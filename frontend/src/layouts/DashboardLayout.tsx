import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, LayoutDashboard, PiggyBank, HandCoins, History, Settings } from "lucide-react";
import juapesaLogo from "/photo-uploads/773bff5d-7a85-4680-989f-75002bbc3dc9.png";
import { PropsWithChildren } from "react";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/loans", label: "Loans", icon: HandCoins },
  { to: "/savings", label: "Savings", icon: PiggyBank },
  { to: "/history", label: "History", icon: History },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: PropsWithChildren) {
  const location = useLocation();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader className="px-3 py-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={juapesaLogo} className="w-8 h-8 rounded-md" alt="JuaPesa" />
            <span className="font-bold text-lg">JuaPesa</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarMenu>
              {nav.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.to}>
                    <Link to={item.to} className="flex items-center gap-2">
                      <item.icon className="shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background/80 backdrop-blur px-4">
          <SidebarTrigger />
          <div className="ml-auto flex items-center gap-2">
            <Button asChild variant="outline" size="sm" className={cn("rounded-xl")}> 
              <Link to="/" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Link>
            </Button>
          </div>
        </div>
        <div className="p-4 md:p-6 lg:p-8">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
