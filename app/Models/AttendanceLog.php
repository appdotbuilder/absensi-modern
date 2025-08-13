<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * App\Models\AttendanceLog
 *
 * @property int $id
 * @property int $attendance_id
 * @property string $type
 * @property \Illuminate\Support\Carbon $logged_at
 * @property float $latitude
 * @property float $longitude
 * @property string $ip_address
 * @property string $user_agent
 * @property array|null $device_info
 * @property array|null $location_data
 * @property bool $face_verified
 * @property float|null $face_confidence
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * 
 * @property-read \App\Models\Attendance $attendance
 * 
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceLog newModelQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceLog newQuery()
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceLog query()
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceLog whereAttendanceId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceLog whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceLog whereDeviceInfo($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceLog whereFaceConfidence($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceLog whereFaceVerified($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceLog whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceLog whereIpAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceLog whereLatitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceLog whereLocationData($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceLog whereLoggedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceLog whereLongitude($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceLog whereType($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceLog whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|AttendanceLog whereUserAgent($value)
 * @method static \Database\Factories\AttendanceLogFactory factory($count = null, $state = [])
 * 
 * @mixin \Eloquent
 */
class AttendanceLog extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'attendance_id',
        'type',
        'logged_at',
        'latitude',
        'longitude',
        'ip_address',
        'user_agent',
        'device_info',
        'location_data',
        'face_verified',
        'face_confidence',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'logged_at' => 'datetime',
        'latitude' => 'float',
        'longitude' => 'float',
        'device_info' => 'array',
        'location_data' => 'array',
        'face_verified' => 'boolean',
        'face_confidence' => 'float',
    ];

    /**
     * Get the attendance that owns the log.
     */
    public function attendance(): BelongsTo
    {
        return $this->belongsTo(Attendance::class);
    }
}