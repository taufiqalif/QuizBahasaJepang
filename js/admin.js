let soalData = [];
let userData = [];

let soalCurrentPage = 1;
let userCurrentPage = 1;

const rowsPerPage = 10;

let soalSortField = 'id';
let soalSortAsc = true;

let userSortField = 'id';
let userSortAsc = true;

// =======================
// Tabs switching
// =======================
function showTab(tab) {
  document.getElementById('soal-tab').style.display = tab === 'soal' ? 'block' : 'none';
  document.getElementById('user-tab').style.display = tab === 'user' ? 'block' : 'none';
}

// =======================
// SOAL CRUD + PAGINATION + SORTING
// =======================
function loadSoal() {
  fetch('api/admin/get_soal.php')
    .then(res => res.json())
    .then(data => {
      soalData = data;
      soalCurrentPage = 1;
      displaySoal();
    });
}

function displaySoal() {
  const list = document.getElementById('soal-list');
  list.innerHTML = '';

  let sortedData = [...soalData].sort((a, b) => {
    let valA = a[soalSortField].toString().toLowerCase();
    let valB = b[soalSortField].toString().toLowerCase();
    if (valA < valB) return soalSortAsc ? -1 : 1;
    if (valA > valB) return soalSortAsc ? 1 : -1;
    return 0;
  });

  const start = (soalCurrentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedItems = sortedData.slice(start, end);

  paginatedItems.forEach(soal => {
    list.innerHTML += `
      <tr>
        <td>${soal.id}</td>
        <td>${soal.pertanyaan}</td>
        <td>${soal.tingkat}</td>
        <td>
          <button onclick="editSoal(${soal.id})">Edit</button>
          <button onclick="hapusSoal(${soal.id})">Hapus</button>
        </td>
      </tr>
    `;
  });

  document.getElementById('soal-page-info').innerText = `Page ${soalCurrentPage} of ${Math.ceil(soalData.length / rowsPerPage)}`;
}

function changeSoalPage(dir) {
  const totalPages = Math.ceil(soalData.length / rowsPerPage);
  soalCurrentPage += dir;
  if (soalCurrentPage < 1) soalCurrentPage = 1;
  if (soalCurrentPage > totalPages) soalCurrentPage = totalPages;
  displaySoal();
}

function setSoalSort(field) {
  if (soalSortField === field) {
    soalSortAsc = !soalSortAsc;
  } else {
    soalSortField = field;
    soalSortAsc = true;
  }
  displaySoal();
}

function tambahSoal() {
  const pertanyaan = document.getElementById('pertanyaan').value.trim();
  const opsi_a = document.getElementById('opsi_a').value.trim();
  const opsi_b = document.getElementById('opsi_b').value.trim();
  const opsi_c = document.getElementById('opsi_c').value.trim();
  const jawaban_benar = document.getElementById('jawaban_benar').value.trim().toUpperCase();
  const tingkat = document.getElementById('tingkat').value;

  if (!pertanyaan || !opsi_a || !opsi_b || !opsi_c || !jawaban_benar) {
    alert("Semua field wajib diisi!");
    return;
  }

  fetch('api/admin/tambah_soal.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pertanyaan, opsi_a, opsi_b, opsi_c, jawaban_benar, tingkat })
  })
    .then(res => res.json())
    .then(result => {
      alert(result.message || result.error);
      loadSoal();
    });
}

function hapusSoal(id) {
  if (!confirm('Yakin mau hapus soal ini?')) return;

  fetch(`api/admin/hapus_soal.php?id=${id}`)
    .then(res => res.json())
    .then(result => {
      alert(result.message || result.error);
      loadSoal();
    });
}

function editSoal(id) {
  const soal = soalData.find(item => item.id == id);
  if (!soal) return alert("Soal tidak ditemukan!");

  const pertanyaan = prompt("Edit pertanyaan:", soal.pertanyaan);
  const opsi_a = prompt("Opsi A:", soal.opsi_a);
  const opsi_b = prompt("Opsi B:", soal.opsi_b);
  const opsi_c = prompt("Opsi C:", soal.opsi_c);
  const jawaban_benar = prompt("Jawaban Benar (A/B/C):", soal.jawaban_benar);
  const tingkat = prompt("Tingkat (pemula/mudah/sedang/sulit):", soal.tingkat);

  const data = { id, pertanyaan, opsi_a, opsi_b, opsi_c, jawaban_benar, tingkat };

  fetch('api/admin/edit_soal.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(res => res.json())
    .then(result => {
      alert(result.message || result.error);
      loadSoal();
    });
}

// =======================
// USER CRUD + PAGINATION + SORTING
// =======================
function loadUsers() {
  fetch('api/admin/get_users.php')
    .then(res => res.json())
    .then(data => {
      userData = data;
      userCurrentPage = 1;
      displayUsers();
    });
}

function displayUsers() {
  const list = document.getElementById('user-list');
  list.innerHTML = '';

  let sortedData = [...userData].sort((a, b) => {
    let valA = a[userSortField].toString().toLowerCase();
    let valB = b[userSortField].toString().toLowerCase();
    if (valA < valB) return userSortAsc ? -1 : 1;
    if (valA > valB) return userSortAsc ? 1 : -1;
    return 0;
  });

  const start = (userCurrentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const paginatedItems = sortedData.slice(start, end);

  paginatedItems.forEach(user => {
    list.innerHTML += `
      <tr>
        <td>${user.id}</td>
        <td>${user.username}</td>
        <td>${user.role}</td>
      </tr>
    `;
  });

  document.getElementById('user-page-info').innerText = `Page ${userCurrentPage} of ${Math.ceil(userData.length / rowsPerPage)}`;
}

function changeUserPage(dir) {
  const totalPages = Math.ceil(userData.length / rowsPerPage);
  userCurrentPage += dir;
  if (userCurrentPage < 1) userCurrentPage = 1;
  if (userCurrentPage > totalPages) userCurrentPage = totalPages;
  displayUsers();
}

function setUserSort(field) {
  if (userSortField === field) {
    userSortAsc = !userSortAsc;
  } else {
    userSortField = field;
    userSortAsc = true;
  }
  displayUsers();
}

// =======================
// LOGOUT
// =======================
function logoutAdmin() {
  localStorage.removeItem('is_admin');
  alert('Berhasil logout admin!');
  window.location.href = 'index.html';
}

// Start
showTab('soal');
loadSoal();
loadUsers();
