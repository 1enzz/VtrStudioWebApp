import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Alert } from '../../components/Alert';
import { Loader } from '../../components/Loader';
import { Button as BaseButton } from '../../components/Button';
import { Input as BaseInput } from '../../components/Input';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { ServiceRulesService, type ServiceRule } from '../../services/ServiceRules';

const Container = styled.div`
  padding: 2rem;
  font-family: 'Rajdhani', sans-serif;
  max-width: 1000px;
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
  padding: 1.25rem;
  margin-bottom: 1.25rem;
  box-shadow: 0 0 12px rgba(255,255,255,0.05);
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: .75rem;
  @media (max-width: 920px) { grid-template-columns: 1fr 1fr; }
  @media (max-width: 540px) { grid-template-columns: 1fr; }
`;

const Input = styled(BaseInput)`
  margin: 0;
  min-width: 0; /* evita overflow dentro do grid */
`;

const SmallInput = styled.input`
  width: 100%;
  min-width: 0; /* evita overflow */
  padding: .6rem .75rem;
  border: none;
  border-radius: 6px;
  background-color: #222;
  color: ${(p) => p.theme.colors.white};
  font-family: 'Rajdhani', sans-serif;
  &::placeholder { color: #888; }
`;

const PrimaryButton = styled(BaseButton)`
  width: fit-content;
`;

const SecondaryButton = styled.button`
  background-color: #444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: .5rem 1rem;
  font-weight: bold;
  font-family: 'Rajdhani', sans-serif;
  cursor: pointer;
  transition: background-color .2s;
  &:hover { background-color: #e50914; }
`;

