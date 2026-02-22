<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

/* DB connection */
require_once __DIR__ . "/admin-panel/config/db.php";

/* Admin Email */
$adminEmail = "admin@example.com";

/* Get user IP */
$ip = $_SERVER['REMOTE_ADDR'];

/* Get POST data */
$your_name    = trim($_POST['your_name'] ?? '');
$your_phone   = trim($_POST['your_phone'] ?? '');
$refer_name   = trim($_POST['refer_name'] ?? '');
$refer_phone  = trim($_POST['refer_phone'] ?? '');
$refer_email  = trim($_POST['refer_email'] ?? '');

/* Basic validation */
if (
  $your_name === '' ||
  $your_phone === '' ||
  $refer_name === '' ||
  $refer_phone === '' ||
  $refer_email === ''
) {
  header("Location: /DISHTV/refer/index.php?error=missing");
  exit;
}

/* 🔒 IP limit: 1 submission per 7 days */
$limitSql = "
  SELECT id FROM referral_submissions
  WHERE ip_address = ?
  AND created_at >= (NOW() - INTERVAL 7 DAY)
  LIMIT 1
";
$limitStmt = $conn->prepare($limitSql);
$limitStmt->bind_param("s", $ip);
$limitStmt->execute();
$limitStmt->store_result();

if ($limitStmt->num_rows > 0) {
  header("Location: /DISHTV/refer/index.php?error=limit");
  exit;
}

/* Insert into DB */
$insertSql = "
  INSERT INTO referral_submissions
  (your_name, your_phone, refer_name, refer_phone, refer_email, ip_address)
  VALUES (?, ?, ?, ?, ?, ?)
";
$stmt = $conn->prepare($insertSql);
$stmt->bind_param(
  "ssssss",
  $your_name,
  $your_phone,
  $refer_name,
  $refer_phone,
  $refer_email,
  $ip
);
$stmt->execute();

/* Send Email (Core PHP) */
$subject = "New Referral Submission";
$message =
  "New referral received:\n\n" .
  "Your Name: $your_name\n" .
  "Your Phone: $your_phone\n\n" .
  "Friend Name: $refer_name\n" .
  "Friend Phone: $refer_phone\n" .
  "Friend Email: $refer_email\n\n" .
  "Date: " . date("Y-m-d H:i:s") . "\n" .
  "IP: $ip";

$headers =
  "From: no-reply@yourdomain.com\r\n" .
  "Reply-To: $refer_email\r\n" .
  "Content-Type: text/plain; charset=UTF-8";

@mail($adminEmail, $subject, $message, $headers);

/* Success redirect */
header("Location: /DISHTV/refer/index.php?success=1");
exit;