import React, { useState } from "react";
import SectionCard from "../components/SectionCard.jsx";
import { Label, TextInput, TextArea, Button } from "../components/Input.jsx";
import { Tabs } from "../components/Tabs.jsx";
import axios from "axios";
import { ToastStack } from "../components/Toast.jsx";

const API = "http://localhost:5000/api/crypto";

function useToaster() {
  const [toasts, setToasts] = useState([]);
  const push = (message, type = "info", ttl) =>
    setToasts((t) => [...t, { id: crypto.randomUUID(), message, type, ttl }]);
  const remove = (id) => setToasts((t) => t.filter((x) => x.id !== id));
  return { toasts, push, remove };
}

function LoadingSpinner({ small = false }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-accent/40 border-t-accent ${
        small ? "w-4 h-4" : "w-5 h-5"
      }`}
    ></span>
  );
}

function CipherTool({ type, notify }) {
  const [text, setText] = useState("HELLO WORLD");
  const [key, setKey] = useState("KEY");
  const [shift, setShift] = useState(3);
  const [mode, setMode] = useState("encrypt");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    setLoading(true);
    try {
      let url = `${API}/${type}`;
      const payload = { text, mode };
      if (type === "caesar") payload.shift = Number(shift);
      if (type !== "caesar") payload.key = key;
      const { data } = await axios.post(url, payload);
      setResult(data.result);
      notify(
        `Berhasil ${mode === "encrypt" ? "enkripsi" : "dekripsi"} ${type}`,
        "success"
      );
    } catch (e) {
      notify(e.response?.data?.error || e.message, "error");
    } finally {
      setLoading(false);
    }
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
          <Button onClick={submit} className="mt-4 w-full" disabled={loading}>
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <LoadingSpinner small /> Memproses...
              </span>
            ) : (
              "Proses"
            )}
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

function AESSection({ notify }) {
  const [key, setKey] = useState("password");
  const [message, setMessage] = useState("Pesan rahasia");
  const [encrypted, setEncrypted] = useState("");
  const [iv, setIv] = useState("");
  const [decrypted, setDecrypted] = useState("");

  const [loading, setLoading] = useState(false);
  async function doEncrypt() {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/aes/encrypt`, { key, message });
      setEncrypted(data.encrypted);
      setIv(data.iv);
      setDecrypted("");
      notify("AES encrypt sukses", "success");
    } catch (e) {
      notify(e.response?.data?.error || e.message, "error");
    } finally {
      setLoading(false);
    }
  }
  async function doDecrypt() {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/aes/decrypt`, {
        key,
        iv,
        encrypted,
      });
      setDecrypted(data.message);
      notify("AES decrypt sukses", "success");
    } catch (e) {
      notify(e.response?.data?.error || e.message, "error");
    } finally {
      setLoading(false);
    }
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
            <Button onClick={doEncrypt} disabled={loading}>
              {loading ? "..." : "Encrypt"}
            </Button>
            <Button
              variant="hollow"
              onClick={doDecrypt}
              disabled={!encrypted || loading}
            >
              {loading ? "..." : "Decrypt"}
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

function RSASection({ notify }) {
  const [keys, setKeys] = useState({ publicKey: "", privateKey: "" });
  const [message, setMessage] = useState("Hello RSA");
  const [encrypted, setEncrypted] = useState("");
  const [decrypted, setDecrypted] = useState("");

  const [loading, setLoading] = useState(false);
  async function gen() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/rsa/keys`);
      setKeys(data);
      notify("Generate kunci RSA", "success");
    } catch (e) {
      notify(e.message, "error");
    } finally {
      setLoading(false);
    }
  }
  async function enc() {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/rsa/encrypt`, {
        publicKey: keys.publicKey,
        message,
      });
      setEncrypted(data.encrypted);
      setDecrypted("");
      notify("RSA encrypt sukses", "success");
    } catch (e) {
      notify(e.response?.data?.error || e.message, "error");
    } finally {
      setLoading(false);
    }
  }
  async function dec() {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/rsa/decrypt`, {
        privateKey: keys.privateKey,
        encrypted,
      });
      setDecrypted(data.message);
      notify("RSA decrypt sukses", "success");
    } catch (e) {
      notify(e.response?.data?.error || e.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={gen} disabled={loading}>
          Generate Keys
        </Button>
        <Button onClick={enc} disabled={!keys.publicKey || loading}>
          Encrypt
        </Button>
        <Button variant="hollow" onClick={dec} disabled={!encrypted || loading}>
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

function HashSection({ notify }) {
  const [algorithm, setAlgorithm] = useState("sha256");
  const [message, setMessage] = useState("Hash me");
  const [digest, setDigest] = useState("");
  const [loading, setLoading] = useState(false);
  async function run() {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/hash`, { algorithm, message });
      setDigest(data.digest);
      notify("Generate hash sukses", "success");
    } catch (e) {
      notify(e.response?.data?.error || e.message, "error");
    } finally {
      setLoading(false);
    }
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
          <Button onClick={run} className="mt-4" disabled={loading}>
            {loading ? "..." : "Generate Hash"}
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
  const toast = useToaster();
  const notify = (msg, type) =>
    toast.push(msg, type === "error" ? "error" : "success");
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
          <CipherTool type={cipher} notify={notify} />
        </SectionCard>
        <SectionCard
          title="AES (Symmetric)"
          description="Enkripsi AES-256-CBC dengan key string (di-hash SHA-256)."
        >
          <AESSection notify={notify} />
        </SectionCard>
        <SectionCard
          title="RSA (Asymmetric)"
          description="Generate pasangan kunci RSA dan lakukan enkripsi/dekripsi."
        >
          <RSASection notify={notify} />
        </SectionCard>
        <SectionCard
          title="Hash"
          description="Hash satu arah untuk integritas data."
        >
          <HashSection notify={notify} />
        </SectionCard>
        <SectionCard title="Base64" description="Encoding / decoding Base64.">
          <Base64Section notify={notify} />
        </SectionCard>
        <SectionCard
          title="Diffie-Hellman"
          description="Pertukaran kunci bersama (key agreement) demo."
        >
          <DiffieHellmanSection notify={notify} />
        </SectionCard>
      </main>
      <footer className="px-6 py-4 text-center text-xs text-gray-500 border-t border-gray-800">
        &copy; 2025 Kriptografi Edu
      </footer>
      <ToastStack toasts={toast.toasts} onRemove={toast.remove} />
    </div>
  );
}

function Base64Section({ notify }) {
  const [mode, setMode] = useState("encode");
  const [text, setText] = useState("Contoh teks");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  async function run() {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/base64`, { text, mode });
      setResult(data.result);
      notify(
        "Base64 " + (mode === "encode" ? "encode" : "decode") + " sukses",
        "success"
      );
    } catch (e) {
      notify(e.response?.data?.error || e.message, "error");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Mode</Label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="mt-1 w-full bg-[#0f1115] border border-gray-700 rounded-md px-3 py-2 text-sm focus:border-accent focus:outline-none"
          >
            <option value="encode">Encode</option>
            <option value="decode">Decode</option>
          </select>
          <Label className="mt-3">Input</Label>
          <TextArea value={text} onChange={(e) => setText(e.target.value)} />
          <Button onClick={run} className="mt-4" disabled={loading}>
            {loading ? "..." : "Proses"}
          </Button>
        </div>
        {result && (
          <div>
            <Label>Hasil</Label>
            <div className="p-3 font-mono bg-black/40 border border-gray-700 rounded text-xs break-all">
              {result}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DiffieHellmanSection({ notify }) {
  const [params, setParams] = useState({ prime: "", generator: "" });
  const [alice, setAlice] = useState({ privateKey: "", publicKey: "" });
  const [bob, setBob] = useState({ privateKey: "", publicKey: "" });
  const [secretA, setSecretA] = useState("");
  const [secretB, setSecretB] = useState("");

  const [loading, setLoading] = useState(false);
  async function genParams() {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API}/dh/params`);
      setParams(data);
      setAlice({});
      setBob({});
      setSecretA("");
      setSecretB("");
      notify("Generate parameter DH", "success");
    } catch (e) {
      notify(e.message, "error");
    } finally {
      setLoading(false);
    }
  }
  async function genAlice() {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/dh/keypair`, params);
      setAlice(data);
      notify("Alice keypair", "success");
    } catch (e) {
      notify(e.message, "error");
    } finally {
      setLoading(false);
    }
  }
  async function genBob() {
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/dh/keypair`, params);
      setBob(data);
      notify("Bob keypair", "success");
    } catch (e) {
      notify(e.message, "error");
    } finally {
      setLoading(false);
    }
  }
  async function compute() {
    setLoading(true);
    try {
      if (alice.privateKey && bob.publicKey) {
        const { data } = await axios.post(`${API}/dh/secret`, {
          ...params,
          privateKey: alice.privateKey,
          publicKey: alice.publicKey,
          otherPublicKey: bob.publicKey,
        });
        setSecretA(data.secret);
      }
      if (bob.privateKey && alice.publicKey) {
        const { data } = await axios.post(`${API}/dh/secret`, {
          ...params,
          privateKey: bob.privateKey,
          publicKey: bob.publicKey,
          otherPublicKey: alice.publicKey,
        });
        setSecretB(data.secret);
      }
      notify("Compute secret selesai", "success");
    } catch (e) {
      notify(e.message, "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button onClick={genParams} disabled={loading}>
          Generate Parameters (p,g)
        </Button>
        <Button onClick={genAlice} disabled={!params.prime || loading}>
          Alice KeyPair
        </Button>
        <Button onClick={genBob} disabled={!params.prime || loading}>
          Bob KeyPair
        </Button>
        <Button
          variant="hollow"
          onClick={compute}
          disabled={!alice.publicKey || !bob.publicKey || loading}
        >
          Compute Secret
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-4 text-xs font-mono">
        <div className="space-y-2">
          {params.prime && (
            <div>
              <Label>Prime (hex)</Label>
              <div className="p-2 bg-black/40 rounded border border-gray-700 break-all max-h-32 overflow-auto">
                {params.prime}
              </div>
            </div>
          )}
          {params.generator && (
            <div>
              <Label>Generator</Label>
              <div className="p-2 bg-black/40 rounded border border-gray-700 break-all">
                {params.generator}
              </div>
            </div>
          )}
          {alice.publicKey && (
            <div>
              <Label>Alice Public</Label>
              <div className="p-2 bg-black/40 rounded border border-gray-700 break-all max-h-24 overflow-auto">
                {alice.publicKey}
              </div>
            </div>
          )}
          {bob.publicKey && (
            <div>
              <Label>Bob Public</Label>
              <div className="p-2 bg-black/40 rounded border border-gray-700 break-all max-h-24 overflow-auto">
                {bob.publicKey}
              </div>
            </div>
          )}
        </div>
        <div className="space-y-2">
          {secretA && (
            <div>
              <Label>Secret (Alice)</Label>
              <div className="p-2 bg-black/40 rounded border border-gray-700 break-all max-h-24 overflow-auto">
                {secretA}
              </div>
            </div>
          )}
          {secretB && (
            <div>
              <Label>Secret (Bob)</Label>
              <div className="p-2 bg-black/40 rounded border border-gray-700 break-all max-h-24 overflow-auto">
                {secretB}
              </div>
            </div>
          )}
          {secretA && secretB && (
            <div className="text-green-400">
              {secretA === secretB ? "Secrets match ✅" : "Secrets differ ❌"}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
