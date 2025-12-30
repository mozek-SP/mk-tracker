"use client";

import React, { useState, useMemo, useEffect } from 'react';
import {
    LayoutDashboard,
    Store,
    Cpu,
    Receipt,
    Wrench,
    TrendingUp,
    Search,
    Plus,
    Globe,
    DollarSign,
    Package,
    X,
    Edit2,
    Trash2,
    Menu,
    ChevronRight,
    RefreshCw,
    Download,
    Upload,
    FileSpreadsheet
} from 'lucide-react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area
} from 'recharts';
import { format, parseISO } from 'date-fns';
import {
    mockBranches,
    mockMachines,
    mockExpenses,
    mockSpareParts,
} from '../utils/mockData';
import {
    Branch,
    Machine,
    Expense,
    SparePart,
} from '../types';
import { Button, Input, Card, Badge } from '../components/ui';
import { cn } from '../utils/cn';
import { exportToExcel, importFromExcel, downloadEntityTemplate } from '../utils/excel';

// --- Types ---
type Tab = 'dashboard' | 'branches' | 'machines' | 'expenses' | 'parts';
type Lang = 'TH' | 'EN';

export default function Page() {
    // --- Core State ---
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [lang, setLang] = useState<Lang>('EN');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const [branches, setBranches] = useState<Branch[]>(mockBranches);
    const [machines, setMachines] = useState<Machine[]>(mockMachines);
    const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
    const [parts, setParts] = useState<SparePart[]>(mockSpareParts);
    const [isLoaded, setIsLoaded] = useState(false);

    // --- Persistence ---
    useEffect(() => {
        const savedBranches = localStorage.getItem('mk_branches');
        const savedMachines = localStorage.getItem('mk_machines');
        const savedExpenses = localStorage.getItem('mk_expenses');
        const savedParts = localStorage.getItem('mk_parts');

        if (savedBranches) setBranches(JSON.parse(savedBranches));
        if (savedMachines) setMachines(JSON.parse(savedMachines));
        if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
        if (savedParts) setParts(JSON.parse(savedParts));

        setIsLoaded(true);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            localStorage.setItem('mk_branches', JSON.stringify(branches));
            localStorage.setItem('mk_machines', JSON.stringify(machines));
            localStorage.setItem('mk_expenses', JSON.stringify(expenses));
            localStorage.setItem('mk_parts', JSON.stringify(parts));
        }
    }, [branches, machines, expenses, parts, isLoaded]);

    // --- Filter State ---
    const [globalSearch, setGlobalSearch] = useState('');
    const [filterMonth, setFilterMonth] = useState<string>('All');
    const [filterYear, setFilterYear] = useState<string>('2023');
    const [filterPhase, setFilterPhase] = useState<string>('All');
    const [filterBranchId, setFilterBranchId] = useState<string>('All');
    const [filterCategory, setFilterCategory] = useState<string>('All');

    // --- CRUD State ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [modalType, setModalType] = useState<Tab | 'branch' | 'machine' | 'expense' | 'part' | null>(null);

    // --- Helpers ---
    const t = (en: string, th: string) => (lang === 'EN' ? en : th);

    const years = ['2022', '2023', '2024', '2025'];
    const months = [
        { v: '01', l: t('Jan', 'ม.ค.') }, { v: '02', l: t('Feb', 'ก.พ.') },
        { v: '03', l: t('Mar', 'มี.ค.') }, { v: '04', l: t('Apr', 'เม.ย.') },
        { v: '05', l: t('May', 'พ.ค.') }, { v: '06', l: t('Jun', 'มิ.ย.') },
        { v: '07', l: t('Jul', 'ก.ค.') }, { v: '08', l: t('Aug', 'ส.ค.') },
        { v: '09', l: t('Sep', 'ก.ย.') }, { v: '10', l: t('Oct', 'ต.ค.') },
        { v: '11', l: t('Nov', 'พ.ย.') }, { v: '12', l: t('Dec', 'ธ.ค.') },
    ];

    // Close mobile menu on tab change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [activeTab]);

    // --- Filtering Logic ---
    const filteredBranches = useMemo(() => branches.filter(b => {
        const matchesSearch = globalSearch === '' || b.name.toLowerCase().includes(globalSearch.toLowerCase());
        const matchesPhase = filterPhase === 'All' || b.phase === filterPhase;
        return matchesSearch && matchesPhase;
    }), [branches, globalSearch, filterPhase]);

    const filterByCommon = (item: any, dateField: string = 'date') => {
        const branch = branches.find(b => b.id === item.branchId);
        let itemDate;
        try { itemDate = parseISO(item[dateField]); } catch (e) { itemDate = new Date(); }
        const m = format(itemDate, 'MM');
        const y = format(itemDate, 'yyyy');

        const matchesSearch = globalSearch === '' ||
            (item.name?.toLowerCase().includes(globalSearch.toLowerCase())) ||
            (item.sn?.toLowerCase().includes(globalSearch.toLowerCase())) ||
            (branch?.name.toLowerCase().includes(globalSearch.toLowerCase())) ||
            (item.detail?.toLowerCase().includes(globalSearch.toLowerCase()));

        const matchesMonth = filterMonth === 'All' || m === filterMonth;
        const matchesYear = filterYear === 'All' || y === filterYear;
        const matchesPhase = filterPhase === 'All' || branch?.phase === filterPhase;
        const matchesBranch = filterBranchId === 'All' || item.branchId === filterBranchId;

        return matchesSearch && matchesMonth && matchesYear && matchesPhase && matchesBranch;
    };

    const filteredMachines = useMemo(() => machines.filter(m => filterByCommon(m, 'installDate')), [machines, branches, globalSearch, filterMonth, filterYear, filterPhase, filterBranchId]);
    const filteredExpenses = useMemo(() => expenses.filter(e => filterByCommon(e) && (filterCategory === 'All' || e.type === filterCategory)), [expenses, branches, globalSearch, filterMonth, filterYear, filterPhase, filterBranchId, filterCategory]);
    const filteredParts = useMemo(() => parts.filter(p => filterByCommon(p) && (filterCategory === 'All' || p.device === filterCategory)), [parts, branches, globalSearch, filterMonth, filterYear, filterPhase, filterBranchId, filterCategory]);

    // --- CRUD Handlers ---
    const openAddModal = (type: any) => {
        setModalType(type);
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const openEditModal = (type: any, item: any) => {
        setModalType(type);
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleDelete = (type: string, id: string) => {
        if (!confirm(t('Are you sure you want to delete?', 'คุณแน่ใจหรือไม่ว่าต้องการลบ?'))) return;
        if (type === 'branch') setBranches(prev => prev.filter(i => i.id !== id));
        if (type === 'machine') setMachines(prev => prev.filter(i => i.id !== id));
        if (type === 'expense') setExpenses(prev => prev.filter(i => i.id !== id));
        if (type === 'part') setParts(prev => prev.filter(i => i.id !== id));
    };

    const handleClearAll = () => {
        // Double confirm for safety
        if (!confirm(t('WARNING: This will delete ALL items in this list.\nAre you sure?', 'คำเตือน: การกระทำนี้จะลบข้อมูล "ทั้งหมด" ในหน้านี้\nคุณแน่ใจหรือไม่?'))) return;
        if (!confirm(t('Final Confirmation: Delete everything?', 'ยืนยันครั้งสุดท้าย: ลบข้อมูลทั้งหมดจริงหรือไม่?'))) return;

        if (activeTab === 'branches') setBranches([]);
        if (activeTab === 'machines') setMachines([]);
        if (activeTab === 'expenses') setExpenses([]);
        if (activeTab === 'parts') setParts([]);
    };

    const saveItem = (data: any) => {
        const type = modalType;
        const isEdit = !!editingItem;

        if (type === 'branch') {
            if (isEdit) setBranches(prev => prev.map(i => i.id === data.id ? data : i));
            else setBranches(prev => [...prev, { ...data, id: Math.random().toString(36).substr(2, 9) }]);
        } else if (type === 'machine') {
            if (isEdit) setMachines(prev => prev.map(i => i.id === data.id ? data : i));
            else setMachines(prev => [...prev, { ...data, id: 'M' + Math.random().toString(36).substr(2, 5) }]);
        } else if (type === 'expense') {
            if (isEdit) setExpenses(prev => prev.map(i => i.id === data.id ? data : i));
            else setExpenses(prev => [...prev, { ...data, id: 'E' + Math.random().toString(36).substr(2, 5) }]);
        } else if (type === 'part') {
            if (isEdit) setParts(prev => prev.map(i => i.id === data.id ? data : i));
            else setParts(prev => [...prev, { ...data, id: 'S' + Math.random().toString(36).substr(2, 5), totalPrice: data.qty * data.unitPrice }]);
        }

        setIsModalOpen(false);
    };

    // --- Excel Handlers ---
    const handleExport = () => {
        const dataMap: any = {
            branches: filteredBranches,
            machines: filteredMachines,
            expenses: filteredExpenses,
            parts: filteredParts
        };
        const exportData = activeTab === 'dashboard' ? expenses : dataMap[activeTab];
        exportToExcel(exportData, `MK_${activeTab.toUpperCase()}`);
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const data = await importFromExcel(file);

            // Helper to parse Excel dates (which might be Numbers or Strings)
            const excelDateToJSDate = (serial: any) => {
                if (!serial) return format(new Date(), 'yyyy-MM-dd'); // Default to today if missing
                if (typeof serial === 'number') {
                    // Excel serial date to JS Date
                    const utc_days = Math.floor(serial - 25569);
                    const utc_value = utc_days * 86400;
                    const date_info = new Date(utc_value * 1000);
                    return format(date_info, 'yyyy-MM-dd');
                }
                // Handle DD/MM/YYYY string format (e.g. 22/10/2021)
                if (typeof serial === 'string' && serial.includes('/')) {
                    const parts = serial.split('/');
                    if (parts.length === 3) {
                        try {
                            // Assume DD/MM/YYYY
                            const day = parseInt(parts[0], 10);
                            const month = parseInt(parts[1], 10) - 1; // Month is 0-indexed
                            const year = parseInt(parts[2], 10);
                            const dateObj = new Date(year, month, day);
                            if (!isNaN(dateObj.getTime())) {
                                return format(dateObj, 'yyyy-MM-dd');
                            }
                        } catch (e) { console.error('Date parse error', e); }
                    }
                }
                // Attempt to parse standard string/ISO
                try { return format(new Date(serial), 'yyyy-MM-dd'); } catch { return format(new Date(), 'yyyy-MM-dd'); }
            };

            // Helper to match Branch Name if ID is missing or text
            const findBranchId = (val: any) => {
                const found = branches.find(b => b.name === val || b.code === val || b.id === val);
                return found ? found.id : val; // Return Found ID or original value
            };

            if (activeTab === 'branches') {
                setBranches(prev => [...prev, ...data.map(d => ({
                    ...d,
                    id: Math.random().toString(36).substr(2, 9),
                    // Ensure crucial fields exist
                    phase: d.phase ? String(d.phase) : '1',
                    zone: d.zone || 'BKK'
                }))]);
            }
            if (activeTab === 'machines') {
                setMachines(prev => [...prev, ...data.map(d => ({
                    ...d,
                    id: 'M' + Math.random().toString(36).substr(2, 5),
                    branchId: findBranchId(d.branchId),
                    installDate: excelDateToJSDate(d.installDate)
                }))]);
            }
            if (activeTab === 'expenses') {
                setExpenses(prev => [...prev, ...data.map(d => ({
                    ...d,
                    id: 'E' + Math.random().toString(36).substr(2, 5),
                    branchId: findBranchId(d.branchId),
                    date: excelDateToJSDate(d.date)
                }))]);
            }
            if (activeTab === 'parts') {
                setParts(prev => [...prev, ...data.map(d => ({
                    ...d,
                    id: 'S' + Math.random().toString(36).substr(2, 5),
                    branchId: findBranchId(d.branchId),
                    date: excelDateToJSDate(d.date),
                    totalPrice: (d.qty || 0) * (d.unitPrice || 0)
                }))]);
            }

            // AUTO-RESET FILTERS to ensure data is visible immediately
            setFilterYear('All');
            setFilterMonth('All');
            setFilterPhase('All');
            setFilterBranchId('All');
            setFilterCategory('All');
            setGlobalSearch('');

            alert(t('Import Successful!', 'นำเข้าข้อมูลสำเร็จ!'));
        } catch (err) {
            console.error(err);
            alert(t('Import Failed!', 'นำเข้าข้อมูลล้มเหลว!'));
        }
        e.target.value = '';
    };

    const handleDownloadTemplate = () => {
        const typeMap: any = { branches: 'branch', machines: 'machine', expenses: 'expense', parts: 'part' };
        downloadEntityTemplate(typeMap[activeTab]);
    };

    if (!isLoaded) return null;

    return (
        <div className="flex min-h-screen bg-[#0F172A] text-slate-200 font-sans">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden select-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-brand/5 blur-[120px] animate-pulse-slow"></div>
                <div className="absolute top-[20%] right-[0%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[120px] animate-pulse-slow delay-1000"></div>
                <div className="absolute bottom-[0%] left-[20%] w-[30%] h-[30%] rounded-full bg-emerald-500/5 blur-[100px] animate-pulse-slow delay-2000"></div>
            </div>

            {/* Sidebar - Desktop */}
            <aside className="fixed left-0 top-0 hidden h-full w-64 flex-col border-r border-slate-800/60 bg-[#0F172A]/90 backdrop-blur-xl lg:flex z-40 shadow-2xl">
                <SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} lang={lang} setLang={setLang} t={t} />
            </aside>

            {/* Sidebar - Mobile Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 flex lg:hidden">
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
                    <aside className="relative h-full w-72 flex-col border-r border-slate-800 bg-[#0F172A] p-4 flex animate-in slide-in-from-left duration-300">
                        <div className="flex justify-between items-center mb-8 px-2">
                            <span className="text-xl font-bold tracking-tight text-white italic">MK TRACKER</span>
                            <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400"><X /></button>
                        </div>
                        <SidebarContent activeTab={activeTab} setActiveTab={setActiveTab} lang={lang} setLang={setLang} t={t} isMobile />
                    </aside>
                </div>
            )}

            {/* Main Container */}
            <main className="flex-1 lg:pl-64 min-w-0 relative z-10">
                <header className="sticky top-0 z-30 border-b border-white/5 bg-[#0F172A]/80 px-4 sm:px-8 py-4 backdrop-blur-md shadow-sm">
                    <div className="flex items-center justify-between gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            <button onClick={() => setIsMobileMenuOpen(true)} className="p-2 lg:hidden text-slate-400 hover:text-white transition-colors">
                                <Menu size={24} />
                            </button>
                            <h2 className="text-lg sm:text-2xl font-bold text-white truncate flex items-center gap-3">
                                {activeTab === 'dashboard' && <LayoutDashboard className="text-brand" size={28} />}
                                {activeTab === 'branches' && <Store className="text-brand" size={28} />}
                                {activeTab === 'machines' && <Cpu className="text-brand" size={28} />}
                                {activeTab === 'expenses' && <Receipt className="text-brand" size={28} />}
                                {activeTab === 'parts' && <Package className="text-brand" size={28} />}

                                {activeTab === 'dashboard' ? t('Overview', 'ภาพรวมระบบ') :
                                    activeTab === 'branches' ? t('Branches', 'จัดการสาขา') :
                                        activeTab === 'machines' ? t('Machines', 'จัดการอุปกรณ์') :
                                            activeTab === 'expenses' ? t('Expenses', 'บันทึกค่าใช้จ่าย') :
                                                t('Repair & Parts', 'งานซ่อมและอะไหล่')}
                            </h2>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="relative hidden sm:block">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                                <Input
                                    placeholder={t('Search...', 'ค้นหา...')}
                                    className="w-48 md:w-64 pl-10 rounded-full bg-slate-900/50 border-slate-700/50 focus:border-brand focus:ring-brand/20 transition-all shadow-inner"
                                    value={globalSearch}
                                    onChange={(e) => setGlobalSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap items-end gap-3 text-xs overflow-x-auto pb-1 custom-scrollbar no-scrollbar-on-mobile">
                        <FilterSelect value={filterYear} onChange={setFilterYear} options={['All', ...years]} label={t('Year', 'ปี')} />
                        <FilterSelect value={filterMonth} onChange={setFilterMonth} options={[{ v: 'All', l: t('All', 'ทุกเดือน') }, ...months]} label={t('Month', 'เดือน')} />
                        <FilterSelect value={filterPhase} onChange={setFilterPhase} options={['All', '1', '2', '3', '4', '5', '6', '7', '8', 'Renovate']} label={t('Phase', 'เฟส')} />
                        <FilterSelect
                            value={filterBranchId}
                            onChange={setFilterBranchId}
                            options={[{ v: 'All', l: t('All', 'ทุกสาขา') }, ...branches.map(b => ({ v: b.id, l: b.name }))]}
                            label={t('Branch', 'สาขา')}
                        />
                        {['expenses', 'parts'].includes(activeTab) && (
                            <FilterSelect
                                value={filterCategory}
                                onChange={setFilterCategory}
                                options={activeTab === 'expenses' ? ['All', 'Maintenance', 'Repair', 'Spare Parts', 'Service'] : ['All', 'CI-10B', 'CI-10C', 'CI-5B', 'UPS']}
                                label={t('Category', 'หมวดหมู่')}
                            />
                        )}
                        <button onClick={() => {
                            setFilterMonth('All'); setFilterYear('2023'); setFilterPhase('All'); setFilterBranchId('All'); setFilterCategory('All'); setGlobalSearch('');
                        }} className="h-8 px-3 rounded-lg flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all active:scale-95">
                            <RefreshCw size={12} /> {t('Reset', 'ล้าง')}
                        </button>
                    </div>
                </header>

                <div className="p-4 sm:p-8 space-y-8 animate-in">
                    {activeTab === 'dashboard' && <DashboardView branches={branches} machines={machines} expenses={filteredExpenses} t={t} />}

                    {activeTab !== 'dashboard' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-white">
                                    {t('List Records', 'รายการข้อมูล')}
                                    <span className="ml-2 text-xs font-normal text-slate-500">
                                        ({activeTab === 'branches' ? filteredBranches.length :
                                            activeTab === 'machines' ? filteredMachines.length :
                                                activeTab === 'expenses' ? filteredExpenses.length : filteredParts.length})
                                    </span>
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    <button onClick={handleClearAll} className="flex items-center gap-2 px-4 h-10 rounded-lg bg-red-600/10 text-red-500 border border-red-600/20 hover:bg-red-600 hover:text-white transition-all text-xs font-bold uppercase tracking-wider shadow-lg shadow-red-500/10 hover:shadow-red-500/30 active:scale-95 mr-2" title={t('Clear All', 'ล้างข้อมูลทั้งหมด')}>
                                        <Trash2 size={16} className="mb-0.5" /> {t('Clear', 'ล้างทั้งหมด')}
                                    </button>
                                    <button onClick={handleExport} className="flex items-center gap-2 px-4 h-10 rounded-lg bg-emerald-600/10 text-emerald-500 border border-emerald-600/20 hover:bg-emerald-600 hover:text-white transition-all text-xs font-bold uppercase tracking-wider shadow-lg shadow-emerald-500/10 hover:shadow-emerald-500/30 active:scale-95" title={t('Export Excel', 'ส่งออกไฟล์')}>
                                        <Download size={16} className="mb-0.5" /> {t('Export', 'ส่งออก')}
                                    </button>
                                    <button onClick={handleDownloadTemplate} className="flex items-center gap-2 px-4 h-10 rounded-lg bg-blue-600/10 text-blue-500 border border-blue-600/20 hover:bg-blue-600 hover:text-white transition-all text-xs font-bold uppercase tracking-wider shadow-lg shadow-blue-500/10 hover:shadow-blue-500/30 active:scale-95" title={t('Download Template', 'ดาวน์โหลดเทมเพลต')}>
                                        <FileSpreadsheet size={16} className="mb-0.5" /> {t('Template', 'เทมเพลต')}
                                    </button>
                                    <label className="flex items-center gap-2 px-4 h-10 rounded-lg bg-purple-600/10 text-purple-500 border border-purple-600/20 hover:bg-purple-600 hover:text-white transition-all text-xs font-bold uppercase tracking-wider shadow-lg shadow-purple-500/10 hover:shadow-purple-500/30 active:scale-95 cursor-pointer">
                                        <Upload size={16} className="mb-0.5" /> {t('Import', 'นำเข้า')}
                                        <input type="file" hidden accept=".xlsx, .xls" onChange={handleImport} />
                                    </label>
                                    <div className="w-px h-10 bg-slate-800 mx-1 hidden sm:block"></div>
                                    <Button onClick={() => openAddModal(activeTab === 'branches' ? 'branch' : activeTab === 'machines' ? 'machine' : activeTab === 'expenses' ? 'expense' : 'part')} className="gap-2 bg-gradient-to-r from-brand to-orange-600 hover:to-orange-500 hover:shadow-orange-500/25 shadow-lg transition-all active:scale-95 text-white h-10 px-5 rounded-lg font-bold uppercase tracking-wide">
                                        <Plus size={18} /> {t('Add New', 'เพิ่มใหม่')}
                                    </Button>
                                </div>
                            </div>

                            {activeTab === 'branches' && <BranchListView branches={filteredBranches} onEdit={(i: any) => openEditModal('branch', i)} onDelete={(id: string) => handleDelete('branch', id)} t={t} />}
                            {activeTab === 'machines' && <MachineListView machines={filteredMachines} branches={branches} onEdit={(i: any) => openEditModal('machine', i)} onDelete={(id: string) => handleDelete('machine', id)} t={t} />}
                            {activeTab === 'expenses' && <ExpenseListView expenses={filteredExpenses} branches={branches} onEdit={(i: any) => openEditModal('expense', i)} onDelete={(id: string) => handleDelete('expense', id)} t={t} />}
                            {activeTab === 'parts' && <SparePartsView parts={filteredParts} branches={branches} onEdit={(i: any) => openEditModal('part', i)} onDelete={(id: string) => handleDelete('part', id)} t={t} />}
                        </div>
                    )}
                </div>
            </main >

            {/* --- CRUD MODAL --- */}
            {
                isModalOpen && (
                    <EntityModal
                        type={modalType}
                        item={editingItem}
                        branches={branches}
                        onClose={() => setIsModalOpen(false)}
                        onSave={saveItem}
                        t={t}
                    />
                )
            }
        </div >
    );
}

