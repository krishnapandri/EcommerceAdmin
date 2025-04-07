import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery } from "@tanstack/react-query";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Upload, Save } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  // General settings
  siteName: z.string().min(2, "Site name must be at least 2 characters"),
  logo: z.string().nullable(),
  favicon: z.string().nullable(),
  primaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color"),
  secondaryColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, "Must be a valid hex color"),
  
  // Contact information
  contactEmail: z.string().email("Must be a valid email address"),
  contactPhone: z.string().nullable(),
  address: z.object({
    street: z.string().nullable(),
    city: z.string().nullable(),
    state: z.string().nullable(),
    zip: z.string().nullable(),
    country: z.string().nullable(),
  }).nullable(),
  
  // Social links
  socialLinks: z.object({
    facebook: z.string().nullable(),
    twitter: z.string().nullable(),
    instagram: z.string().nullable(),
    linkedin: z.string().nullable(),
    youtube: z.string().nullable(),
  }).nullable(),
  
  // Legal
  privacyPolicy: z.string().nullable(),
  termsOfService: z.string().nullable(),
  returnPolicy: z.string().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

export default function SiteSettings() {
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string | null>(null);

  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/site-settings"],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteName: "ShopAdmin",
      logo: null,
      favicon: null,
      primaryColor: "#4f46e5",
      secondaryColor: "#0ea5e9",
      contactEmail: "",
      contactPhone: null,
      address: {
        street: null,
        city: null,
        state: null,
        zip: null,
        country: null,
      },
      socialLinks: {
        facebook: null,
        twitter: null,
        instagram: null,
        linkedin: null,
        youtube: null,
      },
      privacyPolicy: null,
      termsOfService: null,
      returnPolicy: null,
    },
  });

  // Update form when settings are loaded
  React.useEffect(() => {
    if (settings) {
      form.reset({
        siteName: settings.siteName,
        logo: settings.logo,
        favicon: settings.favicon,
        primaryColor: settings.primaryColor,
        secondaryColor: settings.secondaryColor,
        contactEmail: settings.contactEmail,
        contactPhone: settings.contactPhone,
        address: settings.address,
        socialLinks: settings.socialLinks,
        privacyPolicy: settings.privacyPolicy,
        termsOfService: settings.termsOfService,
        returnPolicy: settings.returnPolicy,
      });
      
      // Set previews if available
      if (settings.logo) setLogoPreview(settings.logo);
      if (settings.favicon) setFaviconPreview(settings.favicon);
    }
  }, [settings, form]);

  const updateSettings = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await apiRequest("PUT", "/api/site-settings", values);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
      toast({
        title: "Settings updated",
        description: "The site settings have been updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: FormValues) {
    updateSettings.mutate(values);
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        form.setValue("logo", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setFaviconPreview(result);
        form.setValue("favicon", result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Site Settings</h1>
          <p className="text-gray-500">Configure your store's settings and appearance</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Loading settings...</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-[20px] w-full" />
              <Skeleton className="h-[20px] w-full" />
              <Skeleton className="h-[20px] w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Site Settings</h1>
        <p className="text-gray-500">Configure your store's settings and appearance</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid grid-cols-4 w-full max-w-4xl mb-4">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="contact">Contact Information</TabsTrigger>
              <TabsTrigger value="social">Social Links</TabsTrigger>
              <TabsTrigger value="legal">Legal Pages</TabsTrigger>
            </TabsList>
            
            {/* General Settings Tab */}
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle>General Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="siteName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Site Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Store Name" {...field} />
                        </FormControl>
                        <FormDescription>
                          This is your store's name as it appears to customers.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <FormLabel>Logo</FormLabel>
                      <div className="mt-2 mb-4">
                        <div 
                          className={`border-2 border-dashed rounded-lg p-4 ${
                            logoPreview ? 'border-gray-200' : 'border-gray-300'
                          } flex flex-col items-center justify-center`}
                          style={{ minHeight: "120px" }}
                        >
                          {logoPreview ? (
                            <img 
                              src={logoPreview} 
                              alt="Site Logo Preview" 
                              className="max-h-24 object-contain"
                            />
                          ) : (
                            <div className="text-center">
                              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500 text-sm">Upload your logo</p>
                            </div>
                          )}
                        </div>
                        <div className="mt-2">
                          <Button 
                            variant="outline" 
                            type="button"
                            className="w-full"
                            onClick={() => document.getElementById('site-logo')?.click()}
                          >
                            {logoPreview ? 'Change Logo' : 'Upload Logo'}
                          </Button>
                          <input 
                            type="file" 
                            id="site-logo" 
                            accept="image/*" 
                            className="hidden"
                            onChange={handleLogoChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <FormLabel>Favicon</FormLabel>
                      <div className="mt-2 mb-4">
                        <div 
                          className={`border-2 border-dashed rounded-lg p-4 ${
                            faviconPreview ? 'border-gray-200' : 'border-gray-300'
                          } flex flex-col items-center justify-center`}
                          style={{ minHeight: "120px" }}
                        >
                          {faviconPreview ? (
                            <img 
                              src={faviconPreview} 
                              alt="Favicon Preview" 
                              className="max-h-16 object-contain"
                            />
                          ) : (
                            <div className="text-center">
                              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500 text-sm">Upload your favicon</p>
                            </div>
                          )}
                        </div>
                        <div className="mt-2">
                          <Button 
                            variant="outline" 
                            type="button"
                            className="w-full"
                            onClick={() => document.getElementById('site-favicon')?.click()}
                          >
                            {faviconPreview ? 'Change Favicon' : 'Upload Favicon'}
                          </Button>
                          <input 
                            type="file" 
                            id="site-favicon" 
                            accept="image/*" 
                            className="hidden"
                            onChange={handleFaviconChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="primaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Color</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <div 
                              className="h-10 w-10 rounded border" 
                              style={{ backgroundColor: field.value }}
                            ></div>
                          </div>
                          <FormDescription>
                            The main color used throughout your site.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="secondaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Secondary Color</FormLabel>
                          <div className="flex gap-2">
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <div 
                              className="h-10 w-10 rounded border" 
                              style={{ backgroundColor: field.value }}
                            ></div>
                          </div>
                          <FormDescription>
                            The accent color used for highlights and secondary elements.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Contact Information Tab */}
            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Email</FormLabel>
                          <FormControl>
                            <Input placeholder="contact@yourstore.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="contactPhone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Contact Phone (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="+1 (555) 123-4567" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Separator className="my-4" />
                  <h3 className="text-lg font-medium mb-4">Store Address</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="address.street"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Street Address</FormLabel>
                          <FormControl>
                            <Input placeholder="123 Main St" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.city"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="San Francisco" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.state"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>State / Province</FormLabel>
                          <FormControl>
                            <Input placeholder="California" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.zip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ZIP / Postal Code</FormLabel>
                          <FormControl>
                            <Input placeholder="94105" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="address.country"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <FormControl>
                            <Input placeholder="United States" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Social Links Tab */}
            <TabsContent value="social">
              <Card>
                <CardHeader>
                  <CardTitle>Social Media Links</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="socialLinks.facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://facebook.com/yourstore" 
                            {...field} 
                            value={field.value || ''} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialLinks.twitter"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Twitter / X</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://twitter.com/yourstore" 
                            {...field} 
                            value={field.value || ''} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialLinks.instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://instagram.com/yourstore" 
                            {...field} 
                            value={field.value || ''} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialLinks.linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://linkedin.com/company/yourstore" 
                            {...field} 
                            value={field.value || ''} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialLinks.youtube"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="https://youtube.com/channel/yourstore" 
                            {...field} 
                            value={field.value || ''} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Legal Pages Tab */}
            <TabsContent value="legal">
              <Card>
                <CardHeader>
                  <CardTitle>Legal Documents</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <FormField
                    control={form.control}
                    name="privacyPolicy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Privacy Policy</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter your privacy policy..." 
                            className="min-h-[200px]"
                            {...field} 
                            value={field.value || ''} 
                          />
                        </FormControl>
                        <FormDescription>
                          This will be displayed on your store's privacy policy page.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="termsOfService"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Terms of Service</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter your terms of service..." 
                            className="min-h-[200px]"
                            {...field} 
                            value={field.value || ''} 
                          />
                        </FormControl>
                        <FormDescription>
                          This will be displayed on your store's terms of service page.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="returnPolicy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Return Policy</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Enter your return policy..." 
                            className="min-h-[200px]"
                            {...field} 
                            value={field.value || ''} 
                          />
                        </FormControl>
                        <FormDescription>
                          This will be displayed on your store's return policy page.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button 
              type="submit" 
              className="flex items-center gap-2"
              disabled={updateSettings.isPending}
            >
              <Save className="h-4 w-4" />
              {updateSettings.isPending ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
