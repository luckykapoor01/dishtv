<?php
// ===============================
// DATABASE CONNECTION
// ===============================
require_once __DIR__ . "/admin-panel/config/db.php";

// ===============================
// HELPER: GET USER IP
// ===============================
function getUserIP() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        return $_SERVER['HTTP_CLIENT_IP'];
    }
    if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        return explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0];
    }
    return $_SERVER['REMOTE_ADDR'];
}

// ===============================
// READ FORM DATA
// ===============================
$name    = trim($_POST['name'] ?? '');
$phone   = trim($_POST['phone'] ?? '');
$email   = trim($_POST['email'] ?? '');
$country = trim($_POST['country'] ?? '');
$message = trim($_POST['message'] ?? '');

$ip = getUserIP();

// ===============================
// BASIC VALIDATION
// ===============================
if ($name === '' || $phone === '' || $email === '') {
    header("Location: /DISHTV/contact-us/index.html?error=missing");
    exit;
}

// ===============================
// CHECK IP LIMIT (7 DAYS)
// ===============================
$checkSql = "
    SELECT id 
    FROM form_submissions
    WHERE ip_address = ?
    AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    LIMIT 1
";

$checkStmt = $conn->prepare($checkSql);
$checkStmt->bind_param("s", $ip);
$checkStmt->execute();
$checkStmt->store_result();

if ($checkStmt->num_rows > 0) {
    // User-friendly redirect (NO die)
    header("Location: index.php?error=limit");
    exit;
}

$checkStmt->close();

// ===============================
// INSERT DATA
// ===============================
$insertSql = "
    INSERT INTO form_submissions
    (name, email, country, phone, message, ip_address, created_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW())
";

$stmt = $conn->prepare($insertSql);
$stmt->bind_param(
    "ssssss",
    $name,
    $email,
    $country,
    $phone,
    $message,
    $ip
);

$stmt->execute();
$stmt->close();

// ===============================
// SEND EMAIL (CORE PHP)
// ===============================
$adminEmail = "admin@example.com";

$subject = "New Contact Form Submission";

$body = "
New form submission received:

Name: $name
Email: $email
Country: $country
Phone: $phone
IP Address: $ip

Message:
$message

Date: " . date("Y-m-d H:i:s");

$headers  = "From: no-reply@yourdomain.com\r\n";
$headers .= "Reply-To: $email\r\n";

@mail($adminEmail, $subject, $body, $headers);

// ===============================
// SUCCESS REDIRECT
// ===============================
header("Location: /DISHTV/contact-us/thank-you.html");
exit;