// --- Sub-Components ---

const SidebarContent = ({ activeTab, setActiveTab, lang, setLang, t, isMobile }: any) => (
    <div className="flex flex-col h-full">
        {!isMobile && (
            <div className="flex h-16 items-center px-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand shadow-lg shadow-brand/20">
                        <TrendingUp className="text-white" size={20} />
                    </div>
                    <span className="text-xl font-black tracking-tight text-white italic">MK TRACKER</span>
                </div>
            </div>
        )}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto custom-scrollbar">
            <SidebarItem icon={<LayoutDashboard size={18} />} label={t('Dashboard', 'แผงควบคุม')} active={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <div className="my-4 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Management</div>
            <SidebarItem icon={<Store size={18} />} label={t('Branches', 'จัดการสาขา')} active={activeTab === 'branches'} onClick={() => setActiveTab('branches')} />
            <SidebarItem icon={<Cpu size={18} />} label={t('Machines', 'รายชื่ออุปกรณ์')} active={activeTab === 'machines'} onClick={() => setActiveTab('machines')} />
            <div className="my-4 px-4 text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Tracking</div>
            <SidebarItem icon={<Receipt size={18} />} label={t('Expenses', 'บันทึกค่าใช้จ่าย')} active={activeTab === 'expenses'} onClick={() => setActiveTab('expenses')} />
            <SidebarItem icon={<Package size={18} />} label={t('Spare Parts', 'อะไหล่/ซ่อม')} active={activeTab === 'parts'} onClick={() => setActiveTab('parts')} />
        </nav>
        <div className="p-4 border-t border-slate-800 bg-[#0F172A]">
            <button
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-all group"
                onClick={() => setLang(lang === 'EN' ? 'TH' : 'EN')}
            >
                <div className="flex items-center gap-3">
                    <Globe size={16} className="text-brand group-hover:scale-110 transition-transform" />
                    <span className="text-xs font-bold">{lang === 'EN' ? 'English' : 'ภาษาไทย'}</span>
                </div>
                <Badge className="bg-slate-800 text-slate-500 group-hover:bg-brand group-hover:text-white transition-colors">{lang}</Badge>
            </button>
        </div>
    </div>
);

const DashboardView = ({ branches, machines, expenses, t }: any) => {
    const totalExpenses = expenses.reduce((sum: number, e: any) => sum + e.amount, 0);
    const repairCosts = expenses.filter((e: any) => e.type === 'ค่าซ่อมแซม' || e.type === 'Repair').reduce((sum: number, e: any) => sum + e.amount, 0);

    const chartData = useMemo(() => {
        if (!expenses.length) return [];
        const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
        return months.map(m => ({
            name: m,
            amount: expenses.filter((e: any) => format(parseISO(e.date), 'MM') === m).reduce((s: number, e: any) => s + e.amount, 0)
        }));
    }, [expenses]);

    return (
        <div className="space-y-8 animate-in">
            <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 xl:grid-cols-4">
                <StatsCard title={t('Total Expenses', 'ค่าใช้จ่ายรวม')} value={`฿${totalExpenses.toLocaleString()}`} icon={<DollarSign className="text-brand" />} accent="brand" />
                <StatsCard title={t('Repair Costs', 'ค่าซ่อมบำรุง')} value={`฿${repairCosts.toLocaleString()}`} icon={<Wrench className="text-blue-500" />} accent="blue" />
                <StatsCard title={t('Active Branches', 'สาขาทั้งหมด')} value={branches.length.toString()} icon={<Store className="text-emerald-500" />} accent="emerald" />
                <StatsCard title={t('Total Assets', 'รายการอุปกรณ์')} value={machines.length.toString()} icon={<Cpu className="text-purple-500" />} accent="purple" />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2 bg-slate-900/40 border-slate-800 shadow-premium p-6 sm:p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold text-white uppercase tracking-wider flex items-center gap-2">
                            <div className="w-1.5 h-6 bg-brand rounded-full" />
                            {t('Expense Trend', 'แนวโน้มการใช้จ่าย')}
                        </h3>
                        <Badge className="bg-brand/10 text-brand border-brand/20">Monthly Data</Badge>
                    </div>
                    <div className="h-[300px] sm:h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                                <defs>
                                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#F97316" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#F97316" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis dataKey="name" stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                                <YAxis stroke="#64748b" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(v) => `฿${v >= 1000 ? (v / 1000) + 'k' : v}`} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.5)' }}
                                    formatter={(v: any) => [`฿${v.toLocaleString()}`, 'Amount']}
                                />
                                <Area type="monotone" dataKey="amount" stroke="#F97316" fill="url(#colorExp)" strokeWidth={3} animationDuration={1000} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="bg-slate-900/40 border-slate-800 shadow-premium p-6 sm:p-8">
                    <h3 className="text-lg font-bold text-white mb-8 uppercase tracking-wider flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                        {t('Asset Health', 'สถานะอุปกรณ์')}
                    </h3>
                    <div className="relative h-64 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Ready', value: machines.filter((m: any) => m.status === 'Ready' || m.status === 'พร้อมใช้งาน').length },
                                        { name: 'Repair', value: machines.filter((m: any) => m.status === 'Repair' || m.status === 'รอซ่อม').length },
                                        { name: 'Other', value: machines.filter((m: any) => !['Ready', 'Repair', 'พร้อมใช้งาน', 'รอซ่อม'].includes(m.status)).length },
                                    ]}
                                    innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value"
                                >
                                    <Cell fill="#10B981" />
                                    <Cell fill="#F43F5E" />
                                    <Cell fill="#64748b" />
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-4xl font-black text-white">{machines.length}</span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Items Total</span>
                        </div>
                    </div>
                    <div className="mt-10 space-y-4">
                        <PieLegend label="พร้อมใช้งาน (Ready)" value={machines.filter((m: any) => m.status === 'Ready' || m.status === 'พร้อมใช้งาน').length} color="bg-emerald-500" />
                        <PieLegend label="กำลังซ่อม (Repair)" value={machines.filter((m: any) => m.status === 'Repair' || m.status === 'รอซ่อม').length} color="bg-rose-500" />
                        <PieLegend label="อื่นๆ (Other)" value={machines.filter((m: any) => !['Ready', 'Repair', 'พร้อมใช้งาน', 'รอซ่อม'].includes(m.status)).length} color="bg-slate-500" />
                    </div>
                </Card>
            </div>
        </div>
    );
};

