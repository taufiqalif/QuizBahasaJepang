// =======================
// Variabel Game
// =======================
let totalSkor = 0;
let comboStreak = 0;
let lives = 3;
let timer;
let timeLeft = 10;
let questionsAnswered = 0;
let startTime = 0;
let timerInterval;

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
// Fungsi Mulai Game
// =======================
function startGame() {
  totalSkor = 0;
  comboStreak = 0;
  lives = 3;
  questionsAnswered = 0;

  updateStatus();
  updateSkorUI();

  document.getElementById('start-btn').style.display = 'none';
  loadQuestion();
}

// =======================
// Dapatkan Tingkat Kesulitan
// =======================
function getDifficultyByProgress() {
  if (questionsAnswered >= 30) return 'sulit';
  if (questionsAnswered >= 20) return 'sedang';
  if (questionsAnswered >= 10) return 'mudah';
  return 'pemula';
}

// =======================
// Load Pertanyaan
// =======================
function loadQuestion() {
  clearInterval(timer);

  const difficulty = getDifficultyByProgress();
  document.getElementById('difficulty-label').innerText = difficulty.toUpperCase();

  fetch(`api/get_soal.php?difficulty=${difficulty}`)
    .then(res => res.json())
    .then(data => {
      console.log('Data soal:', data);
      if (data.error) {
        showNotification(data.error, 'error');
        return;
      }

      document.getElementById('question').innerText = data.pertanyaan || 'Pertanyaan tidak tersedia';
      const optionsDiv = document.getElementById('options');
      optionsDiv.innerHTML = '';

      ['opsi_a', 'opsi_b', 'opsi_c'].forEach(key => {
        if (data[key]) {
          const btn = document.createElement('button');
          btn.innerText = data[key];
          btn.classList.add('option-btn');
          btn.onclick = () => jawabSoal(key.slice(-1).toUpperCase(), data.jawaban_benar);
          optionsDiv.appendChild(btn);
        }
      });

      mulaiSoal();
      startTimer();
    })
    .catch(err => {
      console.error('Error:', err);
      showNotification('Gagal mengambil pertanyaan!', 'error');
    });
}

// =======================
// Jawab Soal + Combo + Skor + Waktu
// =======================
function jawabSoal(jawabanUser, jawabanBenar) {
  clearInterval(timer);
  clearInterval(timerInterval);
  questionsAnswered++;

  const endTime = new Date().getTime();
  const waktuJawab = (endTime - startTime) / 1000;

  let bonusWaktu = 0;

  if (jawabanUser === jawabanBenar.toUpperCase()) {
    comboStreak++;

    let bonusCombo = (comboStreak - 1) * 5;

    if (waktuJawab < 5) {
      bonusWaktu = 10;
    } else if (waktuJawab < 10) {
      bonusWaktu = 5;
    }

    let skorTambah = 10 + bonusCombo + bonusWaktu;
    totalSkor += skorTambah;

    showNotification(
      `Benar! +${skorTambah} poin (Combo x${comboStreak}, ${waktuJawab.toFixed(1)} detik) 🔥`,
      'success'
    );

    playSound('correct');
  } else {
    comboStreak = 0;
    totalSkor -= 5;
    if (totalSkor < 0) totalSkor = 0;

    lives--;
    showNotification(`Salah! -5 poin ❌. Jawaban: ${jawabanBenar}`, 'error');

    playSound('wrong');
  }

  updateStatus();
  updateSkorUI();

  if (lives <= 0) {
    playSound('gameover');
    gameOver();
  } else {
    loadQuestion();
  }
}

// =======================
// Timer Real-Time Buat Waktu Jawab
// =======================
function mulaiSoal() {
  startTime = new Date().getTime();

  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    const now = new Date().getTime();
    const elapsed = ((now - startTime) / 1000).toFixed(1);
    document.getElementById('timer').innerText = `Waktu Jawab: ${elapsed} detik ⏱️`;
  }, 100);
}

// =======================
// Timer Hitung Mundur
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

function startTimer() {
  timeLeft = getTimeByDifficulty();
  updateTimerDisplay();

  timer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timer);
      clearInterval(timerInterval);

      lives--;
      comboStreak = 0;
      showNotification('Waktu habis! Nyawa berkurang.', 'error');

      updateStatus();
      updateSkorUI();

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
  clearInterval(timerInterval);
  clearInterval(timer);

  showNotification(`Game Over! Skor kamu: ${totalSkor}`, 'error');

  const level = getDifficultyByProgress();
  submitScore(username, totalSkor, level);

  document.getElementById('start-btn').style.display = 'block';
  document.getElementById('question').innerText = 'Klik tombol mulai untuk bermain!';
  document.getElementById('options').innerHTML = '';
  document.getElementById('timer').innerText = '';
  document.getElementById('difficulty-label').innerText = '';
}

// =======================
// Submit Skor
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
        list.innerHTML = '<tr><td colspan="4">Belum ada skor!</td></tr>';
        return;
      }

      data.forEach((entry, index) => {
        list.innerHTML += `
          <tr>
            <td>${index + 1}</td> 
            <td>${entry.username}</td>
            <td>${entry.total_skor}</td>
            <td>${entry.rank}</td>
            <td>${entry.medali}</td>
          </tr>
        `;
      });
    })
    .catch(err => {
      console.error(err);
      showNotification('Gagal memuat leaderboard!', 'error');
    });
}

// =======================
// Helper Functions
// =======================
function showNotification(message, type = 'info') {
  const notif = document.getElementById('notification');
  notif.innerText = message;
  notif.className = `notification show ${type}`;

  setTimeout(() => {
    notif.className = notif.className.replace('show', '');
  }, 2000);
}

function updateStatus() {
  document.getElementById('lives').innerText = lives;
}

function updateSkorUI() {
  document.getElementById('skor').innerText = `Skor: ${totalSkor} ⭐`;
  document.getElementById('combo').innerText = `Combo Streak: ${comboStreak} 🔥`;
}

function updateTimerDisplay() {
  const timeDisplay = document.getElementById('time');
  timeDisplay.innerText = timeLeft;
  timeDisplay.style.color = (timeLeft <= 3) ? 'red' : '#fff';
}

function playSound(type) {
  const sound = document.getElementById(`sound-${type}`);
  if (sound) {
    sound.currentTime = 0;
    sound.play();
  }
}

function logout() {
  localStorage.removeItem('username');
  window.location.href = 'index.html';
}

// =======================
// Load Leaderboard on Page Load
// =======================
window.onload = () => {
  loadLeaderboard();
};
