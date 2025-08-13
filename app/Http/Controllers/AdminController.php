<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        $today = today();
        
        // Today's statistics
        $todayStats = [
            'totalEmployees' => User::employees()->where('is_active', true)->count(),
            'presentToday' => Attendance::whereDate('date', $today)->whereNotNull('clock_in')->count(),
            'lateToday' => Attendance::whereDate('date', $today)->where('status', 'late')->count(),
            'absentToday' => User::employees()->where('is_active', true)->count() - 
                           Attendance::whereDate('date', $today)->whereNotNull('clock_in')->count(),
        ];
        
        // Recent attendance activities
        $recentActivities = Attendance::with('user')
            ->whereDate('date', $today)
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();
            
        // Monthly overview
        $monthlyOverview = $this->getMonthlyOverview();
        
        return Inertia::render('admin/dashboard', [
            'todayStats' => $todayStats,
            'recentActivities' => $recentActivities,
            'monthlyOverview' => $monthlyOverview,
        ]);
    }

    /**
     * Display daily attendance report.
     */
    public function show(Request $request)
    {
        $date = $request->get('date', today()->format('Y-m-d'));
        $selectedDate = Carbon::createFromFormat('Y-m-d', $date);
        
        // Get all active employees with their attendance for the selected date
        $employees = User::employees()
            ->where('is_active', true)
            ->with(['attendances' => function ($query) use ($selectedDate) {
                $query->where('date', $selectedDate);
            }])
            ->orderBy('name')
            ->get();
            
        // Transform data for frontend
        $attendanceData = $employees->map(function ($employee) {
            $attendance = $employee->attendances->first();
            
            return [
                'id' => $employee->id,
                'name' => $employee->name,
                'employee_id' => $employee->employee_id,
                'department' => $employee->department,
                'position' => $employee->position,
                'attendance' => $attendance ? [
                    'id' => $attendance->id,
                    'clock_in' => $attendance->clock_in,
                    'clock_out' => $attendance->clock_out,
                    'status' => $attendance->status,
                    'work_duration' => $attendance->work_duration,
                    'clock_in_address' => $attendance->clock_in_address,
                    'clock_out_address' => $attendance->clock_out_address,
                    'is_verified' => $attendance->is_verified,
                ] : null,
                'status' => $attendance ? $attendance->status : 'absent',
            ];
        });
        
        // Calculate daily statistics
        $dailyStats = [
            'total' => $employees->count(),
            'present' => $attendanceData->where('status', '!=', 'absent')->count(),
            'late' => $attendanceData->where('status', 'late')->count(),
            'absent' => $attendanceData->where('status', 'absent')->count(),
        ];
        
        return Inertia::render('admin/daily-report', [
            'attendanceData' => $attendanceData,
            'dailyStats' => $dailyStats,
            'selectedDate' => $date,
        ]);
    }

    /**
     * Display monthly attendance report.
     */
    public function create(Request $request)
    {
        $month = $request->get('month', now()->format('Y-m'));
        $monthDate = Carbon::createFromFormat('Y-m', $month);
        
        // Get all active employees
        $employees = User::employees()
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
            
        // Get attendance data for the month
        $attendances = Attendance::whereYear('date', $monthDate->year)
            ->whereMonth('date', $monthDate->month)
            ->with('user')
            ->get();
            
        // Transform data for monthly report
        $monthlyData = $employees->map(function ($employee) use ($attendances, $monthDate) {
            $employeeAttendances = $attendances->where('user_id', $employee->id);
            
            $totalDays = $employeeAttendances->count();
            $presentDays = $employeeAttendances->where('status', 'present')->count();
            $lateDays = $employeeAttendances->where('status', 'late')->count();
            $workingDays = $monthDate->daysInMonth; // Simplified - should exclude weekends/holidays
            
            return [
                'id' => $employee->id,
                'name' => $employee->name,
                'employee_id' => $employee->employee_id,
                'department' => $employee->department,
                'position' => $employee->position,
                'totalDays' => $totalDays,
                'presentDays' => $presentDays,
                'lateDays' => $lateDays,
                'absentDays' => $workingDays - $totalDays,
                'attendanceRate' => $workingDays > 0 ? round($totalDays / $workingDays * 100, 1) : 0,
                'totalWorkHours' => round($employeeAttendances->sum('work_duration') / 60, 1),
            ];
        });
        
        return Inertia::render('admin/monthly-report', [
            'monthlyData' => $monthlyData,
            'selectedMonth' => $month,
            'monthName' => $monthDate->format('F Y'),
        ]);
    }
    
    /**
     * Get monthly overview data for dashboard.
     *
     * @return array
     */
    protected function getMonthlyOverview(): array
    {
        $currentMonth = now();
        $daysInMonth = $currentMonth->daysInMonth;
        
        // Get attendance data for current month
        $monthlyAttendances = Attendance::whereYear('date', $currentMonth->year)
            ->whereMonth('date', $currentMonth->month)
            ->get();
            
        $totalEmployees = User::employees()->where('is_active', true)->count();
        $totalPossibleAttendances = $totalEmployees * $daysInMonth;
        
        $presentCount = $monthlyAttendances->where('status', 'present')->count();
        $lateCount = $monthlyAttendances->where('status', 'late')->count();
        $totalAttendances = $monthlyAttendances->count();
        
        return [
            'attendanceRate' => $totalPossibleAttendances > 0 ? 
                round($totalAttendances / $totalPossibleAttendances * 100, 1) : 0,
            'punctualityRate' => $totalAttendances > 0 ? 
                round($presentCount / $totalAttendances * 100, 1) : 0,
            'totalWorkHours' => round($monthlyAttendances->sum('work_duration') / 60, 1),
            'averageWorkHours' => $totalAttendances > 0 ? 
                round($monthlyAttendances->sum('work_duration') / 60 / $totalAttendances, 1) : 0,
        ];
    }
}