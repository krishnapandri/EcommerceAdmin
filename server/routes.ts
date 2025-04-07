import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import {
  insertProductSchema,
  insertCategorySchema,
  insertBrandSchema,
  insertRefundSettingsSchema,
  insertSiteSettingsSchema,
  insertSupportTicketSchema,
  insertTicketReplySchema,
  insertRefundSchema
} from "@shared/schema";
import { fromZodError } from "zod-validation-error";

function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const validationError = fromZodError(error);
      throw new Error(validationError.message);
    }
    throw error;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API prefix
  const apiPrefix = "/api";

  // Define API routes
  
  // Dashboard Stats Route
  app.get(`${apiPrefix}/dashboard/stats`, async (req: Request, res: Response) => {
    try {
      // In a real app, these would come from the database
      const stats = {
        totalSales: "$124,563.00",
        totalSalesChange: 12.5,
        activeCustomers: 24563,
        activeCustomersChange: 8.2,
        totalOrders: 5242,
        totalOrdersChange: 5.3,
        pendingRefunds: 32,
        pendingRefundsChange: -2.1
      };
      
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Recent Orders for Dashboard
  app.get(`${apiPrefix}/orders/recent`, async (req: Request, res: Response) => {
    try {
      const recentOrders = await storage.getRecentOrders();
      res.json(recentOrders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Top Selling Products for Dashboard
  app.get(`${apiPrefix}/products/top-selling`, async (req: Request, res: Response) => {
    try {
      const topProducts = await storage.getTopSellingProducts();
      res.json(topProducts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Product Routes
  app.get(`${apiPrefix}/products`, async (req: Request, res: Response) => {
    try {
      const products = await storage.getProducts();
      // Transform for frontend display
      const formattedProducts = products.map(product => ({
        id: product.id.toString(),
        name: product.name,
        price: `$${product.price}`,
        category: product.categoryId ? "Category Name" : "Uncategorized", // In real app, join with category
        stock: Number(product.stock),
        status: product.stock > 10 ? "In Stock" : product.stock > 0 ? "Low Stock" : "Out of Stock",
        createdAt: product.createdAt.toLocaleDateString('en-US')
      }));
      res.json(formattedProducts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get(`${apiPrefix}/products/:id`, async (req: Request, res: Response) => {
    try {
      const product = await storage.getProduct(Number(req.params.id));
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post(`${apiPrefix}/products`, async (req: Request, res: Response) => {
    try {
      const productData = validateSchema(insertProductSchema, req.body);
      const product = await storage.createProduct(productData);
      res.status(201).json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put(`${apiPrefix}/products/:id`, async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const productData = validateSchema(insertProductSchema.partial(), req.body);
      const product = await storage.updateProduct(id, productData);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.delete(`${apiPrefix}/products/:id`, async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const deleted = await storage.deleteProduct(id);
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Product Reviews Route
  app.get(`${apiPrefix}/product-reviews`, async (req: Request, res: Response) => {
    try {
      // Mock data for now
      const reviews = [
        {
          id: "PR-1001",
          product: {
            id: "P-1001",
            name: "Wireless Headphones"
          },
          customer: {
            id: "C-1001",
            name: "John Doe",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg"
          },
          rating: 4,
          comment: "Great product, works as expected. Sound quality is excellent, but battery life could be better.",
          status: "Approved",
          date: "Mar 15, 2023"
        },
        {
          id: "PR-1002",
          product: {
            id: "P-1002",
            name: "Smart Watch Series 5"
          },
          customer: {
            id: "C-1002",
            name: "Sophie Moore",
            avatar: "https://randomuser.me/api/portraits/women/65.jpg"
          },
          rating: 5,
          comment: "Amazing watch! The fitness tracking features are spot on and the battery lasts for days.",
          status: "Approved",
          date: "Mar 18, 2023"
        },
        {
          id: "PR-1003",
          product: {
            id: "P-1003",
            name: "Bluetooth Speaker"
          },
          customer: {
            id: "C-1003",
            name: "Michael Foster",
            avatar: "https://randomuser.me/api/portraits/men/42.jpg"
          },
          rating: 2,
          comment: "Not impressed. The sound is tinny and it disconnects frequently.",
          status: "Pending",
          date: "Mar 20, 2023"
        },
        {
          id: "PR-1004",
          product: {
            id: "P-1004",
            name: "Laptop Backpack"
          },
          customer: {
            id: "C-1004",
            name: "Emma Wilson",
            avatar: "https://randomuser.me/api/portraits/women/33.jpg"
          },
          rating: 3,
          comment: "Decent quality, but not as spacious as I expected. The water bottle holder is too small.",
          status: "Approved",
          date: "Mar 22, 2023"
        },
        {
          id: "PR-1005",
          product: {
            id: "P-1005",
            name: "Wireless Keyboard"
          },
          customer: {
            id: "C-1005",
            name: "Robert Fox",
            avatar: "https://randomuser.me/api/portraits/men/95.jpg"
          },
          rating: 1,
          comment: "Extremely disappointed. Keys started sticking after just two weeks of use.",
          status: "Rejected",
          date: "Mar 25, 2023"
        }
      ];
      
      res.json(reviews);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Category Routes
  app.get(`${apiPrefix}/categories`, async (req: Request, res: Response) => {
    try {
      const categories = await storage.getCategories();
      
      // Mock data with nested structure for demo
      const mockCategories = [
        {
          id: "C-1001",
          name: "Electronics",
          slug: "electronics",
          parentId: null,
          productCount: 125,
          children: [
            {
              id: "C-1002",
              name: "Computers",
              slug: "computers",
              parentId: "C-1001",
              productCount: 45,
              children: [
                {
                  id: "C-1003",
                  name: "Laptops",
                  slug: "laptops",
                  parentId: "C-1002",
                  productCount: 28
                },
                {
                  id: "C-1004",
                  name: "Desktops",
                  slug: "desktops",
                  parentId: "C-1002",
                  productCount: 17
                }
              ]
            },
            {
              id: "C-1005",
              name: "Audio",
              slug: "audio",
              parentId: "C-1001",
              productCount: 38,
              children: [
                {
                  id: "C-1006",
                  name: "Headphones",
                  slug: "headphones",
                  parentId: "C-1005",
                  productCount: 22
                },
                {
                  id: "C-1007",
                  name: "Speakers",
                  slug: "speakers",
                  parentId: "C-1005",
                  productCount: 16
                }
              ]
            }
          ]
        },
        {
          id: "C-2001",
          name: "Clothing",
          slug: "clothing",
          parentId: null,
          productCount: 98,
          children: [
            {
              id: "C-2002",
              name: "Men",
              slug: "men",
              parentId: "C-2001",
              productCount: 42
            },
            {
              id: "C-2003",
              name: "Women",
              slug: "women",
              parentId: "C-2001",
              productCount: 56
            }
          ]
        },
        {
          id: "C-3001",
          name: "Home & Kitchen",
          slug: "home-kitchen",
          parentId: null,
          productCount: 67
        }
      ];
      
      res.json(mockCategories);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post(`${apiPrefix}/categories`, async (req: Request, res: Response) => {
    try {
      const categoryData = validateSchema(insertCategorySchema, req.body);
      const category = await storage.createCategory(categoryData);
      res.status(201).json(category);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Brand Routes
  app.get(`${apiPrefix}/brands`, async (req: Request, res: Response) => {
    try {
      const brands = await storage.getBrands();
      
      // Mock data for demo
      const mockBrands = [
        {
          id: "B-1001",
          name: "Apple",
          logo: "https://cdn-icons-png.flaticon.com/512/0/747.png",
          productCount: 35,
          description: "Apple Inc. is an American multinational technology company that designs, develops, and sells consumer electronics, computer software, and online services."
        },
        {
          id: "B-1002",
          name: "Samsung",
          logo: "https://cdn-icons-png.flaticon.com/512/882/882849.png",
          productCount: 42,
          description: "Samsung Electronics Co., Ltd. is a South Korean multinational electronics company headquartered in Suwon, South Korea."
        },
        {
          id: "B-1003",
          name: "Nike",
          logo: "https://cdn-icons-png.flaticon.com/512/732/732084.png",
          productCount: 28,
          description: "Nike, Inc. is an American multinational corporation that is engaged in the design, development, manufacturing, and worldwide marketing and sales of footwear, apparel, equipment, accessories, and services."
        },
        {
          id: "B-1004",
          name: "Sony",
          logo: "https://cdn-icons-png.flaticon.com/512/731/731970.png",
          productCount: 22,
          description: "Sony Corporation is a Japanese multinational conglomerate corporation headquartered in Kōnan, Minato, Tokyo, Japan."
        },
        {
          id: "B-1005",
          name: "Adidas",
          logo: "https://cdn-icons-png.flaticon.com/512/731/731962.png",
          productCount: 19,
          description: "Adidas AG is a German multinational corporation that designs and manufactures shoes, clothing and accessories."
        },
        {
          id: "B-1006",
          name: "Microsoft",
          logo: "https://cdn-icons-png.flaticon.com/512/732/732221.png",
          productCount: 15,
          description: "Microsoft Corporation is an American multinational technology corporation which produces computer software, consumer electronics, personal computers, and related services."
        }
      ];
      
      res.json(mockBrands);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post(`${apiPrefix}/brands`, async (req: Request, res: Response) => {
    try {
      const brandData = validateSchema(insertBrandSchema, req.body);
      const brand = await storage.createBrand(brandData);
      res.status(201).json(brand);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Order Routes
  app.get(`${apiPrefix}/orders`, async (req: Request, res: Response) => {
    try {
      // Mock data for orders
      const orders = [
        {
          id: "#ORD-7245",
          customer: {
            id: "C-1001",
            name: "Sophie Moore",
            email: "sophie.moore@example.com"
          },
          amount: "$149.99",
          items: 3,
          status: "Delivered",
          paymentStatus: "Paid",
          date: "July 11, 2023"
        },
        {
          id: "#ORD-7244",
          customer: {
            id: "C-1002",
            name: "Michael Foster",
            email: "michael.foster@example.com"
          },
          amount: "$89.99",
          items: 1,
          status: "Shipped",
          paymentStatus: "Paid",
          date: "July 10, 2023"
        },
        {
          id: "#ORD-7243",
          customer: {
            id: "C-1003",
            name: "Emma Wilson",
            email: "emma.wilson@example.com"
          },
          amount: "$299.99",
          items: 4,
          status: "Pending",
          paymentStatus: "Unpaid",
          date: "July 9, 2023"
        },
        {
          id: "#ORD-7242",
          customer: {
            id: "C-1004",
            name: "Robert Fox",
            email: "robert.fox@example.com"
          },
          amount: "$59.99",
          items: 2,
          status: "Delivered",
          paymentStatus: "Paid",
          date: "July 8, 2023"
        },
        {
          id: "#ORD-7241",
          customer: {
            id: "C-1005",
            name: "Jane Cooper",
            email: "jane.cooper@example.com"
          },
          amount: "$129.99",
          items: 1,
          status: "Cancelled",
          paymentStatus: "Refunded",
          date: "July 7, 2023"
        }
      ];
      
      res.json(orders);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get(`${apiPrefix}/orders/:id`, async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      
      // Mock detailed order data for demo
      const order = {
        id: id,
        customer: {
          id: "C-1001",
          name: "Sophie Moore",
          email: "sophie.moore@example.com",
          phone: "+1 (555) 123-4567",
          address: {
            street: "123 Main St",
            city: "San Francisco",
            state: "CA",
            zip: "94105",
            country: "United States"
          }
        },
        shipping: {
          method: "Standard Shipping (3-5 business days)",
          trackingNumber: "TRK12345678",
          estimatedDelivery: "July 15, 2023"
        },
        payment: {
          method: "Credit Card",
          status: "Paid",
          cardLast4: "4242"
        },
        items: [
          {
            id: "OI-1001",
            name: "Wireless Headphones",
            sku: "SKU-001",
            price: "$89.99",
            quantity: 1,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80"
          },
          {
            id: "OI-1002",
            name: "Phone Case",
            sku: "SKU-002",
            price: "$19.99",
            quantity: 1,
            image: "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80"
          },
          {
            id: "OI-1003",
            name: "USB-C Cable",
            sku: "SKU-003",
            price: "$12.99",
            quantity: 2,
            image: "https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?ixlib=rb-1.2.1&auto=format&fit=crop&w=64&q=80"
          }
        ],
        status: "Delivered",
        subtotal: "$135.96",
        shipping_cost: "$5.99",
        tax: "$8.04",
        total: "$149.99",
        notes: "Please leave package at the door",
        date: "July 11, 2023"
      };
      
      res.json(order);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Customer Routes
  app.get(`${apiPrefix}/customers`, async (req: Request, res: Response) => {
    try {
      // Mock data for customers
      const customers = [
        {
          id: "C-1001",
          name: "Sophie Moore",
          email: "sophie.moore@example.com",
          avatar: "https://randomuser.me/api/portraits/women/65.jpg",
          orderCount: 8,
          totalSpent: "$849.92",
          status: "Active",
          registrationDate: "Jan 15, 2023"
        },
        {
          id: "C-1002",
          name: "Michael Foster",
          email: "michael.foster@example.com",
          avatar: "https://randomuser.me/api/portraits/men/42.jpg",
          orderCount: 6,
          totalSpent: "$629.94",
          status: "Active",
          registrationDate: "Feb 3, 2023"
        },
        {
          id: "C-1003",
          name: "Emma Wilson",
          email: "emma.wilson@example.com",
          avatar: "https://randomuser.me/api/portraits/women/33.jpg",
          orderCount: 4,
          totalSpent: "$479.96",
          status: "Active",
          registrationDate: "Feb 18, 2023"
        },
        {
          id: "C-1004",
          name: "Robert Fox",
          email: "robert.fox@example.com",
          avatar: "https://randomuser.me/api/portraits/men/95.jpg",
          orderCount: 3,
          totalSpent: "$179.97",
          status: "Inactive",
          registrationDate: "Mar 5, 2023"
        },
        {
          id: "C-1005",
          name: "Jane Cooper",
          email: "jane.cooper@example.com",
          avatar: "https://randomuser.me/api/portraits/women/72.jpg",
          orderCount: 5,
          totalSpent: "$599.95",
          status: "Active",
          registrationDate: "Mar 12, 2023"
        }
      ];
      
      res.json(customers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Refund Routes
  app.get(`${apiPrefix}/refunds`, async (req: Request, res: Response) => {
    try {
      // Mock data for refunds
      const refunds = [
        {
          id: "RF-1001",
          orderNumber: "#ORD-7241",
          customer: {
            id: "C-1005",
            name: "Jane Cooper",
            email: "jane.cooper@example.com"
          },
          amount: "$129.99",
          reason: "Product not as described. The color is different from what was shown in the product images.",
          status: "Approved",
          date: "July 8, 2023"
        },
        {
          id: "RF-1002",
          orderNumber: "#ORD-7239",
          customer: {
            id: "C-1002",
            name: "Michael Foster",
            email: "michael.foster@example.com"
          },
          amount: "$49.99",
          reason: "Received damaged item. The packaging was crushed and the product inside is broken.",
          status: "Pending",
          date: "July 9, 2023"
        },
        {
          id: "RF-1003",
          orderNumber: "#ORD-7235",
          customer: {
            id: "C-1001",
            name: "Sophie Moore",
            email: "sophie.moore@example.com"
          },
          amount: "$89.99",
          reason: "Ordered wrong size. Would like to return for a refund instead of exchanging.",
          status: "Pending",
          date: "July 10, 2023"
        },
        {
          id: "RF-1004",
          orderNumber: "#ORD-7230",
          customer: {
            id: "C-1003",
            name: "Emma Wilson",
            email: "emma.wilson@example.com"
          },
          amount: "$199.99",
          reason: "Item doesn't meet expectations. The quality is much lower than I expected for the price.",
          status: "Rejected",
          date: "July 11, 2023"
        },
        {
          id: "RF-1005",
          orderNumber: "#ORD-7225",
          customer: {
            id: "C-1004",
            name: "Robert Fox",
            email: "robert.fox@example.com"
          },
          amount: "$59.99",
          reason: "Found better price elsewhere. Would like to return the unused item.",
          status: "Pending",
          date: "July 12, 2023"
        }
      ];
      
      res.json(refunds);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post(`${apiPrefix}/refunds`, async (req: Request, res: Response) => {
    try {
      const refundData = validateSchema(insertRefundSchema, req.body);
      const refund = await storage.createRefund(refundData);
      res.status(201).json(refund);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Refund Settings Routes
  app.get(`${apiPrefix}/refund-settings`, async (req: Request, res: Response) => {
    try {
      const settings = await storage.getRefundSettings();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put(`${apiPrefix}/refund-settings`, async (req: Request, res: Response) => {
    try {
      const settingsData = validateSchema(insertRefundSettingsSchema, req.body);
      const settings = await storage.updateRefundSettings(settingsData);
      res.json(settings);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Support Tickets Routes
  app.get(`${apiPrefix}/support-tickets`, async (req: Request, res: Response) => {
    try {
      // Mock data for support tickets
      const tickets = [
        {
          id: "TICKET-1001",
          customer: {
            id: "C-1001",
            name: "Sophie Moore",
            email: "sophie.moore@example.com",
            avatar: "https://randomuser.me/api/portraits/women/65.jpg"
          },
          subject: "Order not delivered",
          issueType: "Order Issue",
          status: "Open",
          priority: "High",
          lastResponseDate: "July 10, 2023",
          createdDate: "July 8, 2023"
        },
        {
          id: "TICKET-1002",
          customer: {
            id: "C-1002",
            name: "Michael Foster",
            email: "michael.foster@example.com",
            avatar: "https://randomuser.me/api/portraits/men/42.jpg"
          },
          subject: "How do I change my password?",
          issueType: "Account",
          status: "Closed",
          priority: "Low",
          lastResponseDate: "July 9, 2023",
          createdDate: "July 9, 2023"
        },
        {
          id: "TICKET-1003",
          customer: {
            id: "C-1003",
            name: "Emma Wilson",
            email: "emma.wilson@example.com",
            avatar: "https://randomuser.me/api/portraits/women/33.jpg"
          },
          subject: "Received wrong item",
          issueType: "Order Issue",
          status: "In Progress",
          priority: "Medium",
          lastResponseDate: "July 11, 2023",
          createdDate: "July 10, 2023"
        },
        {
          id: "TICKET-1004",
          customer: {
            id: "C-1004",
            name: "Robert Fox",
            email: "robert.fox@example.com",
            avatar: "https://randomuser.me/api/portraits/men/95.jpg"
          },
          subject: "Request for refund",
          issueType: "Refund",
          status: "Open",
          priority: "Medium",
          lastResponseDate: null,
          createdDate: "July 11, 2023"
        },
        {
          id: "TICKET-1005",
          customer: {
            id: "C-1005",
            name: "Jane Cooper",
            email: "jane.cooper@example.com",
            avatar: "https://randomuser.me/api/portraits/women/72.jpg"
          },
          subject: "Product defective",
          issueType: "Product Issue",
          status: "Open",
          priority: "Urgent",
          lastResponseDate: null,
          createdDate: "July 12, 2023"
        }
      ];
      
      res.json(tickets);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post(`${apiPrefix}/support-tickets`, async (req: Request, res: Response) => {
    try {
      const ticketData = validateSchema(insertSupportTicketSchema, req.body);
      const ticket = await storage.createSupportTicket(ticketData);
      res.status(201).json(ticket);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post(`${apiPrefix}/support-tickets/:id/replies`, async (req: Request, res: Response) => {
    try {
      const ticketId = Number(req.params.id);
      const replyData = validateSchema(insertTicketReplySchema, { ...req.body, ticketId });
      const reply = await storage.addTicketReply(replyData);
      res.status(201).json(reply);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  // Site Settings Routes
  app.get(`${apiPrefix}/site-settings`, async (req: Request, res: Response) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put(`${apiPrefix}/site-settings`, async (req: Request, res: Response) => {
    try {
      const settingsData = validateSchema(insertSiteSettingsSchema.partial(), req.body);
      const settings = await storage.updateSiteSettings(settingsData);
      res.json(settings);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
