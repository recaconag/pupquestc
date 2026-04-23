/**
 * auth/auth.ts — Frontend Authentication Utilities
 *
 * This file handles everything related to "is the user logged in?"
 * on the frontend side. Key exports:
 *
 * - getAccessToken / setAccessToken / clearAccessToken
 *     Read, save, and delete the JWT token from localStorage.
 *
 * - verifyToken(token)
 *     Decodes a JWT string and returns the user's info (id, name, role).
 *     Does NOT make a network call — it reads the token locally.
 *
 * - useUserVerification()
 *     A React hook that components can call to get the current logged-in user.
 *     Returns null if nobody is logged in.
 *     Automatically updates when the user logs in or out in any browser tab.
 *
 * - signOut(navigate)
 *     Clears the token and redirects the user to the login page.
 */
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import type { decodedUser } from "../types/types";

const ACCESS_TOKEN_KEY = "accessToken";

const notifyAuthChanged = () => {
  // In-tab updates (React listeners)
  window.dispatchEvent(new Event("auth:changed"));
};

export const getAccessToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return window.localStorage?.getItem(ACCESS_TOKEN_KEY) ?? null;
};

export const setAccessToken = (token: string) => {
  if (typeof window === "undefined") return;
  if (!token) return;
  window.localStorage?.setItem(ACCESS_TOKEN_KEY, token);
  notifyAuthChanged();
};

export const clearAccessToken = () => {
  if (typeof window === "undefined") return;
  window.localStorage?.removeItem(ACCESS_TOKEN_KEY);
  notifyAuthChanged();
};

/* =========================
   TOKEN VERIFICATION
========================= */

export const verifyToken = (token: string): decodedUser | null => {
  try {
    const decoded: decodedUser = jwtDecode(token);
    return decoded;
  } catch {
    return null;
  }
};

export const getVerifiedUserFromStorage = (): decodedUser | null => {
  const token = getAccessToken();
  if (!token) return null;
  return verifyToken(token);
};

/* =========================
   USER HOOK
========================= */

export const useUserVerification = () => {
  const [user, setUser] = useState<decodedUser | null>(null);

  useEffect(() => {
    const refresh = () => {
      setUser(getVerifiedUserFromStorage());
    };

    refresh();

    // Cross-tab logout/login
    const onStorage = (e: StorageEvent) => {
      if (e.key === ACCESS_TOKEN_KEY) refresh();
    };

    // Same-tab changes (setAccessToken/clearAccessToken)
    const onAuthChanged = () => refresh();

    window.addEventListener("storage", onStorage);
    window.addEventListener("auth:changed", onAuthChanged);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("auth:changed", onAuthChanged);
    };
  }, []);

  return user;
};

/* =========================
   SIGN OUT
========================= */

export const signOut = (
  navigate?: (path: string) => void
) => {
  clearAccessToken();
  if (navigate) navigate("/login");
  else window.location.href = "/login";
};

// Backwards-compatible exports (so existing imports won't break)
export const setUserLocalStorage = (
  token: string,
  navigate?: (path: string) => void
) => {
  if (!token) {
    signOut(navigate);
    return;
  }
  setAccessToken(token);
};

export const getUserLocalStorage = getAccessToken;

export const removeUserLocalStorage = (navigate?: (path: string) => void) => {
  signOut(navigate);
};