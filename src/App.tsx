import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GetTicket from './screens/GetTicket';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Attendant from './screens/Attendent';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GetTicket />} />
        <Route
          path="/attendent"
          element={(
            <ProtectedRoute>
              <Attendant />
            </ProtectedRoute>
          )}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
