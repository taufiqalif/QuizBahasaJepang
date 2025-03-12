// =========================================
// Fungsi Login User & Admin
// =========================================
function login() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  // Validasi input
  if (!username || !password) {
    showNotification('Username dan Password wajib diisi!', 'error');
    return;
  }

  // Kirim data ke backend login.php
  fetch('api/login.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(response => {
      if (response.error) {
        showNotification(response.error, 'error');
      } else {
        // Simpan username
        localStorage.setItem('username', response.username);

        // Cek role
        if (response.role === 'admin') {
          localStorage.setItem('is_admin', 'true');
          showNotification('Login admin berhasil!', 'success');
          setTimeout(() => window.location.href = 'admin.html', 1500);
        } else {
          localStorage.removeItem('is_admin'); // pastikan bukan admin
          showNotification('Login berhasil!', 'success');
          setTimeout(() => window.location.href = 'game.html', 1500);
        }
      }
    })
    .catch(err => {
      console.error(err);
      showNotification('Gagal menghubungi server!', 'error');
    });
}

// =========================================
// Notifikasi UI
// =========================================
function showNotification(message, type = 'info') {
  const notif = document.createElement('div');
  notif.className = `notification show ${type}`;
  notif.innerText = message;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.remove();
  }, 2500);
}


function register() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const role = document.getElementById('role').value;  // ambil role dari select
  
  if (!username || !password) {
    showNotification('Isi semua kolom!', 'error');
    return;
  }

  fetch('api/register.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, role })  // kirim role ke backend
  })
  .then(res => res.json())
  .then(result => {
    if (result.message) {
      showNotification(result.message, 'success');
      window.location.href = 'index.html';
    } else {
      showNotification(result.error, 'error');
    }
  });
}
