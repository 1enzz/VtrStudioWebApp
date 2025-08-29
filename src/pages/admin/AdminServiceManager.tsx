import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Alert } from '../../components/Alert';
import { Loader } from '../../components/Loader';
import { Button as BaseButton } from '../../components/Button';
import { Input as BaseInput } from '../../components/Input';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { ServiceRulesService, type ServiceRule } from '../../services/ServiceRules';

const CATEGORIES = ['Pequeno', 'Médio', 'Grande', 'Pick Up Pequena', 'Pick Up Grande'] as const;
type Category = typeof CATEGORIES[number];
type MaxEditor = Record<Category, number | ''>;

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
  min-width: 0;
`;

const SmallInput = styled.input`
  width: 100%;
  min-width: 0;
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

const TableGrid = styled.div<{ cols: number }>`
  display: grid;
  grid-template-columns: 2fr repeat(${(p) => p.cols}, 1.2fr) 1.2fr 1fr;
  gap: .5rem;
  align-items: center;

  > div { padding: .6rem .75rem; background-color: #111; border-radius: 8px; }
  .head { background: transparent; font-weight: 700; color: ${(p) => p.theme.colors.primary}; }

  @media (max-width: 760px) {
    display: block;
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

const CreateGrid = styled.div`
  display: grid;
  gap: .75rem;
  align-items: end;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
`;

const CreateActions = styled.div`
  grid-column: 1 / -1;
  display: flex;
  justify-content: flex-end;
  align-items: end;

  @media (max-width: 540px) {
    width: 100%;
    & > button { width: 100%; }
  }
`;

const emptyMax = (): MaxEditor =>
  CATEGORIES.reduce((acc, k) => ({ ...acc, [k]: '' as const }), {} as MaxEditor);

const normalizeMax = (max?: Record<string, number | null | undefined>): Record<string, number> => {
  const base: Record<string, number> = {};
  CATEGORIES.forEach((k) => { base[k] = Number(max?.[k] ?? 0); });
  if (max) {
    for (const [k, v] of Object.entries(max)) {
      if (!(k in base)) base[k] = Number(v ?? 0);
    }
  }
  return base;
};

export const AdminServiceManager = () => {
  const [items, setItems] = useState<ServiceRule[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [cServiceType, setCServiceType] = useState('');
  const [cDuration, setCDuration] = useState('');
  const [cMax, setCMax] = useState<MaxEditor>(emptyMax());

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
      maxPerDay: normalizeMax(Object.fromEntries(
        CATEGORIES.map((k) => [k, cMax[k] === '' ? 0 : Number(cMax[k])])
      )),
    };
    try {
      setLoading(true);
      const created = await ServiceRulesService.create(payload);
      setOk(`Serviço "${created.serviceType}" criado.`);
      setCServiceType(''); setCDuration('');
      setCMax(emptyMax());
      fetchData();
    } catch (e: any) {
      setError(e?.response?.data?.error ?? 'Erro ao criar serviço.');
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (s: ServiceRule) => {
    const maxNorm = normalizeMax(s.maxPerDay);
    const max: MaxEditor = CATEGORIES.reduce((acc, k) => {
      acc[k] = maxNorm[k] ?? 0;
      return acc;
    }, {} as MaxEditor);

    setEditMap(prev => ({
      ...prev,
      [s.id!]: {
        serviceType: s.serviceType,
        duration: s.duration,
        max
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
      maxPerDay: normalizeMax(Object.fromEntries(
        CATEGORIES.map((k) => [k, edited.max[k] === '' ? 0 : Number(edited.max[k])])
      ))
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

          {CATEGORIES.map((cat) => (
            <SmallInput
              key={cat}
              placeholder={`${cat} (nº por dia)`}
              value={cMax[cat]}
              onChange={(e) =>
                setCMax({ ...cMax, [cat]: e.target.value === '' ? '' : Number(e.target.value) })
              }
              inputMode="numeric"
            />
          ))}

          <CreateActions>
            <PrimaryButton onClick={onCreate}>Criar</PrimaryButton>
          </CreateActions>
        </CreateGrid>
      </Card>

      <Card>
        <Row style={{ gridTemplateColumns: '2fr 1fr' }}>
          <Input label="Filtrar por nome/duração" value={filter} onChange={(e) => setFilter(e.target.value)} />
          <div style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-end' }}>
            <SecondaryButton onClick={() => setFilter('')}>Limpar filtro</SecondaryButton>
            <SecondaryButton onClick={fetchData}>Atualizar</SecondaryButton>
          </div>
        </Row>
      </Card>

      <Card>
        <div className="head" style={{ marginBottom: '.5rem' }}>Lista de Serviços</div>

        <TableGrid cols={CATEGORIES.length}>
          <div className="head">Serviço</div>
          {CATEGORIES.map((c) => (
            <div className="head" key={`head-${c}`}>{c}</div>
          ))}
          <div className="head">Duração</div>
          <div className="head">Ações</div>

          {filtered.map((s) => {
            const isEditing = !!editMap[s.id!];
            const maxNorm = normalizeMax(s.maxPerDay);

            const data = editMap[s.id!] ?? {
              serviceType: s.serviceType,
              duration: s.duration,
              max: CATEGORIES.reduce((acc, k) => {
                acc[k] = maxNorm[k] ?? 0;
                return acc;
              }, {} as MaxEditor)
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

                {CATEGORIES.map((cat) => (
                  <div key={`${s.id}-${cat}`}>
                    {isEditing ? (
                      <SmallInput
                        inputMode="numeric"
                        value={data.max[cat]}
                        onChange={(e) =>
                          setEditMap((prev) => ({
                            ...prev,
                            [s.id!]: {
                              ...data,
                              max: { ...data.max, [cat]: e.target.value === '' ? '' : Number(e.target.value) }
                            }
                          }))
                        }
                      />
                    ) : (maxNorm[cat] ?? 0)}
                  </div>
                ))}

                {/* Duração */}
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

                {/* Ações */}
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
        </TableGrid>

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
