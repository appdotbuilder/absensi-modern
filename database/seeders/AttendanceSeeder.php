<?php

namespace Database\Seeders;

use App\Models\Attendance;
use App\Models\User;
use Illuminate\Database\Seeder;

class AttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::factory()->admin()->create([
            'name' => 'Administrator',
            'email' => 'admin@company.com',
            'department' => 'Management',
            'position' => 'System Administrator',
        ]);

        // Create employees
        $employees = User::factory(10)->employee()->create();

        // Create attendance data for the past 30 days
        $employees->each(function ($employee) {
            // Create attendance for the last 20-25 days (some missing for realistic data)
            $attendanceDays = random_int(20, 25);
            
            Attendance::factory($attendanceDays)->create([
                'user_id' => $employee->id,
            ]);

            // Create today's attendance for some employees
            if (random_int(1, 100) <= 70) { // 70% chance
                Attendance::factory()->today()->create([
                    'user_id' => $employee->id,
                ]);
            }
        });
    }
}