import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Builder from './pages/Builder';
import ThemeSelector from './pages/ThemeSelector';
import Settings from './pages/Settings';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="themes" element={<ThemeSelector />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="/builder/:siteId" element={<Builder />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