const PieLegend = ({ label, value, color }: any) => (
    <div className="flex justify-between items-center bg-slate-950/50 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-3">
            <div className={cn("w-3 h-3 rounded-full shadow-lg", color)} />
            <span className="text-slate-400 text-sm font-semibold">{label}</span>
        </div>
        <span className="text-white font-bold">{value}</span>
    </div>
);

const EntityModal = ({ type, item, branches, onClose, onSave, t }: any) => {
    const [formData, setFormData] = useState<any>(item || {
        branchId: branches[0]?.id || '',
        date: format(new Date(), 'yyyy-MM-dd'),
        installDate: format(new Date(), 'yyyy-MM-dd'),
        type: type === 'branch' ? 'MK Restaurant' : type === 'expense' ? 'Maintenance' : '',
        status: 'Ready',
        pos: 'CE',
        qty: 1,
        unitPrice: 0,
        amount: 0,
        phase: '1',
        zone: 'BKK',
        code: '', name: '', province: '', phone: '', detail: '', technician: '', device: '', partName: '', remark: ''
    });

    const [otherFields, setOtherFields] = useState<Record<string, boolean>>({});

    const handleSelectChange = (field: string, value: string) => {
        if (value === 'Other') {
            setOtherFields(prev => ({ ...prev, [field]: true }));
            setFormData((prev: any) => ({ ...prev, [field]: '' }));
        } else {
            setOtherFields(prev => ({ ...prev, [field]: false }));
            setFormData((prev: any) => ({ ...prev, [field]: value }));
        }
    };

    const isEdit = !!item;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in">
            <Card className="w-full max-w-lg bg-slate-900 overflow-hidden relative border-brand/20 shadow-premium">
                <div className="bg-brand px-6 py-5 flex justify-between items-center text-white">
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black tracking-widest text-white/60 leading-none mb-1">{isEdit ? 'Modification' : 'Creation'}</span>
                        <h3 className="font-bold text-xl leading-none">{isEdit ? t('Edit', 'แก้ไข') : t('Add', 'เพิ่ม')} {type.toUpperCase()}</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-all active:scale-95"><X size={24} /></button>
                </div>

                <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    {!['branch'].includes(type) && (
                        <div>
                            <label className="text-[10px] text-slate-500 uppercase font-black mb-1.5 block tracking-widest">{t('Select Branch', 'เลือกสาขา')}</label>
                            <select className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-sm focus:border-brand focus:ring-brand/20 outline-none transition-all cursor-pointer" value={formData.branchId} onChange={e => setFormData({ ...formData, branchId: e.target.value })}>
                                {branches.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                            </select>
                        </div>
                    )}

                    {type === 'branch' && (
                        <>
                            <div className="grid grid-cols-2 gap-4">
                                <FormGroup label={t('Branch Code', 'รหัสสาขา')} value={formData.code} onChange={(v: any) => setFormData({ ...formData, code: v })} />
                                <div className="flex-1">
                                    <label className="text-[10px] text-slate-500 uppercase font-black mb-1.5 block tracking-widest">{t('Branch Type', 'ประเภทสาขา')}</label>
                                    {otherFields.type ? (
                                        <Input autoFocus placeholder="Enter Type" className="bg-slate-800/80 border-brand/50 h-11" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} />
                                    ) : (
                                        <select className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-sm focus:border-brand focus:ring-brand/20 outline-none" value={formData.type} onChange={e => handleSelectChange('type', e.target.value)}>
                                            <option value="MK Restaurant">MK Restaurant</option>
                                            <option value="MK Gold">MK Gold</option>
                                            <option value="MK Live">MK Live</option>
                                            <option value="Bonus Suki">Bonus Suki</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    )}
                                </div>
                            </div>

                            <FormGroup label={t('Branch Name', 'ชื่อสาขา')} value={formData.name} onChange={(v: any) => setFormData({ ...formData, name: v })} />

                            <div className="grid grid-cols-2 gap-4">
                                <FormGroup label={t('Province', 'จังหวัด')} value={formData.province} onChange={(v: any) => setFormData({ ...formData, province: v })} />
                                <FormGroup label={t('Phone', 'เบอร์โทร')} value={formData.phone} onChange={(v: any) => setFormData({ ...formData, phone: v })} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] text-slate-500 uppercase font-black mb-1.5 block tracking-widest">{t('Phase', 'เฟส')}</label>
                                    <select className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-sm focus:border-brand focus:ring-brand/20 outline-none" value={formData.phase} onChange={e => setFormData({ ...formData, phase: e.target.value })}>
                                        {['1', '2', '3', '4', '5', '6', '7', '8', 'Renovate', 'ปิดสาขา'].map(p => <option key={p} value={p}>{p}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-500 uppercase font-black mb-1.5 block tracking-widest">{t('Zone', 'โซน')}</label>
                                    <select className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-sm focus:border-brand focus:ring-brand/20 outline-none" value={formData.zone} onChange={e => setFormData({ ...formData, zone: e.target.value })}>
                                        <option value="BKK">BKK</option><option value="UPC">UPC</option>
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    {type === 'machine' && (
                        <>
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase font-black mb-1.5 block tracking-widest">{t('Asset Name', 'ชื่ออุปกรณ์')}</label>
                                {otherFields.name ? (
                                    <Input autoFocus placeholder="Enter Asset Name" className="bg-slate-800/80 border-brand/50 h-11" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                                ) : (
                                    <select className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-sm focus:border-brand focus:ring-brand/20 outline-none" value={formData.name} onChange={e => handleSelectChange('name', e.target.value)}>
                                        <option value="CI-10">CI-10</option>
                                        <option value="CI-5">CI-5</option>
                                        <option value="RK-10">RK-10</option>
                                        <option value="Other">Other</option>
                                    </select>
                                )}
                            </div>

                            <FormGroup label={t('Serial Number', 'หมายเลขเครื่อง')} value={formData.sn} onChange={(v: any) => setFormData({ ...formData, sn: v })} />
                            <FormGroup label={t('Install Date', 'วันที่ติดตั้ง')} type="date" value={formData.installDate} onChange={(v: any) => setFormData({ ...formData, installDate: v })} />

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] text-slate-500 uppercase font-black mb-1.5 block tracking-widest">POS System</label>
                                    {otherFields.pos ? (
                                        <Input autoFocus placeholder="Enter System Name" className="bg-slate-800/80 border-brand/50 h-11" value={formData.pos} onChange={e => setFormData({ ...formData, pos: e.target.value })} />
                                    ) : (
                                        <select className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-sm focus:border-brand focus:ring-brand/20 outline-none" value={formData.pos} onChange={e => handleSelectChange('pos', e.target.value)}>
                                            <option value="CE">CE</option><option value="12DATA">12DATA</option><option value="Other">Other</option>
                                        </select>
                                    )}
                                </div>
                                <div>
                                    <label className="text-[10px] text-slate-500 uppercase font-black mb-1.5 block tracking-widest">Status</label>
                                    {otherFields.status ? (
                                        <Input autoFocus placeholder="Enter Status" className="bg-slate-800/80 border-brand/50 h-11" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} />
                                    ) : (
                                        <select className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-sm focus:border-brand focus:ring-brand/20 outline-none" value={formData.status} onChange={e => handleSelectChange('status', e.target.value)}>
                                            <option value="พร้อมใช้งาน">พร้อมใช้งาน</option>
                                            <option value="รอซ่อม">รอซ่อม</option>
                                            <option value="ยกเลิกการใช้งาน">ยกเลิกการใช้งาน</option>
                                            <option value="Other">อื่น ๆ</option>
                                        </select>
                                    )}
                                </div>
                            </div>
                            <FormGroup label={t('Remark', 'หมายเหตุ')} value={formData.remark} onChange={(v: any) => setFormData({ ...formData, remark: v })} />
                        </>
                    )}

                    {type === 'expense' && (
                        <>
                            <FormGroup label={t('Record Date', 'วันที่ลงบันทึก')} type="date" value={formData.date} onChange={(v: any) => setFormData({ ...formData, date: v })} />
                            <div>
                                <label className="text-[10px] text-slate-500 uppercase font-black mb-1.5 block tracking-widest">{t('Category', 'หมวดหมู่')}</label>
                                {otherFields.type ? (
                                    <Input autoFocus placeholder="Enter Category Type" className="bg-slate-800/80 border-brand/50 h-11" value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} />
                                ) : (
                                    <select className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-sm focus:border-brand focus:ring-brand/20 outline-none" value={formData.type} onChange={e => handleSelectChange('type', e.target.value)}>
                                        <option value="ค่าบำรุงรักษา">ค่าบำรุงรักษา</option>
                                        <option value="ค่าซ่อมแซม">ค่าซ่อมแซม</option>
                                        <option value="ค่าอะไหล่">ค่าอะไหล่</option>
                                        <option value="ค่าบริการ">ค่าบริการ</option>
                                        <option value="ค่าใช้จ่ายอื่น ๆ">ค่าใช้จ่ายอื่น ๆ</option>
                                    </select>
                                )}
                            </div>
                            <FormGroup label={t('Detail', 'รายละเอียด')} value={formData.detail} onChange={(v: any) => setFormData({ ...formData, detail: v })} />
                            <div className="grid grid-cols-2 gap-4">
                                <FormGroup label={t('Amount (THB)', 'จำนวนเงิน (บาท)')} type="number" value={formData.amount} onChange={(v: any) => setFormData({ ...formData, amount: parseFloat(v) })} />
                                <FormGroup label={t('Technician', 'ช่างที่เข้าหน้างาน')} value={formData.technician} onChange={(v: any) => setFormData({ ...formData, technician: v })} />
                            </div>
                        </>
                    )}

                    {type === 'part' && (
                        <>
                            <FormGroup label={t('Service Date', 'วันที่ซ่อม')} type="date" value={formData.date} onChange={(v: any) => setFormData({ ...formData, date: v })} />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] text-slate-500 uppercase font-black mb-1.5 block tracking-widest">{t('Device', 'อุปกรณ์ที่ซ่อม')}</label>
                                    {otherFields.device ? (
                                        <Input autoFocus placeholder="Enter Device Name" className="bg-slate-800/80 border-brand/50 h-11" value={formData.device} onChange={e => setFormData({ ...formData, device: e.target.value })} />
                                    ) : (
                                        <select className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl p-3 text-sm focus:border-brand focus:ring-brand/20 outline-none" value={formData.device} onChange={e => handleSelectChange('device', e.target.value)}>
                                            <option value="CI-10B">CI-10B</option>
                                            <option value="CI-10C">CI-10C</option>
                                            <option value="CI-5B">CI-5B</option>
                                            <option value="UPS">UPS</option>
                                            <option value="Other">อื่น ๆ</option>
                                        </select>
                                    )}
                                </div>
                                <FormGroup label={t('Part Name', 'ชื่ออะไหล่')} value={formData.partName} onChange={(v: any) => setFormData({ ...formData, partName: v })} />
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                <FormGroup label={t('Qty', 'จำนวน')} type="number" value={formData.qty} onChange={(v: any) => setFormData({ ...formData, qty: parseInt(v) })} />
                                <FormGroup label={t('Price/Unit', 'ราคา/หน่วย')} type="number" value={formData.unitPrice} onChange={(v: any) => setFormData({ ...formData, unitPrice: parseFloat(v) })} />
                                <div className="flex flex-col justify-center">
                                    <span className="text-[10px] text-slate-500 uppercase font-black mb-1.5 tracking-tighter">{t('Total', 'ราคารวม')}</span>
                                    <span className="text-sm font-black text-brand leading-none">฿{(formData.qty * formData.unitPrice).toLocaleString()}</span>
                                </div>
                            </div>
                            <FormGroup label={t('Technician', 'ช่างที่ดำเนินการ')} value={formData.technician} onChange={(v: any) => setFormData({ ...formData, technician: v })} />
                        </>
                    )}
                </div>

                <div className="p-6 bg-slate-950/80 mt-auto flex gap-4 border-t border-slate-800">
                    <Button variant="ghost" className="flex-1 rounded-xl h-12 text-slate-400 hover:text-white" onClick={onClose}>{t('Cancel', 'ยกเลิก')}</Button>
                    <Button className="flex-1 bg-brand text-white rounded-xl h-12 font-bold shadow-lg shadow-brand/20 hover:shadow-brand/40 active:scale-95 transition-all" onClick={() => onSave(formData)}>{t('Confirm & Save', 'ยืนยันบันทึกข้อมูล')}</Button>
                </div>
            </Card>
        </div>
    );
};

