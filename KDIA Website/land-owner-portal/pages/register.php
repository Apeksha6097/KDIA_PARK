<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Land Owner Registration</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/css/portal.css" />
</head>
<body>
  <div class="container">
    <h1>Register</h1>
    <form id="registerForm" class="card">
      <label>Full Name
        <input type="text" name="fullName" required />
      </label>
      <label>Mobile Number
        <input type="tel" name="mobile" required />
      </label>
      <label>Email Address
        <input type="email" name="email" required />
      </label>
      <label>Password
        <input type="password" name="password" id="password" required />
        <div id="pwd-strength"><div></div></div>
      </label>
      <label>Confirm Password
        <input type="password" name="confirmPassword" required />
      </label>
      <button type="submit" class="btn">Register</button>
      <p>Already have an account? <a href="login.php">Login instead</a></p>
    </form>
  </div>
  <script src="../assets/js/auth.php?v=1.0.1"></script>
</body>
</html>
