import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, Filter } from "lucide-react";

interface Order {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  amount: string;
  items: number;
  status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
  paymentStatus: 'Paid' | 'Unpaid' | 'Refunded';
  date: string;
}

export default function OrderList() {
  const { data: orders, isLoading } = useQuery<Order[]>({
    queryKey: ['/api/orders'],
  });

  const columns: ColumnDef<Order>[] = [
    {
      accessorKey: "id",
      header: "Order ID",
      cell: ({ row }) => <span className="font-medium">{row.getValue("id")}</span>,
    },
    {
      accessorKey: "customer.name",
      header: "Customer",
      cell: ({ row }) => (
        <div>
          <div className="font-medium">{row.original.customer.name}</div>
          <div className="text-sm text-gray-500">{row.original.customer.email}</div>
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
    },
    {
      accessorKey: "items",
      header: "Items",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variants: Record<string, string> = {
          "Pending": "bg-blue-100 text-blue-800",
          "Shipped": "bg-yellow-100 text-yellow-800",
          "Delivered": "bg-green-100 text-green-800",
          "Cancelled": "bg-red-100 text-red-800",
        };
        
        return (
          <Badge className={`${variants[status]} rounded-full`}>
            {status}
          </Badge>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "paymentStatus",
      header: "Payment",
      cell: ({ row }) => {
        const status = row.getValue("paymentStatus") as string;
        const variants: Record<string, string> = {
          "Paid": "bg-green-100 text-green-800",
          "Unpaid": "bg-gray-100 text-gray-800",
          "Refunded": "bg-amber-100 text-amber-800",
        };
        
        return (
          <Badge className={`${variants[status]} rounded-full`}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Date",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const orderId = row.getValue("id") as string;
        
        return (
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/orders/${orderId}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">Orders</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center p-8">Loading orders...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={orders || []} 
          searchColumn="id"
          searchPlaceholder="Search order ID..."
        />
      )}
    </div>
  );
}
