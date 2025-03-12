function login() {
  const username = document.getElementById('username').value.trim();

  if (!username) {
    showNotification('Masukkan username!', 'error');
    return;
  }

  localStorage.setItem('username', username);
  window.location.href = 'game.html';
}

function showNotification(message, type = 'info') {
  const notif = document.createElement('div');
  notif.className = `notification show ${type}`;
  notif.innerText = message;
  document.body.appendChild(notif);

  setTimeout(() => {
    notif.remove();
  }, 2000);
}
