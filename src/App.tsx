import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import Dashboard from '@/pages/Dashboard';
import Ledger from '@/pages/Ledger';
import Monitor from '@/pages/Monitor';
import Pipeline from '@/pages/Pipeline';
import Inspection from '@/pages/Inspection';
import Safety from '@/pages/Safety';
import Emergency from '@/pages/Emergency';
import Statistics from '@/pages/Statistics';

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/ledger" element={<Ledger />} />
          <Route path="/monitor" element={<Monitor />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/inspection" element={<Inspection />} />
          <Route path="/safety" element={<Safety />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
