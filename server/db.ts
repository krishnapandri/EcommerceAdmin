import "reflect-metadata";
import { DataSource } from "typeorm";
import * as entities from "@shared/schema";
import dotenv from 'dotenv';
dotenv.config();
// Get all entity classes from the schema file
const allEntities = [
  entities.User,
  entities.Product,
  entities.Category,
  entities.Brand,
  entities.Customer,
  entities.Order,
  entities.OrderItem,
  entities.ProductReview,
  entities.Refund,
  entities.RefundSettings,
  entities.SupportTicket,
  entities.TicketReply,
  entities.SiteSettings
];

// Create TypeORM datasource using PostgreSQL
export const dataSource = new DataSource({
  type: "mssql",
  url: process.env.DATABASE_URL,
  synchronize: true, // Only for development, set to false in production
  logging: false,
  entities: allEntities,
});

// Initialize database connection
export const initializeDatabase = async () => {
  try {
    if (!dataSource.isInitialized) {
      await dataSource.initialize();
      console.log("Database connection initialized");
    }
    return dataSource;
  } catch (error) {
    console.error("Error initializing database connection:", error);
    throw error;
  }
};