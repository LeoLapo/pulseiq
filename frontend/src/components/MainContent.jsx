import { useState, useEffect } from 'react';
import Chart from 'chart.js/auto';

function MainContent({ selectedStock }) {
  const [stockData, setStockData] = useState(null);
  const [chart, setChart] = useState(null);

  const getMockStockData = (symbol) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const labels = [];
        const prices = [];
        let price = Math.random() * 100 + 50;
        const now = new Date();

        for (let i = 10; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(now.getDate() - i);
          labels.push(date.toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }));
          price += (Math.random() - 0.45) * 5;
          price = Math.max(10, price);
          prices.push(price.toFixed(2));
        }

        resolve({
          symbol,
          companyName: `Empresa ${symbol} S.A.`,
          latestPrice: prices[prices.length - 1],
          changePercent: ((prices[prices.length - 1] - prices[0]) / prices[0] * 100).toFixed(2),
          chartData: { labels, prices },
        });
      }, 500);
    });
  };

  useEffect(() => {
    if (selectedStock) {
      getMockStockData(selectedStock).then((data) => {
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