const SidebarItem = ({ icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: any }) => (
    <button onClick={onClick} className={cn("flex w-full items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-bold transition-all group",
        active ? "bg-brand text-white shadow-premium shadow-brand/20" : "text-slate-400 hover:bg-slate-800/50 hover:text-white")}>
        <span className={cn(active ? "text-white" : "text-slate-500 group-hover:text-brand transition-colors")}>{icon}</span> {label}
        {active && <ChevronRight size={14} className="ml-auto opacity-60" />}
    </button>
);

const StatsCard = ({ title, value, icon, accent }: any) => {
    const accents: any = {
        brand: "group-hover:bg-brand/10 border-brand/10",
        blue: "group-hover:bg-blue-500/10 border-blue-500/10",
        emerald: "group-hover:bg-emerald-500/10 border-emerald-500/10",
        purple: "group-hover:bg-purple-500/10 border-purple-500/10"
    };
    return (
        <Card className={cn("relative overflow-hidden group border-slate-800 transition-all bg-slate-900/40 p-6 shadow-subtle hover:shadow-premium hover:-translate-y-1", accents[accent])}>
            <div className="flex items-center justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 transition-colors">{icon}</div>
                <div className="w-12 h-12 rounded-full absolute -right-2 -top-2 bg-white/5 blur-2xl group-hover:bg-brand/10 transition-all" />
            </div>
            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{title}</div>
            <div className="text-2xl font-black text-white">{value}</div>
        </Card>
    );
};

