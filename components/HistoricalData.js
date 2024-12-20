import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, CartesianGrid, Bar } from 'recharts';

const HistoricalData = ({ symbol, timeRange, setTimeRange, timeRangeOptions }) => {
  const [historicalData, setHistoricalData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (symbol) {
      const fetchHistoricalData = async () => {
        try {
          const intervalMap = { '5y': '1d', '1y': '1d', '1m': '1h', '1d': '15m' };
          const limitMap = { '5y': 2000, '1y': 365, '1m': 744, '1d': 96 };

          const interval = intervalMap[timeRange] || '1d';
          const limit = limitMap[timeRange] || 96;

          const res = await fetch(
            `https://api.binance.com/api/v1/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`
          );
          const data = await res.json();
//
          if (res.ok) {
            const formattedData = data.map((d) => ({
              time: new Date(d[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              open: parseFloat(d[1]),
              high: parseFloat(d[2]),
              low: parseFloat(d[3]),
              close: parseFloat(d[4]),
            }));
            setHistoricalData(formattedData);
          } else {
            setError('Error fetching historical data');
          }
        } catch (err) {
          setError('Error fetching historical data');
        }
      };
      fetchHistoricalData();
    }
  }, [symbol, timeRange]);

  return (
    <>
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart data={historicalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={['auto', 'auto']} />
          <Tooltip />
          <Bar dataKey="close" fill="#8884d8" />
        </ComposedChart>
      </ResponsiveContainer>
      <div className="flex justify-center mt-4">
        {timeRangeOptions.map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`mx-2 px-4 py-2 text-sm font-medium ${
              timeRange === range ? 'text-white bg-blue-600' : 'text-blue-600 bg-white'
            } rounded-lg shadow-lg`}
          >
            {range}
          </button>
        ))}
      </div>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </>
  );
};

export default HistoricalData;
