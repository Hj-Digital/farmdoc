import { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    setStatus(data.message || data.error);
  };

  return (
    <>
      <Head>
        <title>Envio de Documentos | Bom Preço</title>
      </Head>
      <div style={styles.container}>
        <h1 style={styles.title}>Envio de Documentos | Bom Preço</h1>
        <p style={styles.subtitle}>Faça o upload de seus documentos em PDF de forma segura.</p>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files[0])}
          style={styles.input}
        />
        <button style={styles.button} onClick={handleUpload}>
          Enviar Documento
        </button>
        {status && <p style={styles.status}>{status}</p>}
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: 500,
    margin: '80px auto',
    background: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    textAlign: 'center',
    fontFamily: 'Segoe UI, sans-serif'
  },
  title: {
    fontSize: '28px',
    marginBottom: '10px',
    color: '#1e3a8a'
  },
  subtitle: {
    fontSize: '16px',
    color: '#555',
    marginBottom: '30px'
  },
  input: {
    marginBottom: '20px',
    display: 'block',
    width: '100%',
    padding: '12px',
    border: '1px solid #ccc',
    borderRadius: '8px'
  },
  button: {
    background: '#1e40af',
    color: '#fff',
    border: 'none',
    padding: '12px 24px',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '16px'
  },
  status: {
    marginTop: '20px',
    color: '#1e3a8a'
  }
};
