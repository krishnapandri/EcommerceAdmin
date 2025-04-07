import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import DashboardLayout from "@/layouts/DashboardLayout";
import NotFound from "@/pages/not-found";

// Pages
import Dashboard from "@/pages/Dashboard";
import ProductList from "@/pages/products/ProductList";
import CreateProduct from "@/pages/products/CreateProduct";
import ProductReviews from "@/pages/products/ProductReviews";
import CategoryList from "@/pages/categories/CategoryList";
import CreateCategory from "@/pages/categories/CreateCategory";
import BrandList from "@/pages/brands/BrandList";
import CreateBrand from "@/pages/brands/CreateBrand";
import OrderList from "@/pages/orders/OrderList";
import OrderDetails from "@/pages/orders/OrderDetails";
import CustomerList from "@/pages/customers/CustomerList";
import RefundRequests from "@/pages/refunds/RefundRequests";
import RefundSettings from "@/pages/refunds/RefundSettings";
import SupportTickets from "@/pages/support/SupportTickets";
import SiteSettings from "@/pages/settings/SiteSettings";

function Router() {
  return (
    <DashboardLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/products" component={ProductList} />
        <Route path="/products/create" component={CreateProduct} />
        <Route path="/products/reviews" component={ProductReviews} />
        <Route path="/categories" component={CategoryList} />
        <Route path="/categories/create" component={CreateCategory} />
        <Route path="/brands" component={BrandList} />
        <Route path="/brands/create" component={CreateBrand} />
        <Route path="/orders" component={OrderList} />
        <Route path="/orders/:id" component={OrderDetails} />
        <Route path="/customers" component={CustomerList} />
        <Route path="/refunds" component={RefundRequests} />
        <Route path="/refunds/settings" component={RefundSettings} />
        <Route path="/support" component={SupportTickets} />
        <Route path="/settings" component={SiteSettings} />
        <Route component={NotFound} />
      </Switch>
    </DashboardLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
