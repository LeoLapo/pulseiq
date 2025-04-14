import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('login');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      console.log('Iniciando login:', { username, password });
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('/api/auth/login', { // Ajustado para /api/auth/login
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('Resposta do login:', response.status, response.statusText);

      if (!response.ok) {
        const data = await response.text(); // Usar text() para evitar erro de parse
        throw new Error(data || `Login failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Corpo da resposta:', data);

      if (data.message === 'Code sent to email') {
        console.log('Mudando para tela de verificação');
        setStep('verify');
      } else {
        throw new Error('Resposta inesperada do servidor');
      }
    } catch (err) {
      console.error('Erro no login:', err);
      setError(err.message || 'Erro de rede ao tentar fazer login');
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      console.log('Verificando código:', { username, code });
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('/api/auth/verify-code', { // Ajustado para /api/auth/verify-code
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, code }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log('Resposta da verificação:', response.status, response.statusText);

      if (!response.ok) {
        const data = await response.text();
        throw new Error(data || `Code verification failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Corpo da verificação:', data);

      localStorage.setItem('authToken', data.token);
      console.log('Token salvo, redirecionando para /dashboard');
      navigate('/dashboard');
    } catch (err) {
      console.error('Erro na verificação:', err);
      setError(err.message || 'Erro de rede ao verificar código');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <form
        onSubmit={step === 'login' ? handleLogin : handleVerifyCode}
        className="bg-bg-secondary p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-accent-secondary">
          {step === 'login' ? 'Login' : 'Verificar Código'}
        </h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {step === 'login' ? (
          <>
            <div className="mb-4">
              <label className="block text-text-secondary mb-2">Usuário</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-text-secondary mb-2">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 text-white"
                required
              />
            </div>
          </>
        ) : (
          <div className="mb-4">
            <label className="block text-text-secondary mb-2">Código</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2 rounded bg-gray-800 text-white"
              required
            />
          </div>
        )}
        <button type="submit" className="w-full bg-accent-secondary p-2 rounded hover:bg-accent-primary">
          {step === 'login' ? 'Entrar' : 'Verificar'}
        </button>
      </form>
    </div>
  );
}

export default Login;