
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export default function ExpenseChart({ transactions, categories }) {
  const chartData = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = transactions.filter(t => {
      const date = new Date(t.date);
      return t.type === 'expense' && 
             date.getMonth() === currentMonth && 
             date.getFullYear() === currentYear;
    });

    const categoryTotals = {};
    monthlyExpenses.forEach(transaction => {
      const category = categories.find(c => c.id === transaction.categoryId);
      if (category) {
        categoryTotals[category.id] = (categoryTotals[category.id] || 0) + transaction.amount;
      }
    });

    const total = Object.values(categoryTotals).reduce((sum, amount) => sum + amount, 0);
    
    return Object.entries(categoryTotals).map(([categoryId, amount]) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        id: categoryId,
        name: category?.name || 'Sin categoría',
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0,
        color: category?.color || '#6B7280'
      };
    }).sort((a, b) => b.amount - a.amount);
  }, [transactions, categories]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
            📊
          </div>
          <p>No hay gastos este mes</p>
        </div>
      </div>
    );
  }

  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercentage = 0;

  return (
    <div className="space-y-4">
      {/* Gráfico de dona */}
      <div className="flex justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
            {chartData.map((item, index) => {
              const strokeDasharray = `${(item.percentage / 100) * circumference} ${circumference}`;
              const strokeDashoffset = -cumulativePercentage * circumference / 100;
              cumulativePercentage += item.percentage;

              return (
                <motion.circle
                  key={item.id}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="transparent"
                  stroke={item.color}
                  strokeWidth="20"
                  strokeDasharray={strokeDasharray}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-300 hover:stroke-width-[25]"
                  initial={{ strokeDasharray: `0 ${circumference}` }}
                  animate={{ strokeDasharray }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">
                ${chartData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Leyenda */}
      <div className="space-y-2 max-h-32 overflow-y-auto scrollbar-hide">
        {chartData.map((item, index) => (
          <motion.div
            key={item.id}
            className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-white">{item.name}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-white">
                ${item.amount.toLocaleString()}
              </p>
              <p className="text-xs text-gray-400">
                {item.percentage.toFixed(1)}%
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
