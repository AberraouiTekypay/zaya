"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type UserRole = "OWNER" | "VET" | "MERCHANT" | "ADMIN";

export interface DemoUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  city: string;
  address?: string;
  avatarUrl?: string;
  clinicName?: string;
  storeName?: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    id: "usr_amine_owner",
    name: "Amine Berraoui",
    email: "amine@zaya.ma",
    role: "OWNER",
    phone: "+212 661 12 34 56",
    city: "Casablanca",
    address: "14 Rue du Souvenir, Maarif",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "usr_sarah_owner",
    name: "Sarah El Fassi",
    email: "sarah@zaya.ma",
    role: "OWNER",
    phone: "+212 662 98 76 54",
    city: "Rabat",
    address: "8 Avenue Hassan II, Agdal",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80",
  },
  {
    id: "usr_dr_bennani",
    name: "Dr. Youssef Bennani",
    email: "vet.anfa@zaya.ma",
    role: "VET",
    phone: "+212 522 36 40 00",
    city: "Casablanca",
    clinicName: "Clinique Vétérinaire d'Anfa",
  },
  {
    id: "usr_merchant_atlas",
    name: "Atlas Pet Supply",
    email: "contact@atlaspet.ma",
    role: "MERCHANT",
    phone: "+212 522 25 10 20",
    city: "Casablanca",
    storeName: "Atlas Pet Boutique Casablanca",
  },
  {
    id: "usr_admin_zaya",
    name: "Admin ZAYA",
    email: "admin@zaya.ma",
    role: "ADMIN",
    phone: "+212 661 00 00 00",
    city: "Casablanca",
  },
];

interface AuthContextType {
  user: DemoUser | null;
  role: UserRole;
  switchUser: (userId: string) => void;
  loginAs: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DemoUser | null>(() => {
    if (typeof window !== "undefined") {
      const savedUserId = localStorage.getItem("zaya_auth_user_id");
      if (savedUserId) {
        const found = DEMO_USERS.find((u) => u.id === savedUserId);
        if (found) return found;
      }
    }
    return DEMO_USERS[0];
  });

  const switchUser = (userId: string) => {
    const found = DEMO_USERS.find((u) => u.id === userId);
    if (found) {
      setUser(found);
      if (typeof window !== "undefined") {
        localStorage.setItem("zaya_auth_user_id", found.id);
      }
    }
  };

  const loginAs = (role: UserRole) => {
    const found = DEMO_USERS.find((u) => u.role === role) || DEMO_USERS[0];
    setUser(found);
    if (typeof window !== "undefined") {
      localStorage.setItem("zaya_auth_user_id", found.id);
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("zaya_auth_user_id");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : "OWNER",
        switchUser,
        loginAs,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
