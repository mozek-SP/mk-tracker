import { pgTable, serial, text, timestamp, integer, decimal } from "drizzle-orm/pg-core";

// ตัวอย่าง Schema สำหรับเก็บข้อมูลสาขา (Branches)
export const branches = pgTable("branches", {
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    location: text("location"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ตัวอย่าง Schema สำหรับเก็บค่าใช้จ่าย (Expenses)
export const expenses = pgTable("expenses", {
    id: serial("id").primaryKey(),
    branchId: integer("branch_id").references(() => branches.id),
    category: text("category").notNull(), // เช่น ค่าซ่อม, อุปกรณ์
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    description: text("description"),
    date: timestamp("date").defaultNow().notNull(),
});
