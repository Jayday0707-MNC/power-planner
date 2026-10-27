import { Routes, Route } from 'react-router-dom';
import TabBar from './components/TabBar';
import Today from './pages/Today';
import Backup from './pages/Backup';
import Costs from './pages/Costs';

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Today />} />
        <Route path="/backup" element={<Backup />} />
        <Route path="/costs" element={<Costs />} />
      </Routes>
      <TabBar />
    </div>
  );
}