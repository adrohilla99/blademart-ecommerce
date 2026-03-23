import { describe, it, expect, beforeEach } from 'vitest';
import { useAuthStore } from '@/store/authStore';
import type { User } from '@/types';

const mockUser: User = {
  id: 'user_1',
  name: 'Test User',
  email: 'test@example.com',
  role: 'USER',
};

beforeEach(() => {
  useAuthStore.getState().logout();
});

describe('Auth Store', () => {
  it('starts unauthenticated', () => {
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });

  it('sets auth on login', () => {
    useAuthStore.getState().setAuth(mockUser, 'test-token');
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(true);
    expect(state.user).toEqual(mockUser);
    expect(state.token).toBe('test-token');
  });

  it('clears auth on logout', () => {
    useAuthStore.getState().setAuth(mockUser, 'test-token');
    useAuthStore.getState().logout();
    const state = useAuthStore.getState();
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toBeNull();
    expect(state.token).toBeNull();
  });
});
