import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { AuthModal } from "@/components/auth/AuthModal";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Menu, X, Moon, Sun, LogOut, Settings, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import juapesaLogo from "/photo-uploads/773bff5d-7a85-4680-989f-75002bbc3dc9.png";

export const Navigation = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Loans", href: "/loans" },
    { name: "Savings", href: "/savings" },
    { name: "History", href: "/history" },
  ];

  return (
    <nav className="modern-nav sticky top-0 z-50 w-full">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <motion.div 
              className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-primary/25"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src={juapesaLogo} 
                alt="JuaPesa" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            <span className="text-2xl font-bold font-crypto bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              JuaPesa
            </span>
          </Link>
          
          <div className="hidden lg:block">
            <div className="flex items-center space-x-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden group",
                    isActive(item.href)
                      ? "text-white bg-primary/20 shadow-lg shadow-primary/25"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  )}
                >
                  <span className="relative z-10">{item.name}</span>
                  {isActive(item.href) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-xl" />
                  )}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="text-muted-foreground hover:text-white hover:bg-white/5 rounded-xl p-3"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="gradient-primary text-white font-crypto">
                        {user.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 glass-card border-border/50" align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  size="lg"
                  onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); }}
                  className="text-muted-foreground hover:text-white hover:bg-white/5 rounded-xl px-6 transition-all duration-300 click-scale"
                >
                  Login
                </Button>
                <Button 
                  size="lg"
                  onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); }}
                  className="gradient-primary text-white hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 rounded-xl px-8 font-medium click-scale"
                >
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                    isActive(item.href)
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-white hover:bg-white/5"
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <Button 
                  variant="ghost" 
                  className="w-full justify-start"
                  onClick={() => { setAuthMode('login'); setIsAuthModalOpen(true); setIsMenuOpen(false); }}
                >
                  Login
                </Button>
                <Button 
                  className="w-full gradient-primary"
                  onClick={() => { setAuthMode('signup'); setIsAuthModalOpen(true); setIsMenuOpen(false); }}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        defaultMode={authMode}
      />
    </nav>
  );
};