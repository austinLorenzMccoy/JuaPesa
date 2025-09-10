import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Smartphone, Building, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const withdrawMethods = [
  { id: "bank", name: "Bank Account", icon: Building, description: "Transfer to your bank account" },
  { id: "mobile", name: "Mobile Money", icon: Smartphone, description: "M-Pesa, MTN Mobile Money, etc." },
  { id: "atm", name: "ATM Card", icon: CreditCard, description: "Withdraw at any ATM" },
];

const Withdraw = () => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [accountDetails, setAccountDetails] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const getAccountLabel = () => {
    switch(method) {
      case 'bank': return 'Bank Account Number';
      case 'mobile': return 'Mobile Money Number';
      case 'atm': return 'Card Number';
      default: return 'Account Details';
    }
  };

  const handleWithdraw = async () => {
    if (!amount || !method || !accountDetails) {
      toast({ title: "Missing Information", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    if (parseFloat(amount) > 50000) {
      toast({ 
        title: "Withdrawal Limit Exceeded", 
        description: "Daily withdrawal limit is ₦50,000", 
        variant: "destructive" 
      });
      return;
    }

    setIsProcessing(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({ 
      title: "Withdrawal Successful!", 
      description: `₦${amount} has been sent to your ${method === 'bank' ? 'bank account' : method === 'mobile' ? 'mobile money' : 'ATM card'}` 
    });
    
    setIsProcessing(false);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Withdraw Money</h1>
          </div>

          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle>Withdraw from Wallet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="text-center text-xl"
                />
                <p className="text-xs text-muted-foreground">Daily limit: ₦50,000</p>
              </div>

              <div className="space-y-3">
                <Label>Withdrawal Method</Label>
                {withdrawMethods.map((withdrawMethod) => (
                  <div
                    key={withdrawMethod.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      method === withdrawMethod.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setMethod(withdrawMethod.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <withdrawMethod.icon className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{withdrawMethod.name}</p>
                        <p className="text-sm text-muted-foreground">{withdrawMethod.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {method && (
                <div className="space-y-2">
                  <Label htmlFor="account">{getAccountLabel()}</Label>
                  <Input
                    id="account"
                    value={accountDetails}
                    onChange={(e) => setAccountDetails(e.target.value)}
                    placeholder={`Enter your ${getAccountLabel().toLowerCase()}`}
                  />
                </div>
              )}

              <Button 
                onClick={handleWithdraw} 
                className="w-full gradient-primary"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Withdraw ₦${amount || '0'}`
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Withdraw;