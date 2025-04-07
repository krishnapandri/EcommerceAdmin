import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "wouter";

interface Customer {
  id: string;
  name: string;
  email: string;
  avatar: string;
  orderCount: number;
  totalSpent: string;
  status: 'Active' | 'Inactive';
  registrationDate: string;
}

export default function CustomerList() {
  const { data: customers, isLoading } = useQuery<Customer[]>({
    queryKey: ['/api/customers'],
  });

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: "Customer",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={row.original.avatar} alt={row.original.name} />
            <AvatarFallback>
              {row.original.name.charAt(0)}
              {row.original.name.split(' ')[1]?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div className="text-sm text-gray-500">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "orderCount",
      header: "Orders",
    },
    {
      accessorKey: "totalSpent",
      header: "Total Spent",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        const variants: Record<string, string> = {
          "Active": "bg-green-100 text-green-800",
          "Inactive": "bg-gray-100 text-gray-800",
        };
        
        return (
          <Badge className={`${variants[status]}`}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "registrationDate",
      header: "Registered On",
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const customerId = row.original.id;
        
        return (
          <Button variant="ghost" size="icon" asChild>
            <Link href={`/customers/${customerId}`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Customers</h1>
        <p className="text-gray-500">Manage your customer base</p>
      </div>

      {isLoading ? (
        <div className="text-center p-8">Loading customers...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={customers || []} 
          searchColumn="name"
          searchPlaceholder="Search customers..."
        />
      )}
    </div>
  );
}
