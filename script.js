// Mengambil elemen HTML dari halaman menggunakan ID
// Elemen ini digunakan untuk mengambil input username dari user
const usernameInput = document.getElementById("username");

// Tombol untuk melakukan pencarian skin
const searchBtn = document.getElementById("searchBtn");

// Canvas untuk menampilkan body Minecraft
const bodyCanvas = document.getElementById("bodyCanvas");

// Canvas untuk menampilkan wajah player
const faceCanvas = document.getElementById("faceCanvas");

// Canvas untuk menampilkan texture skin mentah
const rawCanvas = document.getElementById("rawCanvas");

// Elemen untuk menampilkan nama player
const playerName = document.getElementById("playerName");

// Elemen untuk menampilkan UUID player
const playerUUID = document.getElementById("playerUUID");

// Tombol untuk download skin
const downloadBtn = document.getElementById("downloadBtn");

// Elemen untuk menampilkan pesan error
const errorMsg = document.getElementById("errorMsg");

// Elemen untuk menampilkan loading
const loading = document.getElementById("loading");


// Event listener pada tombol search
// Ketika tombol diklik maka fungsi searchPlayer akan dijalankan
searchBtn.addEventListener("click", searchPlayer);


// Event listener ketika user menekan tombol Enter di input
// Jika tombol Enter ditekan maka searchPlayer akan dijalankan
usernameInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        searchPlayer();
    }
});


// Fungsi utama untuk mencari player Minecraft
async function searchPlayer() {

    // Mengambil username yang dimasukkan user
    const username = usernameInput.value.trim();

    // Jika username kosong maka proses dihentikan
    if (!username) return;

    // Menampilkan loading ketika request API sedang berjalan
    loading.style.display = "block";

    // Menyembunyikan pesan error
    errorMsg.style.display = "none";

    try {

        // STEP 1 : MENGAMBIL UUID
        // Membuat URL API Mojang untuk mendapatkan UUID dari username
        const uuidUrl = `https://api.mojang.com/users/profiles/minecraft/${username}`;

        // Menggunakan CORS proxy agar API dapat diakses dari browser
        const proxyUUID = `https://api.allorigins.win/get?url=${encodeURIComponent(uuidUrl)}`;

        // Melakukan request ke API
        const uuidResponse = await fetch(proxyUUID);

        // Mengubah response menjadi JSON
        const uuidData = await uuidResponse.json();

        // Parsing data dari proxy
        const uuidJson = JSON.parse(uuidData.contents);

        // Mengambil UUID dari response
        const uuid = uuidJson.id;

        // STEP 2 : MENGAMBIL PROFILE PLAYER
        // URL API untuk mendapatkan data skin
        const profileUrl = `https://sessionserver.mojang.com/session/minecraft/profile/${uuid}`;

        // Menggunakan proxy kembali
        const proxyProfile = `https://api.allorigins.win/get?url=${encodeURIComponent(profileUrl)}`;

        // Request profile player
        const profileResponse = await fetch(proxyProfile);

        // Mengubah response menjadi JSON
        const profileData = await profileResponse.json();

        // Parsing response proxy
        const profileJson = JSON.parse(profileData.contents);

        // STEP 3 : DECODE TEXTURE
        // Mengambil property textures dari response
        const textureBase64 = profileJson.properties[0].value;

        // Decode Base64 menjadi JSON
        const textureJson = JSON.parse(atob(textureBase64));

        // Mengambil URL skin dari JSON
        const skinUrl = textureJson.textures.SKIN.url;

        // STEP 4 : LOAD IMAGE SKIN
        // Membuat object image baru
        const img = new Image();

        // Mengaktifkan crossOrigin agar gambar bisa digunakan di canvas
        img.crossOrigin = "anonymous";

        // Set source image ke URL skin
        img.src = skinUrl;

        // Ketika gambar selesai dimuat maka renderSkin dijalankan
        img.onload = function () {
            renderSkin(img);
        };

        // STEP 5 : MENAMPILKAN INFO PLAYER
        // Menampilkan nama player di halaman
        playerName.textContent = "Name: " + username;

        // Menampilkan UUID player
        playerUUID.textContent = "UUID: " + uuid;

        // STEP 6 : DOWNLOAD SKIN
        // Event ketika tombol download diklik
        downloadBtn.onclick = function () {

            // Membuat elemen link sementara
            const link = document.createElement("a");

            // Mengisi link dengan URL skin
            link.href = skinUrl;

            // Nama file yang akan di download
            link.download = username + "_skin.png";

            // Menjalankan proses download
            link.click();
        };

    } catch (error) {

        // Jika terjadi error maka tampilkan pesan error
        errorMsg.style.display = "block";

    } finally {

        // Menyembunyikan loading ketika proses selesai
        loading.style.display = "none";
    }
}



// Fungsi untuk merender skin ke canvas
function renderSkin(img) {

    // Mengambil context dari canvas (untuk menggambar)
    const bodyCtx = bodyCanvas.getContext("2d");
    const faceCtx = faceCanvas.getContext("2d");
    const rawCtx = rawCanvas.getContext("2d");

    // MENAMPILKAN RAW TEXTURE
    // Menggambar texture skin asli ke canvas
    rawCtx.drawImage(img, 0, 0, 64, 64, 0, 0, 256, 256);


    // MENAMPILKAN WAJAH PLAYER
    // Mengambil bagian wajah dari skin
    // Koordinat wajah di skin Minecraft adalah (8,8) ukuran 8x8
    faceCtx.drawImage(img, 8, 8, 8, 8, 0, 0, 128, 128);


    // MENAMPILKAN BODY PLAYER
    // Clear canvas sebelum menggambar
    bodyCtx.clearRect(0, 0, bodyCanvas.width, bodyCanvas.height);

    // Head
    bodyCtx.drawImage(img, 8, 8, 8, 8, 96, 0, 64, 64);

    // Body
    bodyCtx.drawImage(img, 20, 20, 8, 12, 96, 64, 64, 96);

    // Left Arm
    bodyCtx.drawImage(img, 44, 20, 4, 12, 48, 64, 32, 96);

    // Right Arm
    bodyCtx.drawImage(img, 44, 20, 4, 12, 160, 64, 32, 96);

    // Left Leg
    bodyCtx.drawImage(img, 4, 20, 4, 12, 96, 160, 32, 96);

    // Right Leg
    bodyCtx.drawImage(img, 4, 20, 4, 12, 128, 160, 32, 96);
}
