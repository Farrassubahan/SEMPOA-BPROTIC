<div align="center">

# 🧮 BPROTIC SEMPOA
### Platform Pembelajaran Mental Aritmatika & Sempoa Interaktif (Offline-First)

[![Expo SDK 58](https://img.shields.io/badge/Expo-SDK%2058-000020.svg?style=for-the-badge&logo=expo)](https://expo.dev)
[![React Native 0.88](https://img.shields.io/badge/React%20Native-0.88-61DAFB.svg?style=for-the-badge&logo=react)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Offline First](https://img.shields.io/badge/Architecture-100%25%20Offline--First-58CC02.svg?style=for-the-badge)](#arsitektur-offline-first)
[![EAS OTA Ready](https://img.shields.io/badge/Updates-EAS%20OTA%20Ready-1CB0F6.svg?style=for-the-badge)](https://expo.dev/eas)

<p align="center">
  Aplikasi pembelajaran sempoa interaktif bergaya <b>Duolingo</b> yang dirancang khusus untuk ekosistem <b>Tempat Les / Bimbingan Belajar</b>, mencakup silabus berjenjang dari <b>Kelas 1 SD hingga 3 SMA</b>.
</p>

---

</div>

## 🌟 Fitur Utama

### 1. 🗺️ Jalur Belajar Berliku ala Duolingo (The Learning Path)
* **Unit Tematik Berjenjang:** Dilengkapi banner unit penuh warna dengan deskripsi materi yang jelas.
* **Node Interaktif 3D:** Tombol level membal (*bouncy*) dengan status terkunci, aktif (*"MULAI"*), atau selesai (*Bintang 1–3*).
* **Peti Hadiah & Ujian Naik Tingkat:** Terdapat node peti bonus permata 💎 dan ujian bos piala 🏆 di setiap akhir unit.
* **Gamifikasi Penuh:** Sistem Nyawa (❤️), Bintang (⭐), Permata (💎), XP, dan Streak Harian (🔥) untuk memotivasi anak belajar setiap hari.

### 2. 🧮 Papan Sempoa Virtual Interaktif (Soroban 1:4)
* **Standar Soroban Jepang:** 1 manik atas (bernilai 5) dan 4 manik bawah (masing-masing bernilai 1) dengan palang pemisah dan titik pemandu satuan.
* **Responsif Segala Perangkat:** Skala adaptif yang nyaman disentuh jari anak di Smartphone (5–7 tiang) maupun Tablet (9–13 tiang).
* **Audio Feedback Low-Latency:** Suara klik manik kayu dan lonceng kemenangan instan tanpa lag.
* **Mode Panduan Jari (Fingering Rule):** Menampilkan petunjuk visual gerakan jari jempol (dorong naik) dan telunjuk (tarik turun).

### 3. ⚡ Flash Anzan Simulator (Mesin Angka Kilat)
* Latihan mental aritmatika bayangan dengan angka berkedip berkecepatan tinggi:
  * 🟢 **Santai (1.0 detik):** Untuk pemula SD.
  * 🟡 **Cepat (0.7 detik):** Untuk tingkat menengah SMP.
  * 🔴 **Kilat Kejuaraan (0.4 detik):** Untuk master olimpiade SMA.

### 4. 👥 Manajemen Tablet Tempat Les (Multi-Profile Switcher)
* **1 Tablet untuk Banyak Murid:** Siswa dapat berganti akun profil dengan memilih avatar kartun tanpa perlu internet atau akun email.
* Setiap murid memiliki catatan XP, level terbuka, dan riwayat akurasinya masing-masing.

### 5. 🔒 Portal Pengajar Terlindungi PIN (Tutor Portal)
* **Keamanan Berlapis:** Akses guru dilindungi PIN 4 digit (Default: `1234`) dengan hashing aman.
* **Mode Nyawa Tak Terbatas (Unlimited Hearts):** Mencegah anak les terhenti belajarnya saat jam kelas berlangsung.
* **Buka Semua Materi (Unlock All Levels):** Memudahkan tutor mendemonstrasikan materi tingkat manapun secara instan.
* **Raport Diagnosa Kelemahan:** Menampilkan rekap rumus yang paling sering membuat murid salah (contoh: *Kawan Besar 8: 3x keliru*).

---

## 📚 Silabus Resmi (SD Kelas 1 s.d. SMA Kelas 3)

| Fase | Tingkat / Jenjang | Target Usia | Standar Silabus & Materi |
| :---: | :--- | :---: | :--- |
| **1** | **Tingkat Dasar** (Kyu 10 – 8) | Kelas 1 – 2 SD | Pengenalan Manik, Aturan Jari (Jempol & Telunjuk), Hitung Langsung 1–9, Rumus Kawan Kecil Penjumlahan & Pengurangan ($+4 = +5 - 1$, dst). |
| **2** | **Tingkat Menengah** (Kyu 7 – 5) | Kelas 3 – 4 SD | Tiang Puluhan, Rumus Kawan Besar ($+9 = -1 + 10$ s.d $+1$), Rumus Campuran Gabungan 5 & 10 ($+6 = +1 - 5 + 10$), Dasar Bayangan (Anzan). |
| **3** | **Tingkat Mahir** (Kyu 4 – 2) | Kelas 5 – 6 SD | Perkalian Sempoa ($2 \times 1, 2 \times 2$), Pembagian Sempoa ($3 : 1$), Pengurangan Berulang pada Tiang. |
| **4** | **Tingkat Advance** (Kyu 1 – Dan 1) | Kelas 1 – 3 SMP | Multi-digit cepat, Operasi rantai penjumlahan 10 baris, Flash Anzan Kecepatan Sedang (0.7s – 1.0s). |
| **5** | **Tingkat Grandmaster** (Dan 2 – Dan 5) | Kelas 1 – 3 SMA | Perhitungan Desimal/Koma, Penentuan Titik Satuan (*Unit Rod*), Akar Kuadrat ($\sqrt{x}$), Ultra Flash Anzan Kejuaraan (0.3s – 0.4s). |

---

## 🏗️ Struktur Proyek

```text
sempoa-app/
├── assets/                  # Ikon, logo, dan gambar splash
├── src/
│   ├── app/                 # Expo Router Screens
│   │   ├── _layout.tsx      # Root Navigation & Theme Provider
│   │   ├── index.tsx        # Layar Utama: Duolingo Learning Path Map
│   │   └── explore.tsx      # Layar Latihan Bebas & Flash Anzan Lab
│   ├── components/
│   │   ├── abacus/          # Papan Sempoa Interaktif (AbacusBoard, Beads, Rods)
│   │   ├── duo/             # Komponen Duolingo (PathNode, UnitBanner, RunnerModal)
│   │   └── tutor/           # Multi-Student Switcher & Tutor Portal PIN Modal
│   ├── data/
│   │   └── curriculum.ts    # Data kurikulum resmi SD 1 s.d. SMA 3
│   ├── engine/
│   │   ├── abacusEngine.ts  # Logika matematika konversi manik & posisi Soroban
│   │   └── generator.ts     # Generator soal kawan kecil/besar & Anzan offline
│   ├── services/
│   │   ├── security.ts      # Enkripsi & verifikasi PIN Guru, sanitasi input
│   │   ├── storage.ts       # Penyimpanan persisten lokal offline (AsyncStorage)
│   │   └── sound.ts         # Audio synthesizer low-latency (klik kayu & lonceng)
│   └── types/               # Definisi tipe TypeScript
├── app.json                 # Konfigurasi aplikasi Expo & EAS Project ID
├── eas.json                 # Konfigurasi EAS Build (APK) & EAS Update Channels
└── package.json
```

---

## 🚀 Memulai Proyek (Development)

### 1. Prasyarat
* Node.js v18 atau yang lebih baru
* NPM atau Bun
* Expo CLI (`npx expo`)

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan di Mode Pengembangan
```bash
npx expo start
```
* Tekan **`w`** untuk membuka langsung di Web Browser.
* Buka aplikasi **Expo Go** di HP/Tablet Android atau iOS, lalu scan QR Code yang muncul di terminal.

### 4. Pengecekan Kualitas Kode
```bash
npx tsc --noEmit    # Memeriksa tipe TypeScript (0 Error)
npx eslint .        # Memeriksa kepatuhan linter (0 Warning)
```

---

## 📦 Mem-build Aplikasi (EAS Build)

Aplikasi ini dikonfigurasi untuk menghasilkan file **APK Android langsung** (bisa langsung dipasang di tablet tempat les tanpa lewat Google Play Store):

```bash
# Build APK Android mandiri
npx eas-cli@latest build -p android --profile preview

# Build iOS
npx eas-cli@latest build -p ios --profile preview
```

Setelah proses build di cloud selesai, terminal akan memberikan link unduhan file `.apk` siap pakai.

---

## ⚡ Pembaruan Otomatis (EAS Over-The-Air Update)

Jika kamu memperbarui soal, kurikulum, tampilan warna, atau memperbaiki bug kode, **kamu tidak perlu membuat APK baru**. Cukup kirim pembaruan lewat terminal:

```bash
npx eas-cli@latest update --branch preview --message "Pembaruan materi kawan besar dan suara manik"
```

> **Cara Kerja di Tablet Siswa:** Begitu tablet terhubung ke jaringan Wi-Fi tempat les dan membuka aplikasi, pembaruan akan terunduh otomatis di latar belakang. Aplikasi akan langsung berubah ke versi terbaru pada pembukaan berikutnya!

---

## 🛡️ Keamanan & Integritas Data

1. **Hashing PIN Guru:** PIN guru les (`1234`) tidak disimpan dalam bentuk teks biasa, melainkan melalui fungsi hashing satu arah dengan *salt* unik.
2. **Sanitasi Profil Murid:** Input nama murid otomatis disanitasi untuk mencegah karakter injeksi atau layout rusak.
3. **Fail-Safe Offline Storage:** Skema penyimpanan lokal divalidasi dengan struktur cadangan otomatis untuk mencegah kerusakan data jika tablet kehabisan baterai saat sesi belajar.

---

<div align="center">
  <sub>Dibangun dengan ❤️ untuk kemajuan pendidikan anak Indonesia oleh Tim <b>BPROTIC</b>.</sub>
</div>
