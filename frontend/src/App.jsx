import { useState } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import MainContent from './components/MainContent';
import Footer from './components/Footer';

function App() {
  const [selectedStock, setSelectedStock] = useState(null);

  return (
    <div className="grid min-h-screen grid-cols-[240px_1fr] grid-rows-[auto_1fr_auto] [grid-template-areas:'header_header''sidebar_main''footer_footer']">
      <Header />
      <Sidebar onStockSelect={setSelectedStock} />
      <MainContent selectedStock={selectedStock} />
      <Footer />
    </div>
  );
}

export default App;