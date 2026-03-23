import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { registerApi, loginApi } from '@/api/auth.api';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const { setAuth, logout: storeLogout, isAuthenticated, user } = useAuthStore();
  const clearCart = useCartStore((s) => s.clearCart);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { token, user } = await loginApi({ email, password });
      setAuth(user, token);
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Login failed';
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { token, user } = await registerApi({ name, email, password });
      setAuth(user, token);
      toast.success(`Welcome to BladeMart, ${user.name}!`);
      navigate('/');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Registration failed';
      toast.error(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    storeLogout();
    clearCart();
    toast.success('Logged out');
    navigate('/login');
  };

  return { login, register, logout, isLoading, isAuthenticated, user };
}
