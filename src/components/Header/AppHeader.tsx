import { UserMenu } from './UserMenu';
import { useAuth } from '@/contexts/AuthContext';

export function AppHeader() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        {/* Logo e Título */}
        <div className="mr-4 flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-lg bg-primary/10">
              <img 
                src="/logo_ultrabase.png" 
                alt="UltraBase Logo" 
                className="h-6 w-6 object-contain" 
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-foreground">
                UltraBase QR
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Gerador de QR Codes para Imagens
              </p>
            </div>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* User Menu */}
        {user && (
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-sm font-medium text-foreground">
                {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário'}
              </span>
              <span className="text-xs text-muted-foreground">
                {user.email}
              </span>
            </div>
            <UserMenu />
          </div>
        )}
      </div>
    </header>
  );
}