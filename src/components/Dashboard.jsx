import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Target,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign
} from 'lucide-react';
import ExpenseChart from '@/components/ExpenseChart';
import RecentTransactions from '@/components/RecentTransactions';

export default function Dashboard({ transactions, categories, budgets, savingsGoals }) {
  const stats = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const totalIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpenses;

    const totalSavingsGoal = savingsGoals.reduce((sum, goal) => sum + goal.targetAmount, 0);
    const totalSaved = savingsGoals.reduce((sum, goal) => sum + goal.currentAmount, 0);

    return {
      totalIncome,
      totalExpenses,
      balance,
      totalSavingsGoal,
      totalSaved,
      transactionCount: monthlyTransactions.length
    };
  }, [transactions, savingsGoals]);

  const StatCard = ({ title, value, icon: Icon, gradient, trend, trendValue }) => (
    <motion.div
      className="glass-card p-6 relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`absolute inset-0 opacity-10 ${gradient}`} />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${gradient}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className={`flex items-center gap-1 text-sm ${
              trend === 'up' ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        <h3 className="text-muted-foreground text-sm font-medium mb-1">{title}</h3>
        <p className="text-2xl font-bold text-foreground">
          ${value.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
        </p>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Panel Principal</h1>
          <p className="text-muted-foreground">Resumen de tus finanzas este mes</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Balance Total</p>
          <p className={`text-2xl font-bold ${
            stats.balance >= 0 ? 'text-emerald-400' : 'text-red-400'
          }`}>
            ${stats.balance.toLocaleString('es-ES', { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ingresos del Mes"
          value={stats.totalIncome}
          icon={TrendingUp}
          gradient="income-gradient"
          trend="up"
          trendValue="+12%"
        />
        <StatCard
          title="Gastos del Mes"
          value={stats.totalExpenses}
          icon={TrendingDown}
          gradient="expense-gradient"
          trend="down"
          trendValue="-5%"
        />
        <StatCard
          title="Total Ahorrado"
          value={stats.totalSaved}
          icon={PiggyBank}
          gradient="savings-gradient"
          trend="up"
          trendValue="+8%"
        />
        <StatCard
          title="Meta de Ahorro"
          value={stats.totalSavingsGoal}
          icon={Target}
          gradient="bg-gradient-to-r from-secondary to-purple-500"
        />
      </div>

      {/* Gráficos y transacciones recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-foreground mb-4">Distribución de Gastos</h2>
          <ExpenseChart transactions={transactions} categories={categories} />
        </motion.div>

        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h2 className="text-xl font-bold text-foreground mb-4">Transacciones Recientes</h2>
          <RecentTransactions transactions={transactions} categories={categories} />
        </motion.div>
      </div>

      {/* Progreso de metas de ahorro */}
      {savingsGoals.length > 0 && (
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-xl font-bold text-foreground mb-4">Progreso de Metas de Ahorro</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savingsGoals.slice(0, 3).map((goal) => {
              const progress = (goal.targetAmount > 0) ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
              return (
                <div key={goal.id} className="bg-white/5 rounded-lg p-4">
                  <h3 className="font-semibold text-foreground mb-2">{goal.name}</h3>
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>${goal.currentAmount.toLocaleString()}</span>
                    <span>${goal.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <motion.div
                      className="savings-gradient h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{progress.toFixed(1)}% completado</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}