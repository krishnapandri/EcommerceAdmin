import { z } from "zod";
import "reflect-metadata";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, EntitySchema } from "typeorm";

// Enum Types
export type ProductStatus = "draft" | "published" | "archived";
export type OrderStatus = "pending" | "shipped" | "delivered" | "cancelled";
export type PaymentStatus = "paid" | "unpaid" | "refunded";
export type RefundStatus = "pending" | "approved" | "rejected";
export type CustomerStatus = "active" | "inactive";
export type TicketStatus = "open" | "in_progress" | "resolved" | "closed";
export type TicketPriority = "low" | "medium" | "high" | "urgent";
export type ReviewStatus = "pending" | "approved" | "rejected";

// Entities
@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar' })
  username: string;

  @Column({ type: 'varchar' })
  password: string;
}

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: string;

  @Column({ type: 'int', default: 0 })
  stock: number;

  @Column({ unique: true, type: 'varchar' })
  sku: string;

  @Column({ nullable: true, type: 'varchar' })
  image: string | null;

  @Column({ type: 'varchar', default: 'published' })
  status: ProductStatus;

  @Column({ nullable: true, type: 'int' })
  categoryId: number | null;

  @Column({ nullable: true, type: 'int' })
  brandId: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Category, category => category.products)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @ManyToOne(() => Brand, brand => brand.products)
  @JoinColumn({ name: 'brandId' })
  brand: Brand;

  @OneToMany(() => OrderItem, orderItem => orderItem.product)
  orderItems: OrderItem[];

  @OneToMany(() => ProductReview, review => review.product)
  reviews: ProductReview[];
}

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ unique: true, type: 'varchar' })
  slug: string;

  @Column({ nullable: true, type: 'int' })
  parentId: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Category, category => category.children)
  @JoinColumn({ name: 'parentId' })
  parent: Category;

  @OneToMany(() => Category, category => category.parent)
  children: Category[];

  @OneToMany(() => Product, product => product.category)
  products: Product[];
}

@Entity("brands")
export class Brand {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar' })
  name: string;

  @Column({ nullable: true, type: 'varchar' })
  logo: string | null;

  @Column({ nullable: true, type: 'text' })
  description: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Product, product => product.brand)
  products: Product[];
}

@Entity("customers")
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ unique: true, type: 'varchar' })
  email: string;

  @Column({ nullable: true, type: 'varchar' })
  phone: string | null;

  @Column({ nullable: true, type: 'varchar' })
  avatar: string | null;

  @Column({ type: 'varchar', default: 'active' })
  status: CustomerStatus;

  @Column({ type: 'simple-json', nullable: true })
  address: any;

  @CreateDateColumn({ name: 'registration_date' })
  registrationDate: Date;

  @OneToMany(() => Order, order => order.customer)
  orders: Order[];

  @OneToMany(() => ProductReview, review => review.customer)
  reviews: ProductReview[];

  @OneToMany(() => Refund, refund => refund.customer)
  refunds: Refund[];

  @OneToMany(() => SupportTicket, ticket => ticket.customer)
  supportTickets: SupportTicket[];
}

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar' })
  orderNumber: string;

  @Column({ type: 'int' })
  customerId: number;

  @Column({ type: 'varchar', default: 'pending' })
  status: OrderStatus;

  @Column({ type: 'varchar', default: 'unpaid' })
  paymentStatus: PaymentStatus;

  @Column({ nullable: true, type: 'varchar' })
  paymentMethod: string | null;

  @Column({ nullable: true, type: 'varchar' })
  shippingMethod: string | null;

  @Column({ type: 'simple-json' })
  shippingAddress: any;

  @Column({ nullable: true, type: 'varchar' })
  trackingNumber: string | null;

  @Column({ nullable: true, type: 'varchar' })
  estimatedDelivery: string | null;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  subtotal: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  shippingCost: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  tax: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total: string;

  @Column({ nullable: true, type: 'text' })
  notes: string | null;

  @CreateDateColumn()
  orderDate: Date;

  @ManyToOne(() => Customer, customer => customer.orders)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  items: OrderItem[];

  @OneToMany(() => Refund, refund => refund.order)
  refunds: Refund[];

  @OneToMany(() => SupportTicket, ticket => ticket.order)
  supportTickets: SupportTicket[];
}

