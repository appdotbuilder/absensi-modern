import React, { useEffect } from 'react';
import { router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from '@/components/lucide-icon';

interface User {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'employee';
}

interface Props {
    auth: {
        user: User;
    };
    [key: string]: unknown;
}

export default function Dashboard({ auth }: Props) {
    const { user } = auth;

    useEffect(() => {
        // Redirect based on user role
        if (user.role === 'admin') {
            router.visit(route('admin.dashboard'));
        } else if (user.role === 'employee') {
            router.visit(route('attendance.index'));
        }
    }, [user.role]);

    return (
        <AppShell>
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="p-8 text-center">
                        <div className="animate-pulse">
                            <LucideIcon name="loader-2" className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
                            <p className="text-gray-600">Memuat dashboard...</p>
                            <p className="text-sm text-gray-500 mt-2">
                                Mengarahkan ke {user.role === 'admin' ? 'dashboard admin' : 'halaman absensi'}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}