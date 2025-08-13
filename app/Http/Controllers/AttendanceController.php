<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAttendanceRequest;
use App\Models\Attendance;
use App\Models\AttendanceLog;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AttendanceController extends Controller
{
    /**
     * Display the attendance dashboard.
     */
    public function index()
    {
        $user = Auth::user();
        $today = today();
        
        // Get today's attendance
        $todayAttendance = Attendance::where('user_id', $user->id)
            ->where('date', $today)
            ->first();
            
        // Get recent attendances
        $recentAttendances = Attendance::where('user_id', $user->id)
            ->latest('date')
            ->limit(5)
            ->get();
            
        // Get monthly summary
        $monthlyStats = $this->getMonthlyStats($user->id);
        
        return Inertia::render('attendance/index', [
            'todayAttendance' => $todayAttendance,
            'recentAttendances' => $recentAttendances,
            'monthlyStats' => $monthlyStats,
            'canClockIn' => !$todayAttendance || !$todayAttendance->clock_in,
            'canClockOut' => $todayAttendance && $todayAttendance->clock_in && !$todayAttendance->clock_out,
        ]);
    }

    /**
     * Store a new attendance record (clock in/out).
     */
    public function store(StoreAttendanceRequest $request)
    {
        $user = Auth::user();
        $today = today();
        $validated = $request->validated();
        
        // Get or create today's attendance
        $attendance = Attendance::firstOrCreate(
            [
                'user_id' => $user->id,
                'date' => $today,
            ],
            [
                'status' => 'present',
                'is_verified' => false,
            ]
        );
        
        $now = now();
        $type = $validated['type']; // 'clock_in' or 'clock_out'
        
        // Update attendance based on type
        if ($type === 'clock_in' && !$attendance->clock_in) {
            $attendance->update([
                'clock_in' => $now->format('H:i:s'),
                'clock_in_lat' => $validated['latitude'],
                'clock_in_lng' => $validated['longitude'],
                'clock_in_address' => $validated['address'] ?? null,
                'clock_in_notes' => $validated['notes'] ?? null,
                'status' => $this->determineStatus($now),
            ]);
        } elseif ($type === 'clock_out' && $attendance->clock_in && !$attendance->clock_out) {
            $clockIn = Carbon::createFromTimeString($attendance->clock_in);
            $workDuration = $clockIn->diffInMinutes($now);
            
            $attendance->update([
                'clock_out' => $now->format('H:i:s'),
                'clock_out_lat' => $validated['latitude'],
                'clock_out_lng' => $validated['longitude'],
                'clock_out_address' => $validated['address'] ?? null,
                'clock_out_notes' => $validated['notes'] ?? null,
                'work_duration' => $workDuration,
            ]);
        }
        
        // Create attendance log
        AttendanceLog::create([
            'attendance_id' => $attendance->id,
            'type' => $type,
            'logged_at' => $now,
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'device_info' => $validated['device_info'] ?? null,
            'location_data' => $validated['location_data'] ?? null,
            'face_verified' => $validated['face_verified'] ?? false,
            'face_confidence' => $validated['face_confidence'] ?? null,
        ]);
        
        return redirect()->back()->with('success', 
            $type === 'clock_in' ? 'Berhasil clock in!' : 'Berhasil clock out!'
        );
    }

    /**
     * Display attendance history.
     */
    public function show(Request $request)
    {
        $user = Auth::user();
        $month = $request->get('month', now()->format('Y-m'));
        $monthDate = Carbon::createFromFormat('Y-m', $month);
        
        $attendances = Attendance::where('user_id', $user->id)
            ->whereYear('date', $monthDate->year)
            ->whereMonth('date', $monthDate->month)
            ->orderBy('date', 'desc')
            ->get();
            
        $monthlyStats = $this->getMonthlyStats($user->id, $monthDate);
        
        return Inertia::render('attendance/history', [
            'attendances' => $attendances,
            'monthlyStats' => $monthlyStats,
            'selectedMonth' => $month,
        ]);
    }
    
    /**
     * Determine attendance status based on clock in time.
     *
     * @param  \Carbon\Carbon  $clockInTime
     * @return string
     */
    protected function determineStatus(Carbon $clockInTime): string
    {
        $workStartTime = Carbon::today()->setTime(9, 0); // 9:00 AM
        
        if ($clockInTime->gt($workStartTime)) {
            return 'late';
        }
        
        return 'present';
    }
    
    /**
     * Get monthly attendance statistics.
     *
     * @param  int  $userId
     * @param  \Carbon\Carbon|null  $month
     * @return array
     */
    protected function getMonthlyStats(int $userId, Carbon $month = null): array
    {
        $month = $month ?? now();
        
        $attendances = Attendance::where('user_id', $userId)
            ->whereYear('date', $month->year)
            ->whereMonth('date', $month->month)
            ->get();
            
        $totalDays = $attendances->count();
        $presentDays = $attendances->where('status', 'present')->count();
        $lateDays = $attendances->where('status', 'late')->count();
        $absentDays = $month->daysInMonth - $totalDays;
        
        $totalWorkHours = $attendances->sum('work_duration') / 60; // Convert minutes to hours
        $avgWorkHours = $totalDays > 0 ? $totalWorkHours / $totalDays : 0;
        
        return [
            'totalDays' => $totalDays,
            'presentDays' => $presentDays,
            'lateDays' => $lateDays,
            'absentDays' => $absentDays,
            'totalWorkHours' => round($totalWorkHours, 1),
            'avgWorkHours' => round($avgWorkHours, 1),
            'attendanceRate' => $totalDays > 0 ? round(($presentDays + $lateDays) / $month->daysInMonth * 100, 1) : 0,
        ];
    }
}