import { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

function MainContent({ selectedStock }) {
  const [stockData, setStockData] = useState(null);
  const [chart, setChart] = useState(null);
  const brToUsStockMap = {
    PETR4: 'XOM',    // Exxon Mobil ~ Petrobras
    VALE3: 'RIO',    // Rio Tinto ~ Vale
    ITUB4: 'JPM',    // JPMorgan ~ Itaú
    BBDC4: 'IBM',
  };
  

  const fetchStockData = async (symbol) => {
    const response = await fetch(`http://localhost:3000/stocks/${symbol}/history`);
    const data = await response.json();
  
    if (!data.history) throw new Error("Erro ao carregar dados");
  
    const labels = data.history.map(item => {
      const date = new Date(item.date);
      return date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
    });
  
    const prices = data.history.map(item => parseFloat(item.price).toFixed(2));
    const latestPrice = prices[prices.length - 1];
    const changePercent = ((latestPrice - prices[0]) / prices[0] * 100).toFixed(2);
  
    return {
      symbol,
      companyName: `Empresa ${symbol}`, // ou pode mapear nomes reais depois
      latestPrice,
      changePercent,
      chartData: { labels, prices },
    };
  };
  

  useEffect(() => {
    if (selectedStock) {
      const usSymbol = brToUsStockMap[selectedStock] || selectedStock;

      fetch(`http://localhost:5000/api/stock/${usSymbol}`)
        .then((res) => res.json())
        .then((data) => {
          setStockData(data);
          updateChart(data);
        });
    }
  }, [selectedStock]);

  const updateChart = (data) => {
    const ctx = document.getElementById('stockChart').getContext('2d');

    if (chart) {
      chart.destroy();
    }

    const newChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: data.chartData.labels,
        datasets: [
          {
            label: `${data.symbol} Price`,
            data: data.chartData.prices,
            borderColor: '#4fd1c5',
            backgroundColor: 'rgba(79, 209, 197, 0.1)',
            borderWidth: 2,
            pointRadius: 0,
            pointHoverRadius: 5,
            fill: true,
            tension: 0.1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: false, ticks: { color: '#a0aec0' }, grid: { color: '#4a5568' } },
          x: { ticks: { color: '#a0aec0' }, grid: { color: '#4a5568' } },
        },
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor: '#2d3748', titleColor: '#e2e8f0', bodyColor: '#a0aec0', borderColor: '#4a5568', borderWidth: 1 },
        },
      },
    });

    setChart(newChart);
  };

  return (
    <main className="[grid-area:main] p-6 overflow-y-auto">
      <h2 className="text-2xl font-medium mb-6">
        {stockData ? `${stockData.symbol} - ${stockData.companyName}` : 'Selecione uma Ação'}
      </h2>
      <div className="bg-bg-secondary p-4 rounded-lg mb-6 min-h-[300px]">
        <canvas id="stockChart"></canvas>
      </div>
      <div className="bg-bg-secondary p-6 rounded-lg">
        <h3 className="text-accent-secondary mb-4">Detalhes</h3>
        <p className="text-text-secondary">
          {stockData
            ? `Preço Atual: R$ ${stockData.latestPrice} (${stockData.changePercent > 0 ? '+' : ''}${stockData.changePercent}%)`
            : 'Clique em uma ação na lista à esquerda para ver os detalhes.'}
        </p>
      </div>
    </main>
  );
}

export default MainContent;