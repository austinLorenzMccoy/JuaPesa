import React, { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Send, CheckCircle, Phone, DollarSign, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

const africanCountries = [
  { code: "NG", name: "Nigeria", currency: "NGN" },
  { code: "KE", name: "Kenya", currency: "KES" },
  { code: "GH", name: "Ghana", currency: "GHS" },
  { code: "ZA", name: "South Africa", currency: "ZAR" },
  { code: "UG", name: "Uganda", currency: "UGX" },
  { code: "TZ", name: "Tanzania", currency: "TZS" },
  { code: "RW", name: "Rwanda", currency: "RWF" },
  { code: "ET", name: "Ethiopia", currency: "ETB" },
  { code: "EG", name: "Egypt", currency: "EGP" },
  { code: "MA", name: "Morocco", currency: "MAD" },
];

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  recipient: string;
  recipientPhone: string;
  country: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'failed';
  fee: number;
}

const africanBanks = [
  "FirstBank Nigeria",
  "GTBank", 
  "MTN Mobile Money",
  "UBA (United Bank for Africa)",
  "Access Bank",
  "Zenith Bank",
  "Airtel Money",
  "Equity Bank",
  "KCB Bank",
  "Safaricom M-Pesa"
];

const Transfer = () => {
  const [step, setStep] = useState<'ussd' | 'amount' | 'bank' | 'country' | 'confirm' | 'phone' | 'success'>('ussd');
  const [ussdCode, setUssdCode] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showBankError, setShowBankError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const fee = 0.05;
  const country = africanCountries.find(c => c.code === selectedCountry);

  const handleUSSDDial = () => {
    if (ussdCode === '*789#') {
      setStep('amount');
      toast({ title: "USSD Connected", description: "Welcome to JuaPesa Transfer Service" });
    } else {
      toast({ 
        title: "Invalid USSD Code", 
        description: "Please dial *789# to access transfer service",
        variant: "destructive"
      });
    }
  };

  const handleAmountSubmit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({ title: "Invalid Amount", description: "Please enter a valid amount", variant: "destructive" });
      return;
    }
    setStep('bank');
  };

  const handleBankSelect = () => {
    if (!selectedBank) {
      toast({ title: "Select Bank", description: "Please select a bank to charge from", variant: "destructive" });
      return;
    }
    
    // Check if amount exceeds bank limit
    if (parseFloat(amount) > 500000) {
      setShowBankError(true);
      return;
    }
    
    setStep('country');
  };

  const handleBankSwitch = () => {
    setShowBankError(false);
    // Reset bank selection to allow user to choose another bank
    setSelectedBank('');
  };

  const handleCountrySelect = () => {
    if (!selectedCountry) {
      toast({ title: "Select Country", description: "Please select a destination country", variant: "destructive" });
      return;
    }
    setStep('phone');
  };

  const handleConfirmTransfer = () => {
    setShowConfirmDialog(true);
  };

  const handleProceedTransfer = () => {
    setShowConfirmDialog(false);
    setStep('confirm');
  };

  const handlePhoneSubmit = () => {
    if (!recipientPhone) {
      toast({ title: "Phone Required", description: "Please enter recipient's phone number", variant: "destructive" });
      return;
    }
    setStep('confirm');
  };

  const handleFinalTransfer = async () => {
    setIsProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const newTransaction: Transaction = {
      id: Date.now().toString(),
      amount: parseFloat(amount),
      currency: country?.currency || 'USD',
      recipient: recipientPhone,
      recipientPhone,
      country: country?.name || '',
      timestamp: new Date().toISOString(),
      status: 'completed',
      fee: fee
    };
    
    // Get existing transactions
    const existingTransactions = JSON.parse(localStorage.getItem('jua_pesa_transactions') || '[]');
    const updatedTransactions = [newTransaction, ...existingTransactions];
    
    setTransactions(updatedTransactions);
    localStorage.setItem('jua_pesa_transactions', JSON.stringify(updatedTransactions));
    
    setIsProcessing(false);
    setStep('success');
    
    toast({ 
      title: "Transfer Successful!", 
      description: `${country?.currency} ${amount} sent to ${recipientPhone}` 
    });
  };

  const resetTransfer = () => {
    setStep('ussd');
    setUssdCode('');
    setAmount('');
    setSelectedBank('');
    setSelectedCountry('');
    setRecipientPhone('');
    setShowBankError(false);
  };

  const goBack = () => {
    switch (step) {
      case 'amount':
        setStep('ussd');
        break;
      case 'bank':
        setStep('amount');
        break;
      case 'country':
        setStep('bank');
        break;
      case 'phone':
        setStep('country');
        break;
      case 'confirm':
        setStep('phone');
        break;
      default:
        navigate('/dashboard');
    }
  };

  // Load transactions on component mount
  React.useEffect(() => {
    const savedTransactions = localStorage.getItem('jua_pesa_transactions');
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-1 container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto">
          <div className="flex items-center mb-8">
            <Button variant="ghost" onClick={goBack} className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Transfer Money</h1>
          </div>

          <AnimatePresence mode="wait">
            {step === 'ussd' && (
              <motion.div
                key="ussd"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Phone className="h-5 w-5 text-primary" />
                      <span>Dial USSD Code</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center p-6 bg-muted/20 rounded-lg">
                      <p className="text-muted-foreground mb-4">Enter the USSD code to start transfer</p>
                      <div className="text-3xl font-mono font-bold text-primary">*789#</div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ussd">Enter USSD Code</Label>
                      <Input
                        id="ussd"
                        value={ussdCode}
                        onChange={(e) => setUssdCode(e.target.value)}
                        placeholder="*789#"
                        className="text-center text-lg font-mono"
                      />
                    </div>
                    
                    <Button onClick={handleUSSDDial} className="w-full gradient-primary">
                      <Phone className="h-4 w-4 mr-2" />
                      Dial
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 'bank' && (
              <motion.div
                key="bank"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <span>Select Bank</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground text-sm">Where do you want to be charged from?</p>
                    
                    <div className="space-y-2">
                      <Label>Choose Bank/Payment Method</Label>
                      <Select value={selectedBank} onValueChange={setSelectedBank}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a bank or payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          {africanBanks.map((bank) => (
                            <SelectItem key={bank} value={bank}>
                              {bank}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button onClick={handleBankSelect} className="w-full gradient-primary">
                      Continue
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 'amount' && (
              <motion.div
                key="amount"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5 text-primary" />
                      <span>Enter Amount</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount to Send</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="text-center text-xl"
                        step="0.01"
                      />
                    </div>
                    
                    <Button onClick={handleAmountSubmit} className="w-full gradient-primary">
                      Continue
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 'country' && (
              <motion.div
                key="country"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span>Select Destination</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Destination Country</Label>
                      <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a country" />
                        </SelectTrigger>
                        <SelectContent>
                          {africanCountries.map((country) => (
                            <SelectItem key={country.code} value={country.code}>
                              {country.name} ({country.currency})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button onClick={handleCountrySelect} className="w-full gradient-primary">
                      Continue
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 'confirm' && (
              <motion.div
                key="confirm"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <CardTitle>Confirm Transfer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3 p-4 bg-muted/20 rounded-lg">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Amount:</span>
                        <span className="font-medium">{country?.currency} {amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bank:</span>
                        <span className="font-medium">{selectedBank}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Destination:</span>
                        <span className="font-medium">{country?.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Recipient:</span>
                        <span className="font-medium">{recipientPhone}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Transfer Fee:</span>
                        <span className="font-medium">$0.05</span>
                      </div>
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>{country?.currency} {amount} + $0.05</span>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                      <p className="text-sm text-yellow-300">
                        You will be charged a fee of $0.05. Continue with transfer?
                      </p>
                    </div>
                    
                    <div className="flex space-x-3">
                      <Button variant="outline" onClick={goBack} className="flex-1">
                        No, Go Back
                      </Button>
                      <Button 
                        onClick={handleFinalTransfer} 
                        className="flex-1 gradient-primary"
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <div className="flex items-center space-x-2">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                            <span>Processing...</span>
                          </div>
                        ) : (
                          'Yes, Send Money'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 'phone' && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <Card className="glass-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Phone className="h-5 w-5 text-primary" />
                      <span>Recipient Details</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="recipientPhone">Recipient Phone Number</Label>
                      <Input
                        id="recipientPhone"
                        type="tel"
                        value={recipientPhone}
                        onChange={(e) => setRecipientPhone(e.target.value)}
                        placeholder="+234 XXX XXX XXXX"
                      />
                    </div>
                    
                    <Button 
                      onClick={handlePhoneSubmit} 
                      className="w-full gradient-primary"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Continue
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <Card className="glass-card border-border/50 text-center">
                  <CardContent className="pt-8 space-y-6">
                    <div className="flex justify-center">
                      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                    </div>
                    
                    <div>
                      <h2 className="text-2xl font-bold text-green-500 mb-2">Transfer Successful!</h2>
                      <p className="text-muted-foreground">
                        {country?.currency} {amount} has been successfully sent to {recipientPhone}
                      </p>
                      <p className="text-sm text-green-400 mt-2">
                        Money sent successfully via {selectedBank}
                      </p>
                    </div>
                    
                    <div className="space-y-3">
                      <Button onClick={() => navigate('/dashboard')} className="w-full gradient-primary">
                        Back to Dashboard
                      </Button>
                      <Button onClick={resetTransfer} variant="outline" className="w-full">
                        Send Another Transfer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recent Transactions */}
          {transactions.length > 0 && (
            <Card className="glass-card border-border/50 mt-8">
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {transactions.slice(0, 3).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <div>
                          <p className="font-medium text-sm">Sent to {transaction.recipientPhone}</p>
                          <p className="text-xs text-muted-foreground">{transaction.country}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-sm">-{transaction.currency} {transaction.amount}</p>
                        <p className="text-xs text-muted-foreground">Completed</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Bank Error Dialog */}
      <Dialog open={showBankError} onOpenChange={setShowBankError}>
        <DialogContent className="sm:max-w-md glass-card border-border/50">
          <DialogHeader>
            <DialogTitle>Insufficient Balance</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-center p-6 bg-red-500/20 rounded-lg border border-red-500/30">
              <p className="text-red-400 mb-2">Your account in {selectedBank} is too low to make this transfer.</p>
              <p className="text-sm text-muted-foreground">Try other banks?</p>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" onClick={() => setShowBankError(false)} className="flex-1">
                Cancel Transfer
              </Button>
              <Button onClick={handleBankSwitch} className="flex-1 gradient-primary">
                Choose Another Bank
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default Transfer;