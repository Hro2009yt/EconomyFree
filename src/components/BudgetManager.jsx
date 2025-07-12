import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Target, AlertTriangle, CheckCircle, Edit2, Trash2 } from 'lucide-react';

export default function BudgetManager({ categories, budgets, transactions, onUpdateBudgets }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    period: 'monthly'
  });
  const { toast } = useToast();

  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  const budgetAnalysis = useMemo(() => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return budgets.map(budget => {
      const category = categories.find(c => c.id === budget.categoryId);
      const monthlyExpenses = transactions.filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && 
               t.categoryId === budget.categoryId &&
               date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear;
      });

      const spent = monthlyExpenses.reduce((sum, t) => sum + t.amount, 0);
      const percentage = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;
      
      let status = 'safe';
      if (percentage >= 100) status = 'exceeded';
      else if (percentage >= 80) status = 'warning';

      return {
        ...budget,
        category,
        spent,
        remaining: Math.max(0, budget.amount - spent),
        percentage: Math.min(percentage, 100),
        status
      };
    });
  }, [budgets, categories, transactions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.categoryId || !formData.amount) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    // Verificar si ya existe un presupuesto para esta categoría
    const existingBudget = budgets.find(b => b.categoryId === formData.categoryId && b.id !== editingId);
    if (existingBudget) {
      toast({
        title: "Error",
        description: "Ya existe un presupuesto para esta categoría",
        variant: "destructive"
      });
      return;
    }

    if (editingId) {
      // Editar presupuesto existente
      const updatedBudgets = budgets.map(budget =>
        budget.id === editingId ? { ...budget, ...formData, amount: parseFloat(formData.amount) } : budget
      );
      onUpdateBudgets(updatedBudgets);
      toast({
        title: "¡Presupuesto actualizado!",
        description: "El presupuesto ha sido actualizado exitosamente"
      });
      setEditingId(null);
    } else {
      // Agregar nuevo presupuesto
      const newBudget = {
        id: Date.now().toString(),
        ...formData,
        amount: parseFloat(formData.amount),
        createdAt: new Date().toISOString()
      };
      onUpdateBudgets([...budgets, newBudget]);
      toast({
        title: "¡Presupuesto creado!",
        description: "El presupuesto ha sido creado exitosamente"
      });
      setIsAdding(false);
    }

    setFormData({ categoryId: '', amount: '', period: 'monthly' });
  };

  const handleEdit = (budget) => {
    setFormData({
      categoryId: budget.categoryId,
      amount: budget.amount.toString(),
      period: budget.period
    });
    setEditingId(budget.id);
    setIsAdding(true);
  };

  const handleDelete = (budgetId) => {
    const updatedBudgets = budgets.filter(b => b.id !== budgetId);
    onUpdateBudgets(updatedBudgets);
    toast({
      title: "Presupuesto eliminado",
      description: "El presupuesto ha sido eliminado exitosamente"
    });
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ categoryId: '', amount: '', period: 'monthly' });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'exceeded': return 'text-red-400 bg-red-500/20';
      case 'warning': return 'text-yellow-400 bg-yellow-500/20';
      default: return 'text-emerald-400 bg-emerald-500/20';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'exceeded': return <AlertTriangle className="w-4 h-4" />;
      case 'warning': return <AlertTriangle className="w-4 h-4" />;
      default: return <CheckCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Gestión de Presupuestos</h1>
          <p className="text-muted-foreground">Controla tus gastos estableciendo límites por categoría</p>
        </div>
        {!isAdding && (
          <Button 
            onClick={() => setIsAdding(true)}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Presupuesto
          </Button>
        )}
      </div>

      {/* Formulario de agregar/editar */}
      {isAdding && (
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h2 className="text-xl font-bold text-foreground mb-4">
            {editingId ? 'Editar Presupuesto' : 'Nuevo Presupuesto'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-foreground">Categoría</Label>
                <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
                  <SelectTrigger className="bg-input border-border text-foreground">
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {expenseCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-foreground">Monto Límite</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Período</Label>
              <Select value={formData.period} onValueChange={(value) => setFormData(prev => ({ ...prev, period: value }))}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Mensual</SelectItem>
                  <SelectItem value="weekly">Semanal</SelectItem>
                  <SelectItem value="yearly">Anual</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                {editingId ? 'Actualizar' : 'Crear'} Presupuesto
              </Button>
              <Button type="button" variant="outline" onClick={cancelEdit}>
                Cancelar
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Lista de presupuestos */}
      <div className="space-y-4">
        {budgetAnalysis.map((budget, index) => (
          <motion.div
            key={budget.id}
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getStatusColor(budget.status)}`}>
                  {getStatusIcon(budget.status)}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    {budget.category && (
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: budget.category.color }}
                      />
                    )}
                    {budget.category?.name || 'Categoría eliminada'}
                  </h3>
                  <p className="text-sm text-muted-foreground capitalize">{budget.period}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEdit(budget)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(budget.id)}
                  className="text-muted-foreground hover:text-red-400"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Gastado</span>
                <span className="text-foreground font-semibold">
                  ${budget.spent.toLocaleString()} / ${budget.amount.toLocaleString()}
                </span>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-3">
                <motion.div
                  className={`h-3 rounded-full ${
                    budget.status === 'exceeded' ? 'bg-red-500' :
                    budget.status === 'warning' ? 'bg-yellow-500' : 'bg-emerald-500'
                  }`}
                  initial={{ width: 0 }}
                  animate={{ width: `${budget.percentage}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
              
              <div className="flex justify-between text-sm">
                <span className={`font-medium ${
                  budget.status === 'exceeded' ? 'text-red-400' :
                  budget.status === 'warning' ? 'text-yellow-400' : 'text-emerald-400'
                }`}>
                  {budget.percentage.toFixed(1)}% utilizado
                </span>
                <span className="text-muted-foreground">
                  Restante: ${budget.remaining.toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>
        ))}

        {budgetAnalysis.length === 0 && (
          <motion.div
            className="glass-card p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Target className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No hay presupuestos configurados</h3>
            <p className="text-muted-foreground mb-4">
              Crea tu primer presupuesto para comenzar a controlar tus gastos
            </p>
            <Button 
              onClick={() => setIsAdding(true)}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Presupuesto
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}