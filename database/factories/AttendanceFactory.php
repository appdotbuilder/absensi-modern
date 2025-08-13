<?php

namespace Database\Factories;

use App\Models\Attendance;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attendance>
 */
class AttendanceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\Attendance>
     */
    protected $model = Attendance::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $clockIn = $this->faker->time('H:i:s', '17:00:00');
        $clockOut = $this->faker->optional(0.8)->time('H:i:s', '18:00:00');
        
        $workDuration = null;
        if ($clockOut) {
            $clockInTime = \Carbon\Carbon::createFromTimeString($clockIn);
            $clockOutTime = \Carbon\Carbon::createFromTimeString($clockOut);
            $workDuration = $clockInTime->diffInMinutes($clockOutTime);
        }

        return [
            'user_id' => User::factory(),
            'date' => $this->faker->dateTimeBetween('-30 days', 'now')->format('Y-m-d'),
            'clock_in' => $clockIn,
            'clock_out' => $clockOut,
            'clock_in_lat' => $this->faker->latitude(-6.3, -6.1), // Jakarta area
            'clock_in_lng' => $this->faker->longitude(106.7, 106.9), // Jakarta area
            'clock_out_lat' => $this->faker->optional(0.8)->latitude(-6.3, -6.1),
            'clock_out_lng' => $this->faker->optional(0.8)->longitude(106.7, 106.9),
            'clock_in_address' => $this->faker->address(),
            'clock_out_address' => $this->faker->optional(0.8)->address(),
            'clock_in_notes' => $this->faker->optional(0.3)->sentence(),
            'clock_out_notes' => $this->faker->optional(0.3)->sentence(),
            'status' => $this->faker->randomElement(['present', 'late', 'half_day']),
            'work_duration' => $workDuration,
            'is_verified' => $this->faker->boolean(70),
        ];
    }

    /**
     * Indicate that the attendance is for today.
     */
    public function today(): static
    {
        return $this->state(fn (array $attributes) => [
            'date' => today()->format('Y-m-d'),
        ]);
    }

    /**
     * Indicate that the attendance is late.
     */
    public function late(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'late',
            'clock_in' => $this->faker->time('H:i:s', '10:00:00'), // After 9 AM
        ]);
    }

    /**
     * Indicate that the attendance is not clocked out.
     */
    public function notClockedOut(): static
    {
        return $this->state(fn (array $attributes) => [
            'clock_out' => null,
            'clock_out_lat' => null,
            'clock_out_lng' => null,
            'clock_out_address' => null,
            'clock_out_notes' => null,
            'work_duration' => null,
        ]);
    }
}