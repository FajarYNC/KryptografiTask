import crypto from "crypto";

// ============= Classical Ciphers with Step Support =============
export function caesarCipher(
  text,
  shift = 3,
  mode = "encrypt",
  { steps = false } = {}
) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const A = alphabet.split("");
  const realShift = (((mode === "decrypt" ? -shift : shift) % 26) + 26) % 26;
  const stepData = [];
  const result = text
    .toUpperCase()
    .split("")
    .map((ch, idx) => {
      const i = A.indexOf(ch);
      if (i === -1) {
        if (steps)
          stepData.push({
            index: idx,
            input: ch,
            output: ch,
            shift: 0,
            note: "non-alpha",
          });
        return ch;
      }
      const out = A[(i + realShift) % 26];
      if (steps)
        stepData.push({ index: idx, input: ch, output: out, shift: realShift });
      return out;
    })
    .join("");
  return steps ? { result, steps: stepData } : result;
}

export function vigenereCipher(
  text,
  key,
  mode = "encrypt",
  { steps = false } = {}
) {
  const a = "A".charCodeAt(0);
  key = key.toUpperCase().replace(/[^A-Z]/g, "");
  if (!key.length) throw new Error("Key kosong setelah normalisasi");
  let ki = 0;
  const stepData = [];
  const result = text
    .toUpperCase()
    .split("")
    .map((ch, idx) => {
      const code = ch.charCodeAt(0);
      if (code < 65 || code > 90) {
        if (steps)
          stepData.push({
            index: idx,
            plain: ch,
            keyChar: "",
            shift: 0,
            cipher: ch,
            note: "non-alpha",
          });
        return ch;
      }
      const k = key.charCodeAt(ki % key.length) - a;
      const shift = mode === "decrypt" ? 26 - k : k;
      const cipher = String.fromCharCode(((code - a + shift) % 26) + a);
      if (steps)
        stepData.push({
          index: idx,
          plain: ch,
          keyChar: key[ki % key.length],
          shift: mode === "decrypt" ? -k : k,
          cipher,
        });
      ki++;
      return cipher;
    })
    .join("");
  return steps ? { result, steps: stepData } : result;
}

export function playfairCipher(
  text,
  key,
  mode = "encrypt",
  { steps = false } = {}
) {
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
  const stepData = [];
  const out = pairs
    .map(([a, b], idxPair) => {
      let [ra, ca] = find(a);
      let [rb, cb] = find(b);
      let rule = "";
      if (ra === rb) {
        rule = "row";
        if (mode === "encrypt") {
          ca = (ca + 1) % 5;
          cb = (cb + 1) % 5;
        } else {
          ca = (ca + 4) % 5;
          cb = (cb + 4) % 5;
        }
      } else if (ca === cb) {
        rule = "column";
        if (mode === "encrypt") {
          ra = (ra + 1) % 5;
          rb = (rb + 1) % 5;
        } else {
          ra = (ra + 4) % 5;
          rb = (rb + 4) % 5;
        }
      } else {
        rule = "rectangle";
        [ca, cb] = [cb, ca];
      }
      const res = grid[ra][ca] + grid[rb][cb];
      if (steps)
        stepData.push({ index: idxPair, pair: a + b, rule, result: res });
      return res;
    })
    .join("");
  return steps ? { result: out, steps: stepData, table: grid } : out;
}

// ============= Modern Crypto (Demo) =============
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

export function hashMessage(algorithm, message) {
  if (!["sha256", "sha512", "md5"].includes(algorithm))
    throw new Error("Unsupported algorithm");
  return crypto.createHash(algorithm).update(message).digest("hex");
}

// ============= Base64 =============
export function base64Transform(text, mode = "encode") {
  if (mode === "encode") return Buffer.from(text, "utf8").toString("base64");
  if (mode === "decode") return Buffer.from(text, "base64").toString("utf8");
  throw new Error("Mode harus encode / decode");
}

// ============= Diffie-Hellman (demo) =============
export function dhGenerateParams(primeLength = 512) {
  // 512 untuk kecepatan demo
  const dh = crypto.createDiffieHellman(primeLength);
  dh.generateKeys();
  return { prime: dh.getPrime("hex"), generator: dh.getGenerator("hex") };
}

export function dhGenerateKeyPair(prime, generator) {
  const dh = crypto.createDiffieHellman(
    Buffer.from(prime, "hex"),
    Buffer.from(generator, "hex")
  );
  dh.generateKeys();
  return {
    privateKey: dh.getPrivateKey("hex"),
    publicKey: dh.getPublicKey("hex"),
  };
}

export function dhComputeSecret({
  prime,
  generator,
  privateKey,
  publicKey,
  otherPublicKey,
}) {
  const dh = crypto.createDiffieHellman(
    Buffer.from(prime, "hex"),
    Buffer.from(generator, "hex")
  );
  dh.setPrivateKey(Buffer.from(privateKey, "hex"));
  dh.setPublicKey(Buffer.from(publicKey, "hex"));
  return dh.computeSecret(Buffer.from(otherPublicKey, "hex")).toString("hex");
}
