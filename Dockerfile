FROM php:8-apache

# Install required packages
RUN apt-get update && apt-get install -y \
    jq \
    && rm -rf /var/lib/apt/lists/*

# Install docker-php-extension-installer
ADD --chmod=0755 https://github.com/mlocati/docker-php-extension-installer/releases/latest/download/install-php-extensions /usr/local/bin/

# Install PHP extensions (minimal for speed test)
RUN install-php-extensions gd pdo_mysql pdo_pgsql

# Clean up
RUN rm -f /usr/src/php.tar.xz /usr/src/php.tar.xz.asc \
    && apt-get autoremove -y \
    && rm -rf /var/lib/apt/lists/*

# Prepare files and folders
RUN mkdir -p /speedtest/

# Copy application files
COPY index.html /speedtest/
COPY app.js /speedtest/
COPY speedtest.js /speedtest/
COPY speedtest_worker.js /speedtest/
COPY favicon.ico /speedtest/
COPY assets/ /speedtest/assets/

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Fix permissions
RUN chown -R www-data:www-data /speedtest/ \
    && chmod -R 755 /speedtest/

# Enable Apache modules
RUN a2enmod rewrite headers

# Apache virtual host configuration
RUN { \
    echo '<VirtualHost *:8080>'; \
    echo '    DocumentRoot /speedtest'; \
    echo '    <Directory /speedtest>'; \
    echo '        Options -Indexes +FollowSymLinks'; \
    echo '        AllowOverride All'; \
    echo '        Require all granted'; \
    echo '    </Directory>'; \
    echo '    '; \
    echo '    # Security: Deny access to sensitive files'; \
    echo '    <FilesMatch "\.(sh|env|log|conf)$">'; \
    echo '        Require all denied'; \
    echo '    </FilesMatch>'; \
    echo '</VirtualHost>'; \
} > /etc/apache2/sites-available/000-default.conf

# Change Apache port
RUN sed -i 's/Listen 80/Listen 8080/' /etc/apache2/ports.conf

# Disable server tokens
RUN echo "ServerTokens Prod" >> /etc/apache2/apache2.conf && \
    echo "ServerSignature Off" >> /etc/apache2/apache2.conf

EXPOSE 8080

# Use entrypoint script
ENTRYPOINT ["/entrypoint.sh"]
