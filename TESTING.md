# 🧪 คู่มือการทดสอบระบบ KU SpeedTest ใน Development

## ✅ การตรวจสอบว่าระบบพร้อมใช้งาน

### 1. ทดสอบ SQLite Database
```bash
cd results
php test_db.php
```

**ผลลัพธ์ที่ควรเห็น:**
- ✅ PHP SQLite PDO Driver: พร้อมใช้งาน
- ✅ เชื่อมต่อฐานข้อมูลสำเร็จ
- ✅ บันทึกข้อมูลสำเร็จ พร้อม Test ID

---

## 🚀 วิธีการทดสอบ Speed Test พร้อม Telemetry

### 2. เปิด PHP Development Server
```bash
php -S localhost:8081
```

### 3. เปิดเบราว์เซอร์
เข้า: **http://localhost:8081/**

### 4. รันทดสอบความเร็ว
1. คลิกปุ่ม **START**
2. รอให้ทดสอบเสร็จ (ประมาณ 20-30 วินาที)
3. **เมื่อเสร็จ** จะเห็นส่วน **"Share results"** ด้านล่างผลลัพธ์

---

## 📊 ตรวจสอบผลลัพธ์ที่บันทึก

### 5. ดูข้อมูลในฐานข้อมูล
```bash
cd results
sqlite3 speedtest_telemetry.db "SELECT id, ip, dl, ul, ping, jitter, timestamp FROM speedtest_users;"
```

หรือใช้ PHP:
```bash
php -r "
\$pdo = new PDO('sqlite:speedtest_telemetry.db');
\$stmt = \$pdo->query('SELECT * FROM speedtest_users ORDER BY timestamp DESC LIMIT 5');
print_r(\$stmt->fetchAll(PDO::FETCH_ASSOC));
"
```

### 6. ดูผลลัพธ์แบบ Web
เปิดเบราว์เซอร์ไปที่:
```
http://localhost:8081/results/?id=1
http://localhost:8081/results/?id=2
http://localhost:8081/results/?id=3
```
*(เปลี่ยน id ตามที่ได้รับ)*

---

## 🎯 วิธีทดสอบฟีเจอร์ต่างๆ

### ทดสอบ Dark Mode
1. เปิดหน้า http://localhost:8081/
2. คลิกปุ่ม 🌓 ที่มุมบนขวา
3. โหมดจะเปลี่ยนระหว่าง Light ↔ Dark
4. Refresh หน้า → โหมดจะคงค่าเดิม (เก็บใน localStorage)

### ทดสอบ Meter Gauges
- เมื่อเริ่มทดสอบ จะเห็น 4 gauges:
  - **Download** (สีเขียวเข้ม #006664)
  - **Upload** (สีเขียวอ่อน #B2BB1E)
  - **Ping** (สีเขียวเข้ม #006664)
  - **Jitter** (สีเขียวอ่อน #B2BB1E)

### ทดสอบ Share Results
1. รันทดสอบความเร็ว
2. หลังเสร็จ จะเห็นส่วน **"Share results"**
3. มี:
   - Test ID
   - Text box สำหรับคัดลอกลิงก์ (คลิกแล้วคัดลอกอัตโนมัติ)
   - รูปภาพแสดงผลลัพธ์

### ทดสอบ Privacy Policy Link
- คลิก "Privacy Policy" ที่ด้านล่าง
- จะเปิดแท็บใหม่ไปที่: https://ocs.ku.ac.th/2019/pdpa/

---

## 🔍 Debug เมื่อมีปัญหา

### ปัญหา: ไม่เห็น Share results
**วิธีตรวจสอบ:**
1. เปิด Developer Tools (F12)
2. ดูที่ Console tab
3. ถ้าเห็น error ที่ `telemetry.php` → database มีปัญหา

**แก้ไข:**
```bash
cd results
php test_db.php  # ตรวจสอบว่า database ทำงานไหม
```

### ปัญหา: Browser cache ข้อมูลเก่า
**แก้ไข:**
- กด `Ctrl + Shift + R` (Windows/Linux)
- กด `Cmd + Shift + R` (Mac)

### ปัญหา: PHP Server ล้มเหลว
**แก้ไข:**
```bash
# หยุด PHP server (Ctrl+C)
# เปลี่ยน port
php -S localhost:8082  # ลองใช้ port อื่น
```

---

## 📝 ตัวอย่างการทดสอบแบบละเอียด

### ทดสอบครบวงจร (End-to-End)
```bash
# 1. รัน test database
cd results
php test_db.php

# 2. เริ่ม PHP server
cd ..
php -S localhost:8081

# 3. เปิดเบราว์เซอร์
# → http://localhost:8081/

# 4. รันทดสอบความเร็ว

# 5. เมื่อเสร็จ คัดลอกลิงก์จาก Share results

# 6. ตรวจสอบว่าลิงก์เปิดได้
# → http://localhost:8081/results/?id=X

# 7. ตรวจสอบ database
cd results
sqlite3 speedtest_telemetry.db "SELECT COUNT(*) as total_tests FROM speedtest_users;"
```

---

## 📊 Stats Page (ดูสถิติทั้งหมด)

### ดูสถิติผลการทดสอบ
```
http://localhost:8081/results/stats.php?password=testpassword
```
*(password ตามที่ตั้งใน telemetry_settings.php: $stats_password)*

### เปลี่ยน password
แก้ไขใน `results/telemetry_settings.php`:
```php
$stats_password = 'รหัสผ่านใหม่';
```

---

## 🎓 สรุป

| ฟีเจอร์ | วิธีทดสอบ | URL |
|---------|-----------|-----|
| Speed Test | คลิก START | http://localhost:8081/ |
| Share Results | รันทดสอบให้เสร็จ | แสดงอัตโนมัติด้านล่าง |
| View Result | เปิดลิงก์ที่ได้ | /results/?id=X |
| Statistics | ใส่ password | /results/stats.php |
| Dark Mode | คลิก 🌓 | - |
| Privacy Policy | คลิก Privacy Policy | เปิดแท็บใหม่ |

---

## 🚀 Deploy to Production

เมื่อทดสอบเสร็จแล้ว พร้อม deploy:

### สำหรับ Apache/Nginx:
1. คัดลอกไฟล์ทั้งหมดไปยัง web root
2. แก้ไข `results/telemetry_settings.php`:
   - เปลี่ยนเป็น MySQL/PostgreSQL สำหรับ production
   - ตั้ง $stats_password ที่ปลอดภัย
3. Import `results/telemetry_mysql.sql` (ถ้าใช้ MySQL)
4. ตั้งค่า permissions:
   ```bash
   chmod 755 backend/
   chmod 755 results/
   chmod 666 results/speedtest_telemetry.db  # ถ้าใช้ SQLite
   ```

---

**Happy Testing! 🎉**
