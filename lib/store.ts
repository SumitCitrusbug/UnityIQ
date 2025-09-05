import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserRole } from "./types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

const rolePermissions: Record<UserRole, string[]> = {
  admin: [
    "templates:create",
    "templates:edit",
    "templates:delete",
    "templates:publish",
    "tasks:assign",
    "tasks:review",
    "tasks:override",
    "shifts:create",
    "shifts:edit",
    "shifts:delete",
    "reports:view",
    "reports:export",
    "users:manage",
    "settings:manage",
    "audit:view",
    "disputes:resolve",
    "bonuses:manage",
    "payroll:export",
  ],
  manager: [
    "tasks:assign",
    "tasks:review",
    "tasks:override",
    "shifts:create",
    "shifts:edit",
    "reports:view",
    "disputes:resolve",
  ],
  staff: [
    "tasks:view",
    "tasks:complete",
    "shifts:view",
    "clock:in",
    "clock:out",
    "pto:request",
    "disputes:submit",
  ],
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: (user: User) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      hasRole: (role: UserRole | UserRole[]) => {
        const user = get().user;
        if (!user) return false;
        if (Array.isArray(role)) {
          return role.includes(user.role);
        }
        return user.role === role;
      },
      hasPermission: (permission: string) => {
        const user = get().user;
        if (!user) return false;
        return rolePermissions[user.role]?.includes(permission) || false;
      },
    }),
    {
      name: "auth-storage",
      skipHydration: true,
    }
  )
);
