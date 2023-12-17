import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegistrationForm from './components/security/RegistrationForm';
import LoginForm from './components/security/LoginForm';
import ClientHomepage from './components/homepages/ClientHomepage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/clientHomepage" element={<ClientHomepage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
