import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Printer, RefreshCw, Truck, AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface OrderDetails {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: {
      street: string;
      city: string;
      state: string;
      zip: string;
      country: string;
    };
  };
  shipping: {
    method: string;
    trackingNumber?: string;
    estimatedDelivery?: string;
  };
  payment: {
    method: string;
    status: 'Paid' | 'Unpaid' | 'Refunded';
    cardLast4?: string;
  };
  items: {
    id: string;
    name: string;
    sku: string;
    price: string;
    quantity: number;
    image: string;
  }[];
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  subtotal: string;
  shipping_cost: string;
  tax: string;
  total: string;
  notes?: string;
  date: string;
}

export default function OrderDetails() {
  const { id } = useParams();
  const [_, navigate] = useLocation();

  const { data: order, isLoading } = useQuery<OrderDetails>({
    queryKey: [`/api/orders/${id}`],
    enabled: !!id,
  });

  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      "Pending": "bg-blue-100 text-blue-800",
      "Shipped": "bg-yellow-100 text-yellow-800",
      "Delivered": "bg-green-100 text-green-800",
      "Cancelled": "bg-red-100 text-red-800",
    };
    return statusColors[status];
  };

  const getPaymentStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      "Paid": "bg-green-100 text-green-800",
      "Unpaid": "bg-gray-100 text-gray-800",
      "Refunded": "bg-amber-100 text-amber-800",
    };
    return statusColors[status];
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading order details...</div>;
  }

  if (!order) {
    return <div className="text-center p-8">Order not found.</div>;
  }

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/orders")}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            Order {order.id}
            <Badge className={`ml-4 ${getStatusColor(order.status)}`}>
              {order.status}
            </Badge>
          </h1>
          <p className="text-sm text-gray-500 mt-1">Placed on {order.date}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Printer className="h-4 w-4" />
            <span>Print</span>
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="h-16 w-16 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                      <div className="mt-1 text-sm text-gray-700">
                        Qty: {item.quantity} × {item.price}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-medium text-gray-900">
                        ${(parseFloat(item.price.replace(/[^0-9.-]+/g, '')) * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
                
                <div className="pt-2 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{order.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Shipping</span>
                    <span>{order.shipping_cost}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Tax</span>
                    <span>{order.tax}</span>
                  </div>
                  <Separator className="my-2" />
                  <div className="flex justify-between font-medium">
                    <span>Total</span>
                    <span>{order.total}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Shipping Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Shipping Address</h4>
                  <p className="text-gray-800">{order.customer.name}</p>
                  <p className="text-gray-600">{order.customer.address.street}</p>
                  <p className="text-gray-600">
                    {order.customer.address.city}, {order.customer.address.state} {order.customer.address.zip}
                  </p>
                  <p className="text-gray-600">{order.customer.address.country}</p>
                  <p className="text-gray-600 mt-2">{order.customer.phone}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Shipping Method</h4>
                  <p className="text-gray-800">{order.shipping.method}</p>
                  
                  {order.shipping.trackingNumber && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500">Tracking Number</p>
                      <p className="text-gray-800">{order.shipping.trackingNumber}</p>
                    </div>
                  )}
                  
                  {order.shipping.estimatedDelivery && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-500">Estimated Delivery</p>
                      <p className="text-gray-800">{order.shipping.estimatedDelivery}</p>
                    </div>
                  )}
                  
                  {order.status === 'Shipped' && (
                    <div className="mt-4">
                      <Button className="flex items-center gap-2">
                        <Truck className="h-4 w-4" />
                        Track Package
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Order Notes */}
          {order.notes && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
        
        <div className="space-y-6">
          {/* Customer Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mb-4">
                <Avatar className="h-12 w-12 mr-3">
                  <AvatarImage src="" alt={order.customer.name} />
                  <AvatarFallback>
                    {order.customer.name.charAt(0)}
                    {order.customer.name.split(' ')[1]?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-medium text-gray-900">{order.customer.name}</h4>
                  <p className="text-sm text-gray-500">{order.customer.email}</p>
                </div>
              </div>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/customers/${order.customer.id}`}>
                  View Customer Profile
                </Link>
              </Button>
            </CardContent>
          </Card>
          
          {/* Payment Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Method</span>
                  <span className="font-medium">{order.payment.method}</span>
                </div>
                
                {order.payment.cardLast4 && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Card</span>
                    <span>••••{order.payment.cardLast4}</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <Badge className={getPaymentStatusColor(order.payment.status)}>
                    {order.payment.status}
                  </Badge>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total</span>
                  <span className="font-medium">{order.total}</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Order Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {order.status === 'Pending' && (
                <Button className="w-full justify-start">
                  <Truck className="mr-2 h-4 w-4" />
                  Mark as Shipped
                </Button>
              )}
              
              {order.status === 'Shipped' && (
                <Button className="w-full justify-start">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Mark as Delivered
                </Button>
              )}
              
              {order.status !== 'Cancelled' && (
                <Button variant="outline" className="w-full justify-start text-amber-500 hover:text-amber-600 hover:bg-amber-50">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Cancel Order
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
