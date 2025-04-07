import { useQuery } from "@tanstack/react-query";
import { CheckCircle, MessageCircle, Flag } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

interface SupportTicket {
  id: string;
  customer: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
  subject: string;
  issueType: string;
  status: 'Open' | 'In Progress' | 'Closed' | 'Resolved';
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  lastResponseDate: string | null;
  createdDate: string;
}

const replyFormSchema = z.object({
  message: z.string().min(5, "Reply message must be at least 5 characters"),
});

type ReplyFormValues = z.infer<typeof replyFormSchema>;

export default function SupportTickets() {
  const { toast } = useToast();
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);

  const { data: tickets, isLoading } = useQuery<SupportTicket[]>({
    queryKey: ['/api/support-tickets'],
  });

  const form = useForm<ReplyFormValues>({
    resolver: zodResolver(replyFormSchema),
    defaultValues: {
      message: "",
    },
  });

  const replyMutation = useMutation({
    mutationFn: async (values: ReplyFormValues) => {
      if (!selectedTicket) return;
      const response = await apiRequest("POST", `/api/support-tickets/${selectedTicket.id}/replies`, {
        userId: 1, // Admin user ID
        message: values.message,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/support-tickets'] });
      setReplyDialogOpen(false);
      form.reset();
      toast({
        title: "Reply sent",
        description: "Your reply has been sent successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to send reply. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onReplySubmit = (data: ReplyFormValues) => {
    replyMutation.mutate(data);
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, string> = {
      "Low": "bg-gray-100 text-gray-800",
      "Medium": "bg-blue-100 text-blue-800",
      "High": "bg-yellow-100 text-yellow-800",
      "Urgent": "bg-red-100 text-red-800",
    };
    
    return variants[priority] || "bg-gray-100 text-gray-800";
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      "Open": "bg-green-100 text-green-800",
      "In Progress": "bg-blue-100 text-blue-800",
      "Resolved": "bg-purple-100 text-purple-800",
      "Closed": "bg-gray-100 text-gray-800",
    };
    
    return variants[status] || "bg-gray-100 text-gray-800";
  };

  const columns: ColumnDef<SupportTicket>[] = [
    {
      accessorKey: "id",
      header: "Ticket ID",
      cell: ({ row }) => <span className="font-medium">{row.getValue("id")}</span>,
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
          <div>
            <div className="font-medium">{row.original.customer.name}</div>
            <div className="text-xs text-gray-500">{row.original.customer.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "subject",
      header: "Subject",
      cell: ({ row }) => (
        <div className="max-w-[250px] truncate">
          {row.getValue("subject")}
        </div>
      ),
    },
    {
      accessorKey: "issueType",
      header: "Issue Type",
      cell: ({ row }) => (
        <div className="text-sm">
          {row.getValue("issueType")}
        </div>
      ),
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string;
        return (
          <Badge className={`${getPriorityBadge(priority)}`}>
            {priority}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <Badge className={`${getStatusBadge(status)}`}>
            {status}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdDate",
      header: "Created",
      cell: ({ row }) => <div className="text-sm">{row.getValue("createdDate")}</div>,
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => {
        const ticket = row.original;
        
        return (
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
              onClick={() => {
                setSelectedTicket(ticket);
                setReplyDialogOpen(true);
              }}
            >
              <MessageCircle className="h-4 w-4" />
            </Button>
            
            {ticket.status !== 'Closed' && ticket.status !== 'Resolved' && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-green-500 hover:text-green-700 hover:bg-green-50"
              >
                <CheckCircle className="h-4 w-4" />
              </Button>
            )}
            
            {ticket.priority !== 'Urgent' && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-amber-500 hover:text-amber-700 hover:bg-amber-50"
              >
                <Flag className="h-4 w-4" />
              </Button>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Support Tickets</h1>
        <p className="text-gray-500">Manage and respond to customer support requests</p>
      </div>

      {isLoading ? (
        <div className="text-center p-8">Loading support tickets...</div>
      ) : (
        <DataTable 
          columns={columns} 
          data={tickets || []} 
          searchColumn="subject"
          searchPlaceholder="Search by subject..."
        />
      )}

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Reply to Ticket: {selectedTicket?.id}</DialogTitle>
            <DialogDescription>
              From {selectedTicket?.customer.name} ({selectedTicket?.customer.email})
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-gray-50 p-4 my-4 rounded-lg">
            <h4 className="font-medium mb-2">{selectedTicket?.subject}</h4>
            <div className="flex items-center gap-2 mb-4">
              <Badge className={`${getStatusBadge(selectedTicket?.status || 'Open')}`}>
                {selectedTicket?.status}
              </Badge>
              <Badge className={`${getPriorityBadge(selectedTicket?.priority || 'Medium')}`}>
                {selectedTicket?.priority}
              </Badge>
            </div>
          </div>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onReplySubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Type your reply here..."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setReplyDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={replyMutation.isPending}
                >
                  {replyMutation.isPending ? "Sending..." : "Send Reply"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
