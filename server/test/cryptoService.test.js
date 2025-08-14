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
  base64Transform,
  dhGenerateParams,
  dhGenerateKeyPair,
  dhComputeSecret,
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

// Base64
const b64 = base64Transform("hello", "encode");
assert("Base64 encode", b64 === "aGVsbG8=");
assert("Base64 decode", base64Transform(b64, "decode") === "hello");

// Diffie-Hellman (512 bits minimal acceptable demo)
const params = dhGenerateParams(512);
const alice = dhGenerateKeyPair(params.prime, params.generator);
const bob = dhGenerateKeyPair(params.prime, params.generator);
const secretA = dhComputeSecret({
  prime: params.prime,
  generator: params.generator,
  privateKey: alice.privateKey,
  publicKey: alice.publicKey,
  otherPublicKey: bob.publicKey,
});
const secretB = dhComputeSecret({
  prime: params.prime,
  generator: params.generator,
  privateKey: bob.privateKey,
  publicKey: bob.publicKey,
  otherPublicKey: alice.publicKey,
});
assert("DH secret match", secretA === secretB && secretA.length > 0);

if (process.exitCode) {
  console.log("Some tests failed");
} else {
  console.log("All tests passed");
}
