import { useState } from 'react';

function Sidebar({ onStockSelect }) {
  const stocks = ['IBM', 'AAPL', 'JPM', 'BBDC4'];
  const [activeStock, setActiveStock] = useState(null);

  const handleClick = (symbol) => {
    setActiveStock(symbol);
    onStockSelect(symbol);
  };

  return (
    <aside className="[grid-area:sidebar] bg-bg-secondary p-6 border-r border-border-color overflow-y-auto">
      <h2 className="text-accent-secondary text-lg mb-4">Minhas Ações</h2>
      <ul>
        {stocks.map((symbol) => (
          <li key={symbol} className="mb-2">
            <button
              onClick={() => handleClick(symbol)}
              className={`w-full text-left p-2 rounded text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition ${
                activeStock === symbol ? 'bg-accent-primary text-bg-primary font-bold' : ''
              }`}
            >
              {symbol}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

export default Sidebar;