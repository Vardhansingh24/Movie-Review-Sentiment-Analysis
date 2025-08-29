document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('loginUsername').value;
  const password = document.getElementById('loginPassword').value;
  const errorElem = document.getElementById('loginError');
  errorElem.textContent = '';
  try {
    const res = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    localStorage.setItem('token', data.token);
    localStorage.setItem('role', data.role);
    // Show modal
    document.getElementById('modalMessage').innerHTML = 'Thank you for logging in!<br>Login successful.';
    document.getElementById('successModal').style.display = 'absolute';
    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1500);
  } catch (err) {
    errorElem.textContent = err.message;
  }
}); 