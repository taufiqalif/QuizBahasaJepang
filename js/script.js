// =======================
// Variabel Game
// =======================
let score = 0;
let lives = 3;
let timer;
let timeLeft = 10;
let questionsAnswered = 0;

// =======================
// Ambil Username dari localStorage
// =======================
const username = localStorage.getItem('username');
if (!username || username.length < 3 || username.length > 20) {
  alert('Silakan login dulu!');
  window.location.href = 'index.html';
} else {
  document.getElementById('username-display').innerText = username;
}

// =======================
// Fungsi Utama Mulai Game
// =======================
function startGame() {
  score = 0;
  lives = 3;
  questionsAnswered = 0;

  updateStatus();
  document.getElementById('start-btn').style.display = 'none';
  loadQuestion();
}

// =======================
// Dapatkan Difficulty Berdasarkan Progress
// =======================
function getDifficultyByProgress() {
  if (questionsAnswered >= 30) return 'sulit';
  if (questionsAnswered >= 20) return 'sedang';
  if (questionsAnswered >= 10) return 'mudah';
  return 'pemula';
}

// =======================
// Load Pertanyaan dari API
// =======================
function loadQuestion() {
  clearInterval(timer);

  const currentDifficulty = getDifficultyByProgress();
  document.getElementById('difficulty-label').innerText = currentDifficulty.toUpperCase();

  fetch(`api/get_soal.php?difficulty=${currentDifficulty}`)
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        showNotification(data.error, 'error');
        return;
      }

      document.getElementById('question').innerText = data.pertanyaan;

      const optionsDiv = document.getElementById('options');
      optionsDiv.innerHTML = '';

      ['opsi_a', 'opsi_b', 'opsi_c'].forEach(key => {
        const btn = document.createElement('button');
        btn.innerText = data[key];
        btn.classList.add('option-btn');
        btn.onclick = () => checkAnswer(key.slice(-1).toUpperCase(), data.jawaban_benar);
        optionsDiv.appendChild(btn);
      });

      startTimer();
    })
    .catch(err => {
      console.error('Error load soal:', err);
      showNotification('Gagal mengambil pertanyaan!', 'error');
    });
}

// =======================
// Cek Jawaban
// =======================
function checkAnswer(selected, correct) {
  clearInterval(timer);
  questionsAnswered++;

  if (selected === correct.toUpperCase()) {
    score += getScoreByDifficulty();
    playSound('correct');
    showNotification('Benar!', 'success');
  } else {
    lives--;
    playSound('wrong');
    showNotification(`Salah! Jawaban: ${correct}`, 'error');
  }

  afterAnswerCheck();
}

// =======================
// Proses Setelah Jawaban Dicek
// =======================
function afterAnswerCheck() {
  updateStatus();

  if (lives <= 0) {
    playSound('gameover');
    gameOver();
  } else {
    loadQuestion();
  }
}

// =======================
// Timer Berdasarkan Difficulty
// =======================
function getTimeByDifficulty() {
  const diff = getDifficultyByProgress();
  switch (diff) {
    case 'pemula': return 12;
    case 'mudah': return 10;
    case 'sedang': return 8;
    case 'sulit': return 6;
    default: return 10;
  }
}

// =======================
// Timer
// =======================
function startTimer() {
  timeLeft = getTimeByDifficulty();
  updateTimerDisplay();

  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer);
      lives--;
      showNotification('Waktu habis! Nyawa berkurang.', 'error');
      updateStatus();

      if (lives <= 0) {
        playSound('gameover');
        gameOver();
      } else {
        loadQuestion();
      }
    }
  }, 1000);
}

// =======================
// Game Over
// =======================
function gameOver() {
  showNotification(`Game Over! Skor kamu: ${score}`, 'error');

  const level = getDifficultyByProgress();
  submitScore(username, score, level);

  document.getElementById('start-btn').style.display = 'block';
  document.getElementById('question').innerText = 'Klik tombol untuk mulai!';
  document.getElementById('options').innerHTML = '';
}

// =======================
// Submit Skor ke Server
// =======================
function submitScore(username, skor, level) {
  fetch('api/save_score.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, skor, level })
  })
    .then(res => res.json())
    .then(result => {
      if (result.message) {
        showNotification(result.message, 'success');
        loadLeaderboard();
      } else {
        showNotification(result.error || 'Gagal simpan skor!', 'error');
      }
    })
    .catch(err => {
      console.error(err);
      showNotification('Terjadi kesalahan!', 'error');
    });
}

// =======================
// Load Leaderboard
// =======================
function loadLeaderboard() {
  fetch('api/get_leaderboard.php')
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('leaderboard');
      list.innerHTML = '';

      if (!data.length) {
        list.innerHTML = '<li>Belum ada skor!</li>';
        return;
      }

      data.forEach((entry, index) => {
        list.innerHTML += `
          <li>${index + 1}. ${entry.username} - ${entry.total_skor} pts - Rank: ${entry.rank}</li>
        `;
      });
    })
    .catch(err => {
      console.error('Error load leaderboard:', err);
      showNotification('Gagal memuat leaderboard!', 'error');
    });
}

// =======================
// Tampilkan Notifikasi
// =======================
function showNotification(message, type = 'info') {
  const notif = document.getElementById('notification');
  notif.innerText = message;
  notif.className = `notification show ${type}`;

  setTimeout(() => {
    notif.className = notif.className.replace('show', '');
  }, 2000);
}

// =======================
// Update Status UI
// =======================
function updateStatus() {
  document.getElementById('score').innerText = score;
  document.getElementById('lives').innerText = lives;
}

// =======================
// Update Timer UI
// =======================
function updateTimerDisplay() {
  const timeDisplay = document.getElementById('time');
  timeDisplay.innerText = timeLeft;
  timeDisplay.style.color = (timeLeft <= 3) ? 'red' : '#fff';
}

// =======================
// Main Fungsi Sound
// =======================
function playSound(type) {
  const sound = document.getElementById(`sound-${type}`);
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}

// =======================
// Skor Berdasarkan Difficulty
// =======================
function getScoreByDifficulty() {
  const diff = getDifficultyByProgress();
  switch (diff) {
    case 'pemula': return 10;
    case 'mudah': return 20;
    case 'sedang': return 30;
    case 'sulit': return 40;
    default: return 10;
  }
}

// =======================
// Auto Load Leaderboard Saat Awal
// =======================
window.onload = () => {
  loadLeaderboard();

  if (!username || username.length < 3) {
    showNotification('Username tidak valid', 'error');
    setTimeout(() => window.location.href = 'index.html', 2000);
  }
};

// =======================
// Logout
// =======================
function logout() {
  localStorage.removeItem('username');
  window.location.href = 'index.html';
}
