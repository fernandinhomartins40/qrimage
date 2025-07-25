import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData?: { full_name?: string }) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Verificar sessão inicial
    const initializeAuth = async () => {
      try {
        // Timeout para evitar loading infinito
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout na autenticação')), 10000);
        });

        const authPromise = supabase.auth.getSession();
        
        const { data: { session }, error } = await Promise.race([authPromise, timeoutPromise]) as any;
        
        if (error) {
          console.error('Erro ao obter sessão:', error);
          toast({
            title: "Erro de autenticação",
            description: "Erro ao verificar sessão atual.",
            variant: "destructive",
          });
        } else {
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Erro ao inicializar autenticação:', error);
        toast({
          title: "Erro de conexão",
          description: "Não foi possível conectar ao servidor de autenticação.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Escutar mudanças na autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session);
        
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Mostrar notificações para eventos específicos
        if (event === 'SIGNED_IN') {
          toast({
            title: "Login realizado com sucesso!",
            description: "Bem-vindo ao Gerador de QR Code.",
            variant: "default",
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: "Logout realizado",
            description: "Você foi desconectado com segurança.",
            variant: "default",
          });
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const signUp = async (email: string, password: string, userData?: { full_name?: string }) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData?.full_name || '',
          },
        },
      });

      if (error) {
        toast({
          title: "Erro no registro",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registro realizado!",
          description: "Verifique seu email para confirmar a conta.",
          variant: "default",
        });
      }

      return { error };
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Erro no registro",
        description: authError.message || "Erro inesperado ao criar conta.",
        variant: "destructive",
      });
      return { error: authError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Erro no login",
          description: error.message,
          variant: "destructive",
        });
      }

      return { error };
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Erro no login",
        description: authError.message || "Erro inesperado ao fazer login.",
        variant: "destructive",
      });
      return { error: authError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast({
          title: "Erro no logout",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast({
        title: "Erro no logout",
        description: "Erro inesperado ao fazer logout.",
        variant: "destructive",
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast({
          title: "Erro ao redefinir senha",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Email enviado!",
          description: "Verifique seu email para redefinir a senha.",
          variant: "default",
        });
      }

      return { error };
    } catch (error) {
      const authError = error as AuthError;
      toast({
        title: "Erro ao redefinir senha",
        description: authError.message || "Erro inesperado ao redefinir senha.",
        variant: "destructive",
      });
      return { error: authError };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};