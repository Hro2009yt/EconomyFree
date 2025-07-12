import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Edit2, Trash2, Tag, Palette } from 'lucide-react';

const colorOptions = [
  '#00FFFF', '#8A2BE2', '#6A0DAD', '#E0BBE4', '#10B981',
  '#3B82F6', '#F59E0B', '#EF4444', '#06B6D4', '#EC4899'
];

export default function CategoryManager({ categories, onUpdateCategories }) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: colorOptions[0],
    type: 'expense'
  });
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la categoría es requerido",
        variant: "destructive"
      });
      return;
    }

    if (editingId) {
      // Editar categoría existente
      const updatedCategories = categories.map(cat =>
        cat.id === editingId ? { ...cat, ...formData } : cat
      );
      onUpdateCategories(updatedCategories);
      toast({
        title: "¡Categoría actualizada!",
        description: `La categoría "${formData.name}" ha sido actualizada`
      });
      setEditingId(null);
    } else {
      // Agregar nueva categoría
      const newCategory = {
        id: Date.now().toString(),
        ...formData
      };
      onUpdateCategories([...categories, newCategory]);
      toast({
        title: "¡Categoría creada!",
        description: `La categoría "${formData.name}" ha sido creada exitosamente`
      });
      setIsAdding(false);
    }

    setFormData({ name: '', color: colorOptions[0], type: 'expense' });
  };

  const handleEdit = (category) => {
    setFormData({
      name: category.name,
      color: category.color,
      type: category.type
    });
    setEditingId(category.id);
    setIsAdding(true);
  };

  const handleDelete = (categoryId) => {
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    onUpdateCategories(updatedCategories);
    toast({
      title: "Categoría eliminada",
      description: "La categoría ha sido eliminada exitosamente"
    });
  };

  const cancelEdit = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', color: colorOptions[0], type: 'expense' });
  };

  const incomeCategories = categories.filter(cat => cat.type === 'income');
  const expenseCategories = categories.filter(cat => cat.type === 'expense');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Gestión de Categorías</h1>
          <p className="text-muted-foreground">Organiza tus transacciones con categorías personalizadas</p>
        </div>
        {!isAdding && (
          <Button 
            onClick={() => setIsAdding(true)}
            className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Categoría
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
            {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">Nombre</Label>
                <Input
                  id="name"
                  placeholder="Ej: Alimentación"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-input border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-foreground">Tipo</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'income' }))}
                    className={`p-2 rounded-lg text-sm font-medium transition-all ${
                      formData.type === 'income'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500'
                        : 'bg-background/50 text-muted-foreground border border-border'
                    }`}
                  >
                    Ingreso
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, type: 'expense' }))}
                    className={`p-2 rounded-lg text-sm font-medium transition-all ${
                      formData.type === 'expense'
                        ? 'bg-red-500/20 text-red-400 border border-red-500'
                        : 'bg-background/50 text-muted-foreground border border-border'
                    }`}
                  >
                    Gasto
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-foreground flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Color
              </Label>
              <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color }))}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${
                      formData.color === color ? 'border-foreground scale-110' : 'border-border'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button type="submit" className="bg-gradient-to-r from-primary to-secondary">
                {editingId ? 'Actualizar' : 'Crear'} Categoría
              </Button>
              <Button type="button" variant="outline" onClick={cancelEdit}>
                Cancelar
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Lista de categorías */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Categorías de Ingresos */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-xl font-bold text-emerald-400 mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Categorías de Ingresos ({incomeCategories.length})
          </h2>
          
          <div className="space-y-3">
            {incomeCategories.map((category, index) => (
              <motion.div
                key={category.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-foreground font-medium">{category.name}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(category)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(category.id)}
                    className="text-muted-foreground hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
            
            {incomeCategories.length === 0 && (
              <p className="text-muted-foreground text-center py-8">No hay categorías de ingresos</p>
            )}
          </div>
        </motion.div>

        {/* Categorías de Gastos */}
        <motion.div
          className="glass-card p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
            <Tag className="w-5 h-5" />
            Categorías de Gastos ({expenseCategories.length})
          </h2>
          
          <div className="space-y-3">
            {expenseCategories.map((category, index) => (
              <motion.div
                key={category.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-foreground font-medium">{category.name}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(category)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(category.id)}
                    className="text-muted-foreground hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
            
            {expenseCategories.length === 0 && (
              <p className="text-muted-foreground text-center py-8">No hay categorías de gastos</p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}