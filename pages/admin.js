import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Head from 'next/head';

export default function Admin() {
  const [senha, setSenha] = useState("");
  const [acesso, setAcesso] = useState(false);
  const [arquivos, setArquivos] = useState([]);

  const senhaCorreta = "hellen123";

  useEffect(() => {
    if (acesso) {
      fetchArquivos();
    }
  }, [acesso]);

  const fetchArquivos = async () => {
    const { data, error } = await supabase
      .from('arquivos')
      .select('*')
      .order('data_envio', { ascending: false });

    if (!error) setArquivos(data);
  };

  const formatarData = (iso) => new Date(iso).toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo"
  });

  return (
    <>
      <Head>
        <title>Área Administrativa | Clínica</title>
      </Head>
      <div style={styles.container}>
        {!acesso ? (
          <div style={styles.loginBox}>
            <h2 style={styles.title}>Área Restrita</h2>
            <input
              type="password"
              placeholder="Digite a senha de acesso"
              onChange={(e) => setSenha(e.target.value)}
              style={styles.input}
            />
            <button onClick={() => setAcesso(senha === senhaCorreta)} style={styles.button}>
              Entrar
            </button>
          </div>
        ) : (
          <div>
            <h2 style={styles.title}>Documentos Recebidos</h2>
            <ul style={styles.list}>
              {arquivos.map((arq) => (
                <li key={arq.id} style={styles.listItem}>
                  <a
                    href={`https://ojfxjuqwbzssyfjtfzeq.supabase.co/storage/v1/object/public/arquivos/${arq.nome}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.link}
                  >
                    📄 {arq.nome}
                  </a>
                  <span style={styles.date}>{formatarData(arq.data_envio)}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  container: {
    maxWidth: 700,
    margin: '80px auto',
    background: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
    fontFamily: 'Segoe UI, sans-serif'
  },
  loginBox: {
    textAlign: 'center'
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
    color: '#1e3a8a'
  },
  input: {
    marginBottom: '20px',
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
  list: {
    listStyle: 'none',
    padding: 0
  },
  listItem: {
    marginBottom: '16px',
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#f3f4f6',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  link: {
    textDecoration: 'none',
    color: '#1d4ed8',
    fontWeight: 'bold'
  },
  date: {
    fontSize: '14px',
    color: '#6b7280'
  }
};
