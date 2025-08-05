import { supabase } from '@/integrations/supabase/client';

// Helper to get current user ID
const getCurrentUserId = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id;
};

// Order API functions
export const fetchOrdersByUser = async (userId?: string) => {
  const userIdToUse = userId || await getCurrentUserId();
  if (!userIdToUse) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', userIdToUse)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
};

// Wishlist API functions
export const fetchWishlist = async (userId?: string) => {
  const userIdToUse = userId || await getCurrentUserId();
  if (!userIdToUse) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('wishlist_items')
    .select(`
      *,
      product:products(*)
    `)
    .eq('user_id', userIdToUse);
  
  if (error) throw error;
  return data?.map(item => item.product) || [];
};

export const addToWishlist = async (productId: string, userId?: string) => {
  const userIdToUse = userId || await getCurrentUserId();
  if (!userIdToUse) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('wishlist_items')
    .insert([{ user_id: userIdToUse, product_id: productId }]);
  
  if (error) throw error;
  return data;
};

export const removeFromWishlist = async (productId: string, userId?: string) => {
  const userIdToUse = userId || await getCurrentUserId();
  if (!userIdToUse) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('user_id', userIdToUse)
    .eq('product_id', productId);
  
  if (error) throw error;
  return data;
};

// Product API functions
export const fetchProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true);
  
  if (error) throw error;
  return data || [];
};

export const fetchProduct = async (id: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

// User profile functions
export const updateUserProfile = async (userId: string, updates: any) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);
  
  if (error) throw error;
  return data;
};

// Cart API functions
export const fetchCart = async (userId?: string) => {
  const userIdToUse = userId || await getCurrentUserId();
  if (!userIdToUse) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('cart_items')
    .select(`
      *,
      product:products(*)
    `)
    .eq('user_id', userIdToUse);
  
  if (error) throw error;
  return data || [];
};

export const addToCart = async (productId: string, quantity = 1, userId?: string) => {
  const userIdToUse = userId || await getCurrentUserId();
  if (!userIdToUse) throw new Error('User not authenticated');

  const { data, error } = await supabase
    .from('cart_items')
    .upsert({
      user_id: userIdToUse,
      product_id: productId,
      quantity
    });
  
  if (error) throw error;
  return data;
};
