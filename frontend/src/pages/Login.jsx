import React, { useState } from 'react';
import api from '../services/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState('');
  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    try {
      const response = await api.post('/auth/login', { email, senha });

      // Guarda o token e os dados retornados
      const { token, nome, role } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('usuario', JSON.stringify({ nome, role }));

      setUsuarioLogado({ nome, role });
    } catch (err) {
      if (err.response && err.response.data) {
        setErro(typeof err.response.data === 'string' ? err.response.data : 'Falha na autenticação.');
      } else {
        setErro('Não foi possível conectar ao servidor.');
      }
    } finally {
      setCarregando(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUsuarioLogado(null);
    setEmail('');
    setSenha('');
  };

  if (usuarioLogado) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h2>Bem-vindo, {usuarioLogado.nome}!</h2>
          <p>Perfil de acesso: <strong>{usuarioLogado.role}</strong></p>
          <p style={{ color: 'green' }}>Login efetuado com sucesso (Token salvo).</p>
          <button style={styles.button} onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h2 style={styles.title}>Acessar Plataforma</h2>

        {erro && <div style={styles.alertError}>{erro}</div>}

        <div style={styles.formGroup}>
          <label style={styles.label}>E-mail:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="exemplo@teste.com"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Senha:</label>
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
            placeholder="••••••••"
            style={styles.input}
          />
        </div>

        <button type="submit" disabled={carregando} style={styles.button}>
          {carregando ? 'Autenticando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

// Estilos inline básicos para você rodar sem precisar de CSS externo no início
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    fontFamily: 'sans-serif'
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '32px',
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '380px'
  },
  title: {
    margin: '0 0 20px 0',
    textAlign: 'center',
    color: '#1f2937'
  },
  formGroup: {
    marginBottom: '16px'
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    color: '#4b5563'
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: '1px solid #d1d5db',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px'
  },
  alertError: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: '10px',
    borderRadius: '6px',
    marginBottom: '16px',
    fontSize: '13px'
  }
};