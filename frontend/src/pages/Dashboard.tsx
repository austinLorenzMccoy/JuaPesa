import { BalanceOverview } from "@/components/ui/balance-overview";
import { CryptoCard } from "@/components/ui/crypto-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownLeft, Plus, Send, Calendar, TrendingUp, Activity } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { mockTransactions } from "@/mocks/data";

const Dashboard = () => {
  const recentTransactions = mockTransactions;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-12">
        {/* Welcome Section */}
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Welcome back, John!
            </h1>
            <p className="text-xl text-muted-foreground">Manage your financial future with JuaPesa</p>
          </div>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-secondary" />
              <span>Last login: Today, 9:24 AM</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-secondary" />
              <span>Portfolio up 12.3% this month</span>
            </div>
          </div>
        </div>

        {/* Balance Overview */}
        <BalanceOverview />

        {/* Quick Actions */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Button size="xl" className="h-24 flex-col space-y-3 gradient-primary text-white hover:shadow-xl hover:shadow-primary/25 transition-all duration-300 rounded-2xl group">
              <Plus className="h-7 w-7 group-hover:scale-110 transition-transform" />
              <span className="font-medium">Apply for Loan</span>
            </Button>
            <Button variant="outline" size="xl" className="h-24 flex-col space-y-3 border-white/20 hover:bg-white/5 rounded-2xl group">
              <ArrowUpRight className="h-7 w-7 text-secondary group-hover:scale-110 transition-transform" />
              <span className="font-medium">Deposit</span>
            </Button>
            <Button variant="outline" size="xl" className="h-24 flex-col space-y-3 border-white/20 hover:bg-white/5 rounded-2xl group">
              <ArrowDownLeft className="h-7 w-7 text-primary group-hover:scale-110 transition-transform" />
              <span className="font-medium">Withdraw</span>
            </Button>
            <Button variant="outline" size="xl" className="h-24 flex-col space-y-3 border-white/20 hover:bg-white/5 rounded-2xl group">
              <Send className="h-7 w-7 text-secondary group-hover:scale-110 transition-transform" />
              <span className="font-medium">Transfer</span>
            </Button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Loan Status */}
          <Card className="glass-card border-border/50 hover:border-primary/20 transition-all duration-300">
            <CardHeader className="space-y-4">
              <CardTitle className="text-foreground text-xl flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <span>Active Loan</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Loan Amount</span>
                  <span className="text-2xl font-bold">KSH 15,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Paid</span>
                  <span className="text-secondary font-semibold">KSH 3,000</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Remaining</span>
                  <span className="text-foreground font-bold">KSH 12,000</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="w-full bg-muted/30 rounded-full h-3">
                  <div className="bg-gradient-to-r from-secondary to-primary h-3 rounded-full transition-all duration-500" style={{ width: '20%' }}></div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>20% paid</span>
                  <span>80% remaining</span>
                </div>
              </div>
              
              <div className="p-4 rounded-xl bg-muted/20 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Next payment</span>
                  <span className="text-primary font-semibold">KSH 1,500</span>
                </div>
                <div className="text-sm text-muted-foreground">Due: February 15, 2024</div>
              </div>
              
              <Button className="w-full gradient-primary text-white hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 rounded-xl py-3">
                Make Payment
              </Button>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="glass-card border-border/50 hover:border-primary/20 transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-foreground text-xl flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-secondary/20 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-secondary" />
                </div>
                <span>Recent Transactions</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors group">
                    <div className="flex items-center space-x-4">
                      <div className={`w-3 h-3 rounded-full ${
                        transaction.type === 'deposit' ? 'bg-secondary' :
                        transaction.type === 'loan' ? 'bg-primary' :
                        transaction.type === 'saving' ? 'bg-secondary' : 'bg-destructive'
                      }`}></div>
                      <div>
                        <p className="font-medium text-sm text-foreground group-hover:text-white transition-colors">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm ${
                        transaction.amount >= 0 ? 'text-secondary' : 'text-foreground'
                      }`}>
                        {(transaction.amount >= 0 ? '+' : '-') + transaction.currency + ' ' + Math.abs(transaction.amount).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">{transaction.status}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-6 border-white/20 hover:bg-white/5 rounded-xl">
                View All Transactions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;