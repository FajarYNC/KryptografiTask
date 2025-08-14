import {
  caesarCipher,
  vigenereCipher,
  playfairCipher,
  generateRSAKeys,
  rsaEncrypt,
  rsaDecrypt,
  aesEncrypt,
  aesDecrypt,
  hashMessage,
} from "../src/services/cryptoService.js";

function assert(name, cond) {
  if (!cond) {
    console.error("FAIL", name);
    process.exitCode = 1;
  } else {
    console.log("OK  ", name);
  }
}

// Caesar
const c = caesarCipher("ABC", 3, "encrypt");
assert("Caesar encrypt", c === "DEF");
assert("Caesar decrypt", caesarCipher(c, 3, "decrypt") === "ABC");

// Vigenere
const v = vigenereCipher("HELLO", "KEY", "encrypt");
assert("Vigenere roundtrip", vigenereCipher(v, "KEY", "decrypt") === "HELLO");

// Playfair
const p = playfairCipher("HELLO", "KEYWORD", "encrypt");
assert(
  "Playfair decrypt length matches",
  playfairCipher(p, "KEYWORD", "decrypt").length >= 5
);

// RSA
const { publicKey, privateKey } = generateRSAKeys();
const rEnc = rsaEncrypt(publicKey, "test");
const rDec = rsaDecrypt(privateKey, rEnc);
assert("RSA roundtrip", rDec === "test");

// AES
const { iv, encrypted } = aesEncrypt("password", "secret");
const dec = aesDecrypt("password", iv, encrypted);
assert("AES roundtrip", dec === "secret");

// Hash
const h = hashMessage("sha256", "abc");
assert("Hash length sha256", h.length === 64);

if (process.exitCode) {
  console.log("Some tests failed");
} else {
  console.log("All tests passed");
}
