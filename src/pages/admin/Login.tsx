import { useState } from 'react';
import styled from 'styled-components';
import { Input } from '../../components/Input';
import { Button } from '../../components/Button';
import { useNavigate } from 'react-router-dom';
import { AdminAuthService } from '../../services/AdminAuthService';
import { Alert } from '../../components/Alert';
import { Loader } from '../../components/Loader';

const PageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: ${(props) => props.theme.colors.background};
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  background-color: ${(props) => props.theme.colors.surface};
  padding: 2rem;
  border-radius: 12px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.05);
  color: ${(props) => props.theme.colors.text};
  font-family: 'Rajdhani', sans-serif;
`;

const Title = styled.h2`
  text-align: center;
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

export const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setError(null);
      setLoading(true);
      const success = await AdminAuthService.login({ username, password });
      if (success) {
        navigate('/admin/dashboard');
      } else {
        setError('Usuário ou senha inválidos');
      }
    } catch (err) {
      setError('Erro no login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageWrapper>
      <Container>
        <Title>Área Administrativa</Title>
        {error && <Alert type="error" message={error} />}
        {loading && <Loader />}
        <Input
          label="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          label="Senha"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={handleLogin}>Entrar</Button>
      </Container>
    </PageWrapper>
  );
};