@Entity("order_items")
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  orderId: number;

  @Column({ type: 'int' })
  productId: number;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: string;

  @ManyToOne(() => Order, order => order.items)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Product, product => product.orderItems)
  @JoinColumn({ name: 'productId' })
  product: Product;
}

@Entity("product_reviews")
export class ProductReview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  productId: number;

  @Column({ type: 'int' })
  customerId: number;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'varchar', default: 'pending' })
  status: ReviewStatus;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Product, product => product.reviews)
  @JoinColumn({ name: 'productId' })
  product: Product;

  @ManyToOne(() => Customer, customer => customer.reviews)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;
}

@Entity("refunds")
export class Refund {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  orderId: number;

  @Column({ type: 'int' })
  customerId: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: string;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'varchar', default: 'pending' })
  status: RefundStatus;

  @Column({ nullable: true, type: 'text' })
  notes: string | null;

  @CreateDateColumn()
  requestDate: Date;

  @Column({ nullable: true, type: 'timestamp' })
  processedDate: Date | null;

  @ManyToOne(() => Order, order => order.refunds)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => Customer, customer => customer.refunds)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;
}

@Entity("refund_settings")
export class RefundSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  timeLimit: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: '0.00' })
  restockingFee: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  autoApproveBelow: string | null;

  @Column({ type: 'simple-json' })
  eligibleStatuses: any;

  @Column({ type: 'text' })
  refundPolicy: string;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity("support_tickets")
export class SupportTicket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, type: 'varchar' })
  ticketNumber: string;

  @Column({ type: 'int' })
  customerId: number;

  @Column({ type: 'varchar' })
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ nullable: true, type: 'int' })
  orderId: number | null;

  @Column({ type: 'varchar', default: 'open' })
  status: TicketStatus;

  @Column({ type: 'varchar', default: 'medium' })
  priority: TicketPriority;

  @Column({ nullable: true, type: 'int' })
  assignedTo: number | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Customer, customer => customer.supportTickets)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @ManyToOne(() => Order, order => order.supportTickets)
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'assignedTo' })
  assignedUser: User;

  @OneToMany(() => TicketReply, reply => reply.ticket)
  replies: TicketReply[];
}

@Entity("ticket_replies")
export class TicketReply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  ticketId: number;

  @Column({ nullable: true, type: 'int' })
  userId: number | null;

  @Column({ nullable: true, type: 'int' })
  customerId: number | null;

  @Column({ type: 'text' })
  message: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => SupportTicket, ticket => ticket.replies)
  @JoinColumn({ name: 'ticketId' })
  ticket: SupportTicket;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;
}

@Entity("site_settings")
export class SiteSettings {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: 'ShopAdmin', type: 'varchar' })
  siteName: string;

  @Column({ nullable: true, type: 'varchar' })
  logo: string | null;

  @Column({ nullable: true, type: 'varchar' })
  favicon: string | null;

  @Column({ default: '#4f46e5', type: 'varchar' })
  primaryColor: string;

  @Column({ default: '#0ea5e9', type: 'varchar' })
  secondaryColor: string;

  @Column({ type: 'varchar' })
  contactEmail: string;

  @Column({ nullable: true, type: 'varchar' })
  contactPhone: string | null;

  @Column({ type: 'simple-json', nullable: true })
  address: any;

  @Column({ type: 'simple-json', nullable: true })
  socialLinks: any;

  @Column({ type: 'simple-json', nullable: true })
  shippingMethods: any;

  @Column({ type: 'simple-json', nullable: true })
  paymentMethods: any;

  @Column({ nullable: true, type: 'text' })
  privacyPolicy: string | null;

  @Column({ nullable: true, type: 'text' })
  termsOfService: string | null;

  @Column({ nullable: true, type: 'text' })
  returnPolicy: string | null;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Zod schemas for validation
