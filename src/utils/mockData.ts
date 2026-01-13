import { Branch, Machine, Expense, SparePart } from '../types';

export const mockBranches: Branch[] = [
    { id: '1', code: 'MK001', name: 'MK Central World', province: 'Bangkok', phone: '02-123-4567', type: 'MK Restaurant', phase: '1', zone: 'BKK' },
    { id: '2', code: 'MK002', name: 'MK Gold Siam Paragon', province: 'Bangkok', phone: '02-987-6543', type: 'MK Gold', phase: '2', zone: 'BKK' },
    { id: '3', code: 'MK003', name: 'MK Live EmQuartier', province: 'Bangkok', phone: '02-333-4444', type: 'MK Live', phase: '1', zone: 'BKK' },
    { id: '4', code: 'MK004', name: 'MK Central Festival Chiang Mai', province: 'Chiang Mai', phone: '053-111-222', type: 'MK Restaurant', phase: '3', zone: 'UPC' },
    { id: '5', code: 'MK005', name: 'Bonus Suki Gateway Ekkamai', province: 'Bangkok', phone: '02-555-6666', type: 'Bonus Suki', phase: '5', zone: 'BKK' },
];

export const mockMachines: Machine[] = [
    { id: 'M1', branchId: '1', name: 'CI-10B', sn: 'SN001', installDate: '2023-01-15', pos: 'CE', status: 'พร้อมใช้งาน', remark: 'Main POS' },
    { id: 'M2', branchId: '1', name: 'CI-5B', sn: 'SN002', installDate: '2023-06-20', pos: 'CE', status: 'พร้อมใช้งาน', remark: 'Kitchen Display' },
    { id: 'M3', branchId: '2', name: 'RK-10', sn: 'SN003', installDate: '2022-11-05', pos: '12DATA', status: 'รอซ่อม', remark: 'Scanner issues' },
];

export const mockExpenses: Expense[] = [
    { id: 'E1', branchId: '1', date: '2023-12-01', type: 'ค่าบำรุงรักษา', detail: 'Monthly checkup', amount: 1500, technician: 'Somchai' },
    { id: 'E2', branchId: '2', date: '2023-12-15', type: 'ค่าซ่อมแซม', detail: 'POS screen replacement', amount: 4500, technician: 'Wichai' },
    { id: 'E3', branchId: '4', date: '2023-12-20', type: 'ค่าอะไหล่', detail: 'New cable', amount: 500, technician: 'Anan' },
];

export const mockSpareParts: SparePart[] = [
    { id: 'S1', date: '2023-12-05', branchId: '1', device: 'CI-10B', partName: 'Thermal Printer', qty: 1, unitPrice: 3500, totalPrice: 3500, technician: 'Somchai' },
];
