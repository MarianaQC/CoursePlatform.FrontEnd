import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GraduationCap, LogOut, User, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export function Header() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/courses" className="flex items-center gap-2 font-semibold">
          <GraduationCap className="h-6 w-6 text-primary" />
          <span className="text-lg">CoursePlatform</span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            to="/courses"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Cursos
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  {user ? getInitials(user.fullName) : 'U'}
                </div>
                <span className="hidden text-sm font-medium md:inline-block">
                  {user?.fullName}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{user?.fullName}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                {isAdmin && (
                  <span className="mt-1 inline-block rounded bg-primary/10 px-1.5 py-0.5 text-xs font-medium text-primary">
                    Admin
                  </span>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
    </header>
  );
}
