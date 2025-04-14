import { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

function MainContent({ selectedStock }) {
  const [stockData, setStockData] = useState(null);
  const [chart, setChart] = useState(null);
  const [error, setError] = useState(null);

  const fetchStockData = async (symbol) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) throw new Error('No authentication token found');

      console.log('Buscando histórico:', symbol);
      const historyResponse = await fetch(`/api/stocks/stocks/${symbol}/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Resposta histórico:', historyResponse.status, historyResponse.statusText);
      if (!historyResponse.ok) {
        const data = await historyResponse.text();
        throw new Error(data || `Failed to fetch stock history: ${historyResponse.statusText}`);
      }

      const historyData = await historyResponse.json();
      if (!historyData.history) throw new Error('No history data available');

      console.log('Buscando preço em tempo real:', symbol);
      const realTimeResponse = await fetch(`/api/stocks/stocks/${symbol}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Resposta preço:', realTimeResponse.status, realTimeResponse.statusText);
      if (!realTimeResponse.ok) {
        const data = await realTimeResponse.text();
        throw new Error(data || `Failed to fetch real-time stock data: ${realTimeResponse.statusText}`);
      }

      const realTimeData = await realTimeResponse.json();

      const labels = historyData.history.map((item) => {
        const date = new Date(item.date);
        return date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' });
      });

      const prices = historyData.history.map((item) => parseFloat(item.price).toFixed(2));
      const latestPrice = parseFloat(realTimeData.price).toFixed(2);
      const changePercent = ((latestPrice - prices[0]) / prices[0] * 100).toFixed(2);

      return {
        symbol,
        companyName: `Empresa ${symbol}`,
        latestPrice,
        changePercent,
        chartData: { labels, prices },
      };
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      setError(err.message);
      return null;
    }
  };

  useEffect(() => {
    if (selectedStock) {
      setError(null);
      fetchStockData(selectedStock).then((data) => {
        if (data) {
          setStockData(data);
          updateChart(data);
        }
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
          tooltip: {
            backgroundColor: '#2d3748',
            titleColor: '#e2e8f0',
            bodyColor: '#a0aec0',
            borderColor: '#4a5568',
            borderWidth: 1,
          },
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
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="bg-bg-secondary p-4 rounded-lg mb-6 min-h-[300px]">
        <canvas id="stockChart"></canvas>
      </div>
      <div className="bg-bg-secondary p-6 rounded-lg">
        <h3 className="text-accent-secondary mb-4">Detalhes</h3>
        <p className="text-text-secondary">
          {stockData
            ? `Preço Atual: R$ ${stockData.latestPrice} (${stockData.changePercent > 0 ? '+' : ''}${
                stockData.changePercent
              }%)`
            : 'Clique em uma ação na lista à esquerda para ver os detalhes.'}
        </p>
      </div>
    </main>
  );
}

export default MainContent;