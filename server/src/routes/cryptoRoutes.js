import { Router } from "express";
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
} from "../services/cryptoService.js";

const router = Router();

router.post("/caesar", (req, res) => {
  const { text, shift, mode, steps } = req.body;
  if (typeof shift !== "number" || !text)
    return res.status(400).json({ error: "Invalid input" });
  const out = caesarCipher(text, shift, mode, { steps });
  res.json(out.steps ? out : { result: out });
});

router.post("/vigenere", (req, res) => {
  const { text, key, mode, steps } = req.body;
  if (!key || !text) return res.status(400).json({ error: "Invalid input" });
  try {
    const out = vigenereCipher(text, key, mode, { steps });
    res.json(out.steps ? out : { result: out });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/playfair", (req, res) => {
  const { text, key, mode, steps } = req.body;
  if (!key || !text) return res.status(400).json({ error: "Invalid input" });
  const out = playfairCipher(text, key, mode, { steps });
  res.json(out.steps ? out : { result: out });
});

router.get("/rsa/keys", (req, res) => {
  const keys = generateRSAKeys();
  res.json(keys);
});

router.post("/rsa/encrypt", (req, res) => {
  const { publicKey, message } = req.body;
  try {
    const encrypted = rsaEncrypt(publicKey, message);
    res.json({ encrypted });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/rsa/decrypt", (req, res) => {
  const { privateKey, encrypted } = req.body;
  try {
    const message = rsaDecrypt(privateKey, encrypted);
    res.json({ message });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/aes/encrypt", (req, res) => {
  const { key, message } = req.body;
  try {
    const data = aesEncrypt(key, message);
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/aes/decrypt", (req, res) => {
  const { key, iv, encrypted } = req.body;
  try {
    const message = aesDecrypt(key, iv, encrypted);
    res.json({ message });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.post("/hash", (req, res) => {
  const { algorithm, message } = req.body;
  try {
    const digest = hashMessage(algorithm, message);
    res.json({ digest });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Base64
router.post("/base64", (req, res) => {
  const { text, mode = "encode" } = req.body;
  try {
    const result = base64Transform(text, mode);
    res.json({ result });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Diffie-Hellman
router.get("/dh/params", (req, res) => {
  const { size } = req.query;
  const primeLength = size ? parseInt(size, 10) : 512;
  const params = dhGenerateParams(primeLength);
  res.json(params);
});

router.post("/dh/keypair", (req, res) => {
  const { prime, generator } = req.body;
  if (!prime || !generator)
    return res.status(400).json({ error: "Missing prime/generator" });
  const kp = dhGenerateKeyPair(prime, generator);
  res.json(kp);
});

router.post("/dh/secret", (req, res) => {
  const { prime, generator, privateKey, publicKey, otherPublicKey } = req.body;
  if (!prime || !generator || !privateKey || !publicKey || !otherPublicKey)
    return res.status(400).json({ error: "Missing fields" });
  try {
    const secret = dhComputeSecret({
      prime,
      generator,
      privateKey,
      publicKey,
      otherPublicKey,
    });
    res.json({ secret });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
