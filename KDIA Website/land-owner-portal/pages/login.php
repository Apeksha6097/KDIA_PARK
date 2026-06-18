<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Land Owner Login</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="../assets/css/portal.css" />
</head>
<body>
  <div class="container">
    <h1>Login</h1>
    <form id="loginForm" class="card">
      <label>Mobile Number / Email
        <input type="text" name="identifier" required />
      </label>
      <label>Password
        <input type="password" name="password" required />
      </label>
      <div>
        <input type="checkbox" id="rememberMe" name="rememberMe" />
        <label for="rememberMe">Remember Me</label>
      </div>
      <button type="submit" class="btn">Login</button>
      <p><a href="#" id="forgotPassword">Forgot Password?</a></p>
      <p>Don't have an account? <a href="register.php">Register</a></p>
    </form>
  </div>
  <script src="../assets/js/auth.php?v=1.0.1"></script>
</body>
</html>
