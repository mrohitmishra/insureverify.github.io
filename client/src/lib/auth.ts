export type AppRole = "admin" | "master-vendor" | "back-office" | "field-executive" | "insurance-company";

type Session = {
  role: AppRole;
  userName: string;
};

const STORAGE_KEYS = {
  role: "auth.role",
  userName: "auth.userName",
} as const;

export function getSession(): Session | null {
  try {
    const role = localStorage.getItem(STORAGE_KEYS.role) as AppRole | null;
    const userName = localStorage.getItem(STORAGE_KEYS.userName);
    if (!role || !userName) return null;
    return { role, userName };
  } catch {
    return null;
  }
}

export function setSession(session: Session) {
  try {
    localStorage.setItem(STORAGE_KEYS.role, session.role);
    localStorage.setItem(STORAGE_KEYS.userName, session.userName);
  } catch {
    // ignore storage failures
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEYS.role);
    localStorage.removeItem(STORAGE_KEYS.userName);
  } catch {
    // ignore storage failures
  }
}
