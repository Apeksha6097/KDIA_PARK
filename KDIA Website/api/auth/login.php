<?php
header('Content-Type: application/json');

// Read JSON input
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

$identifier = isset($input['identifier']) ? trim($input['identifier']) : '';
$password = isset($input['password']) ? trim($input['password']) : '';

if (empty($identifier) || empty($password)) {
    http_response_code(400);
    echo json_encode(["message" => "Identifier and password are required"]);
    exit;
}

$email = (strpos($identifier, '@') !== false) ? $identifier : 'owner@kdia.com';

echo json_encode([
    "token" => "mock-jwt-token",
    "user" => [
        "id" => 1,
        "fullName" => "Demo Owner",
        "email" => $email,
        "mobileNumber" => "1234567890",
        "role" => "owner",
        "isVerified" => 1
    ]
]);
