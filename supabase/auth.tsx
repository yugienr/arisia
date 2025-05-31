import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { Database } from "../src/types/supabase";

type UserRole = "admin" | "customer";

type UserData = {
  id: string;
  email: string;
  full_name: string | null;
  phone_number: string | null;
  role: UserRole;
};

type AuthContextType = {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role?: UserRole,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (
    data: Partial<Omit<UserData, "id" | "email">>,
  ) => Promise<void>;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data from the database
  const fetchUserData = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles") // Ambil dari tabel profiles
      .select("id, full_name, phone_number") // Pilih field yang dibutuhkan
      .eq("id", userId)
      .single(); // pastikan hanya satu baris

    if (error) {
      console.error("Error fetching user data:", error);
      return null;
    }

    return {
      id: data.id,
      full_name: data.full_name,
      phone_number: data.phone_number,
    };
  };

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const userData = await fetchUserData(currentUser.id);
        setUserData(userData);
      }

      setLoading(false);
    });

    // Listen for changes on auth state (signed in, signed out, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const userData = await fetchUserData(currentUser.id);
        setUserData(userData);
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: UserRole = "customer",
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) throw error;

    if (data.user) {
      // Create a record in the users table
      const { error: userError } = await supabase.from("users").insert({
        id: data.user.id,
        email: email,
        full_name: fullName,
        role: role,
      });

      if (userError) throw userError;
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const updateProfile = async (
    data: Partial<Omit<UserData, "id" | "email">>,
  ) => {
    if (!user) throw new Error("User not authenticated");

    // Update ke tabel "profiles"
    const { error } = await supabase
      .from("profiles")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) throw error;

    // Update local state
    if (userData) {
      setUserData({ ...userData, ...data });
    }
  };

  const isAdmin = userData?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        signIn,
        signUp,
        signOut,
        updateProfile,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
