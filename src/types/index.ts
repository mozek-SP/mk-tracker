export type BranchType = 'MK Restaurant' | 'MK Gold' | 'MK Live' | 'Bonus Suki' | 'Other';
export type Phase = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | 'Renovate' | 'ปิดสาขา';
export type Zone = 'BKK' | 'UPC';
export type MachineStatus = 'พร้อมใช้งาน' | 'รอซ่อม' | 'ยกเลิกการใช้งาน' | 'อื่น ๆ';
export type POSSystem = 'CE' | '12DATA' | 'Other';
export type ExpenseType = 'Maintenance' | 'Repair' | 'Spare Parts' | 'Service' | 'Other';

export interface Branch {
    id: string;
    code: string; // Added code
    name: string;
    province: string;
    phone: string;
    type: string; // Use string to allow custom directly or handle in UI
    phase: string;
    zone: Zone;
}

export interface Machine {
    id: string;
    branchId: string;
    name: string; // CI-10, CI-5, etc.
    sn: string;
    installDate: string;
    pos: string;
    status: string;
    remark?: string;
}

export interface Expense {
    id: string;
    branchId: string;
    date: string;
    type: string;
    detail: string;
    amount: number;
    technician: string;
}

export interface SparePart {
    id: string;
    date: string;
    branchId: string;
    device: string;
    partName: string;
    qty: number;
    unitPrice: number;
    totalPrice: number;
    technician: string;
}

export interface CM {
    id: string;
    branchId: string;
    machineId: string;
    date: string;
    symptom: string;
    solution: string;
    technicians: string;
}
