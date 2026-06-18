<?php header('Content-Type: application/javascript'); ?>
document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  const loginForm = document.getElementById('loginForm');

  /* ---------- Password Strength ---------- */
  const pwdInput = document.getElementById('password');
  const strengthBar = document.querySelector('#pwd-strength div');

  if (pwdInput && strengthBar) {
    pwdInput.addEventListener('input', () => {
      const val = pwdInput.value;
      let strength = 0;
      if (val.length >= 8) strength++;
      if (/[A-Z]/.test(val)) strength++;
      if (/[0-9]/.test(val)) strength++;
      if (/[^A-Za-z0-9]/.test(val)) strength++;
      const pct = (strength / 4) * 100;
      strengthBar.style.width = pct + '%';
      const colors = ['#e74c3c','#e67e22','#f1c40f','#2ecc71'];
      strengthBar.style.background = colors[strength - 1] || '#ccc';
    });
  }

  /* ---------- Registration ---------- */
  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(registerForm));
      if (data.password !== data.confirmPassword) {
        return showToast('Passwords do not match.', 'error');
      }
      if (data.password.length < 8) {
        return showToast('Password must be at least 8 characters.', 'error');
      }
      try {
        const res = await fetch('../../api/auth/register.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const json = await res.json();
        if (res.ok) {
          showToast('Registration successful! Redirecting to login...', 'success');
          setTimeout(() => window.location.href = 'login.php', 1500);
        } else {
          showToast(json.message || 'Registration failed.', 'error');
        }
      } catch (err) {
        showToast('Network error. Please try again.', 'error');
      }
    });
  }

  /* ---------- Login ---------- */
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(loginForm));
      try {
        const res = await fetch('../../api/auth/login.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        const json = await res.json();
        if (res.ok) {
          localStorage.setItem('token', json.token);
          localStorage.setItem('user', JSON.stringify(json.user));
          window.location.href = 'dashboard.php';
        } else {
          showToast(json.message || 'Login failed.', 'error');
        }
      } catch (err) {
        showToast('Network error. Please try again.', 'error');
      }
    });
  }
});

function showToast(msg, type = 'info') {
  let toast = document.getElementById('portal-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'portal-toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.className = 'portal-toast ' + type;
  toast.style.opacity = '1';
  setTimeout(() => { toast.style.opacity = '0'; }, 3000);
}
