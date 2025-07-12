import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export default function TransactionSummary({ transactions }) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <motion.div
        className="glass-card p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Transacciones</p>
            <p className="text-xl font-bold text-foreground">{transactions.length}</p>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="glass-card p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
            <ArrowUpRight className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Ingresos</p>
            <p className="text-xl font-bold text-emerald-400">${totalIncome.toLocaleString()}</p>
          </div>
        </div>
      </motion.div>
      <motion.div
        className="glass-card p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-red-500/20 text-red-400">
            <ArrowDownRight className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Gastos</p>
            <p className="text-xl font-bold text-red-400">${totalExpenses.toLocaleString()}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}