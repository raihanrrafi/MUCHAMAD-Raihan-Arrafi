// =========================================================
// script.js
// Logika utama proyek. Mengambil data dari variabel global di data.js.
// =========================================================

// --- 1. Fungsi Greeting (untuk Dashboard) ---
function updateGreeting() {
    const time = new Date();
    const hour = time.getHours();

    // Ambil nama dari local storage (disimpan saat login)
    let userName = localStorage.getItem('loggedInUser') || 'Pengguna';
    let greetingText = '';

    if (hour >= 5 && hour < 11) {
        greetingText = 'Selamat Pagi, ' + userName;
    } else if (hour >= 11 && hour < 15) {
        greetingText = 'Selamat Siang, ' + userName;
    } else if (hour >= 15 && hour < 18) {
        greetingText = 'Selamat Sore, ' + userName;
    } else {
        greetingText = 'Selamat Malam, ' + userName;
    }

    const greetingElement = document.getElementById('greetingMessage');
    if (greetingElement) {
        greetingElement.textContent = greetingText
    }
}

// --- 2. Fungsi Rendering Data Stok (untuk Stok.html) ---
function renderStokData() {
    const stokListContainer = document.getElementById('stokList');
    if (!stokListContainer) return;

    stokListContainer.innerHTML = '';

    // dataBahanAjar diambil dari data.js
    if (typeof dataBahanAjar === 'undefined' || dataBahanAjar.length === 0) {
        stokListContainer.innerHTML = '<p>Data Bahan Ajar tidak ditemukan.</p>';
        return;
    }

    dataBahanAjar.forEach(item => {
        const card = document.createElement('div');
        card.className = 'data-card';

        card.innerHTML = `
            <div class="card-header">
                <h4>Informasi Bahan Ajar</h4>
            </div>
            <div class="card-image">
                <img src="${item.cover}" alt="Cover ${item.namaBarang}" style="max-width: 100%; height: auto; border-radius: 4px;">
            </div>
            <div class="card-detail">
                <div class="detail-row"><span class="detail-label">Kode Lokasi</span><span>${item.kodeLokasi}</span></div>
                <div class="detail-row"><span class="detail-label">Kode Barang</span><span>${item.kodeBarang}</span></div>
                <div class="detail-row"><span class="detail-label">Nama Barang</span><span>${item.namaBarang}</span></div>
                <div class="detail-row"><span class="detail-label">Jenis Barang</span><span>${item.jenisBarang}</span></div>
                <div class="detail-row"><span class="detail-label">Edisi</span><span>${item.edisi}</span></div>
                <div class="detail-row"><span class="detail-label">Stok</span><span>${item.stok}</span></div>
            </div>
        `;
        stokListContainer.appendChild(card);
    });
}

// --- 3. Fungsi Menampilkan Hasil Tracking (untuk Tracking.html) ---
function displayTrackingResult(data, doNumber) {
    const trackingResult = document.getElementById('trackingResult');
    if (!trackingResult) return;

    let headerHtml = `
    <div class="tracking-header">
        <p>No. DO/Billing</p>
            <h3>${doNumber}</h3>
            <p>Nama Mahasiswa: <strong>${data.nama}</strong></p>
            <p>Status: <strong>${data.status}</strong></p>
            <p>Detail Ekspedisi: ${data.ekspedisi} | Paket: ${data.paket}</p>
            <p>Tanggal Kirim: ${data.tanggalKirim} | Total Pembayaran: ${data.total}</p>
        </div>
        <h4>Perjalanan Paket</h4>
        <div class="timeline">`;

    let timelineHtml = data.perjalanan.map((item, index) => {
        const isDeliveredClass = (index === data.perjalanan.length - 1 && data.status === 'Dikirim') ? 'delivered' : ''; 
        return `
            <div class="timeline-item ${isDeliveredClass}">
                <div class="timeline-content">
                    <p>${item.keterangan}</p>
                    <span class="timeline-date">${item.waktu}</span>
                </div>
            </div>
        `;
    }).join('');

    trackingResult.innerHTML = headerHtml + timelineHtml + `</div>`;
}


