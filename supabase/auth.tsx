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
    phoneNumber?: string,
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
      .from("users")
      .select("id, email, full_name, phone_number, role")
      .eq("id", userId)
      .maybeSingle(); // ⬅️ ini tidak error kalau hasilnya null

    if (error) {
      console.error("Error fetching user data:", error);
      return null;
    }

    if (!data) {
      console.warn("No user found with id:", userId);
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      full_name: data.full_name,
      phone_number: data.phone_number,
      role: data.role,
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
    phoneNumber?: string,
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone_number: phoneNumber,
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
        phone_number: phoneNumber,
        role: role,
      });

      if (userError) throw userError;

      // Also create a record in the profiles table for backward compatibility
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: fullName,
        avatar_url: null,
        username: email.split("@")[0],
        website: null,
      });

      if (profileError) console.error("Error creating profile:", profileError);
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

    // Update ke tabel "users"
    const { error } = await supabase
      .from("users")
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