export const insertUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6)
});

export const insertProductSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  price: z.string(),
  stock: z.number().default(0),
  sku: z.string().min(1),
  image: z.string().nullable().optional(),
  status: z.enum(["draft", "published", "archived"]).default("published"),
  categoryId: z.number().nullable().optional(),
  brandId: z.number().nullable().optional(),
});

export const insertCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  parentId: z.number().nullable().optional(),
});

export const insertBrandSchema = z.object({
  name: z.string().min(1),
  logo: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});

export const insertCustomerSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().nullable().optional(),
  avatar: z.string().nullable().optional(),
  status: z.enum(["active", "inactive"]).default("active"),
  address: z.any().optional(),
});

export const insertOrderSchema = z.object({
  orderNumber: z.string().min(1),
  customerId: z.number(),
  status: z.enum(["pending", "shipped", "delivered", "cancelled"]).default("pending"),
  paymentStatus: z.enum(["paid", "unpaid", "refunded"]).default("unpaid"),
  paymentMethod: z.string().nullable().optional(),
  shippingMethod: z.string().nullable().optional(),
  shippingAddress: z.any(),
  trackingNumber: z.string().nullable().optional(),
  estimatedDelivery: z.string().nullable().optional(),
  subtotal: z.string(),
  shippingCost: z.string(),
  tax: z.string(),
  total: z.string(),
  notes: z.string().nullable().optional(),
});

export const insertOrderItemSchema = z.object({
  orderId: z.number(),
  productId: z.number(),
  quantity: z.number().min(1),
  price: z.string(),
});

export const insertProductReviewSchema = z.object({
  productId: z.number(),
  customerId: z.number(),
  rating: z.number().min(1).max(5),
  comment: z.string(),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
});

export const insertRefundSchema = z.object({
  orderId: z.number(),
  customerId: z.number(),
  amount: z.string(),
  reason: z.string(),
  status: z.enum(["pending", "approved", "rejected"]).default("pending"),
  notes: z.string().nullable().optional(),
});

export const insertRefundSettingsSchema = z.object({
  timeLimit: z.number(),
  restockingFee: z.string().default("0.00"),
  autoApproveBelow: z.string().nullable().optional(),
  eligibleStatuses: z.any(),
  refundPolicy: z.string(),
});

export const insertSupportTicketSchema = z.object({
  customerId: z.number(),
  subject: z.string().min(1),
  message: z.string().min(1),
  orderId: z.number().nullable().optional(),
  status: z.enum(["open", "in_progress", "resolved", "closed"]).default("open"),
  priority: z.enum(["low", "medium", "high", "urgent"]).default("medium"),
  assignedTo: z.number().nullable().optional(),
});

export const insertTicketReplySchema = z.object({
  ticketId: z.number(),
  userId: z.number().nullable().optional(),
  customerId: z.number().nullable().optional(),
  message: z.string().min(1),
});

export const insertSiteSettingsSchema = z.object({
  siteName: z.string().default("ShopAdmin"),
  logo: z.string().nullable().optional(),
  favicon: z.string().nullable().optional(),
  primaryColor: z.string().default("#4f46e5"),
  secondaryColor: z.string().default("#0ea5e9"),
  contactEmail: z.string().email(),
  contactPhone: z.string().nullable().optional(),
  address: z.any().optional(),
  socialLinks: z.any().optional(),
  shippingMethods: z.any().optional(),
  paymentMethods: z.any().optional(),
  privacyPolicy: z.string().nullable().optional(),
  termsOfService: z.string().nullable().optional(),
  returnPolicy: z.string().nullable().optional(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertBrand = z.infer<typeof insertBrandSchema>;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type InsertProductReview = z.infer<typeof insertProductReviewSchema>;
export type InsertRefund = z.infer<typeof insertRefundSchema>;
export type InsertRefundSettings = z.infer<typeof insertRefundSettingsSchema>;
export type InsertSupportTicket = z.infer<typeof insertSupportTicketSchema>;
export type InsertTicketReply = z.infer<typeof insertTicketReplySchema>;
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