const FilterSelect = ({ value, onChange, options, label }: any) => (
    <div className="flex flex-col gap-1 inline-flex shrink-0">
        <span className="text-[10px] font-black text-slate-500 uppercase px-1 tracking-tighter opacity-80">{label}</span>
        <select className="h-9 min-w-[100px] rounded-xl border border-slate-700/50 bg-slate-800/80 px-3 text-[11px] font-bold text-slate-300 focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand/50 transition-all cursor-pointer hover:bg-slate-800" value={value} onChange={(e) => onChange(e.target.value)}>
            {options.map((o: any) => <option key={o.v || o} value={o.v || o} className="bg-slate-900">{o.l || o}</option>)}
        </select>
    </div>
);

const FormGroup = ({ label, value, onChange, type = "text" }: any) => (
    <div>
        <label className="text-[10px] text-slate-500 uppercase font-black mb-1.5 block tracking-widest">{label}</label>
        <Input type={type} value={value} onChange={e => onChange(e.target.value)} className="bg-slate-800/50 border-slate-700/50 rounded-xl focus:border-brand focus:ring-brand/20 transition-all h-11 placeholder:text-slate-600" />
    </div>
);

const TableBase = ({ children }: { children: React.ReactNode }) => (
    <Card className="p-0 border-slate-800/60 bg-slate-900/40 overflow-hidden shadow-premium backdrop-blur-sm ring-1 ring-white/5">
        <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left text-sm whitespace-nowrap">
                {children}
            </table>
        </div>
    </Card>
);

