import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { CryptoCard } from "@/components/ui/crypto-card";
import { AuthModal } from "@/components/auth/AuthModal";
import { Shield, Zap, Users, TrendingUp, CheckCircle, ArrowRight, Star } from "lucide-react";
import { motion } from "framer-motion";

const Index = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Floating Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div 
            className="floating-orb absolute top-20 left-10 w-64 h-64 opacity-20"
            animate={{ 
              y: [0, -20, 0],
              x: [0, 10, 0],
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="floating-orb absolute bottom-32 right-20 w-48 h-48 opacity-15"
            animate={{ 
              y: [0, 20, 0],
              x: [0, -15, 0],
              scale: [1, 0.9, 1]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          />
          <motion.div 
            className="floating-orb absolute top-1/2 left-1/3 w-32 h-32 opacity-25"
            animate={{ 
              rotate: [0, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        </div>
        <div className="hero-glow absolute inset-0" />
        <div className="container mx-auto px-6 py-32 text-center relative z-10">
          <div className="space-y-10 max-w-5xl mx-auto">
            <div className="space-y-6">
              <h1 className="text-6xl md:text-7xl font-bold leading-[1.1] tracking-tight">
                Smart Financial Access for{" "}
                <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                  Everyone
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                AI-powered liquidity network enabling instant, low-cost cross-wallet transfers across African mobile money rails. 
                Connect M-Pesa, MTN, Airtel Money through stablecoin pools with sub-$0.10 fees.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                size="xl" 
                className="gradient-primary text-white hover:shadow-xl hover:shadow-primary/25 transition-all duration-500 rounded-2xl px-12 py-6 text-lg font-semibold group"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                className="border-white/20 text-white hover:bg-white/10 rounded-2xl px-12 py-6 text-lg font-medium backdrop-blur-sm"
                onClick={() => window.open('https://docs.lovable.dev/features/visual-edit', '_blank')}
              >
                Watch Demo
              </Button>
            </div>

            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground pt-8">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary border-2 border-background" />
                  ))}
                </div>
                <span>50,000+ users</span>
              </div>
              <div className="flex items-center space-x-1">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="ml-1">4.9/5 rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose JuaPesa?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            AI-powered liquidity network for instant, low-cost cross-wallet transfers across African mobile money systems
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <CryptoCard
            title="USSD Bridge"
            value="Dial *789#"
            subtitle="Convert mobile money to stablecoins instantly"
            icon={<Zap className="h-6 w-6" />}
            glowing
            className="hover:scale-105 transition-transform duration-300"
          />
          <CryptoCard
            title="AI Liquidity Router"
            value="<15s transfers"
            subtitle="AI predicts cash flows for optimal routing"
            icon={<TrendingUp className="h-6 w-6" />}
            className="hover:scale-105 transition-transform duration-300"
          />
          <CryptoCard
            title="Cross-Chain Settlement"
            value="Sub-$0.10 fees"
            subtitle="Hedera + Circle CCTP for fast settlement"
            icon={<Shield className="h-6 w-6" />}
            className="hover:scale-105 transition-transform duration-300"
          />
          <CryptoCard
            title="Mobile Money Rails"
            value="M-Pesa, MTN, Airtel"
            subtitle="Connect all major African mobile money"
            icon={<Users className="h-6 w-6" />}
            className="hover:scale-105 transition-transform duration-300"
          />
        </div>
      </section>

      {/* How it Works */}
      <section className="container mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-muted-foreground text-lg">
            Experience the future of cross-wallet transfers in Africa
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
          {[
            {
              step: "1",
              title: "Dial *789#",
              description: "Access the USSD gateway from any phone to start cross-wallet transfers"
            },
            {
              step: "2", 
              title: "Convert Currency",
              description: "AI routes your mobile money through stablecoin pools (cNGN, USDC, XAUt)"
            },
            {
              step: "3",
              title: "Instant Settlement", 
              description: "Funds arrive in seconds via Hedera blockchain and Circle CCTP"
            }
          ].map((item, index) => (
            <div key={index} className="text-center space-y-6 group">
              <div className="relative">
                <div className="w-20 h-20 mx-auto gradient-primary rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform duration-300">
                  {item.step}
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-10 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
              </div>
              <h3 className="text-xl font-semibold">{item.title}</h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-6 py-20">
        <div className="glass-card rounded-3xl p-12 text-center max-w-4xl mx-auto crypto-shadow">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform African Finance?
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
            Join the AI liquidity network saving $400M/year in failed interoperability fees. 
            Enable 10-second cross-wallet transfers today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Button 
              size="xl" 
              className="gradient-primary text-white hover:shadow-xl hover:shadow-primary/25 transition-all duration-500 rounded-2xl px-12 py-6 text-lg font-semibold"
              onClick={() => setIsAuthModalOpen(true)}
            >
              Create Account
            </Button>
            <Button 
              variant="outline" 
              size="xl" 
              className="border-white/20 text-white hover:bg-white/10 rounded-2xl px-12 py-6 text-lg font-medium"
              onClick={() => window.open('https://docs.lovable.dev', '_blank')}
            >
              Learn More
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: CheckCircle, text: "No hidden fees" },
              { icon: CheckCircle, text: "Instant approval" },
              { icon: CheckCircle, text: "24/7 support" }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-center space-x-3">
                <item.icon className="h-6 w-6 text-secondary" />
                <span className="text-lg">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default Index;