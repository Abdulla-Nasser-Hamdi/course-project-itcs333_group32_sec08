<?php
/**
 * Authentication Handler for Login Form
 * 
 * This PHP script handles user authentication via POST requests from the Fetch API.
 * It validates credentials against a MySQL database using PDO,
 * creates sessions, and returns JSON responses.
 */

// --- Session Management ---
// TODO: Start a PHP session using session_start()
// This must be called before any output is sent to the browser
// Sessions allow us to store user data across multiple pages
session_start()

// --- Set Response Headers ---
// TODO: Set the Content-Type header to 'application/json'
// This tells the browser that we're sending JSON data back
header("Content-Type: application/json")

// TODO: (Optional) Set CORS headers if your frontend and backend are on different domains
// You'll need headers for Access-Control-Allow-Origin, Methods, and Headers


// --- Check Request Method ---
// TODO: Verify that the request method is POST
// Use the $_SERVER superglobal to check the REQUEST_METHOD
// If the request is not POST, return an error response and exit
if($_SERVER[REQUEST_METHOD] !== "POST"){
    echo json_encode([
        'success' => false,
        'message' => "Invalid request method"
    ]);
    exit;

}

$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

// --- Validate Required Fields ---
if (!isset($data['email']) || !isset($data['password'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Missing email or password'
    ]);
    exit;
}

$email = trim($data['email']);
$password = $data['password'];

// --- Server-Side Validation ---
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid email format'
    ]);
    exit;
}

if (strlen($password) < 8) {
    echo json_encode([
        'success' => false,
        'message' => 'Password must be at least 8 characters'
    ]);
    exit;
}

// --- Database Connection ---
require_once "db.php"; // contains getDBConnection()

try {
    $pdo = getDBConnection();

    // --- Prepare SQL Query ---
    $sql = "SELECT id, name, email, password FROM users WHERE email = :email";
    $stmt = $pdo->prepare($sql);

    // --- Execute ---
    $stmt->execute(['email' => $email]);

    // --- Fetch User ---
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // --- Verify User & Password ---
    if ($user && password_verify($password, $user['password'])) {

        // --- Successful Authentication ---
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_name'] = $user['name'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['logged_in'] = true;

        echo json_encode([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'id' => $user['id'],
                'name' => $user['name'],
                'email' => $user['email']
            ]
        ]);
        exit;

    } else {

        // --- Failed Authentication ---
        echo json_encode([
            'success' => false,
            'message' => 'Invalid email or password'
        ]);
        exit;
    }

} catch (PDOException $e) {

    // --- Error Handling ---
    error_log("Login Error: " . $e->getMessage());

    echo json_encode([
        'success' => false,
        'message' => 'Something went wrong. Please try again later.'
    ]);
    exit;
}
?>