const TableRow = ({ children, onEdit, onDelete }: any) => (
    <tr className="hover:bg-slate-800/30 transition-colors group">
        {children}
        <td className="px-6 py-4 text-right">
            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                <button onClick={onEdit} className="p-2 hover:bg-brand/20 text-brand rounded-lg transition-colors"><Edit2 size={16} /></button>
                <button onClick={onDelete} className="p-2 hover:bg-rose-500/20 text-rose-500 rounded-lg transition-colors"><Trash2 size={16} /></button>
            </div>
        </td>
    </tr>
);

const BranchListView = ({ branches, onEdit, onDelete, t }: any) => (
    <TableBase>
        <thead className="bg-slate-800/50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <tr>
                <th className="px-6 py-4">{t('Code', 'รหัส')}</th>
                <th className="px-6 py-4">{t('Name', 'ชื่อสาขา')}</th>
                <th className="px-6 py-4">{t('Type', 'ประเภท')}</th>
                <th className="px-6 py-4">{t('Province', 'จังหวัด')}</th>
                <th className="px-6 py-4 text-center">{t('Zone', 'โซน')}</th>
                <th className="px-6 py-4 text-center">{t('Phase', 'เฟส')}</th>
                <th className="px-6 py-4">{t('Phone', 'โทรศัพท์')}</th>
                <th className="px-6 py-4 text-right">Actions</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
            {branches.map((b: any) => (
                <TableRow key={b.id} onEdit={() => onEdit(b)} onDelete={() => onDelete(b.id)}>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">{b.code}</td>
                    <td className="px-6 py-4 font-bold text-white">{b.name}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{b.type}</td>
                    <td className="px-6 py-4 text-slate-400">{b.province}</td>
                    <td className="px-6 py-4 text-center text-xs font-bold text-slate-500">{b.zone}</td>
                    <td className="px-6 py-4 text-center"><Badge className="bg-slate-800 text-slate-300 border-slate-700 font-mono tracking-tighter">{b.phase}</Badge></td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{b.phone}</td>
                </TableRow>
            ))}
        </tbody>
    </TableBase>
);

