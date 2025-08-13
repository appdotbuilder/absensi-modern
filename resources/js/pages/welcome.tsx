import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { LucideIcon } from '@/components/lucide-icon';

export default function Welcome() {
    const features = [
        {
            icon: 'face-id',
            title: 'Pengenalan Wajah',
            description: 'Sistem absensi dengan teknologi pengenalan wajah untuk keamanan maksimal'
        },
        {
            icon: 'map-pin',
            title: 'Verifikasi Lokasi',
            description: 'Anti-fake GPS dengan verifikasi lokasi real-time untuk mencegah kecurangan'
        },
        {
            icon: 'bar-chart-3',
            title: 'Laporan Lengkap',
            description: 'Dashboard analytics dengan laporan harian, bulanan, dan visualisasi data'
        },
        {
            icon: 'users',
            title: 'Multi-Role',
            description: 'Sistem untuk karyawan dan administrator dengan hak akses berbeda'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
            {/* Header */}
            <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">A</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">AttendanceApp</span>
                        </div>
                        <div className="space-x-4">
                            <Link
                                href="/login"
                                className="text-gray-600 hover:text-gray-900 font-medium"
                            >
                                Masuk
                            </Link>
                            <Link href="/register">
                                <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                                    Daftar
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-20 pb-16">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            🕐 Sistem Absensi
                            <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                                {' '}Modern
                            </span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
                            Solusi absensi karyawan terdepan dengan teknologi pengenalan wajah dan 
                            verifikasi lokasi anti-fake GPS. Kelola kehadiran tim Anda dengan mudah dan akurat.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg px-8">
                                    🚀 Mulai Sekarang
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button size="lg" variant="outline" className="text-lg px-8 border-2">
                                    👤 Demo Admin
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            ✨ Fitur Unggulan
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Teknologi terdepan untuk sistem absensi yang akurat dan terpercaya
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div 
                                key={index} 
                                className="text-center p-6 rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <LucideIcon 
                                        name={feature.icon as 'face-id' | 'map-pin' | 'bar-chart-3' | 'users'} 
                                        className="w-8 h-8 text-blue-600" 
                                    />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">
                            📈 Manfaat untuk Perusahaan
                        </h2>
                        <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                            Tingkatkan produktivitas dan akurasi data kehadiran karyawan
                        </p>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-4xl font-bold mb-2">99.9%</div>
                            <div className="text-blue-100">Akurasi Pengenalan</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold mb-2">50%</div>
                            <div className="text-blue-100">Pengurangan Fraud</div>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold mb-2">80%</div>
                            <div className="text-blue-100">Efisiensi Waktu</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4 text-center">
                    <div className="max-w-2xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            🎯 Siap Mulai?
                        </h2>
                        <p className="text-lg text-gray-600 mb-8">
                            Bergabung dengan ribuan perusahaan yang telah mempercayai sistem kami
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/register">
                                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-lg px-8">
                                    💼 Daftar Sebagai Karyawan
                                </Button>
                            </Link>
                            <Link href="/login">
                                <Button size="lg" variant="outline" className="text-lg px-8 border-2">
                                    🔑 Login Admin
                                </Button>
                            </Link>
                        </div>
                        
                        {/* Demo Credentials */}
                        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200 max-w-md mx-auto">
                            <h3 className="font-semibold text-gray-900 mb-2">🎪 Demo Account:</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <div><strong>Admin:</strong> admin@company.com</div>
                                <div><strong>Password:</strong> password</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-8">
                <div className="container mx-auto px-4 text-center">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-md flex items-center justify-center">
                            <span className="text-white font-bold text-sm">A</span>
                        </div>
                        <span className="text-lg font-bold">AttendanceApp</span>
                    </div>
                    <p className="text-gray-400">
                        © 2024 AttendanceApp. Sistem absensi modern untuk masa depan.
                    </p>
                </div>
            </footer>
        </div>
    );
}