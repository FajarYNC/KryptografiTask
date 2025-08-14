import crypto from "crypto";

// Caesar Cipher
export function caesarCipher(text, shift = 3, mode = "encrypt") {
  const a = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const A = a.split("");
  shift = (((mode === "decrypt" ? -shift : shift) % 26) + 26) % 26;
  return text
    .toUpperCase()
    .split("")
    .map((ch) => {
      const idx = A.indexOf(ch);
      if (idx === -1) return ch;
      return A[(idx + shift) % 26];
    })
    .join("");
}

// Vigenere Cipher
export function vigenereCipher(text, key, mode = "encrypt") {
  const a = "A".charCodeAt(0);
  key = key.toUpperCase().replace(/[^A-Z]/g, "");
  let ki = 0;
  return text
    .toUpperCase()
    .split("")
    .map((ch) => {
      const code = ch.charCodeAt(0);
      if (code < 65 || code > 90) return ch;
      const k = key.charCodeAt(ki++ % key.length) - a;
      const shift = mode === "decrypt" ? 26 - k : k;
      return String.fromCharCode(((code - a + shift) % 26) + a);
    })
    .join("");
}

// Playfair Cipher (simplified: J merged with I)
export function playfairCipher(text, key, mode = "encrypt") {
  key = key
    .toUpperCase()
    .replace(/J/g, "I")
    .replace(/[^A-Z]/g, "");
  const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
  let tableKey = "";
  for (const c of key + alphabet) if (!tableKey.includes(c)) tableKey += c;
  const grid = [];
  for (let i = 0; i < 25; i += 5) grid.push(tableKey.slice(i, i + 5));
  const clean = text
    .toUpperCase()
    .replace(/J/g, "I")
    .replace(/[^A-Z]/g, "");
  const pairs = [];
  let i = 0;
  while (i < clean.length) {
    let a = clean[i];
    let b = clean[i + 1];
    if (!b || a === b) {
      b = "X";
      i++;
    } else {
      i += 2;
    }
    pairs.push([a, b]);
  }
  function find(ch) {
    for (let r = 0; r < 5; r++) {
      const c = grid[r].indexOf(ch);
      if (c !== -1) return [r, c];
    }
  }
  return pairs
    .map(([a, b]) => {
      let [ra, ca] = find(a);
      let [rb, cb] = find(b);
      if (ra === rb) {
        // same row
        if (mode === "encrypt") {
          ca = (ca + 1) % 5;
          cb = (cb + 1) % 5;
        } else {
          ca = (ca + 4) % 5;
          cb = (cb + 4) % 5;
        }
      } else if (ca === cb) {
        // same col
        if (mode === "encrypt") {
          ra = (ra + 1) % 5;
          rb = (rb + 1) % 5;
        } else {
          ra = (ra + 4) % 5;
          rb = (rb + 4) % 5;
        }
      } else {
        // rectangle
        [ca, cb] = [cb, ca];
      }
      return grid[ra][ca] + grid[rb][cb];
    })
    .join("");
}

// RSA (demo only, not for production)
export function generateRSAKeys() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
  return { publicKey, privateKey };
}

export function rsaEncrypt(publicKey, message) {
  return crypto
    .publicEncrypt(publicKey, Buffer.from(message, "utf8"))
    .toString("base64");
}

export function rsaDecrypt(privateKey, encrypted) {
  return crypto
    .privateDecrypt(privateKey, Buffer.from(encrypted, "base64"))
    .toString("utf8");
}

// AES-256-CBC
export function aesEncrypt(key, message) {
  key = crypto.createHash("sha256").update(key).digest();
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(message, "utf8"),
    cipher.final(),
  ]);
  return { iv: iv.toString("hex"), encrypted: encrypted.toString("hex") };
}

export function aesDecrypt(key, ivHex, encryptedHex) {
  key = crypto.createHash("sha256").update(key).digest();
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

// Hashing
export function hashMessage(algorithm, message) {
  if (!["sha256", "sha512", "md5"].includes(algorithm))
    throw new Error("Unsupported algorithm");
  return crypto.createHash(algorithm).update(message).digest("hex");
}
