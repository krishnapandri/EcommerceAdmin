import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { 
  ChevronRight, 
  Home, 
  Search, 
  Bell, 
  ChevronDown,
  BarChart2,
  Package,
  Folder,
  Tag,
  ShoppingBag,
  Users,
  HandCoins,
  Headset,
  Settings,
  Menu,
  X
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const NavItem = ({ 
  href, 
  label, 
  icon, 
  active = false,
  hasSubmenu = false
}: { 
  href: string; 
  label: string; 
  icon: React.ReactNode; 
  active?: boolean;
  hasSubmenu?: boolean;
}) => {
  const [location] = useLocation();
  const isActive = active || location === href;

  return (
    <li>
      <Link href={href}>
        <a className={`flex items-center ${hasSubmenu ? 'justify-between' : 'space-x-3'} px-4 py-2.5 rounded-lg ${
          isActive 
            ? "bg-primary text-white" 
            : "text-gray-300 hover:bg-gray-700"
        } mb-1`}>
          <div className="flex items-center space-x-3">
            <span className="w-5 text-center">{icon}</span>
            <span>{label}</span>
          </div>
          {hasSubmenu && <ChevronRight className="h-4 w-4" />}
        </a>
      </Link>
    </li>
  );
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [location] = useLocation();

  // Get current page title
  const getPageTitle = () => {
    if (location === "/") return "Dashboard";
    const path = location.split("/")[1];
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div 
        className={`w-full md:w-64 bg-gray-800 text-white flex flex-col fixed md:fixed md:left-0 md:top-0 md:h-full z-40 md:z-0 transition-all duration-300 ${
          isMobile && !sidebarOpen ? "bottom-full" : "bottom-0"
        }`}
      >
        <div className="flex justify-between items-center h-16 px-4 md:px-6 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-accent" />
            <span className="font-semibold text-xl">ShopAdmin</span>
          </div>
          {isMobile && (
            <button onClick={() => setSidebarOpen(false)} className="md:hidden">
              <X className="h-6 w-6" />
            </button>
          )}
        </div>
        <div className="flex flex-col h-full overflow-y-auto py-4 px-2">
          <nav>
            <ul>
              <NavItem href="/" label="Dashboard" icon={<BarChart2 className="h-5 w-5" />} />
              <NavItem href="/products" label="Products" icon={<Package className="h-5 w-5" />} hasSubmenu />
              <NavItem href="/categories" label="Categories" icon={<Folder className="h-5 w-5" />} hasSubmenu />
              <NavItem href="/brands" label="Brands" icon={<Tag className="h-5 w-5" />} hasSubmenu />
              <NavItem href="/orders" label="Orders" icon={<ShoppingBag className="h-5 w-5" />} hasSubmenu />
              <NavItem href="/customers" label="Customers" icon={<Users className="h-5 w-5" />} />
              <NavItem href="/refunds" label="Refunds" icon={<HandCoins className="h-5 w-5" />} hasSubmenu />
              <NavItem href="/support" label="Support Tickets" icon={<Headset className="h-5 w-5" />} />
              <NavItem href="/settings" label="Site Settings" icon={<Settings className="h-5 w-5" />} />
            </ul>
          </nav>
        </div>
      </div>

      <div className="flex-1 md:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
          <div className="flex justify-between items-center h-16 px-4 md:px-6">
            <div className="flex items-center md:hidden">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSidebarOpen(true)}
                className="text-gray-500"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
            
            <div className="flex-1 max-w-xl ml-4 md:ml-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-full">
                <Bell className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-4 w-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                  5
                </span>
              </Button>
              
              <div className="relative">
                <button className="flex items-center space-x-2 focus:outline-none">
                  <Avatar>
                    <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="User avatar" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block font-medium">John Doe</span>
                  <ChevronDown className="hidden md:inline-block h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="p-4 md:p-6">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <nav className="flex" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link href="/">
                    <a className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary">
                      <Home className="mr-2 h-4 w-4" />
                      Home
                    </a>
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <ChevronRight className="text-gray-400 mx-2 h-4 w-4" />
                    <span className="text-sm font-medium text-gray-700">{getPageTitle()}</span>
                  </div>
                </li>
              </ol>
            </nav>
          </div>
          
          {children}
        </main>
      </div>
    </div>
  );
}
