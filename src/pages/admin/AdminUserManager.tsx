import { useState } from 'react';
import styled from 'styled-components';
import { Alert } from '../../components/Alert';
import { Loader } from '../../components/Loader';
import { Input as BaseInput } from '../../components/Input';
import { Button as BaseButton } from '../../components/Button';
import { Select as BaseSelect } from '../../components/Select';
import { AdminUserService } from '../../services/AdminUserService';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import type {CreateUserRequest, UpdateUserRequest, UserOutput } from '../../services/AdminUserService';

const Container = styled.div`
  padding: 2rem;
  font-family: 'Rajdhani', sans-serif;
  max-width: 900px;
  margin: 0 auto;
  color: ${(p) => p.theme.colors.text};
`;

const Title = styled.h2`
  color: ${(p) => p.theme.colors.primary};
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Card = styled.div`
  background-color: ${(p) => p.theme.colors.surface};
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 0 12px rgba(255,255,255,0.05);
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  @media (max-width: 680px) { grid-template-columns: 1fr; }
`;

const Input = styled(BaseInput)`
  margin: 0;
`;

const Select = styled(BaseSelect)`
  margin: 0;
`;

const PrimaryButton = styled(BaseButton)`
  width: fit-content;
`;

const SecondaryButton = styled.button`
  background-color: #444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-weight: bold;
  font-family: 'Rajdhani', sans-serif;
  cursor: pointer;
  transition: background-color .2s;
  &:hover { background-color: #e50914; }
`;

export const AdminUserManager = () => {
  const [cUsername, setCUsername] = useState('');
  const [cPassword, setCPassword] = useState('');
  const [cRole, setCRole] = useState<'admin' | 'user'>('user');
  const [showConfirm, setShowConfirm] = useState(false);

  const [qUsername, setQUsername] = useState('');
  const [found, setFound] = useState<UserOutput | null>(null);
  const [uPassword, setUPassword] = useState('');
  const [uRole, setURole] = useState<'admin' | 'user'>('user');


  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetMsgs = () => { setError(null); setOk(null); };

  const handleCreate = async () => {
    resetMsgs();
    if (!cUsername || !cPassword) {
      setError('Informe username e senha.');
      return;
    }
    if (cPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }
    const payload: CreateUserRequest = { username: cUsername.trim(), password: cPassword, role: cRole };
    try {
      setLoading(true);
      const created = await AdminUserService.createUser(payload);
      setOk(`Usuário ${created.username} criado com sucesso.`);
      setCUsername(''); setCPassword(''); setCRole('user');
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Erro ao criar usuário.');
    } finally {
      setLoading(false);
    }
  };

  const handleFind = async () => {
    resetMsgs();
    if (!qUsername) { setError('Informe o username para buscar.'); return; }
    try {
      setLoading(true);
      const user = await AdminUserService.getUser(qUsername.trim());
      setFound(user);
      setURole(user.role);
      setUPassword('');
    } catch (e: any) {
      setFound(null);
      setError(e?.response?.status === 404 ? 'Usuário não encontrado.' : 'Erro ao buscar usuário.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    resetMsgs();
    if (!found) return;
    if (!uPassword && !uRole) {
      setError('Informe uma alteração (senha e/ou role).');
      return;
    }
    const payload: UpdateUserRequest = { role: uRole, password: uPassword || undefined };
    try {
      setLoading(true);
      const updated = await AdminUserService.updateUser(found.username, payload);
      setFound(updated);
      setUPassword('');
      setOk(`Usuário ${updated.username} atualizado.`);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Erro ao atualizar usuário.');
    } finally {
      setLoading(false);
    }
  };

const handleDelete = async () => {
  resetMsgs();
  if (!found) return;
  try {
    setLoading(true);
    await AdminUserService.deleteUser(found.username);
    setOk(`Usuário ${found.username} excluído.`);
    setFound(null);
    setQUsername('');
  } catch (e: any) {
    setError(e?.response?.data?.error ?? 'Erro ao excluir usuário.');
  } finally {
    setLoading(false);
    setShowConfirm(false); // fecha o modal ao final
  }
};


  return (
    <Container>
      <Title>Gerenciar Usuários</Title>
      {error && <Alert type="error" message={error} />}
      {ok && <Alert type="success" message={ok} />}
      {loading && <Loader />}

      {/* Criar */}
      <Card>
        <h3 style={{ marginTop: 0, color: '#e50914' }}>Criar Usuário</h3>
        <Row>
          <Input label="Username" value={cUsername} onChange={(e) => setCUsername(e.target.value)} />
          <Input label="Senha" type="password" value={cPassword} onChange={(e) => setCPassword(e.target.value)} />
        </Row>
        <div style={{ marginTop: '0.75rem', maxWidth: 260 }}>
          <Select
            label="Role"
            value={cRole}
            isSearchable={false}
            onChange={(v) => setCRole((v as 'admin' | 'user') ?? 'user')}
            options={[
              { value: 'user', label: 'user' },
              { value: 'admin', label: 'admin' },
            ]}
          />
        </div>
        <div style={{ marginTop: '1rem' }}>
          <PrimaryButton onClick={handleCreate}>Criar</PrimaryButton>
        </div>
      </Card>

      <Card>
        <h3 style={{ marginTop: 0, color: '#e50914' }}>Buscar / Editar / Excluir</h3>
        <Row>
          <Input label="Username para busca" value={qUsername} onChange={(e) => setQUsername(e.target.value)} />
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <PrimaryButton onClick={handleFind}>Buscar</PrimaryButton>
          </div>
        </Row>

        {found && (
          <>
            <div style={{ marginTop: '1rem' }}>
              <p><strong>Encontrado:</strong> {found.username} ({found.role})</p>
              {found.createdAt && <p><strong>Criado em:</strong> {new Date(found.createdAt).toLocaleString('pt-BR')}</p>}
            </div>

            <Row style={{ marginTop: '0.75rem' }}>
              <Input label="Nova senha (opcional)" type="password" value={uPassword} onChange={(e) => setUPassword(e.target.value)} />
              <Select
                label="Role"
                value={uRole}
                isSearchable={false}
                onChange={(v) => setURole((v as 'admin' | 'user') ?? 'user')}
                options={[
                  { value: 'user', label: 'user' },
                  { value: 'admin', label: 'admin' },
                ]}
              />
            </Row>

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <PrimaryButton onClick={handleUpdate}>Salvar alterações</PrimaryButton>
              <SecondaryButton onClick={() => setShowConfirm(true)}>Excluir</SecondaryButton>
            </div>
          </>
        )}
      </Card>
          {showConfirm && (
      <ConfirmDialog
        title="Excluir usuário"
        message={`Confirma excluir o usuário ${found?.username}? Essa ação não pode ser desfeita.`}
        confirmText="Excluir"
        cancelText="Cancelar"
        onConfirm={handleDelete}
        onCancel={() => setShowConfirm(false)}
      />
    )}
    </Container>
  );
};

export default AdminUserManager;
