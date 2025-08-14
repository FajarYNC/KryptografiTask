import React, { useState } from "react";
import SectionCard from "../components/SectionCard.jsx";
import { Label, TextInput, TextArea, Button } from "../components/Input.jsx";
import { Tabs } from "../components/Tabs.jsx";
import axios from "axios";

const API = "http://localhost:5000/api/crypto";

function CipherTool({ type }) {
  const [text, setText] = useState("HELLO WORLD");
  const [key, setKey] = useState("KEY");
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState("encrypt");
  const [result, setResult] = useState("");
  const submit = async () => {
    let url = `${API}/${type}`;
    const payload = { text, mode };
    if (type === "caesar") payload.shift = Number(shift);
    if (type !== "caesar") payload.key = key;
    const { data } = await axios.post(url, payload);
    setResult(data.result);
  };
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>Text</Label>
          <TextArea value={text} onChange={(e) => setText(e.target.value)} />
        </div>
        <div>
          {type === "caesar" ? (
            <>
              <Label>Shift</Label>
              <TextInput
                type="number"
                value={shift}
                onChange={(e) => setShift(e.target.value)}
              />
            </>
          ) : (
            <>
              <Label>Key</Label>
              <TextInput value={key} onChange={(e) => setKey(e.target.value)} />
            </>
          )}
          <Label className="mt-4">Mode</Label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="mt-1 w-full bg-[#0f1115] border border-gray-700 rounded-md px-3 py-2 text-sm focus:border-accent focus:outline-none"
          >
            <option value="encrypt">Encrypt</option>
            <option value="decrypt">Decrypt</option>
          </select>
          <Button onClick={submit} className="mt-4 w-full">
            Proses
          </Button>
        </div>
      </div>
      {result && (
        <div className="bg-black/40 rounded-md p-3 font-mono text-sm border border-gray-700 break-words">
          {result}
        </div>
      )}
    </div>
  );
}

