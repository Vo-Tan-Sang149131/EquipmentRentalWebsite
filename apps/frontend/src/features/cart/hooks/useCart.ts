import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cartService } from '../services/cart.service';
import type { CartItemRequest } from '../types/cart.types';
import { useAuthStore } from '@/store/useAuthStore.ts';

export function useCart() {
  const queryClient = useQueryClient();

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const {
    data: cartData,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ['cart'],
    queryFn: () => cartService.getMyCart(),
    staleTime: 1000 * 60 * 5,

    enabled: isAuthenticated,
  });


  const addToCartMutation = useMutation({
    mutationFn: (payload: CartItemRequest) => cartService.addToCart(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: (cartItemId: number) => cartService.removeFromCart(cartItemId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const cartItemsCount = cartData?.items?.length || 0;

  return {
    cart: cartData,
    isLoading,
    isError,
    error,
    cartItemsCount,
    addToCart: addToCartMutation.mutateAsync,
    isAdding: addToCartMutation.isPending,
    removeFromCart: removeFromCartMutation.mutateAsync,
    isRemoving: removeFromCartMutation.isPending,
  };
}
