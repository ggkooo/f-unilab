import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import GetTicket from './screens/GetTicket';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Attendant from './screens/Attendent';
import Login from './screens/Login';
import Admin from './screens/Admin';
import Tv from './screens/TV';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GetTicket />} />
        <Route path="/tv" element={<Tv />} />
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
          path="/admin"
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