// =========================================================
// EVENT LISTENERS UTAMA
// =========================================================
document.addEventListener('DOMContentLoaded', function() {
    // --- A. Login (index.html) ---
    const loginForm = document.getElementById('loginForm');
    const forgotPasswordLink = document.getElementById('forgotPasswordLink');
    const registerLink = document.getElementById('registerLink');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            let isAuthenticated = false;
            let userName = '';

            // KOREKSI LOGIN: Loop melalui dataPengguna dari data.js
            for (let i = 0; i < dataPengguna.length; i++) {
                if (dataPengguna[i].email === email && dataPengguna[i].password === password) {
                    isAuthenticated = true;
                    userName = dataPengguna[i].nama;
                    localStorage.setItem('loggedInUser', userName);
                    break;
                }
            }

            if (isAuthenticated) {
                window.location.href = 'dashboard.html';
            } else {
                alert('email/password yang anda masukkan salah');
            }
        });
    }

    // Event listener untuk link Lupa Password dan Daftar
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(event) {
            event.preventDefault();
            alert('Fitur Lupa Password akan ditampilkan dalam bentuk Modal Box');
        });
    }

    if (registerLink) {
        registerLink.addEventListener('click', function(event) {
            event.preventDefault();
            alert('Fitur Pendaftaran (Daftar) akan ditampilkan dalam bentuk Modal Box');
        });
    }

    // Panggil fungsi greeting jika ada elemennya di halaman
    updateGreeting();

    // --- B. Tracking (tracking.html) ---
    const searchButton = document.getElementById('searchButton');
    const doNumberInput = document.getElementById('doNumber');

    if (searchButton) {
        searchButton.addEventListener('click', function() {
            const doNumber = doNumberInput.value.trim();
            const trackingResult = document.getElementById('trackingResult');

            if (doNumber === '') {
                alert('Nomor DO tidak boleh kosong!');
                trackingResult.innerHTML = '<p class="placeholder-text">Silahkan masukkan nomor DO yang valid.</p>';
                return;
            }

            // KOREKSI TRACKING: Menggunakan dataTracking dari data.js
            const data = dataTracking[doNumber];

            if (data) {
                displayTrackingResult(data, doNumber);
            } else {
                alert('Nomor DO tidak ditemukan atau salah!');
                trackingResult.innerHTML = '<p class="placeholder-text">Nomor DO/Billing tidak ditemukan. Coba Nomor: 2023001234 atau 2023005678</p>';
            }
        });
    }

    // --- C. Stok (stok.html) ---
    const tambahStokBtn = document.getElementById('tambahStokBtn');
    const addStokForm = document.getElementById('addStokForm');
    const submitStokBtn = document.getElementById('submitStokBtn');

    if (tambahStokBtn) {
        renderStokData(); // Panggil rendering data awal saat di halaman stok

        tambahStokBtn.addEventListener('click', function() {
            if (addStokForm.style.display === 'none') {
                addStokForm.style.display = 'block';
                tambahStokBtn.textContent = 'Sembunyikan Form';
            } else {
                addStokForm.style.display = 'none';
                tambahStokBtn.textContent = 'Tambahkan Stok Baru';
            }
        });
    }

    if (submitStokBtn) {
        submitStokBtn.addEventListener('click', function() {
            const newStok = {
                kodeLokasi: document.getElementById('inputKodeLokasi').value,
                kodeBarang: document.getElementById('inputKodeBarang').value,
                namaBarang: document.getElementById('inputNamaBarang').value,
                jenisBarang: document.getElementById('inputJenisBarang').value,
                edisi: document.getElementById('inputEdisi').value, 
                stok: parseInt(document.getElementById('inputStok').value),
                cover: "assets/default_new.jpg"
            };

            if (Object.values(newStok).some(val => val === "" || (typeof val === 'number' && isNaN(val)))) {
                alert("Harap lengkapi semua data dengan benar!");
                return;
            }

            dataBahanAjar.push(newStok);

            renderStokData(); 

            // Reset form
            document.getElementById('inputKodeLokasi').value = '';
            document.getElementById('inputKodeBarang').value = '';
            document.getElementById('inputNamaBarang').value = '';
            document.getElementById('inputJenisBarang').value = '';
            document.getElementById('inputEdisi').value = '';
            document.getElementById('inputStok').value = '';

            alert(`Data ${newStok.namaBarang} berhasil ditambahkan!`);
            addStokForm.style.display = 'none';
            tambahStokBtn.textContent = 'Tambahkan Stok Baru';
        });
    }
});