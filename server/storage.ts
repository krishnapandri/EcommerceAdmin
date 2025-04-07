import {
  users, User, InsertUser,
  products, Product, InsertProduct,
  categories, Category, InsertCategory,
  brands, Brand, InsertBrand,
  customers, Customer, InsertCustomer,
  orders, Order, InsertOrder,
  orderItems, OrderItem, InsertOrderItem,
  productReviews, ProductReview, InsertProductReview,
  refunds, Refund, InsertRefund,
  refundSettings, RefundSettings, InsertRefundSettings,
  supportTickets, SupportTicket, InsertSupportTicket,
  ticketReplies, TicketReply, InsertTicketReply,
  siteSettings, SiteSettings, InsertSiteSettings
} from "@shared/schema";

// Storage interface with all CRUD methods needed for the eCommerce dashboard
export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Products
  getProduct(id: number): Promise<Product | undefined>;
  getProducts(): Promise<Product[]>;
  getTopSellingProducts(limit?: number): Promise<any[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;

  // Categories
  getCategory(id: number): Promise<Category | undefined>;
  getCategories(): Promise<Category[]>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;

  // Brands
  getBrand(id: number): Promise<Brand | undefined>;
  getBrands(): Promise<Brand[]>;
  createBrand(brand: InsertBrand): Promise<Brand>;
  updateBrand(id: number, brand: Partial<InsertBrand>): Promise<Brand | undefined>;
  deleteBrand(id: number): Promise<boolean>;

  // Customers
  getCustomer(id: number): Promise<Customer | undefined>;
  getCustomers(): Promise<Customer[]>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: number): Promise<boolean>;

  // Orders
  getOrder(id: number): Promise<Order | undefined>;
  getOrders(): Promise<Order[]>;
  getOrderWithItems(id: number): Promise<any>;
  getRecentOrders(limit?: number): Promise<any[]>;
  createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order>;
  updateOrderStatus(id: number, status: string): Promise<Order | undefined>;

  // Product Reviews
  getProductReview(id: number): Promise<ProductReview | undefined>;
  getProductReviews(): Promise<ProductReview[]>;
  updateReviewStatus(id: number, status: string): Promise<ProductReview | undefined>;
  deleteReview(id: number): Promise<boolean>;

  // Refunds
  getRefund(id: number): Promise<Refund | undefined>;
  getRefunds(): Promise<Refund[]>;
  createRefund(refund: InsertRefund): Promise<Refund>;
  updateRefundStatus(id: number, status: string, notes?: string): Promise<Refund | undefined>;

  // Refund Settings
  getRefundSettings(): Promise<RefundSettings | undefined>;
  updateRefundSettings(settings: InsertRefundSettings): Promise<RefundSettings>;

  // Support Tickets
  getSupportTicket(id: number): Promise<SupportTicket | undefined>;
  getSupportTickets(): Promise<SupportTicket[]>;
  createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket>;
  updateTicketStatus(id: number, status: string): Promise<SupportTicket | undefined>;
  assignTicket(id: number, userId: number): Promise<SupportTicket | undefined>;
  addTicketReply(reply: InsertTicketReply): Promise<TicketReply>;

  // Site Settings
  getSiteSettings(): Promise<SiteSettings | undefined>;
  updateSiteSettings(settings: Partial<InsertSiteSettings>): Promise<SiteSettings>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private products: Map<number, Product>;
  private categories: Map<number, Category>;
  private brands: Map<number, Brand>;
  private customers: Map<number, Customer>;
  private orders: Map<number, Order>;
  private orderItems: Map<number, OrderItem[]>;
  private productReviews: Map<number, ProductReview>;
  private refunds: Map<number, Refund>;
  private refundSettings: RefundSettings | undefined;
  private supportTickets: Map<number, SupportTicket>;
  private ticketReplies: Map<number, TicketReply[]>;
  private siteSettings: SiteSettings | undefined;

  private userId: number;
  private productId: number;
  private categoryId: number;
  private brandId: number;
  private customerId: number;
  private orderId: number;
  private orderItemId: number;
  private reviewId: number;
  private refundId: number;
  private ticketId: number;
  private replyId: number;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.categories = new Map();
    this.brands = new Map();
    this.customers = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.productReviews = new Map();
    this.refunds = new Map();
    this.supportTickets = new Map();
    this.ticketReplies = new Map();

    this.userId = 1;
    this.productId = 1;
    this.categoryId = 1;
    this.brandId = 1;
    this.customerId = 1;
    this.orderId = 1;
    this.orderItemId = 1;
    this.reviewId = 1;
    this.refundId = 1;
    this.ticketId = 1;
    this.replyId = 1;

    // Initialize with demo data
    this.initializeDemoData();
  }

  // Initialize with some demo data
  private initializeDemoData() {
    // Set up default site settings
    this.siteSettings = {
      id: 1,
      siteName: "ShopAdmin",
      logo: null,
      favicon: null,
      primaryColor: "#4f46e5",
      secondaryColor: "#0ea5e9",
      contactEmail: "contact@shopadmin.com",
      contactPhone: null,
      address: null,
      socialLinks: null,
      shippingMethods: null,
      paymentMethods: null,
      privacyPolicy: null,
      termsOfService: null,
      returnPolicy: null,
      updatedAt: new Date()
    };

    // Set up default refund settings
    this.refundSettings = {
      id: 1,
      timeLimit: 30,
      restockingFee: "0.00",
      autoApproveBelow: "25.00",
      eligibleStatuses: ["delivered"],
      refundPolicy: "Customers can return items within 30 days of delivery for a full refund.",
      updatedAt: new Date()
    };

    // Create demo admin user
    this.createUser({
      username: "admin",
      password: "admin123"
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Products
  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getTopSellingProducts(limit: number = 5): Promise<any[]> {
    // In a real DB, this would join with order items to find top selling products
    // For demo, just return some products with mock data
    return Array.from(this.products.values())
      .slice(0, limit)
      .map((product, index) => ({
        id: product.id.toString(),
        name: product.name,
        image: product.image || `https://placehold.co/300x300?text=${encodeURIComponent(product.name)}`,
        soldCount: 1000 - (index * 100),
        price: `$${product.price}`,
        percentageChange: 24.5 - (index * 2.1)
      }));
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const now = new Date();
    const newProduct: Product = { 
      ...product, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.products.set(id, newProduct);
    return newProduct;
  }

  async updateProduct(id: number, product: Partial<InsertProduct>): Promise<Product | undefined> {
    const existingProduct = this.products.get(id);
    if (!existingProduct) return undefined;

    const updatedProduct: Product = { 
      ...existingProduct, 
      ...product, 
      updatedAt: new Date() 
    };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }

  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }

  // Categories
  async getCategory(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const now = new Date();
    const newCategory: Category = { 
      ...category, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.categories.set(id, newCategory);
    return newCategory;
  }

  async updateCategory(id: number, category: Partial<InsertCategory>): Promise<Category | undefined> {
    const existingCategory = this.categories.get(id);
    if (!existingCategory) return undefined;

    const updatedCategory: Category = { 
      ...existingCategory, 
      ...category, 
      updatedAt: new Date() 
    };
    this.categories.set(id, updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: number): Promise<boolean> {
    return this.categories.delete(id);
  }

  // Brands
  async getBrand(id: number): Promise<Brand | undefined> {
    return this.brands.get(id);
  }

  async getBrands(): Promise<Brand[]> {
    return Array.from(this.brands.values());
  }

  async createBrand(brand: InsertBrand): Promise<Brand> {
    const id = this.brandId++;
    const now = new Date();
    const newBrand: Brand = { 
      ...brand, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.brands.set(id, newBrand);
    return newBrand;
  }

  async updateBrand(id: number, brand: Partial<InsertBrand>): Promise<Brand | undefined> {
    const existingBrand = this.brands.get(id);
    if (!existingBrand) return undefined;

    const updatedBrand: Brand = { 
      ...existingBrand, 
      ...brand, 
      updatedAt: new Date() 
    };
    this.brands.set(id, updatedBrand);
    return updatedBrand;
  }

  async deleteBrand(id: number): Promise<boolean> {
    return this.brands.delete(id);
  }

  // Customers
  async getCustomer(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const id = this.customerId++;
    const newCustomer: Customer = { 
      ...customer, 
      id,
      registrationDate: new Date()
    };
    this.customers.set(id, newCustomer);
    return newCustomer;
  }

  async updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const existingCustomer = this.customers.get(id);
    if (!existingCustomer) return undefined;

    const updatedCustomer: Customer = { 
      ...existingCustomer, 
      ...customer 
    };
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }

  async deleteCustomer(id: number): Promise<boolean> {
    return this.customers.delete(id);
  }

  // Orders
  async getOrder(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async getOrderWithItems(id: number): Promise<any> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    const items = this.orderItems.get(id) || [];
    const customer = this.customers.get(order.customerId);

    return {
      ...order,
      customer,
      items: items.map(item => {
        const product = this.products.get(item.productId);
        return {
          ...item,
          product
        };
      })
    };
  }

  async getRecentOrders(limit: number = 4): Promise<any[]> {
    // Sort by orderDate, most recent first
    const sortedOrders = Array.from(this.orders.values())
      .sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime())
      .slice(0, limit);

    // Enhance with customer data
    return sortedOrders.map(order => {
      const customer = this.customers.get(order.customerId);
      return {
        id: order.orderNumber,
        customer: {
          id: customer?.id.toString() || "",
          name: customer?.name || "Unknown Customer",
          avatar: customer?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(customer?.name || "Unknown")}`
        },
        amount: `$${order.total}`,
        status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
        date: order.orderDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      };
    });
  }

  async createOrder(order: InsertOrder, items: InsertOrderItem[]): Promise<Order> {
    const id = this.orderId++;
    const orderNumber = `ORD-${String(id).padStart(4, '0')}`;
    
    const newOrder: Order = { 
      ...order, 
      id,
      orderNumber,
      orderDate: new Date()
    };
    this.orders.set(id, newOrder);

    // Store order items
    const orderItemsList: OrderItem[] = [];
    for (const item of items) {
      const itemId = this.orderItemId++;
      const orderItem: OrderItem = {
        ...item,
        id: itemId,
        orderId: id
      };
      orderItemsList.push(orderItem);
    }
    this.orderItems.set(id, orderItemsList);

    return newOrder;
  }

  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;

    // Validate status is one of the enum values
    if (!["pending", "shipped", "delivered", "cancelled"].includes(status)) {
      throw new Error("Invalid order status");
    }

    const updatedOrder: Order = {
      ...order,
      status: status as any
    };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }

  // Product Reviews
  async getProductReview(id: number): Promise<ProductReview | undefined> {
    return this.productReviews.get(id);
  }

  async getProductReviews(): Promise<ProductReview[]> {
    return Array.from(this.productReviews.values());
  }

  async updateReviewStatus(id: number, status: string): Promise<ProductReview | undefined> {
    const review = this.productReviews.get(id);
    if (!review) return undefined;

    // Validate status is one of the enum values
    if (!["pending", "approved", "rejected"].includes(status)) {
      throw new Error("Invalid review status");
    }

    const updatedReview: ProductReview = {
      ...review,
      status: status as any
    };
    this.productReviews.set(id, updatedReview);
    return updatedReview;
  }

  async deleteReview(id: number): Promise<boolean> {
    return this.productReviews.delete(id);
  }

  // Refunds
  async getRefund(id: number): Promise<Refund | undefined> {
    return this.refunds.get(id);
  }

  async getRefunds(): Promise<Refund[]> {
    return Array.from(this.refunds.values());
  }

  async createRefund(refund: InsertRefund): Promise<Refund> {
    const id = this.refundId++;
    const newRefund: Refund = { 
      ...refund, 
      id,
      requestDate: new Date(),
      processedDate: null
    };
    this.refunds.set(id, newRefund);
    return newRefund;
  }

  async updateRefundStatus(id: number, status: string, notes?: string): Promise<Refund | undefined> {
    const refund = this.refunds.get(id);
    if (!refund) return undefined;

    // Validate status is one of the enum values
    if (!["pending", "approved", "rejected"].includes(status)) {
      throw new Error("Invalid refund status");
    }

    const updatedRefund: Refund = {
      ...refund,
      status: status as any,
      notes: notes || refund.notes,
      processedDate: ["approved", "rejected"].includes(status) ? new Date() : null
    };
    this.refunds.set(id, updatedRefund);
    return updatedRefund;
  }

  // Refund Settings
  async getRefundSettings(): Promise<RefundSettings | undefined> {
    return this.refundSettings;
  }

  async updateRefundSettings(settings: InsertRefundSettings): Promise<RefundSettings> {
    this.refundSettings = {
      ...this.refundSettings,
      ...settings,
      id: 1,
      updatedAt: new Date()
    };
    return this.refundSettings;
  }

  // Support Tickets
  async getSupportTicket(id: number): Promise<SupportTicket | undefined> {
    return this.supportTickets.get(id);
  }

  async getSupportTickets(): Promise<SupportTicket[]> {
    return Array.from(this.supportTickets.values());
  }

  async createSupportTicket(ticket: InsertSupportTicket): Promise<SupportTicket> {
    const id = this.ticketId++;
    const ticketNumber = `TICKET-${String(id).padStart(4, '0')}`;
    const now = new Date();
    
    const newTicket: SupportTicket = { 
      ...ticket, 
      id,
      ticketNumber,
      createdAt: now,
      updatedAt: now
    };
    this.supportTickets.set(id, newTicket);
    return newTicket;
  }

  async updateTicketStatus(id: number, status: string): Promise<SupportTicket | undefined> {
    const ticket = this.supportTickets.get(id);
    if (!ticket) return undefined;

    // Validate status is one of the enum values
    if (!["open", "in_progress", "resolved", "closed"].includes(status)) {
      throw new Error("Invalid ticket status");
    }

    const updatedTicket: SupportTicket = {
      ...ticket,
      status: status as any,
      updatedAt: new Date()
    };
    this.supportTickets.set(id, updatedTicket);
    return updatedTicket;
  }

  async assignTicket(id: number, userId: number): Promise<SupportTicket | undefined> {
    const ticket = this.supportTickets.get(id);
    if (!ticket) return undefined;

    const user = this.users.get(userId);
    if (!user) throw new Error("User not found");

    const updatedTicket: SupportTicket = {
      ...ticket,
      assignedTo: userId,
      updatedAt: new Date()
    };
    this.supportTickets.set(id, updatedTicket);
    return updatedTicket;
  }

  async addTicketReply(reply: InsertTicketReply): Promise<TicketReply> {
    const id = this.replyId++;
    const newReply: TicketReply = { 
      ...reply, 
      id,
      createdAt: new Date()
    };
    
    const existingReplies = this.ticketReplies.get(reply.ticketId) || [];
    this.ticketReplies.set(reply.ticketId, [...existingReplies, newReply]);
    
    // Update ticket updatedAt time
    const ticket = this.supportTickets.get(reply.ticketId);
    if (ticket) {
      this.supportTickets.set(reply.ticketId, {
        ...ticket,
        updatedAt: new Date()
      });
    }
    
    return newReply;
  }

  // Site Settings
  async getSiteSettings(): Promise<SiteSettings | undefined> {
    return this.siteSettings;
  }

  async updateSiteSettings(settings: Partial<InsertSiteSettings>): Promise<SiteSettings> {
    this.siteSettings = {
      ...this.siteSettings!,
      ...settings,
      id: 1,
      updatedAt: new Date()
    };
    return this.siteSettings;
  }
}

export const storage = new MemStorage();
