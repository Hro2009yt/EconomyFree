import { useState, useMemo } from 'react';

export function useTransactionFiltering(transactions, categories) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  const filteredAndSortedTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || transaction.categoryId === filterCategory;
      const matchesType = filterType === 'all' || transaction.type === filterType;
      
      let matchesDate = true;
      if (filterDateFrom) {
        matchesDate = matchesDate && new Date(transaction.date) >= new Date(filterDateFrom);
      }
      if (filterDateTo) {
        matchesDate = matchesDate && new Date(transaction.date) <= new Date(filterDateTo);
      }
      
      return matchesSearch && matchesCategory && matchesType && matchesDate;
    });

    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'amount':
          aValue = a.amount;
          bValue = b.amount;
          break;
        case 'description':
          aValue = a.description.toLowerCase();
          bValue = b.description.toLowerCase();
          break;
        case 'category':
          const aCat = categories.find(c => c.id === a.categoryId);
          const bCat = categories.find(c => c.id === b.categoryId);
          aValue = aCat?.name.toLowerCase() || '';
          bValue = bCat?.name.toLowerCase() || '';
          break;
        default: // date
          aValue = new Date(a.date);
          bValue = new Date(b.date);
      }
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [transactions, categories, searchTerm, filterCategory, filterType, filterDateFrom, filterDateTo, sortBy, sortOrder]);

  const clearFilters = () => {
    setSearchTerm('');
    setFilterCategory('all');
    setFilterType('all');
    setFilterDateFrom('');
    setFilterDateTo('');
  };

  return {
    filteredAndSortedTransactions,
    searchTerm,
    setSearchTerm,
    filterCategory,
    setFilterCategory,
    filterType,
    setFilterType,
    filterDateFrom,
    setFilterDateFrom,
    filterDateTo,
    setFilterDateTo,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    clearFilters,
  };
}