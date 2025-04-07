import * as React from "react";
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
  X,
  ExternalLink,
  Store
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface SimpleNavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
}

// Simple nav item without submenu
const SimpleNavItem = ({ href, label, icon, isActive }: SimpleNavItemProps) => (
  <li>
    <Link href={href}>
      <div className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg cursor-pointer ${
        isActive 
          ? "bg-primary text-white" 
          : "text-gray-300 hover:bg-gray-700"
      } mb-1`}>
        <span className="w-5 text-center">{icon}</span>
        <span>{label}</span>
      </div>
    </Link>
  </li>
);

interface SubmenuNavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  submenuItems: Array<{label: string, href: string}>;
  isActive: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

// Submenu nav item
const SubmenuNavItem = ({ 
  href, 
  label, 
  icon, 
  submenuItems,
  isActive,
  isExpanded,
  onToggle
}: SubmenuNavItemProps) => {
  const [location] = useLocation();
  
  return (
    <li>
      <div>
        <button 
          onClick={onToggle}
          className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg ${
            isActive 
              ? "bg-primary text-white" 
              : "text-gray-300 hover:bg-gray-700"
          } mb-1`}
        >
          <div className="flex items-center space-x-3">
            <span className="w-5 text-center">{icon}</span>
            <span>{label}</span>
          </div>
          {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>
        {isExpanded && (
          <ul className="pl-10 mb-2">
            {submenuItems.map((item, index) => (
              <li key={index}>
                <Link href={item.href}>
                  <div className={`block py-2 px-4 rounded-lg cursor-pointer ${
                    location === item.href || location.startsWith(item.href + '/')
                      ? "bg-gray-700 text-white"
                      : "text-gray-400 hover:bg-gray-700 hover:text-gray-300"
                  }`}>
                    {item.label}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
};

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = React.useState(!isMobile);
  const [location] = useLocation();
  const [expandedMenus, setExpandedMenus] = React.useState<Record<string, boolean>>({});

  // Toggle a specific submenu
  const toggleSubmenu = (menuId: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  // Get current page title
  const getPageTitle = () => {
    if (location === "/") return "Dashboard";
    const path = location.split("/")[1];
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  // Close sidebar on mobile when route changes
  React.useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location, isMobile]);

  // Define navigation items and their submenus
  const navigationItems = [
    {
      id: 'dashboard',
      href: '/',
      label: 'Dashboard',
      icon: <BarChart2 className="h-5 w-5" />,
      hasSubmenu: false
    },
    {
      id: 'products',
      href: '/products',
      label: 'Products',
      icon: <Package className="h-5 w-5" />,
      hasSubmenu: true,
      submenuItems: [
        { label: 'All Products', href: '/products' },
        { label: 'Add Product', href: '/products/new' },
        { label: 'Out of Stock', href: '/products/out-of-stock' }
      ]
    },
    {
      id: 'categories',
      href: '/categories',
      label: 'Categories',
      icon: <Folder className="h-5 w-5" />,
      hasSubmenu: true,
      submenuItems: [
        { label: 'All Categories', href: '/categories' },
        { label: 'Add Category', href: '/categories/new' }
      ]
    },
    {
      id: 'brands',
      href: '/brands',
      label: 'Brands',
      icon: <Tag className="h-5 w-5" />,
      hasSubmenu: true,
      submenuItems: [
        { label: 'All Brands', href: '/brands' },
        { label: 'Add Brand', href: '/brands/new' }
      ]
    },
    {
      id: 'orders',
      href: '/orders',
      label: 'Orders',
      icon: <ShoppingBag className="h-5 w-5" />,
      hasSubmenu: true,
      submenuItems: [
        { label: 'All Orders', href: '/orders' },
        { label: 'Pending', href: '/orders/pending' },
        { label: 'Delivered', href: '/orders/delivered' }
      ]
    },
    {
      id: 'customers',
      href: '/customers',
      label: 'Customers',
      icon: <Users className="h-5 w-5" />,
      hasSubmenu: false
    },
    {
      id: 'refunds',
      href: '/refunds',
      label: 'Refunds',
      icon: <HandCoins className="h-5 w-5" />,
      hasSubmenu: true,
      submenuItems: [
        { label: 'All Refunds', href: '/refunds' },
        { label: 'Settings', href: '/refunds/settings' }
      ]
    },
    {
      id: 'support',
      href: '/support',
      label: 'Support Tickets',
      icon: <Headset className="h-5 w-5" />,
      hasSubmenu: false
    },
    {
      id: 'settings',
      href: '/settings',
      label: 'Site Settings',
      icon: <Settings className="h-5 w-5" />,
      hasSubmenu: false
    }
  ];

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
        <div className="flex flex-col h-full overflow-y-hidden hover:overflow-y-auto py-4 px-2 transition-all">
          <nav>
            <ul>
              {navigationItems.map(item => {
                const isActive = location === item.href || location.startsWith(item.href + '/') || 
                  (item.hasSubmenu && item.submenuItems?.some(subItem => 
                    location === subItem.href || location.startsWith(subItem.href + '/')
                  ));
                
                if (!item.hasSubmenu) {
                  return (
                    <SimpleNavItem 
                      key={item.id}
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                      isActive={!!isActive}
                    />
                  );
                }
                
                return (
                  <SubmenuNavItem 
                    key={item.id}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    submenuItems={item.submenuItems || []}
                    isActive={!!isActive}
                    isExpanded={!!expandedMenus[item.id]}
                    onToggle={() => toggleSubmenu(item.id)}
                  />
                );
              })}
            </ul>
            
            {/* Website Link in Sidebar */}
            <div className="mt-6 px-4">
              <a 
                href="https://example.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-3 px-4 py-2.5 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
              >
                <span className="w-5 text-center"><Store className="h-5 w-5" /></span>
                <span>View Website</span>
                <ExternalLink className="h-3.5 w-3.5 ml-auto" />
              </a>
            </div>
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
              <a 
                href="https://example.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hidden md:flex items-center space-x-2 text-primary hover:text-primary/80 border border-primary/20 hover:border-primary/40 px-3 py-1.5 rounded-lg transition-colors"
              >
                <Store className="h-4 w-4" />
                <span className="font-medium text-sm">View Website</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
              
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
                    <div className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary cursor-pointer">
                      <Home className="mr-2 h-4 w-4" />
                      Home
                    </div>
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
