# Aplikasi Kriptografi Node.js

Project ini berisi server API Node.js dan client React (Vite + Tailwind) untuk demonstrasi beberapa algoritma kriptografi (klasik dan modern) secara interaktif.

## Fitur

- Cipher klasik: Caesar, Vigenere, Playfair (opsional keluarkan langkah / steps)
- Base64 encode / decode
- AES-256-CBC (simetris) demo
- RSA (generate key pair, encrypt, decrypt)
- Diffie-Hellman (generate parameter, keypair, shared secret)
- Hash (SHA-256, SHA-512, MD5) untuk integritas
- UI interaktif dengan Tailwind, tema gelap modern + notifikasi (toast) & loading state

> Catatan: Implementasi hanya untuk tujuan edukasi. Jangan gunakan untuk kebutuhan produksi / keamanan serius.

## Struktur

```
server/  -> Express API
client/  -> React + Vite + Tailwind UI
```

## Menjalankan

Buka dua terminal.

### 1. Server

```
cd server
npm install
npm run dev
```

Server default di `http://localhost:5000`.

### 2. Client

```
cd client
npm install
npm run dev
```

Akses UI di URL yang ditampilkan (biasanya `http://localhost:5173`).

## Endpoint Ringkas

Semua endpoint berada di prefix `/api/crypto`.

Klasik (+ opsi `steps: true` untuk melihat proses per karakter / pasangan huruf):

- POST /caesar { text, shift, mode, steps? }
- POST /vigenere { text, key, mode, steps? }
- POST /playfair { text, key, mode, steps? }

Modern & utilitas:

- POST /base64 { text, mode } // mode: encode | decode
- POST /aes/encrypt { key, message }
- POST /aes/decrypt { key, iv, encrypted }
- GET /rsa/keys
- POST /rsa/encrypt { publicKey, message }
- POST /rsa/decrypt { privateKey, encrypted }
- POST /hash { algorithm, message } // algorithm: sha256 | sha512 | md5

Diffie-Hellman (demo):

- GET /dh/params -> generate prime & generator
- POST /dh/keypair { prime, generator } -> buat pasangan kunci
- POST /dh/secret { prime, generator, privateKey, publicKey, otherPublicKey }

Catatan: Parameter prime & generator yang dihasilkan hanya untuk demo (512-bit). Untuk produksi gunakan ukuran lebih besar (>= 2048-bit) & library matang.

### Contoh (curl)

```bash
# Caesar encrypt dengan steps
curl -X POST http://localhost:5000/api/crypto/caesar \
	-H "Content-Type: application/json" \
	-d '{"text":"HELLO","shift":3,"mode":"encrypt","steps":true}'

# Base64 encode
curl -X POST http://localhost:5000/api/crypto/base64 \
	-H "Content-Type: application/json" \
	-d '{"text":"Halo","mode":"encode"}'

# Dapatkan parameter Diffie-Hellman
curl http://localhost:5000/api/crypto/dh/params
```

### Field `steps`

Jika `steps:true` dikirim pada cipher klasik, response akan berisi array langkah yang bisa dipakai UI untuk visualisasi (misal menampilkan pergeseran huruf). UI saat ini fokus pada hasil akhir; Anda bisa menambah komponen visual sendiri memanfaatkan data tersebut.

## Testing (Server)

Terdapat skrip sederhana untuk menguji layanan kripto.

```bash
cd server
npm test
```

## Pengembangan Lanjutan (Ide)

- Tambah visualisasi tabel Playfair & highlight pasangan
- Copy-to-clipboard tombol hasil
- Simpan history operasi di localStorage
- Dukungan algoritma tambahan (Hill cipher, ECC, dsb.)
- Mode gelap/terang toggle

## Lisensi

MIT (opsional, bisa disesuaikan kebutuhan tugas).

---

Edu project – gunakan library kriptografi standar (misal libsodium, OpenSSL, WebCrypto) untuk kebutuhan keamanan nyata.
