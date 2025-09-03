import { CryptoCard } from "@/components/ui/crypto-card";
import { Wallet, PiggyBank, CreditCard, TrendingUp } from "lucide-react";

export const BalanceOverview = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <CryptoCard
        title="Total Balance"
        value="KSH 45,230"
        subtitle="Available funds"
        icon={<Wallet className="h-4 w-4" />}
        trend="up"
        trendValue="+12.5%"
        glowing
      />
      
      <CryptoCard
        title="Savings Balance"
        value="KSH 32,100"
        subtitle="Current savings"
        icon={<PiggyBank className="h-4 w-4" />}
        trend="up"
        trendValue="+8.2%"
      />
      
      <CryptoCard
        title="Active Loan"
        value="KSH 15,000"
        subtitle="Outstanding balance"
        icon={<CreditCard className="h-4 w-4" />}
        trend="down"
        trendValue="-5.1%"
      />
      
      <CryptoCard
        title="Monthly Growth"
        value="KSH 2,450"
        subtitle="This month"
        icon={<TrendingUp className="h-4 w-4" />}
        trend="up"
        trendValue="+15.3%"
      />
    </div>
  );
};