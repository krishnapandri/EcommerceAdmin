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
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save } from "lucide-react";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const formSchema = z.object({
  timeLimit: z.string().min(1, "Time limit is required").refine(val => !isNaN(parseInt(val)), "Must be a number"),
  restockingFee: z.string().min(1, "Restocking fee is required").refine(val => !isNaN(parseFloat(val)), "Must be a number"),
  autoApproveBelow: z.string().refine(val => val === "" || !isNaN(parseFloat(val)), "Must be a number"),
  eligibleStatuses: z.array(z.string()).min(1, "At least one status must be selected"),
  refundPolicy: z.string().min(10, "Refund policy must be at least 10 characters"),
});

type FormValues = z.infer<typeof formSchema>;

const orderStatuses = [
  { id: "delivered", label: "Delivered" },
  { id: "shipped", label: "Shipped" },
  { id: "pending", label: "Pending" },
];

export default function RefundSettings() {
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["/api/refund-settings"],
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      timeLimit: "",
      restockingFee: "0",
      autoApproveBelow: "",
      eligibleStatuses: [],
      refundPolicy: "",
    },
  });

  // Update form when settings are loaded
  React.useEffect(() => {
    if (settings) {
      form.reset({
        timeLimit: settings.timeLimit.toString(),
        restockingFee: settings.restockingFee.toString(),
        autoApproveBelow: settings.autoApproveBelow?.toString() || "",
        eligibleStatuses: settings.eligibleStatuses,
        refundPolicy: settings.refundPolicy,
      });
    }
  }, [settings, form]);

  const updateSettings = useMutation({
    mutationFn: async (values: FormValues) => {
      const response = await apiRequest("PUT", "/api/refund-settings", {
        ...values,
        timeLimit: parseInt(values.timeLimit),
        restockingFee: parseFloat(values.restockingFee),
        autoApproveBelow: values.autoApproveBelow ? parseFloat(values.autoApproveBelow) : null,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/refund-settings"] });
      toast({
        title: "Settings updated",
        description: "The refund settings have been updated successfully.",
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

  if (isLoading) {
    return (
      <div>
        <div className="mb-6 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/refunds")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800">Refund Settings</h1>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Loading refund settings...</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[20px] w-full" />
            <Skeleton className="h-[200px] w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/refunds")}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Refund Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configure Refund Policy and Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="timeLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time Limit (days)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="1" placeholder="30" {...field} />
                      </FormControl>
                      <FormDescription>
                        Number of days after delivery that customers can request a refund.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="restockingFee"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Restocking Fee (%)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" placeholder="0" {...field} />
                      </FormControl>
                      <FormDescription>
                        Percentage fee charged for restocking returned items.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="autoApproveBelow"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Auto-approve Refunds Below ($)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="0.01" placeholder="Optional" {...field} />
                    </FormControl>
                    <FormDescription>
                      Automatically approve refund requests below this amount. Leave blank to disable auto-approval.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <FormLabel className="text-base">Eligible Order Statuses</FormLabel>
                <FormDescription className="mb-3">
                  Select which order statuses are eligible for refund requests.
                </FormDescription>
                {orderStatuses.map((status) => (
                  <FormField
                    key={status.id}
                    control={form.control}
                    name="eligibleStatuses"
                    render={({ field }) => (
                      <FormItem
                        key={status.id}
                        className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 mb-2"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(status.id)}
                            onCheckedChange={(checked) => {
                              const updatedStatuses = checked
                                ? [...field.value, status.id]
                                : field.value?.filter((value) => value !== status.id);
                              field.onChange(updatedStatuses);
                            }}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-medium">
                            {status.label}
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                ))}
                <FormMessage className="mt-2">
                  {form.formState.errors.eligibleStatuses?.message}
                </FormMessage>
              </div>

              <Separator className="my-4" />

              <FormField
                control={form.control}
                name="refundPolicy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Refund Policy</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter your store's refund policy here..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      This policy will be displayed to customers on your store. Be clear about your terms and conditions for refunds.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="pt-4 flex justify-end">
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
        </CardContent>
      </Card>
    </div>
  );
}
