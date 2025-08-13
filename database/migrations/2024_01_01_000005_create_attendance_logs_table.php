<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attendance_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('attendance_id')->constrained()->onDelete('cascade');
            $table->enum('type', ['clock_in', 'clock_out']);
            $table->timestamp('logged_at');
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->string('ip_address');
            $table->text('user_agent');
            $table->json('device_info')->nullable();
            $table->json('location_data')->nullable()->comment('Additional location verification data');
            $table->boolean('face_verified')->default(false);
            $table->float('face_confidence')->nullable()->comment('Face recognition confidence score');
            $table->timestamps();
            
            $table->index(['attendance_id', 'type']);
            $table->index('logged_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendance_logs');
    }
};