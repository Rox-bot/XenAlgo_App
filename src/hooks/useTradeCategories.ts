import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

export type TradeCategory = Tables<'trade_categories'>;

export interface CreateCategoryData {
  name: string;
  color?: string;
}

export function useTradeCategories() {
  const [categories, setCategories] = useState<TradeCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchCategories = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trade_categories')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (categoryData: CreateCategoryData) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('trade_categories')
        .insert([{
          ...categoryData,
          user_id: user.id,
          color: categoryData.color || '#3B82F6',
        }])
        .select()
        .single();

      if (error) throw error;
      
      setCategories(prev => [data, ...prev]);
      toast.success('Category created successfully');
      return data;
    } catch (error: any) {
      console.error('Error creating category:', error);
      toast.error('Failed to create category');
      throw error;
    }
  };

  const updateCategory = async (id: string, updates: Partial<CreateCategoryData>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('trade_categories')
        .update(updates)
        .eq('id', id)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setCategories(prev => prev.map(category => 
        category.id === id ? data : category
      ));
      toast.success('Category updated successfully');
      return data;
    } catch (error: any) {
      console.error('Error updating category:', error);
      toast.error('Failed to update category');
      throw error;
    }
  };

  const deleteCategory = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('trade_categories')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;

      setCategories(prev => prev.filter(category => category.id !== id));
      toast.success('Category deleted successfully');
    } catch (error: any) {
      console.error('Error deleting category:', error);
      toast.error('Failed to delete category');
      throw error;
    }
  };

  useEffect(() => {
    if (user) {
      fetchCategories();
    } else {
      setCategories([]);
      setLoading(false);
    }
  }, [user]);

  return {
    categories,
    loading,
    createCategory,
    updateCategory,
    deleteCategory,
    refetch: fetchCategories,
  };
} 