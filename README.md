# Aplikasi Kriptografi Node.js

Project ini berisi server API Node.js dan client React (Vite + Tailwind) untuk demonstrasi beberapa algoritma kriptografi (klasik dan modern) secara interaktif.

## Fitur

- Cipher klasik: Caesar, Vigenere, Playfair
- AES-256-CBC (simetris) demo
- RSA (generate key pair, encrypt, decrypt)
- Hash (SHA-256, SHA-512, MD5) untuk integritas
- UI interaktif dengan Tailwind, tema gelap modern

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

- POST /api/crypto/caesar { text, shift, mode }
- POST /api/crypto/vigenere { text, key, mode }
- POST /api/crypto/playfair { text, key, mode }
- GET /api/crypto/rsa/keys
- POST /api/crypto/rsa/encrypt { publicKey, message }
- POST /api/crypto/rsa/decrypt { privateKey, encrypted }
- POST /api/crypto/aes/encrypt { key, message }
- POST /api/crypto/aes/decrypt { key, iv, encrypted }
- POST /api/crypto/hash { algorithm, message }

## Lisensi

MIT (opsional, bisa disesuaikan kebutuhan tugas).
