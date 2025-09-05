import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  PiggyBank, 
  TrendingUp, 
  Target,
  Calendar,
  Shield,
  Zap,
  ChartBar,
  Award,
  Star,
  Plus
} from "lucide-react";

const Savings = () => {
  const [savingsAmount, setSavingsAmount] = useState('');
  const [savingsPeriod, setSavingsPeriod] = useState('12');

  const savingsProducts = [
    {
      name: "Flex Save",
      apy: "6-8%",
      minAmount: "KSH 100",
      description: "Flexible savings with daily withdrawals",
      color: "primary",
      features: ["Daily access", "No lock-in period", "Mobile money integration"],
      risk: "Low"
    },
    {
      name: "Smart Goal",
      apy: "10-12%",
      minAmount: "KSH 1,000",
      description: "Goal-based savings with AI insights",
      color: "secondary", 
      features: ["Goal tracking", "AI recommendations", "Higher returns"],
      risk: "Low-Medium"
    },
    {
      name: "Crypto Yield",
      apy: "15-25%",
      minAmount: "KSH 5,000",
      description: "Stablecoin yields with DeFi protocols",
      color: "accent",
      features: ["DeFi yields", "Automated strategies", "Compound interest"],
      risk: "Medium"
    }
  ];

  const savingsGoals = [
    { name: "Emergency Fund", target: 50000, current: 32500, progress: 65, daysLeft: 45 },
    { name: "Holiday Trip", target: 80000, current: 24000, progress: 30, daysLeft: 120 },
    { name: "New Phone", target: 15000, current: 12000, progress: 80, daysLeft: 10 }
  ];

  const calculateReturns = () => {
    const principal = parseFloat(savingsAmount) || 0;
    const months = parseInt(savingsPeriod);
    const annualRate = 0.1; // 10% APY
    const compoundFrequency = 12; // Monthly compounding
    
    const amount = principal * Math.pow(1 + (annualRate / compoundFrequency), compoundFrequency * (months / 12));
    const interest = amount - principal;
    
    return { finalAmount: amount, interest: interest };
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-24">
        <div className="hero-glow absolute inset-0" />
        <div className="container mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-6xl font-bold font-crypto mb-6">
              Smart <span className="gradient-secondary bg-clip-text text-transparent">Savings</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Grow your wealth with AI-powered savings products. Earn up to 25% APY with 
              automated strategies and goal-based planning.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <PiggyBank className="h-5 w-5 text-primary" />
                <span>Automated savings</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-secondary" />
                <span>Insured deposits</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                <span>High yield returns</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Savings Calculator */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8 mb-16 crypto-shadow"
        >
          <div className="flex items-center space-x-3 mb-6">
            <ChartBar className="h-8 w-8 text-secondary" />
            <h2 className="text-3xl font-bold font-crypto">Savings Calculator</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="savings-amount" className="text-lg font-medium mb-2 block">
                  Monthly Savings (KSH)
                </Label>
                <Input
                  id="savings-amount"
                  type="number"
                  value={savingsAmount}
                  onChange={(e) => setSavingsAmount(e.target.value)}
                  placeholder="Enter monthly amount"
                  className="text-lg h-12 glass-card border-border/50"
                />
              </div>
              
              <div>
                <Label htmlFor="savings-period" className="text-lg font-medium mb-2 block">
                  Savings Period: {savingsPeriod} months
                </Label>
                <input
                  id="savings-period"
                  type="range"
                  min="1"
                  max="60"
                  value={savingsPeriod}
                  onChange={(e) => setSavingsPeriod(e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>1 month</span>
                  <span>5 years</span>
                </div>
              </div>
            </div>
            
            <div className="glass-card-light rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 font-crypto">Projected Returns</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monthly Contribution:</span>
                  <span className="font-semibold">KSH {Number(savingsAmount).toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Period:</span>
                  <span className="font-semibold">{savingsPeriod} months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Expected APY:</span>
                  <span className="font-semibold text-secondary">10%</span>
                </div>
                <div className="border-t border-border/50 pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Contributions:</span>
                    <span className="font-semibold">
                      KSH {(Number(savingsAmount) * Number(savingsPeriod)).toLocaleString() || '0'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Interest Earned:</span>
                    <span className="font-semibold text-accent">
                      KSH {calculateReturns().interest.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Final Amount:</span>
                    <span className="font-bold text-primary">
                      KSH {calculateReturns().finalAmount.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-6 gradient-secondary click-scale">
                Start Saving Now
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Savings Products */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold font-crypto mb-6">Savings Products</h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            Choose from multiple savings products tailored to your financial goals and risk appetite
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {savingsProducts.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02 }}
              className="glass-card rounded-3xl p-8 crypto-shadow hover:crypto-shadow-hover transition-all duration-300"
            >
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold font-crypto mb-2">{product.name}</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              <div className="text-center mb-6">
                <div className="text-4xl font-bold font-crypto text-secondary mb-2">
                  {product.apy}
                </div>
                <div className="text-sm text-muted-foreground">Expected Annual Yield</div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Minimum:</span>
                  <span className="font-semibold">{product.minAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Risk Level:</span>
                  <Badge variant="outline" className="text-accent">
                    {product.risk}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {product.features.map((feature, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-secondary" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button className="w-full gradient-secondary click-scale">
                Start Saving
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Savings Goals */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Target className="h-8 w-8 text-accent" />
              <h2 className="text-3xl font-bold font-crypto">Savings Goals</h2>
            </div>
            <Button className="gradient-accent click-scale">
              <Plus className="h-4 w-4 mr-2" />
              Add Goal
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savingsGoals.map((goal, index) => (
              <motion.div
                key={goal.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card-light rounded-xl p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">{goal.name}</h3>
                  <Badge variant="outline" className="text-accent">
                    {goal.daysLeft} days left
                  </Badge>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-semibold">{goal.progress}%</span>
                  </div>
                  <Progress value={goal.progress} className="h-3" />
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    KSH {goal.current.toLocaleString()}
                  </span>
                  <span className="font-semibold">
                    KSH {goal.target.toLocaleString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Savings;