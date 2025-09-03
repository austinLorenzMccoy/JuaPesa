import { useState } from "react";
import { Navigation } from "@/components/ui/navigation";
import { Footer } from "@/components/ui/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";
import { 
  History as HistoryIcon,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  CreditCard,
  Smartphone,
  TrendingUp,
  Calendar
} from "lucide-react";

const History = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const transactions = [
    {
      id: "TXN001",
      type: "loan_disbursement", 
      amount: 25000,
      description: "Smart Loan - Business Expansion",
      date: "2024-01-15T10:30:00",
      status: "completed",
      method: "m-pesa",
      reference: "MPP123456789"
    },
    {
      id: "TXN002",
      type: "savings_deposit",
      amount: 5000,
      description: "Goal Save - Emergency Fund",
      date: "2024-01-14T14:20:00", 
      status: "completed",
      method: "bank_transfer",
      reference: "BT987654321"
    },
    {
      id: "TXN003",
      type: "loan_repayment",
      amount: -3500,
      description: "Loan Repayment - Quick Cash",
      date: "2024-01-13T09:15:00",
      status: "completed", 
      method: "auto_debit",
      reference: "AD456789123"
    },
    {
      id: "TXN004",
      type: "savings_withdrawal",
      amount: -1200,
      description: "Emergency Withdrawal - Medical",
      date: "2024-01-12T16:45:00",
      status: "completed",
      method: "ussd",
      reference: "USSD789123456"
    },
    {
      id: "TXN005", 
      type: "transfer",
      amount: -800,
      description: "Transfer to John Doe",
      date: "2024-01-11T11:30:00",
      status: "pending",
      method: "app",
      reference: "APP123789456"
    },
    {
      id: "TXN006",
      type: "crypto_yield",
      amount: 450,
      description: "Stablecoin Yield - USDC Pool",
      date: "2024-01-10T08:00:00",
      status: "completed",
      method: "defi",
      reference: "DEFI456123789"
    }
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'loan_disbursement':
      case 'savings_deposit':
      case 'crypto_yield':
        return <ArrowDownLeft className="h-5 w-5 text-secondary" />;
      case 'loan_repayment':
      case 'savings_withdrawal':
      case 'transfer':
        return <ArrowUpRight className="h-5 w-5 text-destructive" />;
      default:
        return <CreditCard className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'm-pesa':
      case 'ussd':
        return <Smartphone className="h-4 w-4" />;
      case 'bank_transfer':
        return <CreditCard className="h-4 w-4" />;
      case 'defi':
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const formatAmount = (amount: number) => {
    const isPositive = amount > 0;
    return {
      value: `KSH ${Math.abs(amount).toLocaleString()}`,
      isPositive
    };
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString(),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const filteredTransactions = transactions.filter(txn => {
    const matchesSearch = txn.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         txn.reference.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || txn.type === filterType;
    const matchesStatus = filterStatus === 'all' || txn.status === filterStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalInflow = transactions
    .filter(txn => txn.amount > 0)
    .reduce((sum, txn) => sum + txn.amount, 0);

  const totalOutflow = transactions
    .filter(txn => txn.amount < 0)
    .reduce((sum, txn) => sum + Math.abs(txn.amount), 0);

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
              Transaction <span className="gradient-accent bg-clip-text text-transparent">History</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Track all your financial activities in one place. View loans, savings, transfers, 
              and crypto yields with detailed insights.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Summary Cards */}
      <section className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="glass-card rounded-2xl p-6 crypto-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl gradient-secondary flex items-center justify-center">
                  <ArrowDownLeft className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold font-crypto">Total Inflow</h3>
                  <p className="text-sm text-muted-foreground">Money received</p>
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-secondary">
              KSH {totalInflow.toLocaleString()}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-2xl p-6 crypto-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <ArrowUpRight className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold font-crypto">Total Outflow</h3>
                  <p className="text-sm text-muted-foreground">Money sent</p>
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-destructive">
              KSH {totalOutflow.toLocaleString()}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card rounded-2xl p-6 crypto-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl gradient-accent flex items-center justify-center">
                  <HistoryIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold font-crypto">Transactions</h3>
                  <p className="text-sm text-muted-foreground">This month</p>
                </div>
              </div>
            </div>
            <div className="text-2xl font-bold text-accent">
              {transactions.length}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="container mx-auto px-6 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 glass-card border-border/50"
              />
            </div>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48 glass-card border-border/50">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="loan_disbursement">Loan Disbursement</SelectItem>
                <SelectItem value="loan_repayment">Loan Repayment</SelectItem>
                <SelectItem value="savings_deposit">Savings Deposit</SelectItem>
                <SelectItem value="savings_withdrawal">Savings Withdrawal</SelectItem>
                <SelectItem value="transfer">Transfer</SelectItem>
                <SelectItem value="crypto_yield">Crypto Yield</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48 glass-card border-border/50">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="glass-card border-border/50 click-scale">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Transaction List */}
      <section className="container mx-auto px-6 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6"
        >
          <div className="space-y-4">
            {filteredTransactions.map((transaction, index) => {
              const amount = formatAmount(transaction.amount);
              const dateTime = formatDate(transaction.date);
              
              return (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="glass-card-light rounded-xl p-6 hover:border-primary/30 transition-all duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-xl glass-card border border-border/50 flex items-center justify-center">
                        {getTransactionIcon(transaction.type)}
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {transaction.description}
                        </h3>
                        <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                          <span>{transaction.reference}</span>
                          <div className="flex items-center space-x-1">
                            {getMethodIcon(transaction.method)}
                            <span className="capitalize">{transaction.method.replace('_', ' ')}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-lg font-bold font-crypto ${
                        amount.isPositive ? 'text-secondary' : 'text-destructive'
                      }`}>
                        {amount.isPositive ? '+' : '-'}{amount.value}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>{dateTime.date}</span>
                        <span>{dateTime.time}</span>
                      </div>
                      <Badge 
                        variant={transaction.status === 'completed' ? 'default' : 
                                transaction.status === 'pending' ? 'secondary' : 'destructive'}
                        className="mt-1"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-12">
              <HistoryIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No transactions found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </motion.div>
      </section>

      <Footer />
    </div>
  );
};

export default History;