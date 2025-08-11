import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { apiAdmin } from '../../api/axios';
import { Loader } from '../../components/Loader';
import { Alert } from '../../components/Alert';

interface VehicleCategory {
  category: string;
  description: string;
  vehicles: string[];
}

const Container = styled.div`
  padding: 2rem;
  font-family: 'Rajdhani', sans-serif;
  max-width: 900px;
  margin: 0 auto;
`;

const Title = styled.h2`
  color: ${(props) => props.theme.colors.primary};
  margin-bottom: 2rem;
  text-align: center;
`;

const CategoryBox = styled.div`
  background-color: #1a1a1a;
  padding: 2rem;
  border-radius: 16px;
  margin-bottom: 2.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
`;

const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: 1rem;

  h3 {
    color: ${(props) => props.theme.colors.primary};
    font-size: 1.5rem;
  }

  p {
    color: ${(props) => props.theme.colors.text};
    opacity: 0.7;
    font-size: 0.95rem;
  }
`;

const VehicleList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  margin-bottom: 1rem;
`;

const VehicleItem = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  background-color: #111;
  padding: 0.6rem 1rem;
  border-radius: 8px;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: 6px;
  background-color: #222;
  color: ${(props) => props.theme.colors.white};
  font-family: 'Rajdhani', sans-serif;

  &::placeholder {
    color: #888;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const Button = styled.button<{ color?: string }>`
  background-color: ${({ color }) => color || '#333'};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 1rem;
  cursor: pointer;
  font-family: 'Rajdhani', sans-serif;
  font-weight: bold;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e50914;
  }
`;

const AddContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

export const AdminVehicleManager = () => {
  const [categories, setCategories] = useState<VehicleCategory[]>([]);
  const [newVehicle, setNewVehicle] = useState<{ [category: string]: string }>({});
  const [editVehicle, setEditVehicle] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiAdmin.get('/vehicle-categories');
      setCategories(response.data);
    } catch {
      setError('Erro ao carregar categorias');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (category: string) => {
    const name = newVehicle[category];
    if (!name) return;
    try {
      await apiAdmin.post(`/vehicle-categories/${category}/add`, JSON.stringify(name), {
        headers: { 'Content-Type': 'application/json' },
      });
      setNewVehicle({ ...newVehicle, [category]: '' });
      fetchCategories();
    } catch {
      setError('Erro ao adicionar veículo');
    }
  };

  const handleRemove = async (category: string, vehicle: string) => {
    try {
      await apiAdmin.delete(`/vehicle-categories/${category}/remove`, {
        data: vehicle,
        headers: { 'Content-Type': 'application/json' },
      });
      fetchCategories();
    } catch {
      setError('Erro ao remover veículo');
    }
  };

  const handleEdit = async (category: string, oldName: string) => {
    const newName = editVehicle[`${category}-${oldName}`];
    if (!newName || newName === oldName) return;
    try {
      await apiAdmin.put(`/admin/vehicle-categories/${category}/edit`, {
        oldName,
        newName,
      });
      setEditVehicle({ ...editVehicle, [`${category}-${oldName}`]: '' });
      fetchCategories();
    } catch {
      setError('Erro ao editar veículo');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <Container>
      <Title>Gerenciar Veículos por Categoria</Title>
      {error && <Alert type="error" message={error} />}
      {loading ? (
        <Loader />
      ) : (
        categories.map((cat) => (
          <CategoryBox key={cat.category}>
            <CategoryHeader>
              <h3>{cat.category}</h3>
              <p>{cat.description}</p>
            </CategoryHeader>

            <VehicleList>
              {cat.vehicles.map((vehicle) => (
                <VehicleItem key={vehicle}>
                  <Input
                    value={editVehicle[`${cat.category}-${vehicle}`] ?? vehicle}
                    onChange={(e) =>
                      setEditVehicle({
                        ...editVehicle,
                        [`${cat.category}-${vehicle}`]: e.target.value,
                      })
                    }
                  />
                  <Actions>
                    <Button color="#0f0" onClick={() => handleEdit(cat.category, vehicle)}>
                      Salvar
                    </Button>
                    <Button color="#c00" onClick={() => handleRemove(cat.category, vehicle)}>
                      Remover
                    </Button>
                  </Actions>
                </VehicleItem>
              ))}
            </VehicleList>

            <AddContainer>
              <Input
                placeholder="Novo veículo"
                value={newVehicle[cat.category] || ''}
                
                onChange={(e) =>
                  setNewVehicle({ ...newVehicle, [cat.category]: e.target.value })
                }
              />
              <Button color="#e50914" onClick={() => handleAdd(cat.category)}>
                Adicionar
              </Button>
            </AddContainer>
          </CategoryBox>
        ))
      )}
    </Container>
  );
};
