export type BranchType = 'MK Restaurant' | 'MK Gold' | 'MK Live' | 'Bonus Suki' | 'Other';
export type Phase = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | 'Renovate' | 'Closed';
export type Zone = 'BKK' | 'UPC';
export type MachineStatus = 'Ready' | 'Repair' | 'Cancel' | 'Other';
export type POSSystem = 'CE' | '12DATA' | 'Other';
export type ExpenseType = 'Maintenance' | 'Repair' | 'Spare Parts' | 'Service' | 'Other';

export interface Branch {
    id: string;
    name: string;
    province: string;
    phone: string;
    type: BranchType;
    customType?: string;
    phase: Phase;
    zone: Zone;
}

export interface Machine {
    id: string;
    branchId: string;
    name: string;
    customName?: string;
    sn: string;
    installDate: string;
    pos: POSSystem;
    customPOS?: string;
    status: MachineStatus;
    customStatus?: string;
    note: string;
}

export interface Expense {
    id: string;
    branchId: string;
    date: string;
    type: ExpenseType;
    customType?: string;
    detail: string;
    amount: number;
    technician: string;
}

export interface SparePart {
    id: string;
    date: string;
    branchId: string;
    device: string;
    customDevice?: string;
    partName: string;
    qty: number;
    unitPrice: number;
    totalPrice: number;
    technician: string;
}

export interface MARevenue {
    id: string;
    branchId: string;
    contractDate: string;
    period: string;
    amount: number;
    status: string;
}
