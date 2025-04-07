import { useQuery } from "@tanstack/react-query";
import { Star, Trash2, CheckCircle, XCircle } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProductReview {
  id: string;
  product: {
    id: string;
    name: string;
  };
  customer: {
    id: string;
    name: string;
    avatar: string;
  };
  rating: number;
  comment: string;
  status: 'Approved' | 'Pending' | 'Rejected';
  date: string;
}

export default function ProductReviews() {
  const { data: reviews, isLoading } = useQuery<ProductReview[]>({
    queryKey: ['/api/product-reviews'],
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  const columns: ColumnDef<ProductReview>[] = [
    {
      accessorKey: "product.name",
      header: "Product",
      cell: ({ row }) => (
        <div className="font-medium">{row.original.product.name}</div>
      ),
    },
    {
      accessorKey: "customer",
      header: "Customer",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={row.original.customer.avatar} alt={row.original.customer.name} />
            <AvatarFallback>
              {row.original.customer.name.charAt(0)}
              {row.original.customer.name.split(' ')[1]?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span>{row.original.customer.name}</span>
        </div>
      ),
    },
    {
      accessorKey: "rating",
      header: "Rating",
      cell: ({ row }) => renderStars(row.original.rating),
    },
    {
      accessorKey: "comment",
      header: "Comment",
      cell: ({ row }) => (
        <div className="max-w-[300px] truncate">
          {row.original.comment}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        const variants: Record<string, string> = {
          "Approved": "bg-green-100 text-green-800",
          "Pending": "bg-yellow-100 text-yellow-800",
          "Rejected": "bg-red-100 text-red-800",
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
      header: "Actions",
      cell: ({ row }) => {
        const reviewId = row.original.id;
        const status = row.original.status;
        
        return (
          <div className="flex items-center gap-2">
            {status === "Pending" && (
              <>
                <Button variant="ghost" size="icon" className="text-green-500 hover:text-green-700 hover:bg-green-50">
                  <CheckCircle className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                  <XCircle className="h-4 w-4" />
                </Button>
              </>
            )}
            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Product Reviews</h1>
        <p className="text-gray-500 mt-1">Manage and moderate customer reviews</p>
      </div>

      {isLoading ? (
        <div className="text-center p-8">Loading reviews...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={reviews || []} 
          searchColumn="product.name"
          searchPlaceholder="Search by product name..."
        />
      )}
    </div>
  );
}
