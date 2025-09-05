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
  TrendingUp, 
  Clock, 
  Shield, 
  Calculator,
  CheckCircle,
  DollarSign,
  CreditCard,
  Smartphone,
  Zap
} from "lucide-react";

const Loans = () => {
  const [loanAmount, setLoanAmount] = useState('');
  const [loanTerm, setLoanTerm] = useState('3');

  const loanProducts = [
    {
      name: "Quick Cash",
      maxAmount: "KSH 10,000",
      duration: "1-7 days",
      rate: "0.5% daily",
      description: "Instant micro-loans for urgent needs",
      color: "primary",
      features: ["Instant approval", "No collateral", "USSD access"]
    },
    {
      name: "Smart Loan",
      maxAmount: "KSH 100,000", 
      duration: "1-12 months",
      rate: "12-18% APR",
      description: "AI-powered loans based on your transaction history",
      color: "secondary",
      features: ["AI credit scoring", "Flexible terms", "Lower rates"]
    },
    {
      name: "Business Boost",
      maxAmount: "KSH 500,000",
      duration: "3-24 months", 
      rate: "15-22% APR",
      description: "Grow your business with our merchant loans",
      color: "accent",
      features: ["Business analytics", "Payment integration", "Growth insights"]
    }
  ];

  const recentApplications = [
    { id: "1", amount: "KSH 25,000", status: "approved", date: "2024-01-15", type: "Smart Loan" },
    { id: "2", amount: "KSH 5,000", status: "disbursed", date: "2024-01-10", type: "Quick Cash" },
    { id: "3", amount: "KSH 50,000", status: "pending", date: "2024-01-14", type: "Business Boost" }
  ];

  const calculateInterest = () => {
    const principal = parseFloat(loanAmount) || 0;
    const months = parseInt(loanTerm);
    const rate = 0.15; // 15% annual rate
    const monthlyRate = rate / 12;
    const monthlyPayment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    return isNaN(monthlyPayment) ? 0 : monthlyPayment;
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
              Smart <span className="gradient-primary bg-clip-text text-transparent">Loans</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              AI-powered lending with instant approvals, competitive rates, and flexible terms. 
              Get the funds you need, when you need them.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <span>Instant approval in minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-secondary" />
                <span>Bank-level security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Smartphone className="h-5 w-5 text-accent" />
                <span>USSD & App access</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Loan Calculator */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8 mb-16 crypto-shadow"
        >
          <div className="flex items-center space-x-3 mb-6">
            <Calculator className="h-8 w-8 text-primary" />
            <h2 className="text-3xl font-bold font-crypto">Loan Calculator</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="amount" className="text-lg font-medium mb-2 block">Loan Amount (KSH)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="text-lg h-12 glass-card border-border/50"
                />
              </div>
              
              <div>
                <Label htmlFor="term" className="text-lg font-medium mb-2 block">
                  Loan Term: {loanTerm} months
                </Label>
                <input
                  id="term"
                  type="range"
                  min="1"
                  max="24"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-muted-foreground mt-1">
                  <span>1 month</span>
                  <span>24 months</span>
                </div>
              </div>
            </div>
            
            <div className="glass-card-light rounded-2xl p-6">
              <h3 className="text-xl font-semibold mb-4 font-crypto">Loan Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Principal Amount:</span>
                  <span className="font-semibold">KSH {Number(loanAmount).toLocaleString() || '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interest Rate:</span>
                  <span className="font-semibold">15% APR</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Term:</span>
                  <span className="font-semibold">{loanTerm} months</span>
                </div>
                <div className="border-t border-border/50 pt-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Monthly Payment:</span>
                    <span className="font-bold text-primary">
                      KSH {calculateInterest().toLocaleString('en-US', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>
              <Button className="w-full mt-6 gradient-primary click-scale">
                Apply for This Loan
              </Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Loan Products */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold font-crypto mb-6">Choose Your Loan</h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
            Multiple loan products designed for different needs and financial situations
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {loanProducts.map((product, index) => (
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

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Max Amount:</span>
                  <span className="font-semibold text-primary">{product.maxAmount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-semibold">{product.duration}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Interest Rate:</span>
                  <span className="font-semibold text-secondary">{product.rate}</span>
                </div>
              </div>

              <div className="space-y-2 mb-6">
                {product.features.map((feature, i) => (
                  <div key={i} className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-secondary" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              <Button className="w-full gradient-primary click-scale">
                Apply Now
              </Button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recent Applications */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8"
        >
          <h2 className="text-3xl font-bold font-crypto mb-8">Recent Applications</h2>
          
          <div className="space-y-4">
            {recentApplications.map((app) => (
              <div key={app.id} className="glass-card-light rounded-xl p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold">{app.amount}</div>
                    <div className="text-sm text-muted-foreground">{app.type}</div>
                  </div>
                </div>
                
                <div className="text-right">
                  <Badge 
                    variant={app.status === 'approved' ? 'default' : app.status === 'disbursed' ? 'secondary' : 'outline'}
                    className="mb-1"
                  >
                    {app.status}
                  </Badge>
                  <div className="text-sm text-muted-foreground">{app.date}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default Loans;