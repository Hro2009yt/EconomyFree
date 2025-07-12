import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Minus, PiggyBank, Target, Calendar, Edit2, Trash2, DollarSign } from 'lucide-react';

export default function SavingsGoals({ savingsGoals, onUpdateGoals }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: ''
  });
  const [modifyingAmount, setModifyingAmount] = useState('');
  const [modifyingGoalId, setModifyingGoalId] = useState(null);
  const [modificationType, setModificationType] = useState('add'); // 'add' or 'subtract'
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.targetAmount) {
      toast({
        title: "Error",
        description: "Por favor completa los campos requeridos",
        variant: "destructive"
      });
      return;
    }

    if (editingId) {
      // Editar meta existente
      const updatedGoals = savingsGoals.map(goal =>
        goal.id === editingId ? { 
          ...goal, 
          ...formData, 
          targetAmount: parseFloat(formData.targetAmount),
          currentAmount: parseFloat(formData.currentAmount) || 0
        } : goal
      );
      onUpdateGoals(updatedGoals);
      toast({
        title: "¡Meta actualizada!",
        description: `La meta "${formData.name}" ha sido actualizada`
      });
      setEditingId(null);
    } else {
      // Agregar nueva meta
      const newGoal = {
        id: Date.now().toString(),
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
        currentAmount: parseFloat(formData.currentAmount) || 0,
        createdAt: new Date().toISOString()
      };
      onUpdateGoals([...savingsGoals, newGoal]);
      toast({
        title: "¡Meta creada!",
        description: `La meta "${formData.name}" ha sido creada exitosamente`
      });
      setIsAdding(false);
    }

    setFormData({ name: '', targetAmount: '', currentAmount: '', targetDate: '' });
  };

  const handleEdit = (goal) => {
    setFormData({
      name: goal.name,
      targetAmount: goal.targetAmount.toString(),
      currentAmount: goal.currentAmount.toString(),
      targetDate: goal.targetDate || ''
    });
    setEditingId(goal.id);
    setIsAdding(true);
  };

  const handleDelete = (goalId) => {
    const updatedGoals = savingsGoals.filter(goal => goal.id !== goalId);
    onUpdateGoals(updatedGoals);
    toast({
      title: "Meta eliminada",
      description: "La meta de ahorro ha sido eliminada exitosamente"
    });
  };

  const handleModifyAmount = (goalId) => {
    const amount = parseFloat(modifyingAmount);
    if (!amount || amount <= 0) {
      toast({
        title: "Error",
        description: "Por favor ingresa un monto válido",
        variant: "destructive"
      });
      return;
    }

    const updatedGoals = savingsGoals.map(goal => {
      if (goal.id === goalId) {
        let newCurrentAmount;
        if (modificationType === 'add') {
          newCurrentAmount = goal.currentAmount + amount;
        } else {
          newCurrentAmount = Math.max(0, goal.currentAmount - amount);
        }
        return { ...goal, currentAmount: newCurrentAmount };
      }
      return goal;
    });
    
    onUpdateGoals(updatedGoals);
    toast({
      title: `¡Monto ${modificationType === 'add' ? 'agregado' : 'restado'}!`,
      description: `Se ${modificationType === 'add' ? 'agregaron' : 'restaron'} $${amount.toLocaleString()} a tu meta de ahorro`
    });
    
    setModifyingAmount('');
    setModifyingGoalId(null);
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', targetAmount: '', currentAmount: '', targetDate: '' });
  };

  const getDaysRemaining = (targetDate) => {
    if (!targetDate) return null;
    const today = new Date();
    const target = new Date(targetDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Metas de Ahorro</h1>
          <p className="text-muted-foreground">Define y alcanza tus objetivos financieros</p>
        </div>
        {!isAdding && (
          <Button 
            onClick={() => setIsAdding(true)}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Meta
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
            {editingId ? 'Editar Meta de Ahorro' : 'Nueva Meta de Ahorro'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Nombre de la Meta</Label>
                <Input
                  id="name"
                  placeholder="Ej: Vacaciones en Europa"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetAmount" className="text-foreground">Monto Objetivo</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.targetAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetAmount: e.target.value }))}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="currentAmount" className="text-foreground">Monto Actual (Opcional)</Label>
                <Input
                  id="currentAmount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.currentAmount}
                  onChange={(e) => setFormData(prev => ({ ...prev, currentAmount: e.target.value }))}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="targetDate" className="text-foreground">Fecha Objetivo (Opcional)</Label>
                <Input
                  id="targetDate"
                  type="date"
                  value={formData.targetDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetDate: e.target.value }))}
                  className="bg-input border-border text-foreground"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                {editingId ? 'Actualizar' : 'Crear'} Meta
              </Button>
              <Button type="button" variant="outline" onClick={cancelEdit}>
                Cancelar
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Lista de metas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {savingsGoals.map((goal, index) => {
          const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
          const daysRemaining = getDaysRemaining(goal.targetDate);
          const isCompleted = progress >= 100;
          
          return (
            <motion.div
              key={goal.id}
              className="glass-card p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${
                    isCompleted ? 'bg-emerald-500/20 text-emerald-400' : 'savings-gradient text-white'
                  }`}>
                    {isCompleted ? <Target className="w-6 h-6" /> : <PiggyBank className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{goal.name}</h3>
                    {goal.targetDate && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>
                          {daysRemaining !== null && daysRemaining >= 0 
                            ? `${daysRemaining} días restantes`
                            : 'Fecha vencida'
                          }
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(goal)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(goal.id)}
                    className="text-muted-foreground hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progreso</span>
                  <span className="text-foreground font-semibold">
                    ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                  </span>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <motion.div
                    className={`h-3 rounded-full ${
                      isCompleted ? 'bg-emerald-500' : 'savings-gradient'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(progress, 100)}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className={`font-medium ${
                    isCompleted ? 'text-emerald-400' : 'text-primary'
                  }`}>
                    {progress.toFixed(1)}% completado
                  </span>
                  <span className="text-muted-foreground">
                    Falta: ${Math.max(0, goal.targetAmount - goal.currentAmount).toLocaleString()}
                  </span>
                </div>

                {!isCompleted && (
                  <div className="pt-3 border-t border-border">
                    {modifyingGoalId === goal.id ? (
                      <div className="space-y-2">
                        <Input
                          type="number"
                          step="0.01"
                          placeholder={`Monto a ${modificationType === 'add' ? 'agregar' : 'restar'}`}
                          value={modifyingAmount}
                          onChange={(e) => setModifyingAmount(e.target.value)}
                          className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleModifyAmount(goal.id)}
                            className={`${modificationType === 'add' ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-500 hover:bg-red-600'} w-full`}
                          >
                            Confirmar
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setModifyingGoalId(null);
                              setModifyingAmount('');
                            }}
                            className="w-full"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => { setModifyingGoalId(goal.id); setModificationType('add'); }}
                          className="w-full bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/30"
                          variant="outline"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar
                        </Button>
                        <Button
                          onClick={() => { setModifyingGoalId(goal.id); setModificationType('subtract'); }}
                          className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                          variant="outline"
                        >
                          <Minus className="w-4 h-4 mr-2" />
                          Restar
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {isCompleted && (
                  <div className="pt-3 border-t border-emerald-500/30">
                    <div className="flex items-center justify-center gap-2 text-emerald-400">
                      <Target className="w-4 h-4" />
                      <span className="font-semibold">¡Meta Completada!</span>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}

        {savingsGoals.length === 0 && (
          <motion.div
            className="lg:col-span-2 glass-card p-12 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <PiggyBank className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No hay metas de ahorro</h3>
            <p className="text-muted-foreground mb-4">
              Crea tu primera meta de ahorro para comenzar a alcanzar tus objetivos financieros
            </p>
            <Button 
              onClick={() => setIsAdding(true)}
              className="bg-gradient-to-r from-primary to-secondary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Meta
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}