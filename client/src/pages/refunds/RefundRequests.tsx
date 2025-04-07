import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle, XCircle, Eye } from "lucide-react";
import { Link } from "wouter";

interface RefundRequest {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  amount: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  date: string;
}

export default function RefundRequests() {
  const { data: refunds, isLoading } = useQuery<RefundRequest[]>({
    queryKey: ['/api/refunds'],
  });

  const columns: ColumnDef<RefundRequest>[] = [
    {
      accessorKey: "id",
      header: "Refund ID",
      cell: ({ row }) => <span className="font-medium">{row.getValue("id")}</span>,
    },
    {
      accessorKey: "orderNumber",
      header: "Order",
      cell: ({ row }) => (
        <Link href={`/orders/${row.original.orderNumber}`}>
          <a className="text-primary hover:underline font-medium">
            {row.original.orderNumber}
          </a>
        </Link>
      ),
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
      accessorKey: "reason",
      header: "Reason",
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate" title={row.getValue("reason") as string}>
          {row.getValue("reason")}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variants: Record<string, string> = {
          "Pending": "bg-yellow-100 text-yellow-800",
          "Approved": "bg-green-100 text-green-800",
          "Rejected": "bg-red-100 text-red-800",
        };
        
        return (
          <Badge className={`${variants[status]}`}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "date",
      header: "Requested On",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const refundId = row.getValue("id") as string;
        const status = row.getValue("status") as string;
        
        if (status === "Pending") {
          return (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-700 hover:bg-green-50">
                <CheckCircle className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                <XCircle className="h-4 w-4" />
              </Button>
            </div>
          );
        }
        
        return (
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/refunds/${refundId}`}>
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
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Refund Requests</h1>
          <p className="text-gray-500">Manage customer refund requests</p>
        </div>
        <Link href="/refunds/settings">
          <Button variant="outline">Refund Settings</Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center p-8">Loading refund requests...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={refunds || []} 
          searchColumn="orderNumber"
          searchPlaceholder="Search by order number..."
        />
      )}
    </div>
  );
}