function calculateAge(dateString: string) {
    if (!dateString) return '-';
    try {
        const install = parseISO(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - install.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const years = Math.floor(diffDays / 365);
        const months = Math.floor((diffDays % 365) / 30);
        return `${years}Y ${months}M`;
    } catch (e) { return '-'; }
}

const MachineListView = ({ machines, branches, onEdit, onDelete, t }: any) => (
    <TableBase>
        <thead className="bg-slate-800/50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <tr>
                <th className="px-6 py-4">Branch</th>
                <th className="px-6 py-4">Asset</th>
                <th className="px-6 py-4">S/N</th>
                <th className="px-6 py-4 text-center">Install</th>
                <th className="px-6 py-4 text-center">Age</th>
                <th className="px-6 py-4 text-center">POS</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4">Remark</th>
                <th className="px-6 py-4 text-right">Actions</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
            {machines.map((m: any) => (
                <TableRow key={m.id} onEdit={() => onEdit(m)} onDelete={() => onDelete(m.id)}>
                    <td className="px-6 py-4 text-slate-400 font-bold">{branches.find((b: any) => b.id === m.branchId)?.name}</td>
                    <td className="px-6 py-4 font-bold text-white">{m.name}</td>
                    <td className="px-6 py-4 font-mono text-slate-500 text-xs">{m.sn}</td>
                    <td className="px-6 py-4 text-center text-xs text-slate-500">{m.installDate}</td>
                    <td className="px-6 py-4 text-center text-xs font-mono text-brand">{calculateAge(m.installDate)}</td>
                    <td className="px-6 py-4 text-center text-xs text-slate-400">{m.pos}</td>
                    <td className="px-6 py-4 text-center"><Badge variant={m.status === 'พร้อมใช้งาน' ? 'success' : m.status === 'รอซ่อม' ? 'error' : 'default'} className="font-bold tracking-tighter uppercase whitespace-nowrap text-[10px]">{m.status}</Badge></td>
                    <td className="px-6 py-4 text-xs text-slate-500 italic max-w-[150px] truncate">{m.remark}</td>
                </TableRow>
            ))}
        </tbody>
    </TableBase>
);

const ExpenseListView = ({ expenses, branches, onEdit, onDelete, t }: any) => (
    <TableBase>
        <thead className="bg-slate-800/50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <tr>
                <th className="px-6 py-4">{t('Branch', 'สาขา')}</th>
                <th className="px-6 py-4">{t('Date', 'วันที่')}</th>
                <th className="px-6 py-4">{t('Type', 'ประเภทค่าใช้จ่าย')}</th>
                <th className="px-6 py-4">{t('Detail', 'รายละเอียด')}</th>
                <th className="px-6 py-4">{t('Technician', 'ช่างที่เข้าหน้างาน')}</th>
                <th className="px-6 py-4 text-right">{t('Amount', 'จำนวนเงิน(บาท)')}</th>
                <th className="px-6 py-4 text-right">Actions</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
            {expenses.map((e: any) => (
                <TableRow key={e.id} onEdit={() => onEdit(e)} onDelete={() => onDelete(e.id)}>
                    <td className="px-6 py-4 font-bold text-white">{branches.find((b: any) => b.id === e.branchId)?.name}</td>
                    <td className="px-6 py-4 text-slate-400 font-medium text-xs">{e.date}</td>
                    <td className="px-6 py-4"><Badge className="bg-slate-800 text-brand border-brand/20 font-bold">{e.type}</Badge></td>
                    <td className="px-6 py-4 text-slate-300 text-sm max-w-[200px] truncate">{e.detail}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{e.technician}</td>
                    <td className="px-6 py-4 text-right font-black text-brand tabular-nums">฿{e.amount.toLocaleString()}</td>
                </TableRow>
            ))}
        </tbody>
    </TableBase>
);

const SparePartsView = ({ parts, branches, onEdit, onDelete, t }: any) => (
    <TableBase>
        <thead className="bg-slate-800/50 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <tr>
                <th className="px-6 py-4">{t('Date', 'วันที่ซ่อม')}</th>
                <th className="px-6 py-4">{t('Branch', 'สาขา')}</th>
                <th className="px-6 py-4">{t('Device', 'อุปกรณ์ที่ซ่อม')}</th>
                <th className="px-6 py-4">{t('Part', 'ชื่ออะไหล่')}</th>
                <th className="px-6 py-4 text-center">{t('Qty', 'จำนวน')}</th>
                <th className="px-6 py-4 text-right">{t('Price/Unit', 'ราคา/หน่วย')}</th>
                <th className="px-6 py-4 text-right">{t('Total', 'ราคารวม')}</th>
                <th className="px-6 py-4">{t('Technician', 'ช่างที่ดำเนินการ')}</th>
                <th className="px-6 py-4 text-right">Actions</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
            {parts.map((p: any) => (
                <TableRow key={p.id} onEdit={() => onEdit(p)} onDelete={() => onDelete(p.id)}>
                    <td className="px-6 py-4 text-slate-400 font-medium text-xs">{p.date}</td>
                    <td className="px-6 py-4 text-white font-bold text-sm">{branches.find((b: any) => b.id === p.branchId)?.name}</td>
                    <td className="px-6 py-4 text-brand font-bold text-xs">{p.device}</td>
                    <td className="px-6 py-4 text-slate-300 font-semibold">{p.partName}</td>
                    <td className="px-6 py-4 text-center text-slate-400">{p.qty}</td>
                    <td className="px-6 py-4 text-right text-slate-400 tabular-nums">฿{p.unitPrice.toLocaleString()}</td>
                    <td className="px-6 py-4 text-right font-black text-emerald-500 tabular-nums">฿{p.totalPrice.toLocaleString()}</td>
                    <td className="px-6 py-4 text-slate-400 text-xs">{p.technician}</td>
                </TableRow>
            ))}
        </tbody>
    </TableBase>
);
