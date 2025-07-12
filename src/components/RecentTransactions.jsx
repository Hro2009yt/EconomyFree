
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight, Calendar } from 'lucide-react';

export default function RecentTransactions({ transactions, categories }) {
  const recentTransactions = transactions.slice(0, 5);

  if (recentTransactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-400">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
            📝
          </div>
          <p>No hay transacciones recientes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {recentTransactions.map((transaction, index) => {
        const category = categories.find(c => c.id === transaction.categoryId);
        const isIncome = transaction.type === 'income';
        
        return (
          <motion.div
            key={transaction.id}
            className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${
                isIncome ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
              }`}>
                {isIncome ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
              </div>
              <div>
                <p className="font-medium text-white">{transaction.description}</p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(transaction.date).toLocaleDateString('es-ES')}</span>
                  {category && (
                    <>
                      <span>•</span>
                      <span style={{ color: category.color }}>{category.name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className={`font-semibold ${
                isIncome ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {isIncome ? '+' : '-'}${transaction.amount.toLocaleString()}
              </p>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
