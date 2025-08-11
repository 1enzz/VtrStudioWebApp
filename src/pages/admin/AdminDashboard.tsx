// src/pages/admin/AdminDashboard.tsx
import { useState } from 'react';
import styled from 'styled-components';
import { AdminBookingList } from './AdminBookingList';
import { AdminVehicleManager } from './AdminVehicleManager';
import { useNavigate } from 'react-router-dom';
import AdminUserManager from './AdminUserManager';
import { AdminServiceManager } from './AdminServiceManager';

const Container = styled.div`
  padding: 2rem;
  font-family: 'Rajdhani', sans-serif;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
`;

const TabButton = styled.button<{ active?: boolean }>`
  background-color: ${({ active }) => (active ? '#e50914' : '#222')};
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  cursor: pointer;
  font-weight: bold;
  font-family: 'Rajdhani', sans-serif;

  &:hover { background-color: #e50914; }
`;

const LogoutButton = styled.button`
  background-color: #444;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-family: 'Rajdhani', sans-serif;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover { background-color: #e50914; }
`;

export const AdminDashboard = () => {
const [activeTab, setActiveTab] = useState<'bookings' | 'vehicles' | 'users' | 'services'>('bookings');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <Container>
      <Header>
      <Tabs>
        <TabButton active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')}>Agendamentos</TabButton>
        <TabButton active={activeTab === 'vehicles'} onClick={() => setActiveTab('vehicles')}>Veículos</TabButton>
        <TabButton active={activeTab === 'services'} onClick={() => setActiveTab('services')}>Serviços</TabButton> {/* +++ */}
        <TabButton active={activeTab === 'users'} onClick={() => setActiveTab('users')}>Usuários</TabButton>
      </Tabs>

        <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
      </Header>

      {activeTab === 'bookings' && <AdminBookingList />}
      {activeTab === 'vehicles' && <AdminVehicleManager />}
      {activeTab === 'services' && <AdminServiceManager />}  
      {activeTab === 'users' && <AdminUserManager />}
    </Container>
  );
};
