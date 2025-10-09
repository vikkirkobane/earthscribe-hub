import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  supabase, 
  signUp as signUpService, 
  signIn as signInService, 
  signOut as signOutService, 
  getCurrentUser,
  User 
} from '../services/supabase';

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          // Get user details
          const supabaseUser = session.user;
          // Get additional user data from our custom table if needed
          const { data, error } = await supabase
            .from('users')
            .select('id, email, name, points, streak_days, created_at')
            .eq('id', supabaseUser.id)
            .single();

          if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found
            console.error('Error fetching user data:', error);
          }

          setUser({
            id: supabaseUser.id,
            email: supabaseUser.email || '',
            name: data?.name,
            points: data?.points || 0,
            streak_days: data?.streak_days || 0,
            created_at: data?.created_at || new Date().toISOString(),
          });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
          if (session?.user) {
            // Get user details
            const supabaseUser = session.user;
            // Get additional user data from our custom table if needed
            const { data, error } = await supabase
              .from('users')
              .select('id, email, name, points, streak_days, created_at')
              .eq('id', supabaseUser.id)
              .single();

            if (error && error.code !== 'PGRST116') {
              console.error('Error fetching user data:', error);
            }

            setUser({
              id: supabaseUser.id,
              email: supabaseUser.email || '',
              name: data?.name,
              points: data?.points || 0,
              streak_days: data?.streak_days || 0,
              created_at: data?.created_at || new Date().toISOString(),
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, name?: string) => {
    await signUpService(email, password, name);
  };

  const signIn = async (email: string, password: string) => {
    await signInService(email, password);
  };

  const signOut = async () => {
    await signOutService();
  };

  const resetPassword = async (email: string) => {
    await supabase.auth.resetPasswordForEmail(email);
  };

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};