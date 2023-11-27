import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Main from './components/Main/Main';
import UncontrolledForm from './components/UncontrolledForm/UncontrolledForm';
import HookForm from './components/HookForm/HookForm';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/uncontrolled-form" element={<UncontrolledForm />} />
        <Route path="/react-hook-form" element={<HookForm />} />
      </Routes>
    </Router>
  );
};

export default App;
