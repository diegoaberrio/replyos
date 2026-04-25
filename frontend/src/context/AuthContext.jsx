import { createContext, useEffect, useMemo, useState } from 'react';
import {
  clearAuthSession,
  getAuthSession,
  saveAuthSession,
} from '../utils/storage';
import { getMe, loginAdmin, logoutAdmin } from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isBootstrappingAuth, setIsBootstrappingAuth] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function bootstrapAuth() {
      try {
        const storedSession = getAuthSession();

        if (!storedSession?.access_token) {
          if (!ignore) {
            setSession(null);
          }
          return;
        }

        const meResponse = await getMe(storedSession.access_token);

        if (!ignore) {
          const nextSession = {
            ...storedSession,
            user: meResponse.data,
          };

          setSession(nextSession);
          saveAuthSession(nextSession);
        }
      } catch {
        if (!ignore) {
          setSession(null);
          clearAuthSession();
        }
      } finally {
        if (!ignore) {
          setIsBootstrappingAuth(false);
          setIsAuthReady(true);
        }
      }
    }

    bootstrapAuth();

    return () => {
      ignore = true;
    };
  }, []);

  async function login(credentials) {
    const loginResponse = await loginAdmin(credentials);

    const nextSession = {
      access_token: loginResponse.data.access_token,
      refresh_token: loginResponse.data.refresh_token,
      user: loginResponse.data.user,
    };

    setSession(nextSession);
    saveAuthSession(nextSession);

    return loginResponse;
  }

  async function logout() {
    const token = session?.access_token ?? null;

    try {
      if (token) {
        await logoutAdmin(token);
      }
    } catch {
      // No bloqueamos logout local
    } finally {
      setSession(null);
      clearAuthSession();
    }
  }

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      accessToken: session?.access_token ?? null,
      refreshToken: session?.refresh_token ?? null,
      isAuthenticated: Boolean(session?.access_token),
      isAuthReady,
      isBootstrappingAuth,
      login,
      logout,
    }),
    [session, isAuthReady, isBootstrappingAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}