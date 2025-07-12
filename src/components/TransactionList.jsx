import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownRight, Edit2, Trash2, Search } from 'lucide-react';

const TransactionItem = ({ transaction, category, onEdit, onDelete, index }) => {
  const isIncome = transaction.type === 'income';
  return (
    <motion.div
      className="glass-card p-4 hover:bg-white/10 transition-colors"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-lg ${isIncome ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
            {isIncome ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{transaction.description}</h3>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <span>{new Date(transaction.date).toLocaleDateString('es-ES')}</span>
              {category && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: category.color }} />
                    <span>{category.name}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className={`text-lg font-bold ${isIncome ? 'text-emerald-400' : 'text-red-400'}`}>
              {isIncome ? '+' : '-'}${transaction.amount.toLocaleString()}
            </p>
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={() => onEdit(transaction)} className="text-muted-foreground hover:text-foreground">
              <Edit2 className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDelete(transaction.id)} className="text-muted-foreground hover:text-red-400">
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default function TransactionList({ transactions, categories, allTransactions, onEdit, onDelete }) {
  if (transactions.length === 0) {
    return (
      <motion.div
        className="glass-card p-12 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Search className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold text-foreground mb-2">No se encontraron transacciones</h3>
        <p className="text-muted-foreground">
          {allTransactions.length === 0 ? 'No hay transacciones registradas aún' : 'Intenta ajustar los filtros de búsqueda'}
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((transaction, index) => {
        const category = categories.find(c => c.id === transaction.categoryId);
        return (
          <TransactionItem
            key={transaction.id}
            transaction={transaction}
            category={category}
            onEdit={onEdit}
            onDelete={onDelete}
            index={index}
          />
        );
      })}
    </div>
  );
}