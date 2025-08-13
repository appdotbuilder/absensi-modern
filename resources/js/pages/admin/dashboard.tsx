import React from 'react';
import { Link } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from '@/components/lucide-icon';

interface TodayStats {
    totalEmployees: number;
    presentToday: number;
    lateToday: number;
    absentToday: number;
}

interface MonthlyOverview {
    attendanceRate: number;
    punctualityRate: number;
    totalWorkHours: number;
    averageWorkHours: number;
}

interface RecentActivity {
    id: number;
    date: string;
    clock_in: string | null;
    clock_out: string | null;
    status: string;
    created_at: string;
    user: {
        name: string;
        employee_id: string;
    };
}

interface Props {
    todayStats: TodayStats;
    monthlyOverview: MonthlyOverview;
    recentActivities: RecentActivity[];
    [key: string]: unknown;
}

export default function AdminDashboard({ 
    todayStats, 
    monthlyOverview, 
    recentActivities 
}: Props) {
    const getStatusBadge = (status: string) => {
        const variants = {
            present: { label: 'Hadir', className: 'bg-green-100 text-green-800' },
            late: { label: 'Terlambat', className: 'bg-orange-100 text-orange-800' },
            absent: { label: 'Tidak Hadir', className: 'bg-red-100 text-red-800' },
            half_day: { label: 'Setengah Hari', className: 'bg-blue-100 text-blue-800' }
        };
        
        const config = variants[status as keyof typeof variants] || variants.absent;
        return (
            <Badge className={config.className}>
                {config.label}
            </Badge>
        );
    };

    const formatTime = (timeString: string | null) => {
        if (!timeString) return '-';
        return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const attendanceRate = todayStats.totalEmployees > 0 
        ? Math.round((todayStats.presentToday / todayStats.totalEmployees) * 100)
        : 0;

    return (
        <AppShell>
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            👨‍💼 Dashboard Admin
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Kelola dan pantau absensi karyawan
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Link href={route('admin.daily-report')}>
                            <Button variant="outline">
                                <LucideIcon name="calendar-days" className="w-4 h-4 mr-2" />
                                Laporan Harian
                            </Button>
                        </Link>
                        <Link href={route('admin.monthly-report')}>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <LucideIcon name="bar-chart-3" className="w-4 h-4 mr-2" />
                                Laporan Bulanan
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Today's Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <LucideIcon name="users" className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Karyawan</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {todayStats.totalEmployees}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <LucideIcon name="check-circle" className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Hadir Hari Ini</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {todayStats.presentToday}
                                    </p>
                                    <p className="text-sm text-green-600">{attendanceRate}% dari total</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <LucideIcon name="clock" className="w-6 h-6 text-orange-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Terlambat</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {todayStats.lateToday}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <LucideIcon name="x-circle" className="w-6 h-6 text-red-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Tidak Hadir</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {todayStats.absentToday}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Monthly Overview */}
                    <Card className="lg:col-span-1">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <LucideIcon name="trending-up" className="w-5 h-5" />
                                Ringkasan Bulan Ini
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Tingkat Kehadiran</span>
                                        <span className="font-medium">{monthlyOverview.attendanceRate}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-blue-600 h-2 rounded-full" 
                                            style={{ width: `${monthlyOverview.attendanceRate}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-600">Ketepatan Waktu</span>
                                        <span className="font-medium">{monthlyOverview.punctualityRate}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-green-600 h-2 rounded-full" 
                                            style={{ width: `${monthlyOverview.punctualityRate}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="pt-2 space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Total Jam Kerja</span>
                                        <span className="text-sm font-medium">{monthlyOverview.totalWorkHours}h</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Rata-rata per Hari</span>
                                        <span className="text-sm font-medium">{monthlyOverview.averageWorkHours}h</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Activities */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <LucideIcon name="activity" className="w-5 h-5" />
                                Aktivitas Terkini
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {recentActivities.length > 0 ? (
                                    recentActivities.map((activity) => (
                                        <div 
                                            key={activity.id}
                                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <LucideIcon name="user" className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {activity.user.name}
                                                    </p>
                                                    <p className="text-sm text-gray-600">
                                                        {activity.user.employee_id}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="flex items-center gap-2">
                                                    {getStatusBadge(activity.status)}
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    {activity.clock_in ? `Masuk: ${formatTime(activity.clock_in)}` : ''}
                                                    {activity.clock_out ? ` | Keluar: ${formatTime(activity.clock_out)}` : ''}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-8">
                                        <LucideIcon name="calendar-x" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-600">Belum ada aktivitas hari ini</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LucideIcon name="zap" className="w-5 h-5" />
                            Aksi Cepat
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link 
                                href={route('admin.daily-report')}
                                className="p-4 border border-gray-200 rounded-lg hover:border-blue-200 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <LucideIcon name="calendar-days" className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Laporan Harian</h3>
                                        <p className="text-sm text-gray-600">Lihat absensi hari ini</p>
                                    </div>
                                </div>
                            </Link>

                            <Link 
                                href={route('admin.monthly-report')}
                                className="p-4 border border-gray-200 rounded-lg hover:border-blue-200 hover:shadow-md transition-all duration-200"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <LucideIcon name="bar-chart-3" className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Laporan Bulanan</h3>
                                        <p className="text-sm text-gray-600">Analisis per bulan</p>
                                    </div>
                                </div>
                            </Link>

                            <div className="p-4 border border-gray-200 rounded-lg opacity-60">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                        <LucideIcon name="settings" className="w-5 h-5 text-gray-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">Pengaturan</h3>
                                        <p className="text-sm text-gray-600">Segera hadir</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}