const Table = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.2fr 1.2fr 1.2fr 1.2fr 1fr;
  gap: .5rem;
  align-items: center;

  > div { padding: .6rem .75rem; background-color: #111; border-radius: 8px; }
  .head { background: transparent; font-weight: 700; color: ${(p) => p.theme.colors.primary}; }

  @media (max-width: 980px) {
    grid-template-columns: 1.5fr 1fr 1fr 1fr 1fr 1fr;
  }
  @media (max-width: 760px) {
    display: block; /* vira cards empilhados no mobile */
  }
`;

const RowCard = styled.div`
  display: contents;
  @media (max-width: 760px) {
    display: block;
    background: #111;
    border-radius: 12px;
    padding: .75rem;
    margin-bottom: .6rem;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: .5rem;
  button {
    background-color: #333;
    color: white;
    border: none;
    border-radius: 6px;
    padding: .4rem .9rem;
    font-weight: bold;
    cursor: pointer;
    font-family: 'Rajdhani', sans-serif;
  }
  button:hover { background-color: #e50914; }
`;

/* --- NOVOS: grid responsivo p/ Criar Serviço --- */
const CreateGrid = styled.div`
  display: grid;
  gap: .75rem;
  align-items: end;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`;

const CreateActions = styled.div`
  grid-column: 1 / -1; /* ocupa a linha toda */
  display: flex;
  justify-content: flex-end;
  align-items: end;

  @media (max-width: 540px) {
    width: 100%;
    & > button { width: 100%; }
  }
`;

type MaxEditor = { Pequeno: number | ''; Médio: number | ''; Grande: number | '' };

export const AdminServiceManager = () => {
  const [items, setItems] = useState<ServiceRule[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Create form
  const [cServiceType, setCServiceType] = useState('');
  const [cDuration, setCDuration] = useState('');
  const [cMax, setCMax] = useState<MaxEditor>({ Pequeno: '', Médio: '', Grande: '' });

  // Edit map (id -> edited values)
  const [editMap, setEditMap] = useState<Record<string, {
    serviceType: string; duration: string; max: MaxEditor;
  }>>({});

  const [confirmDelete, setConfirmDelete] = useState<{ id: string; name: string } | null>(null);

  const resetMsgs = () => { setOk(null); setError(null); };

  const fetchData = async () => {
    try {
      resetMsgs();
      setLoading(true);
      const data = await ServiceRulesService.list();
      setItems(data);
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Erro ao carregar serviços.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase();
    if (!q) return items;
    return items.filter(i =>
      i.serviceType.toLowerCase().includes(q) ||
      i.duration.toLowerCase().includes(q)
    );
  }, [items, filter]);

  const onCreate = async () => {
    resetMsgs();
    if (!cServiceType.trim() || !cDuration.trim()) {
      setError('Informe nome do serviço e duração.');
      return;
    }
    const payload: ServiceRule = {
      serviceType: cServiceType.trim(),
      duration: cDuration.trim(),
      maxPerDay: {
        Pequeno: Number(cMax.Pequeno || 0),
        Médio: Number(cMax.Médio || 0),
        Grande: Number(cMax.Grande || 0),
      },
    };
    try {
      setLoading(true);
      const created = await ServiceRulesService.create(payload);
      setOk(`Serviço "${created.serviceType}" criado.`);
      setCServiceType(''); setCDuration('');
      setCMax({ Pequeno: '', Médio: '', Grande: '' });
      fetchData();
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Erro ao criar serviço.');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (s: ServiceRule) => {
    setEditMap(prev => ({
      ...prev,
      [s.id!]: {
        serviceType: s.serviceType,
        duration: s.duration,
        max: {
          Pequeno: s.maxPerDay?.Pequeno ?? 0,
          Médio:   s.maxPerDay?.Médio ?? 0,
          Grande:  s.maxPerDay?.Grande ?? 0,
        }
      }
    }));
  };

  const cancelEdit = (id: string) => {
    setEditMap(prev => {
      const copy = { ...prev }; delete copy[id]; return copy;
    });
  };

  const onSave = async (id: string) => {
    resetMsgs();
    const edited = editMap[id];
    if (!edited) return;

    const payload: ServiceRule = {
      serviceType: edited.serviceType.trim(),
      duration: edited.duration.trim(),
      maxPerDay: {
        Pequeno: Number(edited.max.Pequeno || 0),
        Médio:   Number(edited.max.Médio || 0),
        Grande:  Number(edited.max.Grande || 0),
      }
    };

    try {
      setLoading(true);
      const updated = await ServiceRulesService.update(id, payload);
      setOk(`Serviço "${updated.serviceType}" atualizado.`);
      cancelEdit(id);
      fetchData();
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Erro ao atualizar serviço.');
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id: string) => {
    resetMsgs();
    try {
      setLoading(true);
      await ServiceRulesService.remove(id);
      setOk('Serviço excluído.');
      fetchData();
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Erro ao excluir serviço.');
    } finally {
      setLoading(false);
      setConfirmDelete(null);
    }
  };

  return (
    <Container>
      <Title>Gerenciar Serviços</Title>
      {error && <Alert type="error" message={error} />}
      {ok && <Alert type="success" message={ok} />}
      {loading && <Loader />}

      {/* Criar (RESPONSIVO) */}
      <Card>
        <h3 style={{ marginTop: 0, color: '#e50914' }}>Criar Serviço</h3>

        <CreateGrid>
          <Input
            label="Nome do serviço"
            value={cServiceType}
            onChange={(e) => setCServiceType(e.target.value)}
          />

          <Input
            label="Duração (ex.: 1 dia / 2 horas)"
            value={cDuration}
            onChange={(e) => setCDuration(e.target.value)}
          />

          <SmallInput
            placeholder="Pequeno (nº por dia)"
            value={cMax.Pequeno}
            onChange={(e) =>
              setCMax({ ...cMax, Pequeno: e.target.value === '' ? '' : Number(e.target.value) })
            }
            inputMode="numeric"
          />

          <SmallInput
            placeholder="Médio (nº por dia)"
            value={cMax.Médio}
            onChange={(e) =>
              setCMax({ ...cMax, Médio: e.target.value === '' ? '' : Number(e.target.value) })
            }
            inputMode="numeric"
          />

          <SmallInput
            placeholder="Grande (nº por dia)"
            value={cMax.Grande}
            onChange={(e) =>
              setCMax({ ...cMax, Grande: e.target.value === '' ? '' : Number(e.target.value) })
            }
            inputMode="numeric"
          />

          <CreateActions>
            <PrimaryButton onClick={onCreate}>Criar</PrimaryButton>
          </CreateActions>
        </CreateGrid>
      </Card>

      {/* Filtro */}
      <Card>
        <Row style={{ gridTemplateColumns: '2fr 1fr' }}>
          <Input label="Filtrar por nome/duração" value={filter} onChange={(e) => setFilter(e.target.value)} />
          <div style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-end' }}>
            <SecondaryButton onClick={() => setFilter('')}>Limpar filtro</SecondaryButton>
            <SecondaryButton onClick={fetchData}>Atualizar</SecondaryButton>
          </div>
        </Row>
      </Card>

      {/* Lista */}
      <Card>
        <div className="head" style={{ marginBottom: '.5rem' }}>Lista de Serviços</div>
        <Table>
          <div className="head">Serviço</div>
          <div className="head">Duração</div>
          <div className="head">Pequeno</div>
          <div className="head">Médio</div>
          <div className="head">Grande</div>
          <div className="head">Ações</div>

          {filtered.map((s) => {
            const isEditing = !!editMap[s.id!];
            const data = editMap[s.id!] ?? {
              serviceType: s.serviceType,
              duration: s.duration,
              max: {
                Pequeno: s.maxPerDay?.Pequeno ?? 0,
                Médio:   s.maxPerDay?.Médio ?? 0,
                Grande:  s.maxPerDay?.Grande ?? 0,
              }
            };

            return (
              <RowCard key={s.id}>
                <div>
                  {isEditing ? (
                    <SmallInput
                      value={data.serviceType}
                      onChange={(e) =>
                        setEditMap((prev) => ({ ...prev, [s.id!]: { ...data, serviceType: e.target.value } }))
                      }
                    />
                  ) : s.serviceType}
                </div>

                <div>
                  {isEditing ? (
                    <SmallInput
                      value={data.duration}
                      onChange={(e) =>
                        setEditMap((prev) => ({ ...prev, [s.id!]: { ...data, duration: e.target.value } }))
                      }
                    />
                  ) : s.duration}
                </div>

                <div>
                  {isEditing ? (
                    <SmallInput
                      inputMode="numeric"
                      value={data.max.Pequeno}
                      onChange={(e) =>
                        setEditMap((prev) => ({
                          ...prev,
                          [s.id!]: { ...data, max: { ...data.max, Pequeno: e.target.value === '' ? '' : Number(e.target.value) } }
                        }))
                      }
                    />
                  ) : (s.maxPerDay?.Pequeno ?? 0)}
                </div>

                <div>
                  {isEditing ? (
                    <SmallInput
                      inputMode="numeric"
                      value={data.max.Médio}
                      onChange={(e) =>
                        setEditMap((prev) => ({
                          ...prev,
                          [s.id!]: { ...data, max: { ...data.max, Médio: e.target.value === '' ? '' : Number(e.target.value) } }
                        }))
                      }
                    />
                  ) : (s.maxPerDay?.Médio ?? 0)}
                </div>

                <div>
                  {isEditing ? (
                    <SmallInput
                      inputMode="numeric"
                      value={data.max.Grande}
                      onChange={(e) =>
                        setEditMap((prev) => ({
                          ...prev,
                          [s.id!]: { ...data, max: { ...data.max, Grande: e.target.value === '' ? '' : Number(e.target.value) } }
                        }))
                      }
                    />
                  ) : (s.maxPerDay?.Grande ?? 0)}
                </div>

                <Actions>
                  {isEditing ? (
                    <>
                      <button onClick={() => onSave(s.id!)}>Salvar</button>
                      <button onClick={() => cancelEdit(s.id!)}>Cancelar</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(s)}>Editar</button>
                      <button onClick={() => setConfirmDelete({ id: s.id!, name: s.serviceType })}>Excluir</button>
                    </>
                  )}
                </Actions>
              </RowCard>
            );
          })}
        </Table>

        {filtered.length === 0 && <p style={{ opacity: .7 }}>Nenhum serviço encontrado.</p>}
      </Card>

      {confirmDelete && (
        <ConfirmDialog
          title="Excluir serviço"
          message={`Confirma excluir o serviço "${confirmDelete.name}"? Essa ação não pode ser desfeita.`}
          confirmText="Excluir"
          cancelText="Cancelar"
          onConfirm={() => onDelete(confirmDelete.id)}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </Container>
  );
};
