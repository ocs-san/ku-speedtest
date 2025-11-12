# Database Access Guide

## 🔒 Security: Stats Page Disabled

หน้า stats.php ถูก disable เพื่อความปลอดภัย  
เข้าถึงข้อมูลผ่าน database โดยตรงแทน

---

## 📊 วิธีดูข้อมูลสำหรับ Admin

### 1. SQLite (Development)

```bash
# เข้า container
docker-compose exec speedtest bash

# เข้า SQLite
cd results
sqlite3 speedtest_telemetry.db

# คำสั่ง SQL
SELECT COUNT(*) as total_tests FROM speedtest_users;
SELECT * FROM speedtest_users ORDER BY timestamp DESC LIMIT 10;

# Export CSV
.mode csv
.output stats.csv
SELECT id, ip, dl, ul, ping, jitter, timestamp FROM speedtest_users;
.quit
```

### 2. MySQL (Production)

```bash
# เข้า MySQL container
docker exec -it ku-speedtest-db mysql -u speedtest -p

# Database queries
USE speedtest;
SELECT COUNT(*) as total_tests FROM speedtest_users;
SELECT AVG(CAST(dl AS DECIMAL(10,2))) as avg_download FROM speedtest_users WHERE dl != '';
SELECT * FROM speedtest_users ORDER BY timestamp DESC LIMIT 10;
```

### 3. Export ข้อมูล (CSV)

```bash
# Export จาก SQLite
docker-compose exec speedtest bash
cd results
php -r "
\$pdo = new PDO('sqlite:speedtest_telemetry.db');
\$stmt = \$pdo->query('SELECT * FROM speedtest_users ORDER BY timestamp DESC');
\$fp = fopen('export_'.date('Y-m-d').'.csv', 'w');
fputcsv(\$fp, ['ID','IP','ISP','Download','Upload','Ping','Jitter','Timestamp']);
while(\$row = \$stmt->fetch(PDO::FETCH_ASSOC)) {
    fputcsv(\$fp, [\$row['id'], \$row['ip'], \$row['ispinfo'], \$row['dl'], \$row['ul'], \$row['ping'], \$row['jitter'], \$row['timestamp']]);
}
fclose(\$fp);
echo 'Export complete: export_'.date('Y-m-d').'.csv';
"
```

### 4. ดูข้อมูลแบบ Quick

```bash
# จำนวนการทดสอบ
docker-compose exec speedtest php -r "
\$pdo = new PDO('sqlite:/speedtest/results/speedtest_telemetry.db');
\$count = \$pdo->query('SELECT COUNT(*) FROM speedtest_users')->fetchColumn();
echo \"Total tests: \$count\n\";
"

# ความเร็วเฉลี่ย
docker-compose exec speedtest php -r "
\$pdo = new PDO('sqlite:/speedtest/results/speedtest_telemetry.db');
\$stmt = \$pdo->query('SELECT AVG(CAST(dl AS REAL)) as avg_dl, AVG(CAST(ul AS REAL)) as avg_ul FROM speedtest_users WHERE dl != \"\" AND ul != \"\"');
\$result = \$stmt->fetch(PDO::FETCH_ASSOC);
echo \"Average Download: \" . round(\$result['avg_dl'], 2) . \" Mbps\n\";
echo \"Average Upload: \" . round(\$result['avg_ul'], 2) . \" Mbps\n\";
"
```

---

## 🔐 Security Measures Implemented

1. ✅ **Stats page disabled** - ไม่มี web interface สำหรับดูข้อมูล
2. ✅ **Database access only** - เข้าถึงผ่าน database โดยตรงเท่านั้น
3. ✅ **Container isolation** - ต้อง exec เข้า container ก่อน
4. ✅ **No public endpoints** - ไม่มี endpoint สำหรับ query ข้อมูล

---

## 📈 Alternative: Admin Dashboard (Optional)

ถ้าต้องการ dashboard สำหรับ admin สามารถใช้:

### phpMyAdmin (MySQL only)

Uncomment ใน `docker-compose.yml`:
```yaml
phpmyadmin:
  image: phpmyadmin:latest
  ports:
    - "8081:80"
```

จากนั้นเข้า: http://localhost:8081/

---

## 🛡️ Additional Security Recommendations

1. **Database Passwords**: เปลี่ยนรหัสผ่าน database ให้แข็งแรง
2. **Firewall**: ปิด port ที่ไม่จำเป็น
3. **SSL/TLS**: ใช้ HTTPS สำหรับ production
4. **Access Control**: จำกัด IP ที่เข้าถึง container
5. **Regular Backups**: Backup database เป็นประจำ
6. **Monitoring**: ติดตั้ง monitoring system
7. **Log Review**: ตรวจสอบ logs เป็นประจำ

---

**หมายเหตุ:** ไฟล์ `stats.php` ถูก rename เป็น `stats.php.disabled`  
สามารถกู้คืนได้โดย rename กลับถ้าจำเป็น
