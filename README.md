# Kelompok ...

Anggota : 

- Gede Raditya Dharma Putra Ayudia (245150700111028)
- Athalariiq Fildzahhanan Ardian (245150707111052)
- I Gusti Ngurah Anantawijaya Mahardika (245150700111027)
- Zeva Wyakta Zaylendra (245150700111033)

Minecraft Skin Viewer adalah aplikasi web sederhana yang dibuat menggunakan **HTML, CSS, dan JavaScript untuk menampilkan skin Minecraft dengan **username player**.

Aplikasi ini mengambil data dari **Mojang API**, mendecode texture skin yang diencode dalam **Base64**, lalu menampilkan:

- Full body karakter Minecraft
- Close-up wajah player
- Preview raw skin texture
- Informasi player (username, UUID, model)
- Tombol untuk mengunduh skin

Aplikasi ini berjalan langsung di browser tanpa memerlukan server backend.

---

# Fitur

- Pencarian skin menggunakan **Minecraft username**
- Mengambil **UUID player secara otomatis**
- Decode **Base64 skin texture**
- Rendering skin menggunakan **HTML Canvas**
- Deteksi model **Steve (Classic)** atau **Alex (Slim)**
- Download skin dalam format **PNG**
- Tampilan UI modern dengan dark theme
- Responsive dan dapat digunakan di perangkat mobile
- Tidak memerlukan **API key**

---

# Struktur Project

Penjelasan file:

- **index.html**  
  File utama yang berisi struktur halaman web.

- **style.css**  
  Berisi styling tampilan aplikasi seperti layout, warna, dan responsive design.

- **script.js**  
  Berisi logika aplikasi untuk mengambil data dari API, memproses skin, dan merender tampilan.

- **README.md**  
  Dokumentasi project.

---

# Cara Menjalankan Project

## 1. Download atau Clone Repository


atau download sebagai **ZIP** dari repository.

---

## 2. Masuk ke Folder Project

---

## 3. Jalankan Aplikasi

Buka file berikut menggunakan browser:

Contoh:

- Double klik file **index.html**
- Atau klik kanan → **Open With Browser**

Aplikasi akan langsung berjalan.

---

## 4. Cara Menggunakan

1. Masukkan **username Minecraft** pada kolom input.
2. Klik tombol **Search** atau tekan **Enter**.
3. Aplikasi akan mengambil data player dari Mojang API.
4. Skin player akan ditampilkan dalam beberapa bentuk:
   - Full body
   - Face preview
   - Raw skin texture
5. Klik **Download Skin** untuk mengunduh skin PNG.

Contoh username yang dapat dicoba:
Notch
jeb_
Dinnerbone
Technoblade


---

# API yang Digunakan

Aplikasi ini menggunakan **Mojang Official API** untuk mengambil data player dan skin.

---

# 1. API Mendapatkan UUID Player

Endpoint: https://api.mojang.com/users/profiles/minecraft/%7Busername%7D

Contoh: https://api.mojang.com/users/profiles/minecraft/Notch


Response API:

```json
{
  "id": "069a79f444e94726a5befca90e38aaf5",
  "name": "Notch"
}
```
Dokumentasi: https://wiki.vg/Mojang_API

API Mendapatkan Data Skin Player

Endpoint:

https://sessionserver.mojang.com/session/minecraft/profile/{uuid}

Contoh:

https://sessionserver.mojang.com/session/minecraft/profile/069a79f444e94726a5befca90e38aaf5

Response API akan berisi property bernama textures yang diencode menggunakan Base64.

Contoh response:

{
  "properties": [
    {
      "name": "textures",
      "value": "Base64EncodedTextureData"
    }
  ]
}
3. Decode Texture Data

Data Base64 akan didecode untuk mendapatkan URL skin.

Contoh hasil decode:

{
  "textures": {
    "SKIN": {
      "url": "http://textures.minecraft.net/texture/xxxxxx"
    }
  }
}

URL ini adalah file skin PNG yang digunakan oleh aplikasi.