function AESSection() {
  const [key, setKey] = useState("password");
  const [message, setMessage] = useState("Pesan rahasia");
  const [encrypted, setEncrypted] = useState("");
  const [iv, setIv] = useState("");
  const [decrypted, setDecrypted] = useState("");

  async function doEncrypt() {
    const { data } = await axios.post(`${API}/aes/encrypt`, { key, message });
    setEncrypted(data.encrypted);
    setIv(data.iv);
    setDecrypted("");
  }
  async function doDecrypt() {
    const { data } = await axios.post(`${API}/aes/decrypt`, {
      key,
      iv,
      encrypted,
    });
    setDecrypted(data.message);
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Key</Label>
          <TextInput value={key} onChange={(e) => setKey(e.target.value)} />
          <Label className="mt-3">Message</Label>
          <TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="flex gap-2 mt-4">
            <Button onClick={doEncrypt}>Encrypt</Button>
            <Button variant="hollow" onClick={doDecrypt} disabled={!encrypted}>
              Decrypt
            </Button>
          </div>
        </div>
        <div className="space-y-3">
          {encrypted && (
            <div>
              <Label>IV</Label>
              <div className="p-2 font-mono bg-black/40 border border-gray-700 rounded text-xs break-all">
                {iv}
              </div>
              <Label className="mt-2">Encrypted (hex)</Label>
              <div className="p-2 font-mono bg-black/40 border border-gray-700 rounded text-xs break-all">
                {encrypted}
              </div>
            </div>
          )}
          {decrypted && (
            <div>
              <Label>Decrypted</Label>
              <div className="p-2 font-mono bg-black/40 border border-gray-700 rounded text-sm break-words">
                {decrypted}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function RSASection() {
  const [keys, setKeys] = useState({ publicKey: "", privateKey: "" });
  const [message, setMessage] = useState("Hello RSA");
  const [encrypted, setEncrypted] = useState("");
  const [decrypted, setDecrypted] = useState("");

  async function gen() {
    const { data } = await axios.get(`${API}/rsa/keys`);
    setKeys(data);
  }
  async function enc() {
    const { data } = await axios.post(`${API}/rsa/encrypt`, {
      publicKey: keys.publicKey,
      message,
    });
    setEncrypted(data.encrypted);
    setDecrypted("");
  }
  async function dec() {
    const { data } = await axios.post(`${API}/rsa/decrypt`, {
      privateKey: keys.privateKey,
      encrypted,
    });
    setDecrypted(data.message);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={gen}>Generate Keys</Button>
        <Button onClick={enc} disabled={!keys.publicKey}>
          Encrypt
        </Button>
        <Button variant="hollow" onClick={dec} disabled={!encrypted}>
          Decrypt
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Message</Label>
          <TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          {keys.publicKey && (
            <details className="bg-black/30 p-2 rounded border border-gray-700">
              <summary className="cursor-pointer text-sm">Public Key</summary>
              <pre className="text-[10px] whitespace-pre-wrap break-all">
                {keys.publicKey}
              </pre>
            </details>
          )}
          {keys.privateKey && (
            <details className="bg-black/30 p-2 rounded border border-gray-700">
              <summary className="cursor-pointer text-sm">Private Key</summary>
              <pre className="text-[10px] whitespace-pre-wrap break-all">
                {keys.privateKey}
              </pre>
            </details>
          )}
          {encrypted && (
            <div>
              <Label>Encrypted (base64)</Label>
              <div className="p-2 font-mono bg-black/40 border border-gray-700 rounded text-xs break-all">
                {encrypted}
              </div>
            </div>
          )}
          {decrypted && (
            <div>
              <Label>Decrypted</Label>
              <div className="p-2 font-mono bg-black/40 border border-gray-700 rounded text-sm break-words">
                {decrypted}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HashSection() {
  const [algorithm, setAlgorithm] = useState("sha256");
  const [message, setMessage] = useState("Hash me");
  const [digest, setDigest] = useState("");
  async function run() {
    const { data } = await axios.post(`${API}/hash`, { algorithm, message });
    setDigest(data.digest);
  }
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Message</Label>
          <TextArea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Label className="mt-3">Algorithm</Label>
          <select
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
            className="mt-1 w-full bg-[#0f1115] border border-gray-700 rounded-md px-3 py-2 text-sm focus:border-accent focus:outline-none"
          >
            <option>sha256</option>
            <option>sha512</option>
            <option>md5</option>
          </select>
          <Button onClick={run} className="mt-4">
            Generate Hash
          </Button>
        </div>
        {digest && (
          <div>
            <Label>Digest (hex)</Label>
            <div className="p-3 font-mono bg-black/40 border border-gray-700 rounded text-xs break-all">
              {digest}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const cipherTabs = ["caesar", "vigenere", "playfair"];
  const [cipher, setCipher] = useState(cipherTabs[0]);
  return (
    <div className="min-h-full flex flex-col">
      <header className="px-6 py-4 border-b border-gray-800">
        <h1 className="text-2xl font-bold gradient-title">
          Aplikasi Kriptografi
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Demo edukasi algoritma klasik dan modern (Jangan gunakan untuk
          produksi)
        </p>
      </header>
      <main className="flex-1 container mx-auto p-6 space-y-8">
        <SectionCard
          title="Cipher Klasik"
          description="Eksperimen dengan Caesar, Vigenere, dan Playfair."
        >
          <Tabs tabs={cipherTabs} active={cipher} onChange={setCipher} />
          <CipherTool type={cipher} />
        </SectionCard>
        <SectionCard
          title="AES (Symmetric)"
          description="Enkripsi AES-256-CBC dengan key string (di-hash SHA-256)."
        >
          <AESSection />
        </SectionCard>
        <SectionCard
          title="RSA (Asymmetric)"
          description="Generate pasangan kunci RSA dan lakukan enkripsi/dekripsi."
        >
          <RSASection />
        </SectionCard>
        <SectionCard
          title="Hash"
          description="Hash satu arah untuk integritas data."
        >
          <HashSection />
        </SectionCard>
      </main>
      <footer className="px-6 py-4 text-center text-xs text-gray-500 border-t border-gray-800">
        &copy; 2025 Kriptografi Edu
      </footer>
    </div>
  );
}
