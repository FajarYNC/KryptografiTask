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
} from "../services/cryptoService.js";

const router = Router();

router.post("/caesar", (req, res) => {
  const { text, shift, mode } = req.body;
  if (typeof shift !== "number" || !text)
    return res.status(400).json({ error: "Invalid input" });
  const result = caesarCipher(text, shift, mode);
  res.json({ result });
});

router.post("/vigenere", (req, res) => {
  const { text, key, mode } = req.body;
  if (!key || !text) return res.status(400).json({ error: "Invalid input" });
  const result = vigenereCipher(text, key, mode);
  res.json({ result });
});

router.post("/playfair", (req, res) => {
  const { text, key, mode } = req.body;
  if (!key || !text) return res.status(400).json({ error: "Invalid input" });
  const result = playfairCipher(text, key, mode);
  res.json({ result });
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

export default router;
