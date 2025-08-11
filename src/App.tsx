import styled from 'styled-components';
import BookingSteps from './pages/BookingSteps';
import { GlobalStyle } from './styles/GlobalStyles';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AdminLogin } from './pages/admin/Login';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminRouteGuard } from './pages/admin/AdminRouteGuard'; // ✅ adicionado

const AppWrapper = styled.div`
  background-color: ${(props) => props.theme.colors.background};
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Rajdhani', sans-serif;
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<BookingSteps />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <AdminRouteGuard>
              <AdminDashboard />
            </AdminRouteGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
}

export default App;
