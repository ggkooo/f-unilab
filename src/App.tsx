import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import GetTicket from './screens/GetTicket';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Attendant from './screens/Attendent';
import Login from './screens/Login';
import Admin from './screens/Admin';
import Tv from './screens/TV';


function App() {
  useEffect(() => {
    const keepUserInApp = () => {
      window.history.pushState({ appLocked: true }, '', window.location.href);
    };

    const isEditableElement = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) {
        return false;
      }

      if (target.isContentEditable) {
        return true;
      }

      const tagName = target.tagName;
      return tagName === 'INPUT' || tagName === 'TEXTAREA' || tagName === 'SELECT';
    };

    keepUserInApp();

    const handlePopState = () => {
      keepUserInApp();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      const isAltLeft = event.altKey && event.key === 'ArrowLeft';
      const isBackspaceOutsideField = event.key === 'Backspace' && !isEditableElement(event.target);

      if (isAltLeft || isBackspaceOutsideField) {
        event.preventDefault();
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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
