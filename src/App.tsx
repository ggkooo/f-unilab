import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GetTicket from './screens/GetTicket';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Attendant from './screens/Attendent';
import Login from './screens/Login';
import Admin from './screens/Admin';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GetTicket />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/attendent"
          element={(
            <ProtectedRoute>
              <Attendant />
            </ProtectedRoute>
          )}
        />
        <Route
          path="/administration"
          element={(
            <ProtectedRoute requireAdmin>
              <Admin />
            </ProtectedRoute>
          )}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
