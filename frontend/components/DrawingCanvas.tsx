'use client';

import { useRef, useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function DrawingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [probabilities, setProbabilities] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
  const canvas = canvasRef.current;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // WHITE background (MNIST compatible)
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      // BLACK stroke for drawing
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 20;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }
}, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.beginPath();
      }
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown' && e.type !== 'touchstart') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let clientX: number, clientY: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
  const canvas = canvasRef.current;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // WHITE background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }
  setPrediction(null);
  setConfidence(null);
  setProbabilities({});
  setError(null);
};

  const predictDigit = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsLoading(true);
    setError(null);

    try {
      const imageData = canvas.toDataURL('image/png');

      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const data = await response.json();
      setPrediction(data.prediction);
      setConfidence(data.confidence);
      setProbabilities(data.probabilities);
    } catch (err) {
      setError('Failed to predict. Please ensure the backend is running.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const chartData = {
    labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
    datasets: [
      {
        label: 'Confidence',
        data: Object.keys(probabilities).length > 0 
          ? Object.keys(probabilities).sort().map(key => probabilities[key] * 100)
          : [],
        backgroundColor: 'rgba(102, 126, 234, 0.8)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Prediction Probabilities',
        color: '#fff',
        font: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: '#fff',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="glass-effect rounded-3xl p-8 max-w-4xl w-full">
        <h1 className="text-4xl font-bold text-white text-center mb-2">
          AI Handwritten Digit Recognition
        </h1>
        <p className="text-white/80 text-center mb-8">
          Draw a digit (0-9) and let AI recognize it
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Drawing Section */}
          <div className="flex flex-col items-center">
            <div className="bg-white/10 rounded-2xl p-6 mb-4">
              <canvas
                ref={canvasRef}
                width={280}
                height={280}
                onMouseDown={startDrawing}
                onMouseUp={stopDrawing}
                onMouseMove={draw}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchEnd={stopDrawing}
                onTouchMove={draw}
                className="border-4 border-white/30 rounded-xl cursor-crosshair touch-none"
              />
            </div>

            <div className="flex gap-4">
              <button
                onClick={clearCanvas}
                className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-8 rounded-xl transition-all transform hover:scale-105"
              >
                Clear
              </button>
              <button
                onClick={predictDigit}
                disabled={isLoading}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-xl transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Predicting...' : 'Predict'}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="flex flex-col">
            {prediction !== null && confidence !== null && (
              <div className="bg-white/10 rounded-2xl p-6 mb-4">
                <h2 className="text-2xl font-bold text-white mb-4">Prediction Result</h2>
                <div className="text-center">
                  <div className="text-8xl font-bold text-white mb-4">
                    {prediction}
                  </div>
                  <div className="text-xl text-white/90">
                    Confidence: <span className="font-bold">{(confidence * 100).toFixed(2)}%</span>
                  </div>
                </div>
              </div>
            )}

            {Object.keys(probabilities).length > 0 && (
              <div className="bg-white/10 rounded-2xl p-6" style={{ height: '300px' }}>
                <Bar data={chartData} options={chartOptions} />
              </div>
            )}

            {error && (
              <div className="bg-red-500/20 border border-red-500 rounded-xl p-4 text-white">
                {error}
              </div>
            )}

            {prediction === null && !error && (
              <div className="bg-white/10 rounded-2xl p-6 flex items-center justify-center h-full">
                <p className="text-white/70 text-center text-lg">
                  Draw a digit on the canvas and click Predict to see the AI's prediction
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
