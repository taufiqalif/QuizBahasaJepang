// =======================
// Tabs switching
// =======================
function showTab(tab) {
  document.getElementById('soal-tab').style.display = tab === 'soal' ? 'block' : 'none';
  document.getElementById('user-tab').style.display = tab === 'user' ? 'block' : 'none';
}

// =======================
// CRUD Soal
// =======================
function loadSoal() {
  fetch('api/admin/get_soal.php')
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('soal-list');
      list.innerHTML = '';
      data.forEach(soal => {
        list.innerHTML += `
          <tr>
            <td>${soal.id}</td>
            <td>${soal.pertanyaan}</td>
            <td>${soal.tingkat}</td>
            <td><button onclick="hapusSoal(${soal.id})">Hapus</button></td>
          </tr>
        `;
      });
    });
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

// =======================
// CRUD User
// =======================
function loadUsers() {
  fetch('api/admin/get_users.php')
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('user-list');
      list.innerHTML = '';
      data.forEach(user => {
        list.innerHTML += `
          <tr>
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.role}</td>
          </tr>
        `;
      });
    });
}


function loadSoal() {
  fetch('api/admin/get_soal.php')
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById('soal-list');
      list.innerHTML = '';

      data.forEach(soal => {
        const li = document.createElement('li');
        li.innerHTML = `
          <strong>${soal.id}</strong> - ${soal.pertanyaan} (${soal.tingkat})
          <button onclick="editSoal(${soal.id})">Edit</button>
          <button onclick="hapusSoal(${soal.id})">Hapus</button>
        `;
        list.appendChild(li);
      });
    });
}

function editSoal(id) {
  // contoh prompt, nanti bisa bikin modal form yang proper!
  const pertanyaan = prompt("Edit pertanyaan:");
  const opsi_a = prompt("Opsi A:");
  const opsi_b = prompt("Opsi B:");
  const opsi_c = prompt("Opsi C:");
  const jawaban_benar = prompt("Jawaban Benar (A/B/C):");
  const tingkat = prompt("Tingkat (pemula/mudah/sedang/sulit):");

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
