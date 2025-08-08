import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DopaminePage from './pages/DopaminePage';
import EnemPage from './pages/EnemPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DopaminePage />} />
        <Route path="/enem" element={<EnemPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
