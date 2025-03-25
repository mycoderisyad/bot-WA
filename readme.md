# 📱 WhatsApp Bot dengan Baileys & TypeScript

Selamat datang di WhatsApp Bot berbasis *Baileys* dan *TypeScript*! 🚀
Bot ini dirancang untuk membantu penjualan dengan fitur-fitur otomatisasi seperti pendaftaran pengguna, cek stok barang, tambah produk, pembelian, dan AI untuk membalas pesan.

---

## ✨ Fitur Utama

✅ **Pendaftaran Pengguna**: Daftar dengan `#daftar` untuk mengakses fitur bot.  
✅ **Cek Stok Barang**: Gunakan `#stok` untuk melihat daftar produk yang tersedia.  
✅ **Tambah Produk (Admin Only)**: Admin bisa menambah produk dengan `#addlist-Nama-Kode-Harga-Stok`.  
✅ **Pembelian Produk**: Gunakan `#beli-KodeProduk-Jumlah` untuk membeli barang.  
✅ **Respon AI**: Bot bisa menjawab pertanyaan pelanggan dengan AI.

---

## 🔧 Cara Instalasi & Menjalankan Bot

### 1️⃣ **Clone Repository**
```sh
git clone https://github.com/mycoderisyad/bot-WA.git
cd bot-WA
```

### 2️⃣ **Install Dependensi**
```sh
npm install
```

### 3️⃣ **Konfigurasi Database**
Pastikan MySQL berjalan, lalu buat database dan sesuaikan file `.env`.
```sh
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=whatsapp_bot
```

### 4️⃣ **Jalankan Bot**
```sh
npx ts-node src/index.ts
```
Pindai QR Code di terminal menggunakan WhatsApp untuk menghubungkan bot.

---

## 🛠️ Cara Menggunakan

### **1️⃣ Daftar Sebagai Pengguna**
Kirim pesan:
```
#daftar
```

### **2️⃣ Melihat Stok Produk**
Kirim pesan:
```
#stok
```
Bot akan mengirim daftar barang yang tersedia.

### **3️⃣ Menambah Produk (Admin Only)**
Format perintah:
```
#addlist-NamaBarang-KodeBarang-Harga-Stok
```
Contoh:
```
#addlist-Kemeja-KM001-150000-10
```

### **4️⃣ Membeli Produk**
Format perintah:
```
#beli-KodeProduk-Jumlah
```
Contoh:
```
#beli-KM001-2
```
Bot akan memperbarui stok dan mengkonfirmasi pesanan.

---

## 👑 Admin
Nomor yang digunakan untuk menjalankan bot secara otomatis menjadi admin. Jika perlu, kamu bisa menambahkan admin langsung ke database.

---

## 🛑 Reset & Hapus Session
Jika ingin menghapus sesi bot saat logout, hapus folder `auth/`:
```sh
rm -rf auth
```
Lalu jalankan ulang bot.

---

## 🤖 AI Integration
Bot ini menggunakan **Google Gemini API** untuk menjawab pertanyaan pelanggan. Pastikan API key sudah diatur di `.env`:
```sh
GOOGLE_GEMINI_API_KEY=your-api-key
```

---

## 🎯 Kontribusi
Jika ingin berkontribusi, fork repo ini, buat branch baru, lalu buat pull request! 🚀

---

## ⚡ Troubleshooting
Jika terjadi error saat menjalankan bot:
- Pastikan dependensi sudah terinstall (`npm install`).
- Periksa koneksi ke MySQL (`.env` harus sesuai).
- Jika error terkait session, hapus folder `auth/` dan scan ulang QR Code.
- Cek log error untuk detail lebih lanjut.

---

## 📌 Lisensi
MIT License. Bebas digunakan dan dikembangkan lebih lanjut. 😃

---

Enjoy coding! 🚀🔥

