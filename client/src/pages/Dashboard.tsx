import { Calendar, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/dashboard/StatCard";
import SalesChart from "@/components/dashboard/SalesChart";
import RevenueChart from "@/components/dashboard/RevenueChart";
import RecentOrdersTable from "@/components/dashboard/RecentOrdersTable";
import TopSellingProducts from "@/components/dashboard/TopSellingProducts";
import { BarChart2, Users, ShoppingBag, HandCoins } from "lucide-react";

export default function Dashboard() {
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">Dashboard Overview</h1>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Button variant="outline" className="inline-flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Last 30 days</span>
            </Button>
          </div>
          <Button className="inline-flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Sales"
          value="$124,563.00"
          changeValue={12.5}
          changeText="vs last month"
          icon={<BarChart2 className="h-5 w-5" />}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-500"
        />
        <StatCard
          title="Active Customers"
          value="24,563"
          changeValue={8.2}
          changeText="vs last month"
          icon={<Users className="h-5 w-5" />}
          iconBgColor="bg-violet-50"
          iconColor="text-violet-500"
        />
        <StatCard
          title="Total Orders"
          value="5,242"
          changeValue={5.3}
          changeText="vs last month"
          icon={<ShoppingBag className="h-5 w-5" />}
          iconBgColor="bg-green-50"
          iconColor="text-green-500"
        />
        <StatCard
          title="Pending Refunds"
          value="32"
          changeValue={-2.1}
          changeText="vs last month"
          icon={<HandCoins className="h-5 w-5" />}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-500"
        />
      </div>

      {/* Charts and activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <SalesChart title="Sales Trends" />
        </div>
        <div>
          <RevenueChart title="Revenue Breakdown" />
        </div>
      </div>

      {/* Recent activity and top products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <RecentOrdersTable />
        </div>
        <div>
          <TopSellingProducts />
        </div>
      </div>
    </div>
  );
}
