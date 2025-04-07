import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

interface Brand {
  id: string;
  name: string;
  logo: string;
  productCount: number;
  description: string;
}

export default function BrandList() {
  const { data: brands, isLoading } = useQuery<Brand[]>({
    queryKey: ['/api/brands'],
  });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredBrands = brands?.filter(
    brand => brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">Brands</h1>
        <Button asChild>
          <Link href="/brands/create">
            <Plus className="mr-2 h-4 w-4" /> Add Brand
          </Link>
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <Input
            placeholder="Search brands..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="text-center p-8">Loading brands...</div>
      ) : !filteredBrands?.length ? (
        <Card>
          <CardContent className="py-6 text-center">
            No brands found. Create your first brand to get started.
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBrands.map((brand) => (
            <Card key={brand.id} className="overflow-hidden">
              <div className="p-6 flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-16 w-16 rounded-md">
                    <AvatarImage src={brand.logo} alt={brand.name} />
                    <AvatarFallback className="rounded-md bg-primary/10 text-primary font-bold text-lg">
                      {brand.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{brand.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-1 mt-1">
                      {brand.description}
                    </p>
                    <Badge variant="outline" className="mt-2">
                      {brand.productCount} products
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex justify-end space-x-2 border-t">
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/brands/edit/${brand.id}`}>
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
