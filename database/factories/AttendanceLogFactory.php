<?php

namespace Database\Factories;

use App\Models\Attendance;
use App\Models\AttendanceLog;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\AttendanceLog>
 */
class AttendanceLogFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var class-string<\App\Models\AttendanceLog>
     */
    protected $model = AttendanceLog::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'attendance_id' => Attendance::factory(),
            'type' => $this->faker->randomElement(['clock_in', 'clock_out']),
            'logged_at' => $this->faker->dateTimeBetween('-30 days', 'now'),
            'latitude' => $this->faker->latitude(-6.3, -6.1), // Jakarta area
            'longitude' => $this->faker->longitude(106.7, 106.9), // Jakarta area
            'ip_address' => $this->faker->ipv4(),
            'user_agent' => $this->faker->userAgent(),
            'device_info' => [
                'browser' => $this->faker->randomElement(['Chrome', 'Firefox', 'Safari', 'Edge']),
                'os' => $this->faker->randomElement(['Windows', 'macOS', 'Linux', 'Android', 'iOS']),
                'device' => $this->faker->randomElement(['Desktop', 'Mobile', 'Tablet']),
            ],
            'location_data' => [
                'accuracy' => $this->faker->numberBetween(1, 100),
                'altitude' => $this->faker->optional()->numberBetween(0, 1000),
                'speed' => $this->faker->optional()->randomFloat(2, 0, 50),
            ],
            'face_verified' => $this->faker->boolean(80),
            'face_confidence' => $this->faker->optional(0.8)->randomFloat(2, 0.5, 1.0),
        ];
    }

    /**
     * Indicate that the log is for clock in.
     */
    public function clockIn(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'clock_in',
        ]);
    }

    /**
     * Indicate that the log is for clock out.
     */
    public function clockOut(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'clock_out',
        ]);
    }

    /**
     * Indicate that face verification failed.
     */
    public function faceNotVerified(): static
    {
        return $this->state(fn (array $attributes) => [
            'face_verified' => false,
            'face_confidence' => $this->faker->randomFloat(2, 0.1, 0.49),
        ]);
    }
}