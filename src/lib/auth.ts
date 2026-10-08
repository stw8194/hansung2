import { supabase } from "./supabase/client";

const SESSION_KEY = "app_session_token";
const AUTH_EVENT = "app-auth-change";

export type AppSession = {
  token: string;
  user: { id: string; login_id: string; nickname: string };
};

type AuthResult = { token: string; user: AppSession["user"] };

function getStoredToken() {
  return window.localStorage.getItem(SESSION_KEY);
}

export const getSessionToken = getStoredToken;

export function notifyAuthChange() {
  window.dispatchEvent(new Event(AUTH_EVENT));
}

function saveToken(token: string | null) {
  if (token) window.localStorage.setItem(SESSION_KEY, token);
  else window.localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT));
}

export async function signUp(
  loginId: string,
  nickname: string,
  password: string,
) {
  const { data, error } = await supabase.rpc("register_user", {
    candidate_login_id: loginId,
    candidate_nickname: nickname,
    candidate_password: password,
  });
  if (error) throw error;
  const result = data as AuthResult;
  saveToken(result.token);
  return result;
}

export async function signIn(loginId: string, password: string) {
  const { data, error } = await supabase.rpc("login_user", {
    candidate_login_id: loginId,
    candidate_password: password,
  });
  if (error) throw error;
  const result = data as AuthResult;
  saveToken(result.token);
  return result;
}

export async function getAppSession(): Promise<AppSession | null> {
  const token = getStoredToken();
  if (!token) return null;
  const { data, error } = await supabase.rpc("get_app_session", {
    candidate_token: token,
  });
  if (error || !data) {
    saveToken(null);
    return null;
  }
  return { token, user: data as AppSession["user"] };
}

export async function signOut() {
  const token = getStoredToken();
  if (token) await supabase.rpc("logout_user", { candidate_token: token });
  saveToken(null);
  window.sessionStorage.removeItem("hri-consultation");
}

export function subscribeAuth(listener: () => void) {
  window.addEventListener(AUTH_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(AUTH_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}
