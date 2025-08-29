document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = document.getElementById('signupUsername').value;
  const password = document.getElementById('signupPassword').value;
  const errorElem = document.getElementById('signupError');
  errorElem.textContent = '';
  try {
    const res = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Signup failed');
    // Show modal
    document.getElementById('modalMessage').innerHTML = 'Thank you for signing up!<br>Signup successful.';
    document.getElementById('successModal').style.display = 'flex';
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1500);
  } catch (err) {
    errorElem.textContent = err.message;
  }
}); 