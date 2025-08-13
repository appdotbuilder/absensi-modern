import React, { useState, useEffect, useCallback } from 'react';
import { AppShell } from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon } from '@/components/lucide-icon';
import { router } from '@inertiajs/react';

interface Attendance {
    id: number;
    date: string;
    clock_in: string | null;
    clock_out: string | null;
    status: string;
    work_duration: number | null;
    clock_in_address: string | null;
    clock_out_address: string | null;
}

interface MonthlyStats {
    totalDays: number;
    presentDays: number;
    lateDays: number;
    absentDays: number;
    totalWorkHours: number;
    avgWorkHours: number;
    attendanceRate: number;
}

interface Props {
    todayAttendance: Attendance | null;
    recentAttendances: Attendance[];
    monthlyStats: MonthlyStats;
    canClockIn: boolean;
    canClockOut: boolean;
    [key: string]: unknown;
}

export default function AttendanceIndex({ 
    todayAttendance, 
    recentAttendances, 
    monthlyStats, 
    canClockIn, 
    canClockOut 
}: Props) {
    const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [address, setAddress] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());

    const getCurrentLocation = useCallback(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setLocation({ lat: latitude, lng: longitude });
                    getAddress(latitude, longitude);
                },
                () => {
                    console.error('Error getting location');
                }
            );
        }
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        getCurrentLocation();
    }, [getCurrentLocation]);

    const getAddress = async (lat: number, lng: number) => {
        try {
            // In a real app, you'd use a geocoding service
            setAddress(`${lat.toFixed(4)}, ${lng.toFixed(4)}`);
        } catch {
            setAddress('Alamat tidak tersedia');
        }
    };

    const handleClockAction = (type: 'clock_in' | 'clock_out') => {
        if (!location) {
            alert('Menunggu lokasi...');
            return;
        }

        setLoading(true);

        router.post(route('attendance.store'), {
            type,
            latitude: location.lat,
            longitude: location.lng,
            address,
            face_verified: true, // In real app, this would come from face recognition
            face_confidence: 0.95,
            device_info: {
                browser: navigator.userAgent,
                timestamp: new Date().toISOString()
            }
        }, {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => setLoading(false)
        });
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            present: { variant: 'default' as const, label: 'Hadir', className: 'bg-green-100 text-green-800' },
            late: { variant: 'secondary' as const, label: 'Terlambat', className: 'bg-orange-100 text-orange-800' },
            absent: { variant: 'destructive' as const, label: 'Tidak Hadir', className: 'bg-red-100 text-red-800' },
            half_day: { variant: 'outline' as const, label: 'Setengah Hari', className: 'bg-blue-100 text-blue-800' }
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

    return (
        <AppShell>
            <div className="container mx-auto p-6 space-y-6">
                {/* Header with Current Time */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        🕐 Absensi Karyawan
                    </h1>
                    <div className="text-2xl font-mono text-blue-600">
                        {currentTime.toLocaleTimeString('id-ID')}
                    </div>
                    <div className="text-gray-600">
                        {currentTime.toLocaleDateString('id-ID', { 
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Clock In/Out Section */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <LucideIcon name="clock" className="w-5 h-5" />
                                    Absensi Hari Ini
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Location Info */}
                                <div className="bg-blue-50 p-4 rounded-lg">
                                    <div className="flex items-center gap-2 text-blue-800 font-medium mb-2">
                                        <LucideIcon name="map-pin" className="w-4 h-4" />
                                        Lokasi Saat Ini
                                    </div>
                                    <div className="text-sm text-blue-600">
                                        {location ? address : 'Mendeteksi lokasi...'}
                                    </div>
                                </div>

                                {/* Today's Attendance Status */}
                                {todayAttendance ? (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <div className="text-green-800 font-medium mb-1">Clock In</div>
                                            <div className="text-2xl font-bold text-green-600">
                                                {formatTime(todayAttendance.clock_in)}
                                            </div>
                                            <div className="text-sm text-green-600">
                                                {getStatusBadge(todayAttendance.status)}
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <div className="text-gray-800 font-medium mb-1">Clock Out</div>
                                            <div className="text-2xl font-bold text-gray-600">
                                                {formatTime(todayAttendance.clock_out)}
                                            </div>
                                            {todayAttendance.work_duration && (
                                                <div className="text-sm text-gray-600">
                                                    Durasi: {formatDuration(todayAttendance.work_duration)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <LucideIcon name="calendar-x" className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                        <p className="text-gray-600">Belum ada absensi hari ini</p>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="flex gap-4 justify-center">
                                    <Button
                                        onClick={() => handleClockAction('clock_in')}
                                        disabled={!canClockIn || loading || !location}
                                        size="lg"
                                        className="bg-green-600 hover:bg-green-700 min-w-32"
                                    >
                                        {loading ? (
                                            <LucideIcon name="loader-2" className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <LucideIcon name="log-in" className="w-4 h-4 mr-2" />
                                        )}
                                        Clock In
                                    </Button>
                                    <Button
                                        onClick={() => handleClockAction('clock_out')}
                                        disabled={!canClockOut || loading || !location}
                                        size="lg"
                                        variant="outline"
                                        className="border-red-200 text-red-600 hover:bg-red-50 min-w-32"
                                    >
                                        {loading ? (
                                            <LucideIcon name="loader-2" className="w-4 h-4 mr-2 animate-spin" />
                                        ) : (
                                            <LucideIcon name="log-out" className="w-4 h-4 mr-2" />
                                        )}
                                        Clock Out
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Monthly Stats */}
                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <LucideIcon name="bar-chart-3" className="w-5 h-5" />
                                    Statistik Bulan Ini
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-green-50 rounded-lg">
                                        <div className="text-2xl font-bold text-green-600">
                                            {monthlyStats.presentDays}
                                        </div>
                                        <div className="text-sm text-green-800">Hadir</div>
                                    </div>
                                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                                        <div className="text-2xl font-bold text-orange-600">
                                            {monthlyStats.lateDays}
                                        </div>
                                        <div className="text-sm text-orange-800">Terlambat</div>
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Tingkat Kehadiran</span>
                                        <span className="text-sm font-medium">{monthlyStats.attendanceRate}%</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Total Jam Kerja</span>
                                        <span className="text-sm font-medium">{monthlyStats.totalWorkHours}h</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-gray-600">Rata-rata per Hari</span>
                                        <span className="text-sm font-medium">{monthlyStats.avgWorkHours}h</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Recent Attendance */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <LucideIcon name="history" className="w-5 h-5" />
                            Riwayat Terkini
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2">Tanggal</th>
                                        <th className="text-left py-2">Clock In</th>
                                        <th className="text-left py-2">Clock Out</th>
                                        <th className="text-left py-2">Durasi</th>
                                        <th className="text-left py-2">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentAttendances.map((attendance) => (
                                        <tr key={attendance.id} className="border-b">
                                            <td className="py-2">
                                                {new Date(attendance.date).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="py-2">{formatTime(attendance.clock_in)}</td>
                                            <td className="py-2">{formatTime(attendance.clock_out)}</td>
                                            <td className="py-2">{formatDuration(attendance.work_duration)}</td>
                                            <td className="py-2">{getStatusBadge(attendance.status)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}