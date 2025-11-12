# KU Speed Test![LibreSpeed Logo](https://github.com/librespeed/speedtest/blob/master/.logo/logo3.png?raw=true)



ระบบทดสอบความเร็วอินเทอร์เน็ต สำหรับมหาวิทยาลัยเกษตรศาสตร์# LibreSpeed



**Powered by Office of Computer Service, Kasetsart University**No Flash, No Java, No Websocket, No Bullshit.



---This is a very lightweight speed test implemented in Javascript, using XMLHttpRequest and Web Workers.



## 🎯 Features
## Try it


- ✅ **KU Branding** - โลโก้และสีประจำมหาวิทยาลัย (#006664, #B2BB1E)[Take a speed test](https://librespeed.org)

- ✅ **Kanit Font** - รองรับภาษาไทย-อังกฤษ

- ✅ **Dark/Light Mode** - สลับโหมดได้ พร้อมบันทึกค่า## Compatibility

- ✅ **4 Meter Gauges** - แสดงผล Download, Upload, Ping, Jitter แบบวงกลม

- ✅ **Telemetry System** - บันทึกผลการทดสอบ (SQLite/MySQL)All modern browsers are supported: IE11, latest Edge, latest Chrome, latest Firefox, latest Safari.

- ✅ **Share Results** - แชร์ลิงก์ผลการทดสอบได้Works with mobile versions too.

- ✅ **Statistics** - ดูสถิติการทดสอบทั้งหมด

- ✅ **Responsive Design** - รองรับทุกขนาดหน้าจอ## Features



---* Download

* Upload

## 🚀 Quick Start* Ping

* Jitter

### ติดตั้งด้วย Docker (แนะนำ)* IP Address, ISP, distance from server (optional)

* Telemetry (optional)

```bash* Results sharing (optional)

# 1. Clone repository* Multiple Points of Test (optional)

git clone https://github.com/ocs-san/ku-speedtest.git

cd ku-speedtest![Screenrecording of a running Speedtest](https://speedtest.fdossena.com/mpot_v6.gif)



# 2. รัน Docker Compose## Server requirements

docker-compose up -d

* A reasonably fast web server with Apache 2 (nginx, IIS also supported)

# 3. เปิดเบราว์เซอร์* PHP 5.4 or newer (other backends also available)

# http://localhost/* MariaDB or MySQL database to store test results (optional, Microsoft SQL Server, PostgreSQL and SQLite also supported)

```* A fast! internet connection



### Development แบบ PHP## Installation



```bash### 🐳 Docker (Recommended)

# รัน PHP Development Server

php -S localhost:8080```bash

# Quick start

# เปิดเบราว์เซอร์docker-compose up -d

# http://localhost:8080/

```# View logs

docker-compose logs -f

---

# Stop

## 📦 Docker Commandsdocker-compose down

```

### พื้นฐาน

Visit: **http://localhost/**

```bash

# เริ่ม containers📖 See [DOCKER.md](DOCKER.md) for detailed setup.

docker-compose up -d

### 🔧 Manual Installation

# ดู logs

docker-compose logs -f speedtestAssuming you have PHP and a web server installed, the installation steps are quite simple.



# หยุด containers1. Download the source code and extract it

docker-compose down1. Copy files to your web server's shared folder (ie. /var/www/html/speedtest)

1. Set up the database in `results/telemetry_settings.php`

# Rebuild image1. Set permissions: `chmod 755 backend results`

docker-compose build --no-cache1. Visit YOURSITE/speedtest/index.html



# ลบทั้ง containers และ volumes📖 See [DOCKER.md](DOCKER.md) for development guide.

docker-compose down -v

```## 🎓 KU Customization



### Docker StandaloneThis version has been customized for Kasetsart University with the following features:



```bash### Features

# Build image- ✅ **KU Branding**: University logo and colors (#006664, #B2BB1E)

docker build -t ku-speedtest .- ✅ **Kanit Font**: Thai-English font support

- ✅ **Dark/Light Mode**: Toggle with localStorage persistence

# Run container- ✅ **4 Meter Gauges**: Download, Upload, Ping, Jitter in horizontal layout

docker run -d \- ✅ **Telemetry Support**: SQLite/MySQL database for result tracking

  --name ku-speedtest \- ✅ **Share Results**: Generate shareable links for test results

  -p 80:8080 \- ✅ **Privacy Policy**: Link to KU PDPA page

  -e TITLE="KU Speed Test" \

  -e TELEMETRY=true \### Quick Links

  ku-speedtest- 📖 [Docker Setup & Usage Guide](DOCKER.md)

- 🐳 [Docker Compose Configuration](docker-compose.yml)

# ดู logs

docker logs -f ku-speedtest### Development

``````bash

# PHP Dev Server

---php -S localhost:8080



## ⚙️ Configuration# Docker

docker-compose up -d

### Environment Variablesdocker-compose logs -f

```

แก้ไขใน `docker-compose.yml`:

### Credits

```yaml- Original: [LibreSpeed](https://github.com/librespeed/speedtest) by Federico Dossena

environment:- Customization: Office of Computer Service, Kasetsart University
  MODE: standalone
  TITLE: "KU Speed Test"
  TELEMETRY: "true"           # เปิด/ปิดการบันทึกผล
  PASSWORD: "your-password"   # รหัสผ่าน stats.php
  DISTANCE: "km"
  WEBPORT: 8080
```

| Variable | Default | คำอธิบาย |
|----------|---------|----------|
| `TITLE` | `LibreSpeed` | ชื่อที่แสดงบนหน้าเว็บ |
| `TELEMETRY` | `false` | เปิด/ปิดบันทึกผลลัพธ์ |
| `PASSWORD` | `password` | รหัสผ่าน stats.php |
| `ENABLE_ID_OBFUSCATION` | `false` | ซ่อน Test ID |
| `REDACT_IP_ADDRESSES` | `false` | ซ่อน IP Address |
| `DISTANCE` | `km` | หน่วยระยะทาง (km/mi) |

---

## 🗄️ Database Configuration

### SQLite (Default - สำหรับ Development)

ใช้ได้ทันที ไม่ต้องตั้งค่าเพิ่ม

```yaml
# docker-compose.yml (default)
environment:
  TELEMETRY: "true"
  # จะใช้ SQLite โดยอัตโนมัติ
```

Database จะถูกสร้างที่: `results/speedtest_telemetry.db`

### MySQL (แนะนำสำหรับ Production)

1. **Uncomment MySQL service** ใน `docker-compose.yml` (บรรทัด ~28-50)

2. **แก้ไข environment ของ speedtest service:**

```yaml
speedtest:
  environment:
    TELEMETRY: "true"
    # เพิ่มการตั้งค่า MySQL
  depends_on:
    - mysql
```

3. **ตั้งค่ารหัสผ่าน MySQL:**

```yaml
mysql:
  environment:
    MYSQL_ROOT_PASSWORD: "secure-root-password"
    MYSQL_PASSWORD: "secure-db-password"
```

4. **Restart containers:**

```bash
docker-compose down
docker-compose up -d
```

---

## 📊 การใช้งาน

### ทดสอบความเร็ว

1. เปิด http://localhost/
2. คลิกปุ่ม **START**
3. รอให้ทดสอบเสร็จ (~20-30 วินาที)
4. ดูผลลัพธ์ที่แสดง

### แชร์ผลลัพธ์

หลังทดสอบเสร็จ จะมีส่วน **"Share results"** แสดง:
- Test ID (obfuscated สำหรับความปลอดภัย)
- ลิงก์สำหรับแชร์ (คลิกคัดลอกอัตโนมัติ)
- รูปภาพผลลัพธ์

### ดูข้อมูลสถิติ (Admin)

**🔒 Security:** หน้า stats.php ถูก disable เพื่อความปลอดภัย

Admin ดูข้อมูลผ่าน database โดยตรง - ดู [DATABASE_ACCESS.md](DATABASE_ACCESS.md)

---

## 🎨 Customization

### สี KU

```css
/* สีหลัก */
--ku-teal: #006664;     /* Download, Ping */
--ku-lime: #B2BB1E;     /* Upload, Jitter */
```

### Dark Mode

- คลิกปุ่ม 🌓 ที่มุมบนขวา
- ระบบจะบันทึกค่าใน localStorage
- Refresh หน้าจอจะยังคงโหมดเดิม

### Fonts

ใช้ฟอนต์ **Kanit** (รองรับไทย-อังกฤษ) จาก `assets/Kanit/`

---

## 📁 Project Structure

```
ku-speedtest/
├── index.html              # หน้าเว็บหลัก (KU customized)
├── speedtest.js            # JavaScript core
├── speedtest_worker.js     # Web Worker
├── docker-compose.yml      # Docker Compose config
├── Dockerfile              # Docker image
├── assets/                 # KU Logo, Kanit fonts
├── backend/                # PHP backend files
│   ├── garbage.php         # Download test
│   ├── empty.php           # Upload/Ping test
│   └── getIP.php           # IP detection
├── results/                # Telemetry system
│   ├── telemetry_settings.php  # Database config
│   ├── telemetry.php           # Save results
│   ├── stats.php               # Statistics page
│   └── *.sql                   # Database schemas
└── docker/                 # Docker configs
    └── entrypoint.sh       # Container startup script
```

---

## 🔧 Troubleshooting

### Container ไม่ start

```bash
# ดู logs
docker-compose logs speedtest

# ตรวจสอบ port conflict
netstat -ano | grep :80
```

### Database error

```bash
# เข้าไปใน container
docker-compose exec speedtest bash

# ตรวจสอบไฟล์ database
ls -lh /speedtest/results/

# ดูข้อมูลใน database
cd results
php -r "
\$pdo = new PDO('sqlite:speedtest_telemetry.db');
\$stmt = \$pdo->query('SELECT COUNT(*) FROM speedtest_users');
print_r(\$stmt->fetch());
"
```

### ไม่เห็น Share results

ตรวจสอบว่า `TELEMETRY=true` ใน docker-compose.yml

```bash
# Restart container
docker-compose restart speedtest
```

### Browser cache

กด **Ctrl+Shift+R** (Windows/Linux) หรือ **Cmd+Shift+R** (Mac)

---

## 🚀 Production Deployment

### 1. เปลี่ยนรหัสผ่าน

แก้ไข `docker-compose.yml`:

```yaml
environment:
  PASSWORD: "your-secure-password-here"
```

และ `results/telemetry_settings.php`:

```php
$stats_password = 'your-secure-password-here';
```

### 2. ใช้ MySQL

Uncomment MySQL service ใน `docker-compose.yml`

### 3. ตั้งค่า Reverse Proxy (Nginx)

สร้างไฟล์ `/etc/nginx/sites-available/speedtest`:

```nginx
server {
    listen 80;
    server_name speedtest.ku.ac.th;

    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable site:
```bash
ln -s /etc/nginx/sites-available/speedtest /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 4. เพิ่ม SSL (Let's Encrypt)

```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d speedtest.ku.ac.th
```

### 5. Backup Database

```bash
# SQLite
docker cp ku-speedtest:/speedtest/results/speedtest_telemetry.db ./backup.db

# MySQL
docker exec ku-speedtest-db mysqldump -u speedtest -p speedtest > backup.sql
```

---

## 📊 Statistics & Monitoring

### ดูข้อมูลสถิติ (Admin Only)

**🔒 Stats page ถูก disable เพื่อความปลอดภัย**

Admin ต้องเข้าถึงผ่าน database โดยตรง:

```bash
# เข้า container
docker-compose exec speedtest bash

# ดูจำนวนการทดสอบ
cd results && sqlite3 speedtest_telemetry.db "SELECT COUNT(*) FROM speedtest_users;"

# ดูข้อมูลล่าสุด 10 รายการ
sqlite3 speedtest_telemetry.db "SELECT * FROM speedtest_users ORDER BY timestamp DESC LIMIT 10;"
```

📖 **คู่มือเต็ม:** [DATABASE_ACCESS.md](DATABASE_ACCESS.md)

### Export ข้อมูล

```bash
# เข้า container
docker-compose exec speedtest bash

# Export เป็น CSV
cd results
php -r "
\$pdo = new PDO('sqlite:speedtest_telemetry.db');
\$stmt = \$pdo->query('SELECT * FROM speedtest_users');
\$fp = fopen('export.csv', 'w');
fputcsv(\$fp, ['id','ip','dl','ul','ping','jitter','timestamp']);
while(\$row = \$stmt->fetch(PDO::FETCH_NUM)) {
    fputcsv(\$fp, \$row);
}
fclose(\$fp);
"
```

---

## 🛡️ Security

### ✅ Security Measures Implemented:

1. ✅ **Stats page disabled** - ไม่มี web interface สำหรับดูข้อมูล
2. ✅ **Database access only** - Admin เข้าถึงผ่าน database โดยตรง
3. ✅ **ID Obfuscation enabled** - Test ID ถูก obfuscate
4. ✅ **IP Redaction enabled** - IP addresses ถูกปิดบัง
5. ✅ **Container isolation** - ข้อมูลอยู่ใน Docker volume
6. ⚠️ **Change database passwords** - ก่อน production

### ⚠️ สิ่งที่ต้องทำก่อน Production:

1. ✅ ~~เปลี่ยนรหัสผ่าน stats.php~~ (Disabled แล้ว)
2. ✅ **ตั้งรหัสผ่าน MySQL** ให้แข็งแรง
3. ✅ ใช้ HTTPS (SSL Certificate)
4. ✅ ตั้งค่า Firewall
5. ✅ ~~จำกัดการเข้าถึง stats.php~~ (Disabled แล้ว)
6. ✅ ใช้ MySQL แทน SQLite
7. ✅ Backup database เป็นประจำ
8. ✅ Update Docker image เป็นประจำ
9. ✅ Review logs เป็นประจำ

---

## 🆘 Support

- **GitHub**: https://github.com/ocs-san/ku-speedtest
- **Issues**: https://github.com/ocs-san/ku-speedtest/issues
- **Original LibreSpeed**: https://github.com/librespeed/speedtest

---

## 📜 License

Based on [LibreSpeed](https://github.com/librespeed/speedtest)  
GNU Lesser General Public License v3.0

Customization by **Office of Computer Service, Kasetsart University**

---

## 🙏 Credits

- **Original Project**: [LibreSpeed](https://github.com/librespeed/speedtest) by Federico Dossena
- **Customization**: Office of Computer Service, Kasetsart University
- **Font**: [Kanit](https://fonts.google.com/specimen/Kanit) by Cadson Demak

---

**Last Updated**: November 12, 2025
