import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Github, Chrome, Wallet, Mail, ArrowLeft } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

export const AuthModal = ({ isOpen, onClose, defaultMode = 'login' }: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot-password'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signup, resetPassword, loginWithGoogle, loginWithGithub, loginWithWallet } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (mode === 'login') {
        await login(email, password);
        toast({ title: "Welcome back!", description: "You've been logged in successfully." });
      } else if (mode === 'signup') {
        await signup(email, password, name);
        toast({ title: "Account created!", description: "Welcome to JuaPesa!" });
      } else if (mode === 'forgot-password') {
        await resetPassword(email);
        toast({ title: "Reset email sent!", description: "Check your email for reset instructions." });
        setMode('login');
      }
      onClose();
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'github' | 'wallet') => {
    setIsLoading(true);
    try {
      if (provider === 'google') await loginWithGoogle();
      else if (provider === 'github') await loginWithGithub();
      else if (provider === 'wallet') await loginWithWallet();
      
      toast({ title: "Welcome!", description: "You've been logged in successfully." });
      onClose();
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to login. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Welcome Back';
      case 'signup': return 'Join JuaPesa';
      case 'forgot-password': return 'Reset Password';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md glass-card border-border/50 crypto-shadow">
        <DialogHeader>
          <div className="flex items-center space-x-2">
            {mode === 'forgot-password' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMode('login')}
                className="p-2"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
            <DialogTitle className="text-2xl font-crypto text-center flex-1">
              {getTitle()}
            </DialogTitle>
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {mode !== 'forgot-password' && (
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('google')}
                    disabled={isLoading}
                    className="glass-card border-border/50 hover:border-primary/50 click-scale"
                  >
                    <Chrome className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('github')}
                    disabled={isLoading}
                    className="glass-card border-border/50 hover:border-primary/50 click-scale"
                  >
                    <Github className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleSocialLogin('wallet')}
                    disabled={isLoading}
                    className="glass-card border-border/50 hover:border-primary/50 click-scale"
                  >
                    <Wallet className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="relative">
                  <Separator />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="bg-background px-2 text-sm text-muted-foreground">
                      or continue with email
                    </span>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="glass-card border-border/50 focus:border-primary/50"
                    placeholder="Enter your full name"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="glass-card border-border/50 focus:border-primary/50"
                  placeholder="Enter your email"
                />
              </div>

              {mode !== 'forgot-password' && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="glass-card border-border/50 focus:border-primary/50 pr-10"
                      placeholder="Enter your password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-1 top-1 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                className="w-full gradient-primary click-scale font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Please wait...</span>
                  </div>
                ) : (
                  <>
                    <Mail className="h-4 w-4 mr-2" />
                    {mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Reset Email'}
                  </>
                )}
              </Button>
            </form>

            <div className="text-center space-y-2 mt-6">
              {mode === 'login' && (
                <>
                  <Button
                    variant="link"
                    onClick={() => setMode('forgot-password')}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Forgot your password?
                  </Button>
                  <div className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Button
                      variant="link"
                      onClick={() => setMode('signup')}
                      className="p-0 h-auto text-primary hover:text-primary-glow"
                    >
                      Sign up
                    </Button>
                  </div>
                </>
              )}
              
              {mode === 'signup' && (
                <div className="text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <Button
                    variant="link"
                    onClick={() => setMode('login')}
                    className="p-0 h-auto text-primary hover:text-primary-glow"
                  >
                    Sign in
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};