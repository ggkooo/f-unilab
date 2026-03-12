import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GetTicket from './screens/GetTicket';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GetTicket />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
