import {
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  boolean,
  decimal,
  date,
  unique,
} from "drizzle-orm/pg-core";

// Users table (for authentication)
export const usersTable = pgTable("users", {
  id: varchar("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  username: varchar("username", { length: 255 }).notNull(),
  role: varchar("role", { length: 10 }).default("user").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Hotels table (pre-populated, read-only for users)

export const hotelsTable = pgTable("hotels", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  pricePerNight: integer("price_per_night").notNull(),
  imageUrl: text("imageUrl"),
  createdAt: timestamp("created_at").defaultNow(),
  totalRating: integer("total_rating").default(0).notNull(),
  ratingCount: integer("rating_count").default(0).notNull(),
  guests: integer("guests").default(1).notNull(), // new
});

// Bookings table to connect users with hotels
export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  hotelId: integer("hotel_id")
    .notNull()
    .references(() => hotelsTable.id, { onDelete: "cascade" }),
  specialInfo: text("special_info"),
  daysCount: integer("days_count").notNull(),
  guests: integer("guests").default(1).notNull(),
  allInclusive: boolean("all-inclusive").default(false),
  totalPrice: integer("total-price").notNull(),
  checkInDate: timestamp("check_in_date").notNull(),
  checkOutDate: timestamp("check_out_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const opinionsTable = pgTable(
  "opinions",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    hotelId: integer("hotel_id")
      .notNull()
      .references(() => hotelsTable.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(),
    content: text("content"),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => {
    return {
      uniqueUserHotel: unique().on(table.userId, table.hotelId), // Zapewnia, że użytkownik oceni dany hotel tylko raz
    };
  }
);

// Type inference exports
export type InsertUser = typeof usersTable.$inferInsert;
export type SelectUser = typeof usersTable.$inferSelect;

export type InsertHotel = typeof hotelsTable.$inferInsert;
export type SelectHotel = typeof hotelsTable.$inferSelect;

export type InsertBooking = typeof bookingsTable.$inferInsert;
export type SelectBooking = typeof bookingsTable.$inferSelect;

export type InsertOpinion = typeof opinionsTable.$inferInsert;
export type SelectOpinion = typeof opinionsTable.$inferSelect;
