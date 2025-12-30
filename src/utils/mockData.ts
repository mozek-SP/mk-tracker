import { Branch, Machine, Expense, SparePart, MARevenue } from '../types';

export const mockBranches: Branch[] = [
    { id: '1', name: 'MK Central World', province: 'Bangkok', phone: '02-123-4567', type: 'MK Restaurant', phase: '1', zone: 'BKK' },
    { id: '2', name: 'MK Gold Siam Paragon', province: 'Bangkok', phone: '02-987-6543', type: 'MK Gold', phase: '2', zone: 'BKK' },
    { id: '3', name: 'MK Live EmQuartier', province: 'Bangkok', phone: '02-333-4444', type: 'MK Live', phase: '1', zone: 'BKK' },
    { id: '4', name: 'MK Central Festival Chiang Mai', province: 'Chiang Mai', phone: '053-111-222', type: 'MK Restaurant', phase: '3', zone: 'UPC' },
    { id: '5', name: 'Bonus Suki Gateway Ekkamai', province: 'Bangkok', phone: '02-555-6666', type: 'Bonus Suki', phase: '5', zone: 'BKK' },
];

export const mockMachines: Machine[] = [
    { id: 'M1', branchId: '1', name: 'CI-10', sn: 'SN001', installDate: '2023-01-15', pos: 'CE', status: 'Ready', note: 'Main POS' },
    { id: 'M2', branchId: '1', name: 'CI-15', sn: 'SN002', installDate: '2023-06-20', pos: 'CE', status: 'Ready', note: 'Kitchen Display' },
    { id: 'M3', branchId: '2', name: 'RK-10', sn: 'SN003', installDate: '2022-11-05', pos: '12DATA', status: 'Repair', note: 'Scanner issues' },
];

export const mockExpenses: Expense[] = [
    { id: 'E1', branchId: '1', date: '2023-12-01', type: 'Maintenance', detail: 'Monthly checkup', amount: 1500, technician: 'Somchai' },
    { id: 'E2', branchId: '2', date: '2023-12-15', type: 'Repair', detail: 'POS screen replacement', amount: 4500, technician: 'Wichai' },
    { id: 'E3', branchId: '4', date: '2023-12-20', type: 'Spare Parts', detail: 'New cable', amount: 500, technician: 'Anan' },
];

export const mockSpareParts: SparePart[] = [
    { id: 'S1', date: '2023-12-05', branchId: '1', device: 'CI-10B', partName: 'Thermal Printer', qty: 1, unitPrice: 3500, totalPrice: 3500, technician: 'Somchai' },
];

export const mockMA: MARevenue[] = [
    { id: 'MA1', branchId: '1', contractDate: '2023-01-01', period: 'Yearly', amount: 12000, status: 'Active' },
];
