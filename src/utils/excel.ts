import * as XLSX from 'xlsx';

/**
 * Standard Export to Excel
 */
export const exportToExcel = (data: any[], fileName: string) => {
    // Transform data to be more readable if needed
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data');
    XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split('T')[0]}.xlsx`);
};

/**
 * Import from Excel / CSV
 */
export const importFromExcel = (file: File): Promise<any[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const bstr = e.target?.result;
                const workbook = XLSX.read(bstr, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(worksheet);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsBinaryString(file);
    });
};

/**
 * Download Specialized Template for each entity
 */
export const downloadEntityTemplate = (type: 'branch' | 'machine' | 'expense' | 'part') => {
    let headers: string[] = [];
    let fileName = '';

    switch (type) {
        case 'branch':
            headers = ['name', 'province', 'phone', 'phase', 'zone'];
            fileName = 'MK_Branch_Template';
            break;
        case 'machine':
            headers = ['name', 'sn', 'branchId', 'pos', 'status', 'installDate'];
            fileName = 'MK_Machine_Template';
            break;
        case 'expense':
            headers = ['date', 'branchId', 'type', 'amount', 'detail', 'technician'];
            fileName = 'MK_Expense_Template';
            break;
        case 'part':
            headers = ['date', 'branchId', 'device', 'partName', 'qty', 'unitPrice', 'technician'];
            fileName = 'MK_SparePart_Template';
            break;
    }

    const ws = XLSX.utils.aoa_to_sheet([headers]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, `${fileName}.xlsx`);
};
