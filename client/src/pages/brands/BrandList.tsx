import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Edit, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";

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
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const { toast } = useToast();

  const deleteBrand = useMutation({
    mutationFn: async (brandId: string) => {
      const response = await apiRequest("DELETE", `/api/brands/${brandId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/brands'] });
      toast({
        title: "Brand deleted",
        description: "The brand has been deleted successfully.",
      });
      setBrandToDelete(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete brand. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    if (brandToDelete) {
      deleteBrand.mutate(brandToDelete.id);
    }
  };

  const filteredBrands = brands?.filter(
    brand => brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">Brands</h1>
        <Link href="/brands/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Brand
          </Button>
        </Link>
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
                <Link href={`/brands/edit/${brand.id}`}>
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                </Link>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => setBrandToDelete(brand)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete the brand "{brandToDelete?.name}"? 
                        This action cannot be undone.
                        {brandToDelete && brandToDelete.productCount > 0 && (
                          <div className="mt-2 text-amber-600 font-medium">
                            Warning: This brand has {brandToDelete.productCount} associated products.
                          </div>
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setBrandToDelete(null)}>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                      >
                        {deleteBrand.isPending ? "Deleting..." : "Delete Brand"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
