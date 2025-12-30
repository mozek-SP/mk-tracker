"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import { Button, Input } from '@/components/ui';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate network delay
        await new Promise(r => setTimeout(r, 1500));

        const adminUser = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin';
        const adminPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'mk1234';

        if (username === adminUser && password === adminPass) {
            localStorage.setItem('mk_auth_token', 'demo-token-123'); // Simple auth
            document.cookie = "auth=true; path=/"; // Set cookie for middleware
            router.push('/');
        } else {
            setError('Invalid username or password');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-[#0F172A] relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand/20 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-1000" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-md p-8 relative z-10"
            >
                <div className="mb-10 text-center">
                    <motion.div
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-16 h-16 bg-gradient-to-tr from-brand to-orange-600 rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-brand/20 mb-6"
                    >
                        <Lock className="text-white" size={32} />
                    </motion.div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter mb-2">MK TRACKER</h1>
                    <p className="text-slate-400">Enter your credentials to access the system</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand transition-colors" size={20} />
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-12 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 transition-all font-medium"
                            />
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-brand transition-colors" size={20} />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-900/50 border border-slate-800 rounded-xl px-12 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:border-brand focus:ring-1 focus:ring-brand/50 transition-all font-medium"
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="text-red-500 text-sm text-center font-bold bg-red-500/10 py-2 rounded-lg border border-red-500/20"
                        >
                            {error}
                        </motion.div>
                    )}

                    <Button
                        disabled={loading}
                        className="w-full h-14 bg-gradient-to-r from-brand to-orange-600 hover:from-brand/90 hover:to-orange-600/90 text-white rounded-xl font-bold text-lg shadow-lg shadow-brand/25 flex items-center justify-center gap-2 group"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : (
                            <>
                                Login to Dashboard
                                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                            </>
                        )}
                    </Button>
                </form>

                <p className="mt-8 text-center text-slate-600 text-xs font-medium uppercase tracking-widest">
                    Restricted Access &bull; MK Restaurant Group
                </p>
            </motion.div>
        </div>
    );
}
