<?php
// ทดสอบว่า SQLite ทำงานได้ไหม
echo "=== ทดสอบ SQLite Database ===\n\n";

// ตรวจสอบ SQLite extension
if (class_exists('PDO') && in_array('sqlite', PDO::getAvailableDrivers())) {
    echo "✅ PHP SQLite PDO Driver: พร้อมใช้งาน\n";
} else {
    echo "❌ PHP SQLite PDO Driver: ไม่พบ\n";
    exit(1);
}

// ตรวจสอบ telemetry_settings.php
require_once 'telemetry_settings.php';
echo "✅ telemetry_settings.php: โหลดสำเร็จ\n";
echo "   - DB Type: $db_type\n";
echo "   - SQLite File: $Sqlite_db_file\n\n";

// ทดสอบสร้างฐานข้อมูล
require_once 'telemetry_db.php';
echo "=== ทดสอบเชื่อมต่อฐานข้อมูล ===\n";

$pdo = getPdo(true);
if (is_string($pdo)) {
    echo "❌ Error: $pdo\n";
    exit(1);
} elseif ($pdo === false) {
    echo "❌ ไม่สามารถเชื่อมต่อฐานข้อมูล\n";
    exit(1);
} else {
    echo "✅ เชื่อมต่อฐานข้อมูลสำเร็จ!\n\n";
}

// ตรวจสอบว่าไฟล์ database ถูกสร้างแล้วหรือยัง
if (file_exists($Sqlite_db_file)) {
    $size = filesize($Sqlite_db_file);
    echo "✅ ไฟล์ Database: $Sqlite_db_file\n";
    echo "   - ขนาด: " . number_format($size) . " bytes\n\n";
} else {
    echo "⚠️ ไฟล์ยังไม่ถูกสร้าง: $Sqlite_db_file\n\n";
}

// ทดสอบบันทึกข้อมูล
echo "=== ทดสอบบันทึกข้อมูล ===\n";
$testId = insertSpeedtestUser(
    '127.0.0.1',
    '{"rawIspInfo":"Test ISP"}',
    '',
    'TestBot/1.0',
    'th-TH',
    '100.5',
    '50.2',
    '10.5',
    '2.1',
    'Test log'
);

if ($testId) {
    echo "✅ บันทึกข้อมูลสำเร็จ!\n";
    echo "   - Test ID: $testId\n";
    echo "   - URL: /results/?id=$testId\n\n";
    
    // ลองดึงข้อมูลกลับมา
    $stmt = $pdo->prepare('SELECT * FROM speedtest_users WHERE id = ?');
    $stmt->execute([$testId]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($data) {
        echo "✅ ข้อมูลที่บันทึก:\n";
        foreach ($data as $key => $value) {
            if ($key !== 'log') { // ข้าม log เพราะยาว
                echo "   - $key: $value\n";
            }
        }
    }
} else {
    echo "❌ บันทึกข้อมูลล้มเหลว\n";
}

echo "\n=== สรุป ===\n";
echo "ถ้าทุกอย่างเป็น ✅ แสดงว่าระบบพร้อมใช้งาน!\n";
echo "ทดสอบได้ที่: http://localhost:8081/\n";
