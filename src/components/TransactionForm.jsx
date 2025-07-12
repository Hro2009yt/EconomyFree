import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { Plus, DollarSign, Calendar, FileText, Tag } from 'lucide-react';

export default function TransactionForm({ categories, onAddTransaction, transactionToEdit, onUpdateTransaction, onDoneEditing }) {
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    description: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0]
  });
  const { toast } = useToast();
  const isEditing = !!transactionToEdit;

  useEffect(() => {
    if (isEditing) {
      setFormData({
        type: transactionToEdit.type,
        amount: transactionToEdit.amount.toString(),
        description: transactionToEdit.description,
        categoryId: transactionToEdit.categoryId,
        date: transactionToEdit.date
      });
    } else {
      setFormData({
        type: 'expense',
        amount: '',
        description: '',
        categoryId: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  }, [transactionToEdit, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.description || !formData.categoryId) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos",
        variant: "destructive"
      });
      return;
    }

    if (isEditing) {
      const updatedTransaction = {
        ...transactionToEdit,
        ...formData,
        amount: parseFloat(formData.amount),
      };
      onUpdateTransaction(updatedTransaction);
      toast({
        title: "¡Transacción actualizada!",
        description: "La transacción ha sido actualizada exitosamente."
      });
      onDoneEditing();
    } else {
      const transaction = {
        id: Date.now().toString(),
        ...formData,
        amount: parseFloat(formData.amount),
        createdAt: new Date().toISOString()
      };
      onAddTransaction(transaction);
      toast({
        title: "¡Transacción agregada!",
        description: `${formData.type === 'income' ? 'Ingreso' : 'Gasto'} de $${formData.amount} registrado exitosamente`
      });
    }

    // Resetear formulario
    setFormData({
      type: 'expense',
      amount: '',
      description: '',
      categoryId: '',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const filteredCategories = categories.filter(cat => cat.type === formData.type);

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        className="glass-card p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-r from-primary to-secondary">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold gradient-text">{isEditing ? 'Editar Transacción' : 'Nueva Transacción'}</h1>
            <p className="text-muted-foreground">{isEditing ? 'Modifica los detalles de la transacción' : 'Registra un nuevo ingreso o gasto'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Tipo de transacción */}
          <div className="space-y-2">
            <Label className="text-foreground">Tipo de Transacción</Label>
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'income', categoryId: '' }))}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.type === 'income'
                    ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400'
                    : 'border-border bg-background/50 text-muted-foreground hover:border-border/80'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">💰</div>
                  <p className="font-semibold">Ingreso</p>
                </div>
              </motion.button>
              
              <motion.button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'expense', categoryId: '' }))}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.type === 'expense'
                    ? 'border-red-500 bg-red-500/20 text-red-400'
                    : 'border-border bg-background/50 text-muted-foreground hover:border-border/80'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="text-center">
                  <div className="text-2xl mb-2">💸</div>
                  <p className="font-semibold">Gasto</p>
                </div>
              </motion.button>
            </div>
          </div>

          {/* Monto */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Monto
            </Label>
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

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Descripción
            </Label>
            <Input
              id="description"
              placeholder="Ej: Compra en supermercado"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-input border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>

          {/* Categoría */}
          <div className="space-y-2">
            <Label className="text-foreground flex items-center gap-2">
              <Tag className="w-4 h-4" />
              Categoría
            </Label>
            <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
              <SelectTrigger className="bg-input border-border text-foreground">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
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

          {/* Fecha */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Fecha
            </Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              className="bg-input border-border text-foreground"
            />
          </div>

          <div className="flex gap-4">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-primary-foreground font-semibold py-3"
            >
              <Plus className="w-4 h-4 mr-2" />
              {isEditing ? 'Actualizar Transacción' : 'Agregar Transacción'}
            </Button>
            {isEditing && (
              <Button type="button" variant="outline" onClick={onDoneEditing} className="w-full">
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
}