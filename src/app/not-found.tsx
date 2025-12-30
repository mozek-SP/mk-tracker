import Link from 'next/link';
import { Button } from '@/components/ui';

export default function NotFound() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[#0F172A] text-slate-200">
            <h2 className="text-4xl font-black text-brand mb-4">404 - Not Found</h2>
            <p className="mb-8 text-slate-400">Could not find the requested resource.</p>
            <Link href="/">
                <Button>Return Home</Button>
            </Link>
        </div>
    );
}
