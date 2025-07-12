
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import Dashboard from '@/components/Dashboard';
import TransactionForm from '@/components/TransactionForm';
import CategoryManager from '@/components/CategoryManager';
import BudgetManager from '@/components/BudgetManager';
import SavingsGoals from '@/components/SavingsGoals';
import TransactionHistory from '@/components/TransactionHistory';
import Sidebar from '@/components/Sidebar';
import { 
  Home, 
  Plus, 
  Tag, 
  Target, 
  PiggyBank, 
  History 
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);

  // Cargar datos del localStorage al iniciar
  useEffect(() => {
    const savedTransactions = localStorage.getItem('moneyManager_transactions');
    const savedCategories = localStorage.getItem('moneyManager_categories');
    const savedBudgets = localStorage.getItem('moneyManager_budgets');
    const savedGoals = localStorage.getItem('moneyManager_savingsGoals');

    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    } else {
      // Categorías por defecto
      const defaultCategories = [
        { id: '1', name: 'Alimentación', color: '#10B981', type: 'expense' },
        { id: '2', name: 'Transporte', color: '#3B82F6', type: 'expense' },
        { id: '3', name: 'Entretenimiento', color: '#8B5CF6', type: 'expense' },
        { id: '4', name: 'Salario', color: '#059669', type: 'income' },
        { id: '5', name: 'Freelance', color: '#0891B2', type: 'income' }
      ];
      setCategories(defaultCategories);
      localStorage.setItem('moneyManager_categories', JSON.stringify(defaultCategories));
    }

    if (savedBudgets) {
      setBudgets(JSON.parse(savedBudgets));
    }

    if (savedGoals) {
      setSavingsGoals(JSON.parse(savedGoals));
    }
  }, []);

  // Guardar transacciones en localStorage
  useEffect(() => {
    localStorage.setItem('moneyManager_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Guardar categorías en localStorage
  useEffect(() => {
    localStorage.setItem('moneyManager_categories', JSON.stringify(categories));
  }, [categories]);

  // Guardar presupuestos en localStorage
  useEffect(() => {
    localStorage.setItem('moneyManager_budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Guardar metas de ahorro en localStorage
  useEffect(() => {
    localStorage.setItem('moneyManager_savingsGoals', JSON.stringify(savingsGoals));
  }, [savingsGoals]);

  const handleUpdateTransaction = (updatedTransaction) => {
    setTransactions(transactions.map(t => t.id === updatedTransaction.id ? updatedTransaction : t));
  };

  const menuItems = [
    { id: 'dashboard', label: 'Panel Principal', icon: Home },
    { id: 'add-transaction', label: 'Nueva Transacción', icon: Plus },
    { id: 'categories', label: 'Categorías', icon: Tag },
    { id: 'budgets', label: 'Presupuestos', icon: Target },
    { id: 'savings', label: 'Metas de Ahorro', icon: PiggyBank },
    { id: 'history', label: 'Historial', icon: History }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <Dashboard 
            transactions={transactions}
            categories={categories}
            budgets={budgets}
            savingsGoals={savingsGoals}
          />
        );
      case 'add-transaction':
        return (
          <TransactionForm 
            categories={categories}
            onAddTransaction={(transaction) => {
              setTransactions(prev => [transaction, ...prev]);
            }}
          />
        );
      case 'categories':
        return (
          <CategoryManager 
            categories={categories}
            onUpdateCategories={setCategories}
          />
        );
      case 'budgets':
        return (
          <BudgetManager 
            categories={categories}
            budgets={budgets}
            transactions={transactions}
            onUpdateBudgets={setBudgets}
          />
        );
      case 'savings':
        return (
          <SavingsGoals 
            savingsGoals={savingsGoals}
            onUpdateGoals={setSavingsGoals}
          />
        );
      case 'history':
        return (
          <TransactionHistory 
            transactions={transactions}
            categories={categories}
            onUpdateTransactions={setTransactions}
            onEditTransaction={handleUpdateTransaction}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      <Helmet>
        <title>MoneyManager - Gestión Personal de Finanzas</title>
        <meta name="description" content="Aplicación completa para gestionar tus finanzas personales con seguimiento de gastos, presupuestos y metas de ahorro" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <div className="flex">
          <Sidebar 
            menuItems={menuItems}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          
          <main className="flex-1 ml-64 p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
        
        <Toaster />
      </div>
    </>
  );
}

export default App;
