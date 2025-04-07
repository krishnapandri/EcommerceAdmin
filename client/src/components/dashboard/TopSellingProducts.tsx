import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";

interface Product {
  id: string;
  name: string;
  image: string;
  soldCount: number;
  price: string;
  percentageChange: number;
}

export default function TopSellingProducts() {
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products/top-selling'],
  });

  return (
    <Card className="border border-gray-100 shadow-sm">
      <div className="px-5 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">Top Selling Products</h3>
      </div>
      <div className="p-5">
        <ul className="divide-y divide-gray-200">
          {isLoading ? (
            <li className="py-3 text-center text-sm text-gray-500">
              Loading top products...
            </li>
          ) : !products?.length ? (
            <li className="py-3 text-center text-sm text-gray-500">
              No top selling products found.
            </li>
          ) : (
            products.map((product) => (
              <li key={product.id} className="py-3 flex items-center space-x-3">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                  <p className="text-sm text-gray-500">Sold: {product.soldCount.toLocaleString()} units</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{product.price}</p>
                  <p className="text-xs text-green-500">+{product.percentageChange}%</p>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
      <div className="bg-gray-50 px-5 py-3 border-t border-gray-200 text-center">
        <Link href="/products">
          <div className="text-primary hover:underline text-sm font-medium cursor-pointer">View all products</div>
        </Link>
      </div>
    </Card>
  );
}
