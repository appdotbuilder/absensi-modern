import React from 'react';
import { router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from '@/components/lucide-icon';

interface AttendanceRecord {
    id: number;
    name: string;
    employee_id: string;
    department: string;
    position: string;
    attendance: {
        id: number;
        clock_in: string | null;
        clock_out: string | null;
        status: string;
        work_duration: number | null;
        clock_in_address: string | null;
        clock_out_address: string | null;
        is_verified: boolean;
    } | null;
    status: string;
}

interface DailyStats {
    total: number;
    present: number;
    late: number;
    absent: number;
}

interface Props {
    attendanceData: AttendanceRecord[];
    dailyStats: DailyStats;
    selectedDate: string;
    [key: string]: unknown;
}

export default function DailyReport({ attendanceData, dailyStats, selectedDate }: Props) {

    const handleDateChange = (newDate: string) => {
        router.get(route('admin.daily-report'), { date: newDate }, {
            preserveState: true,
            replace: true
        });
    };

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

    const formatDuration = (minutes: number | null) => {
        if (!minutes) return '-';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}j ${mins}m`;
    };

    const attendanceRate = dailyStats.total > 0 
        ? Math.round(((dailyStats.present + dailyStats.late) / dailyStats.total) * 100)
        : 0;

    return (
        <AppShell>
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            📊 Laporan Harian
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Data absensi karyawan per hari
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Button
                            onClick={() => handleDateChange(new Date().toISOString().split('T')[0])}
                            variant="outline"
                        >
                            <LucideIcon name="calendar" className="w-4 h-4 mr-2" />
                            Hari Ini
                        </Button>
                    </div>
                </div>

                {/* Statistics Cards */}
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
                                        {dailyStats.total}
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
                                    <p className="text-sm font-medium text-gray-600">Hadir</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {dailyStats.present}
                                    </p>
                                    <p className="text-sm text-green-600">
                                        {dailyStats.total > 0 ? Math.round((dailyStats.present / dailyStats.total) * 100) : 0}% dari total
                                    </p>
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
                                        {dailyStats.late}
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
                                        {dailyStats.absent}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Attendance Rate Visualization */}
                <Card>
                    <CardHeader>
                        <CardTitle>Tingkat Kehadiran</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="flex-1">
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Tingkat Kehadiran</span>
                                    <span className="font-bold">{attendanceRate}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-3">
                                    <div 
                                        className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" 
                                        style={{ width: `${attendanceRate}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div className="p-3 bg-green-50 rounded-lg">
                                <div className="text-lg font-bold text-green-600">{dailyStats.present}</div>
                                <div className="text-sm text-green-800">Hadir</div>
                            </div>
                            <div className="p-3 bg-orange-50 rounded-lg">
                                <div className="text-lg font-bold text-orange-600">{dailyStats.late}</div>
                                <div className="text-sm text-orange-800">Terlambat</div>
                            </div>
                            <div className="p-3 bg-red-50 rounded-lg">
                                <div className="text-lg font-bold text-red-600">{dailyStats.absent}</div>
                                <div className="text-sm text-red-800">Tidak Hadir</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Detailed Attendance Table */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LucideIcon name="table" className="w-5 h-5" />
                            Detail Absensi - {new Date(selectedDate).toLocaleDateString('id-ID', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="text-left py-3 px-4 font-semibold">Karyawan</th>
                                        <th className="text-left py-3 px-4 font-semibold">Departemen</th>
                                        <th className="text-left py-3 px-4 font-semibold">Clock In</th>
                                        <th className="text-left py-3 px-4 font-semibold">Clock Out</th>
                                        <th className="text-left py-3 px-4 font-semibold">Durasi</th>
                                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                                        <th className="text-left py-3 px-4 font-semibold">Lokasi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceData.map((record) => (
                                        <tr key={record.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {record.name}
                                                    </div>
                                                    <div className="text-gray-500">
                                                        {record.employee_id}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <div>
                                                    <div className="text-gray-900">{record.department}</div>
                                                    <div className="text-gray-500 text-xs">{record.position}</div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                {formatTime(record.attendance?.clock_in || null)}
                                            </td>
                                            <td className="py-3 px-4">
                                                {formatTime(record.attendance?.clock_out || null)}
                                            </td>
                                            <td className="py-3 px-4">
                                                {formatDuration(record.attendance?.work_duration || null)}
                                            </td>
                                            <td className="py-3 px-4">
                                                {getStatusBadge(record.status)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <div className="text-xs text-gray-600 max-w-32 truncate">
                                                    {record.attendance?.clock_in_address || '-'}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {attendanceData.length === 0 && (
                            <div className="text-center py-8">
                                <LucideIcon name="calendar-x" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600">Tidak ada data absensi pada tanggal ini</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}