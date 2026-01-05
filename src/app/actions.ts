'use server'

import { db } from "@/db";
import { branches, machines, expenses, spareParts, cms } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// --- Branch Actions ---
export async function getBranches() {
    try {
        return await db.select().from(branches).orderBy(desc(branches.createdAt));
    } catch (error) {
        console.error("Failed to get branches:", error);
        return [];
    }
}

export async function upsertBranch(data: any) {
    try {
        const { id, createdAt, updatedAt, ...rest } = data;

        // If it looks like a UUID (length > 20) and we have an ID, try update
        if (id && id.length > 20) {
            await db.update(branches)
                .set({ ...rest, updatedAt: new Date() })
                .where(eq(branches.id, id));
            return { success: true, id };
        } else {
            // New entry
            const result = await db.insert(branches).values(rest).returning({ id: branches.id });
            revalidatePath("/");
            return { success: true, id: result[0].id };
        }
    } catch (error) {
        console.error("Failed to upsert branch:", error);
        return { success: false, error };
    }
}

export async function deleteBranch(id: string) {
    try {
        await db.delete(branches).where(eq(branches.id, id));
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete branch:", error);
        return { success: false, error };
    }
}

// --- Machine Actions ---
export async function getMachines() {
    try {
        return await db.select().from(machines).orderBy(desc(machines.createdAt));
    } catch (error) {
        console.error("Failed to get machines:", error);
        return [];
    }
}

export async function upsertMachine(data: any) {
    try {
        const { id, createdAt, updatedAt, ...rest } = data;
        if (id && id.length > 20) {
            await db.update(machines)
                .set({ ...rest, updatedAt: new Date() })
                .where(eq(machines.id, id));
            return { success: true, id };
        } else {
            const result = await db.insert(machines).values(rest).returning({ id: machines.id });
            revalidatePath("/");
            return { success: true, id: result[0].id };
        }
    } catch (error) {
        console.error("Failed to upsert machine:", error);
        return { success: false, error };
    }
}

export async function deleteMachine(id: string) {
    try {
        await db.delete(machines).where(eq(machines.id, id));
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete machine:", error);
        return { success: false, error };
    }
}

// --- Expense Actions ---
export async function getExpenses() {
    try {
        return await db.select().from(expenses).orderBy(desc(expenses.date));
    } catch (error) {
        console.error("Failed to get expenses:", error);
        return [];
    }
}

export async function upsertExpense(data: any) {
    try {
        const { id, createdAt, updatedAt, ...rest } = data;
        // Ensure amount is decimal/number
        const formattedData = {
            ...rest,
            amount: rest.amount?.toString()
        };

        if (id && id.length > 20) {
            await db.update(expenses)
                .set({ ...formattedData, updatedAt: new Date() })
                .where(eq(expenses.id, id));
            return { success: true, id };
        } else {
            const result = await db.insert(expenses).values(formattedData).returning({ id: expenses.id });
            revalidatePath("/");
            return { success: true, id: result[0].id };
        }
    } catch (error) {
        console.error("Failed to upsert expense:", error);
        return { success: false, error };
    }
}

export async function deleteExpense(id: string) {
    try {
        await db.delete(expenses).where(eq(expenses.id, id));
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete expense:", error);
        return { success: false, error };
    }
}

// --- Spare Part Actions ---
export async function getSpareParts() {
    try {
        return await db.select().from(spareParts).orderBy(desc(spareParts.date));
    } catch (error) {
        console.error("Failed to get spare parts:", error);
        return [];
    }
}

export async function upsertSparePart(data: any) {
    try {
        const { id, createdAt, updatedAt, ...rest } = data;
        const formattedData = {
            ...rest,
            unitPrice: rest.unitPrice?.toString(),
            totalPrice: (rest.qty * rest.unitPrice)?.toString()
        };

        if (id && id.length > 20) {
            await db.update(spareParts)
                .set({ ...formattedData, updatedAt: new Date() })
                .where(eq(spareParts.id, id));
            return { success: true, id };
        } else {
            const result = await db.insert(spareParts).values(formattedData).returning({ id: spareParts.id });
            revalidatePath("/");
            return { success: true, id: result[0].id };
        }
    } catch (error) {
        console.error("Failed to upsert spare part:", error);
        return { success: false, error };
    }
}

export async function deleteSparePart(id: string) {
    try {
        await db.delete(spareParts).where(eq(spareParts.id, id));
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete spare part:", error);
        return { success: false, error };
    }
}

// --- CM Actions ---
export async function getCms() {
    try {
        return await db.select().from(cms).orderBy(desc(cms.date));
    } catch (error) {
        console.error("Failed to get CMs:", error);
        return [];
    }
}

export async function upsertCm(data: any) {
    try {
        const { id, createdAt, updatedAt, ...rest } = data;
        if (id && id.length > 20) {
            await db.update(cms)
                .set({ ...rest, updatedAt: new Date() })
                .where(eq(cms.id, id));
            return { success: true, id };
        } else {
            const result = await db.insert(cms).values(rest).returning({ id: cms.id });
            revalidatePath("/");
            return { success: true, id: result[0].id };
        }
    } catch (error) {
        console.error("Failed to upsert CM:", error);
        return { success: false, error };
    }
}

export async function deleteCm(id: string) {
    try {
        await db.delete(cms).where(eq(cms.id, id));
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Failed to delete CM:", error);
        return { success: false, error };
    }
}

export async function clearAll(type: string) {
    try {
        if (type === 'branches') await db.delete(branches);
        if (type === 'machines') await db.delete(machines);
        if (type === 'expenses') await db.delete(expenses);
        if (type === 'parts') await db.delete(spareParts);
        if (type === 'cms') await db.delete(cms);
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error(`Failed to clear ${type}:`, error);
        return { success: false, error };
    }
}

// --- Bulk Actions ---
export async function bulkInsert(type: 'branches' | 'machines' | 'expenses' | 'parts' | 'cms', data: any[]) {
    try {
        if (data.length === 0) return { success: true };

        if (type === 'branches') {
            await db.insert(branches).values(data.map(d => {
                const { id, ...rest } = d;
                return rest;
            }));
        } else if (type === 'machines') {
            await db.insert(machines).values(data.map(d => {
                const { id, ...rest } = d;
                return { ...rest, updatedAt: new Date() };
            }));
        } else if (type === 'expenses') {
            await db.insert(expenses).values(data.map(d => {
                const { id, ...rest } = d;
                return { ...rest, amount: d.amount.toString(), updatedAt: new Date() };
            }));
        } else if (type === 'parts') {
            await db.insert(spareParts).values(data.map(d => {
                const { id, ...rest } = d;
                return {
                    ...rest,
                    unitPrice: d.unitPrice.toString(),
                    totalPrice: d.totalPrice.toString(),
                    updatedAt: new Date()
                };
            }));
        } else if (type === 'cms') {
            await db.insert(cms).values(data.map(d => {
                const { id, ...rest } = d;
                return { ...rest, updatedAt: new Date() };
            }));
        }

        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error(`Failed to bulk insert ${type}:`, error);
        return { success: false, error };
    }
}
