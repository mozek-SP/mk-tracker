import { pgTable, text, timestamp, integer, decimal, date } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Branches Table
export const branches = pgTable("branches", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    code: text("code").notNull(),
    name: text("name").notNull(),
    province: text("province"),
    phone: text("phone"),
    type: text("type").notNull(), // MK Restaurant, MK Gold, etc.
    phase: text("phase").notNull(), // 1, 2, ..., Renovate
    zone: text("zone").notNull(), // BKK, UPC
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

// Machines Table
export const machines = pgTable("machines", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    branchId: text("branch_id").references(() => branches.id, { onDelete: 'cascade' }).notNull(),
    name: text("name").notNull(), // CI-10, CI-5, etc.
    sn: text("sn").notNull(),
    installDate: date("install_date").notNull(),
    pos: text("pos").notNull(),
    status: text("status").notNull(),
    remark: text("remark"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

// Expenses Table
export const expenses = pgTable("expenses", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    branchId: text("branch_id").references(() => branches.id, { onDelete: 'cascade' }).notNull(),
    date: date("date").notNull(),
    type: text("type").notNull(), // Maintenance, Repair, etc.
    detail: text("detail").notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    technician: text("technician"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

// Spare Parts Table
export const spareParts = pgTable("spare_parts", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    branchId: text("branch_id").references(() => branches.id, { onDelete: 'cascade' }).notNull(),
    date: date("date").notNull(),
    device: text("device").notNull(),
    partName: text("part_name").notNull(),
    qty: integer("qty").notNull().default(1),
    unitPrice: decimal("unit_price", { precision: 10, scale: 2 }).notNull(),
    totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(),
    technician: text("technician"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

// Corrective Maintenance (CM) Table
export const cms = pgTable("cms", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    branchId: text("branch_id").references(() => branches.id, { onDelete: 'cascade' }).notNull(),
    machineId: text("machine_id").references(() => machines.id, { onDelete: 'cascade' }).notNull(),
    date: date("date").notNull(),
    symptom: text("symptom").notNull(),
    solution: text("solution").notNull(),
    technicians: text("technicians"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

