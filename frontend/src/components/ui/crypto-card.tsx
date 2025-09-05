import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CryptoCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
  glowing?: boolean;
}

export const CryptoCard = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  className,
  glowing = false
}: CryptoCardProps) => {
  const trendColors = {
    up: "text-secondary",
    down: "text-destructive",
    neutral: "text-muted-foreground"
  };

  return (
    <Card className={cn(
      "glass-card border-border/50 transition-all duration-300 hover:border-primary/50",
      glowing && "crypto-shadow",
      className
    )}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-primary">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
        {trend && trendValue && (
          <div className={cn("text-xs font-medium", trendColors[trend])}>
            {trend === "up" && "↗"} {trend === "down" && "↘"} {trendValue}
          </div>
        )}
      </CardContent>
    </Card>
  );
};