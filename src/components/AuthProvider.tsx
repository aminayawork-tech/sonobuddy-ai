"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient, supabaseConfigured } from "@/lib/supabase/client";
import { FREE_SCAN_LIMIT } from "@/lib/plans";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  tier: "free" | "pro" | "clinic";
  scans_used_this_month: number;
  apple_original_transaction_id: string | null;
}

interface AuthContextValue {
  user:    User | null;
  profile: Profile | null;
  loading: boolean;
  scansLeft: number;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user:           null,
  profile:        null,
  loading:        true,
  scansLeft:      FREE_SCAN_LIMIT,
  refreshProfile: async () => {},
  signOut:        async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  const fetchProfile = useCallback(async (uid: string) => {
    const { data } = await supabase
      .from("profiles")
      .select("id, email, full_name, tier, scans_used_this_month, apple_original_transaction_id")
      .eq("id", uid)
      .single();
    if (data) setProfile(data as Profile);
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (user) await fetchProfile(user.id);
  }, [user, fetchProfile]);

  useEffect(() => {
    // Skip if Supabase not configured (env vars missing)
    if (!supabaseConfigured) { setLoading(false); return; }

    // Initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) fetchProfile(user.id).finally(() => setLoading(false));
      else setLoading(false);
    });

    // Auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      const u = session?.user ?? null;
      setUser(u);
      if (u) fetchProfile(u.id);
      else   setProfile(null);
    });

    return () => subscription.unsubscribe();
  }, [supabase, fetchProfile]);

  const scansLeft = profile
    ? profile.tier === "free"
      ? Math.max(0, FREE_SCAN_LIMIT - profile.scans_used_this_month)
      : Infinity
    : FREE_SCAN_LIMIT;

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, scansLeft, refreshProfile, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
