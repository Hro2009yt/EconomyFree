import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Filter, Download } from 'lucide-react';
import TransactionList from '@/components/TransactionList';
import TransactionFilters from '@/components/TransactionFilters';
import TransactionSummary from '@/components/TransactionSummary';
import TransactionForm from '@/components/TransactionForm';
import { useTransactionFiltering } from '@/hooks/useTransactionFiltering';

export default function TransactionHistory({ transactions, categories, onUpdateTransactions, onEditTransaction }) {
  const [showFilters, setShowFilters] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const { toast } = useToast();

  const {
    filteredAndSortedTransactions,
    ...filterProps
  } = useTransactionFiltering(transactions, categories);

  const handleDeleteTransaction = (transactionId) => {
    const updatedTransactions = transactions.filter(t => t.id !== transactionId);
    onUpdateTransactions(updatedTransactions);
    toast({
      title: "Transacción eliminada",
      description: "La transacción ha sido eliminada exitosamente"
    });
  };

  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleDoneEditing = () => {
    setEditingTransaction(null);
  };

  const handleExportData = () => {
    toast({
      title: "🚧 Esta función no está implementada aún",
      description: "¡No te preocupes! Puedes solicitarla en tu próximo prompt! 🚀"
    });
  };

  if (editingTransaction) {
    return (
      <TransactionForm 
        categories={categories}
        transactionToEdit={editingTransaction}
        onUpdateTransaction={onEditTransaction}
        onDoneEditing={handleDoneEditing}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Historial de Transacciones</h1>
          <p className="text-muted-foreground">Busca y filtra todas tus transacciones</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            variant="outline"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button
            onClick={handleExportData}
            className="bg-gradient-to-r from-primary to-secondary"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <TransactionSummary transactions={filteredAndSortedTransactions} />

      <TransactionFilters
        showFilters={showFilters}
        categories={categories}
        {...filterProps}
      />

      <TransactionList
        transactions={filteredAndSortedTransactions}
        categories={categories}
        allTransactions={transactions}
        onEdit={handleEditClick}
        onDelete={handleDeleteTransaction}
      />
    </div>
  );
}