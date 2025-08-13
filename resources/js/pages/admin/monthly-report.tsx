import React from 'react';
import { router } from '@inertiajs/react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from '@/components/lucide-icon';

interface MonthlyRecord {
    id: number;
    name: string;
    employee_id: string;
    department: string;
    position: string;
    totalDays: number;
    presentDays: number;
    lateDays: number;
    absentDays: number;
    attendanceRate: number;
    totalWorkHours: number;
}

interface Props {
    monthlyData: MonthlyRecord[];
    selectedMonth: string;
    monthName: string;
    [key: string]: unknown;
}

export default function MonthlyReport({ monthlyData, selectedMonth, monthName }: Props) {
    const handleMonthChange = (newMonth: string) => {
        router.get(route('admin.monthly-report'), { month: newMonth }, {
            preserveState: true,
            replace: true
        });
    };

    const totalStats = monthlyData.reduce((acc, record) => ({
        totalEmployees: acc.totalEmployees + 1,
        totalPresent: acc.totalPresent + record.presentDays,
        totalLate: acc.totalLate + record.lateDays,
        totalAbsent: acc.totalAbsent + record.absentDays,
        totalWorkHours: acc.totalWorkHours + record.totalWorkHours,
        avgAttendanceRate: acc.avgAttendanceRate + record.attendanceRate
    }), {
        totalEmployees: 0,
        totalPresent: 0,
        totalLate: 0,
        totalAbsent: 0,
        totalWorkHours: 0,
        avgAttendanceRate: 0
    });

    const overallAttendanceRate = totalStats.totalEmployees > 0 
        ? Math.round(totalStats.avgAttendanceRate / totalStats.totalEmployees)
        : 0;

    const getAttendanceRateBadge = (rate: number) => {
        if (rate >= 90) return <Badge className="bg-green-100 text-green-800">Sangat Baik</Badge>;
        if (rate >= 80) return <Badge className="bg-blue-100 text-blue-800">Baik</Badge>;
        if (rate >= 70) return <Badge className="bg-orange-100 text-orange-800">Cukup</Badge>;
        return <Badge className="bg-red-100 text-red-800">Perlu Perhatian</Badge>;
    };

    // Sort employees by attendance rate (descending)
    const sortedData = [...monthlyData].sort((a, b) => b.attendanceRate - a.attendanceRate);
    const topPerformers = sortedData.slice(0, 3);
    const needsAttention = sortedData.filter(record => record.attendanceRate < 80);

    return (
        <AppShell>
            <div className="container mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            📈 Laporan Bulanan
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Analisis absensi karyawan - {monthName}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="month"
                            value={selectedMonth}
                            onChange={(e) => handleMonthChange(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Button
                            onClick={() => handleMonthChange(new Date().toISOString().slice(0, 7))}
                            variant="outline"
                        >
                            <LucideIcon name="calendar" className="w-4 h-4 mr-2" />
                            Bulan Ini
                        </Button>
                    </div>
                </div>

                {/* Overview Statistics */}
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
                                        {totalStats.totalEmployees}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <LucideIcon name="trending-up" className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Rata-rata Kehadiran</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {overallAttendanceRate}%
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <LucideIcon name="clock" className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Total Jam Kerja</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {Math.round(totalStats.totalWorkHours)}h
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <LucideIcon name="alert-triangle" className="w-6 h-6 text-orange-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-600">Perlu Perhatian</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {needsAttention.length}
                                    </p>
                                    <p className="text-sm text-orange-600">Kehadiran &lt; 80%</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Top Performers */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <LucideIcon name="award" className="w-5 h-5" />
                                🏆 Top Performers
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {topPerformers.map((performer, index) => (
                                    <div key={performer.id} className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                #{index + 1}
                                            </div>
                                            <div>
                                                <p className="font-medium text-gray-900">{performer.name}</p>
                                                <p className="text-sm text-gray-600">{performer.department}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-orange-600">
                                                {performer.attendanceRate}%
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                {performer.presentDays}h kehadiran
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Monthly Trend Chart Placeholder */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <LucideIcon name="bar-chart-3" className="w-5 h-5" />
                                📊 Ringkasan Statistik
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-gray-600">Tingkat Kehadiran</span>
                                        <span className="font-medium">{overallAttendanceRate}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3">
                                        <div 
                                            className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" 
                                            style={{ width: `${overallAttendanceRate}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 pt-4">
                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <div className="text-lg font-bold text-green-600">{totalStats.totalPresent}</div>
                                        <div className="text-sm text-green-800">Total Hadir</div>
                                    </div>
                                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                                        <div className="text-lg font-bold text-orange-600">{totalStats.totalLate}</div>
                                        <div className="text-sm text-orange-800">Total Terlambat</div>
                                    </div>
                                    <div className="text-center p-3 bg-red-50 rounded-lg">
                                        <div className="text-lg font-bold text-red-600">{totalStats.totalAbsent}</div>
                                        <div className="text-sm text-red-800">Total Absen</div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Detailed Employee Report */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LucideIcon name="table" className="w-5 h-5" />
                            Detail Laporan Karyawan - {monthName}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b bg-gray-50">
                                        <th className="text-left py-3 px-4 font-semibold">Karyawan</th>
                                        <th className="text-left py-3 px-4 font-semibold">Departemen</th>
                                        <th className="text-center py-3 px-4 font-semibold">Total Hari</th>
                                        <th className="text-center py-3 px-4 font-semibold">Hadir</th>
                                        <th className="text-center py-3 px-4 font-semibold">Terlambat</th>
                                        <th className="text-center py-3 px-4 font-semibold">Absen</th>
                                        <th className="text-center py-3 px-4 font-semibold">Jam Kerja</th>
                                        <th className="text-center py-3 px-4 font-semibold">Tingkat Kehadiran</th>
                                        <th className="text-center py-3 px-4 font-semibold">Performa</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {sortedData.map((record) => (
                                        <tr key={record.id} className="border-b hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {record.name}
                                                    </div>
                                                    <div className="text-gray-500 text-sm">
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
                                            <td className="py-3 px-4 text-center font-medium">
                                                {record.totalDays}
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                                    {record.presentDays}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-orange-100 text-orange-800 rounded-full text-sm font-medium">
                                                    {record.lateDays}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <span className="inline-flex items-center justify-center w-8 h-8 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                                                    {record.absentDays}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-center font-medium">
                                                {record.totalWorkHours}h
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                <div className="text-lg font-bold text-gray-900">
                                                    {record.attendanceRate}%
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                                                    <div 
                                                        className={`h-2 rounded-full transition-all duration-300 ${
                                                            record.attendanceRate >= 90 ? 'bg-green-500' :
                                                            record.attendanceRate >= 80 ? 'bg-blue-500' :
                                                            record.attendanceRate >= 70 ? 'bg-orange-500' : 'bg-red-500'
                                                        }`}
                                                        style={{ width: `${record.attendanceRate}%` }}
                                                    ></div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-center">
                                                {getAttendanceRateBadge(record.attendanceRate)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {monthlyData.length === 0 && (
                            <div className="text-center py-8">
                                <LucideIcon name="calendar-x" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                <p className="text-gray-600">Tidak ada data absensi pada bulan ini</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}