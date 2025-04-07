import { useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Edit, Trash2, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
  parentId: string | null;
  children?: Category[];
}

const CategoryItem = ({ 
  category, 
  level = 0 
}: { 
  category: Category; 
  level?: number;
}) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = category.children && category.children.length > 0;
  
  return (
    <div>
      <div 
        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
        style={{ paddingLeft: `${level * 2}rem` }}
      >
        <div className="flex items-center py-4 px-6">
          {hasChildren && (
            <Button 
              variant="ghost" 
              size="icon" 
              className="mr-2 h-8 w-8" 
              onClick={() => setExpanded(!expanded)}
            >
              {expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          )}
          {!hasChildren && <div className="w-10" />}
          
          <div className="flex-1">
            <div className="font-medium">{category.name}</div>
            <div className="text-sm text-gray-500">/{category.slug}</div>
          </div>
          
          <Badge variant="outline" className="mr-4">
            {category.productCount} products
          </Badge>
          
          <div className="flex items-center space-x-2">
            <Link href={`/categories/edit/${category.id}`}>
              <Button variant="ghost" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {expanded && hasChildren && (
        <div>
          {category.children!.map((child) => (
            <CategoryItem key={child.id} category={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

export default function CategoryList() {
  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold text-gray-800 mb-2 md:mb-0">Categories</h1>
        <Link href="/categories/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Category
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <Input
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </CardContent>
      </Card>

      <Card>
        {isLoading ? (
          <CardContent className="py-6 text-center">
            Loading categories...
          </CardContent>
        ) : !categories?.length ? (
          <CardContent className="py-6 text-center">
            No categories found. Create your first category to get started.
          </CardContent>
        ) : (
          <div className="divide-y divide-gray-200">
            <div className="bg-gray-50 py-3 px-6 text-sm font-medium text-gray-500 uppercase">
              Category Structure
            </div>
            {categories.map((category) => (
              <CategoryItem key={category.id} category={category} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
