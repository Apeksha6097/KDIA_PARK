<?php
header('Content-Type: application/json');

// Read JSON input
$inputJSON = file_get_contents('php://input');
$input = json_decode($inputJSON, true);

$fullName = isset($input['fullName']) ? trim($input['fullName']) : '';
$email = isset($input['email']) ? trim($input['email']) : '';
$mobileNumber = isset($input['mobileNumber']) ? trim($input['mobileNumber']) : '';
$password = isset($input['password']) ? trim($input['password']) : '';

if (empty($fullName) || empty($email) || empty($mobileNumber) || empty($password)) {
    http_response_code(400);
    echo json_encode(["message" => "All fields are required"]);
    exit;
}

http_response_code(201);
echo json_encode(["message" => "Registration successful!"]);
