import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Footer from './components/Footer';
import Login from './components/Login';

function App() {
  const [selectedStock, setSelectedStock] = useState(null);
  const isAuthenticated = !!localStorage.getItem('authToken');

  const Dashboard = () => (
    <div className="grid min-h-screen grid-cols-[240px_1fr] grid-rows-[auto_1fr_auto] [grid-template-areas:'header_header''sidebar_main''footer_footer']">
      <Header />
      <Sidebar onStockSelect={setSelectedStock} />
      <MainContent selectedStock={selectedStock} />
      <Footer />
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
        />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;