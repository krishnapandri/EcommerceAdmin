import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Upload } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Brand name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateBrand() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const createBrand = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await apiRequest("POST", "/api/brands", values);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/brands'] });
      toast({
        title: "Brand created",
        description: "The brand has been created successfully.",
      });
      navigate("/brands");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create brand. Please try again.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: FormValues) {
    createBrand.mutate(values);
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/brands")}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Create New Brand</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Apple" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter brand description" 
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a brief description of the brand.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="pt-4 flex justify-end space-x-4">
                    <Button 
                      variant="outline" 
                      onClick={() => navigate("/brands")}
                      type="button"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createBrand.isPending}
                    >
                      {createBrand.isPending ? "Creating..." : "Create Brand"}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">Brand Logo</h3>
              <div className="mb-4">
                <div 
                  className={`border-2 border-dashed rounded-lg p-4 ${
                    logoPreview ? 'border-gray-200' : 'border-gray-300'
                  } flex flex-col items-center justify-center`}
                  style={{ minHeight: "200px" }}
                >
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Brand Logo Preview" 
                      className="mx-auto h-32 object-contain"
                    />
                  ) : (
                    <div className="text-center">
                      <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 mb-2">Drag and drop your logo here</p>
                      <p className="text-gray-400 text-sm">SVG, PNG, JPG up to 5MB</p>
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => document.getElementById('brand-logo')?.click()}
                  >
                    {logoPreview ? 'Change Logo' : 'Upload Logo'}
                  </Button>
                  <input 
                    type="file" 
                    id="brand-logo" 
                    accept="image/*" 
                    className="hidden"
                    onChange={handleLogoChange}
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-md font-medium mb-2">Logo Guidelines</h3>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Use a transparent background when possible</li>
                  <li>• Recommended size: 512x512 pixels</li>
                  <li>• Maximum file size: 5MB</li>
                  <li>• Use high-quality images for the best appearance</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
