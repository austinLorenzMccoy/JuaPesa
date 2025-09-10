import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CreditCard, Smartphone, Building } from "lucide-react";
import { useNavigate } from "react-router-dom";

const depositMethods = [
  { id: "bank", name: "Bank Transfer", icon: Building, description: "Transfer from your bank account" },
  { id: "mobile", name: "Mobile Money", icon: Smartphone, description: "M-Pesa, MTN Mobile Money, etc." },
  { id: "card", name: "Debit/Credit Card", icon: CreditCard, description: "Visa, Mastercard accepted" },
];

const Deposit = () => {
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDeposit = async () => {
    if (!amount || !method) {
      toast({ title: "Missing Information", description: "Please fill all fields", variant: "destructive" });
      return;
    }

    setIsProcessing(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast({ 
      title: "Deposit Successful!", 
      description: `₦${amount} has been added to your account` 
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
            <h1 className="text-2xl font-bold">Deposit Money</h1>
          </div>

          <Card className="glass-card border-border/50">
            <CardHeader>
              <CardTitle>Add Money to Wallet</CardTitle>
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
              </div>

              <div className="space-y-3">
                <Label>Deposit Method</Label>
                {depositMethods.map((depositMethod) => (
                  <div
                    key={depositMethod.id}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      method === depositMethod.id 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setMethod(depositMethod.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <depositMethod.icon className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{depositMethod.name}</p>
                        <p className="text-sm text-muted-foreground">{depositMethod.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Button 
                onClick={handleDeposit} 
                className="w-full gradient-primary"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Deposit ₦${amount || '0'}`
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

export default Deposit;