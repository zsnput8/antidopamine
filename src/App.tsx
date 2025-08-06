import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DopaminePage from './pages/DopaminePage';
import EnemPage from './pages/EnemPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<DopaminePage />} />
      <Route path="/enem" element={<EnemPage />} />
    </Routes>
  );
}

export default App;