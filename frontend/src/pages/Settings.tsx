import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import DashboardLayout from "@/layouts/DashboardLayout";
import { 
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Palette,
  Moon,
  Sun,
  Camera,
  Save,
  Lock,
  Smartphone,
  Mail,
  Eye,
  EyeOff
} from "lucide-react";

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { toast } = useToast();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // Security settings
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(true);

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      await updateProfile({ name, email });
      toast({ title: "Profile updated!", description: "Your profile has been updated successfully." });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({ 
        title: "Error", 
        description: "New passwords don't match.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      // Simulate password change
      await new Promise(resolve => setTimeout(resolve, 1000));
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast({ title: "Password changed!", description: "Your password has been updated successfully." });
    } catch (error) {
      toast({ 
        title: "Error", 
        description: "Failed to change password. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const settingSections = [
    {
      id: 'profile',
      title: 'Profile Settings',
      icon: User,
      content: (
        <div className="space-y-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <Avatar className="w-20 h-20">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="text-2xl font-crypto bg-gradient-to-r from-primary to-secondary text-white">
                  {user?.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <Button
                size="sm"
                className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 gradient-primary"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <h3 className="text-xl font-semibold font-crypto">{user?.name}</h3>
              <p className="text-muted-foreground">{user?.email}</p>
              <p className="text-sm text-accent capitalize">{user?.provider} account</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-card border-border/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-card border-border/50"
              />
            </div>
          </div>

          <Button 
            onClick={handleUpdateProfile}
            disabled={isLoading}
            className="gradient-primary click-scale"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )
    },
    {
      id: 'security',
      title: 'Security Settings',
      icon: Shield,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Change Password</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <div className="relative">
                  <Input
                    id="current-password"
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="glass-card border-border/50 pr-10"
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
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="glass-card border-border/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="glass-card border-border/50"
                />
              </div>
            </div>
            <Button 
              onClick={handleChangePassword}
              disabled={isLoading}
              className="gradient-secondary click-scale"
            >
              <Lock className="h-4 w-4 mr-2" />
              Update Password
            </Button>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-semibold">Two-Factor Authentication</h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Enable 2FA</p>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
              </div>
              <Switch
                checked={twoFactorAuth}
                onCheckedChange={setTwoFactorAuth}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Biometric Authentication</p>
                <p className="text-sm text-muted-foreground">Use fingerprint or face recognition</p>
              </div>
              <Switch
                checked={biometricAuth}
                onCheckedChange={setBiometricAuth}
              />
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'notifications',
      title: 'Notification Settings',
      icon: Bell,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Communication Preferences</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive important updates via email</p>
                  </div>
                </div>
                <Switch
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Smartphone className="h-5 w-5 text-secondary" />
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Get SMS alerts for transactions</p>
                  </div>
                </div>
                <Switch
                  checked={smsNotifications}
                  onCheckedChange={setSmsNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Bell className="h-5 w-5 text-accent" />
                  <div>
                    <p className="font-medium">Push Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                  </div>
                </div>
                <Switch
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-muted-foreground">Receive product updates and promotions</p>
                  </div>
                </div>
                <Switch
                  checked={marketingEmails}
                  onCheckedChange={setMarketingEmails}
                />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Palette,
      content: (
        <div className="space-y-6">
          <div className="space-y-4">
            <h4 className="font-semibold">Theme Preferences</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {theme === 'dark' ? (
                  <Moon className="h-5 w-5 text-primary" />
                ) : (
                  <Sun className="h-5 w-5 text-accent" />
                )}
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">
                    {theme === 'dark' ? 'Currently using dark theme' : 'Switch to dark theme'}
                  </p>
                </div>
              </div>
              <Switch
                checked={theme === 'dark'}
                onCheckedChange={toggleTheme}
              />
            </div>
          </div>
        </div>
      )
    }
  ];

  const [activeSection, setActiveSection] = useState('profile');

  return (
    <DashboardLayout>
      <section className="mx-auto max-w-7xl py-6 md:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Settings Navigation */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass-card rounded-2xl p-6 sticky top-16 md:top-20">
              <h2 className="text-xl font-bold font-crypto mb-6">Settings</h2>
              <nav className="space-y-2">
                {settingSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeSection === section.id
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'hover:bg-muted/30 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <section.icon className="h-5 w-5" />
                    <span className="font-medium">{section.title}</span>
                  </button>
                ))}
              </nav>
            </div>
          </motion.div>

          {/* Settings Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3"
          >
            <div className="glass-card rounded-2xl p-8 crypto-shadow">
              {settingSections.map((section) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: activeSection === section.id ? 1 : 0,
                    display: activeSection === section.id ? 'block' : 'none'
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="flex items-center space-x-3 mb-8">
                    <section.icon className="h-8 w-8 text-primary" />
                    <h2 className="text-3xl font-bold font-crypto">{section.title}</h2>
                  </div>
                  {section.content}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </DashboardLayout>
  );
};

export default Settings;