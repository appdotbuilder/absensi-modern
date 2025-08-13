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
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('date')->comment('Date of attendance');
            $table->time('clock_in')->nullable()->comment('Clock in time');
            $table->time('clock_out')->nullable()->comment('Clock out time');
            $table->decimal('clock_in_lat', 10, 8)->nullable()->comment('Clock in latitude');
            $table->decimal('clock_in_lng', 11, 8)->nullable()->comment('Clock in longitude');
            $table->decimal('clock_out_lat', 10, 8)->nullable()->comment('Clock out latitude');
            $table->decimal('clock_out_lng', 11, 8)->nullable()->comment('Clock out longitude');
            $table->string('clock_in_address')->nullable()->comment('Clock in location address');
            $table->string('clock_out_address')->nullable()->comment('Clock out location address');
            $table->text('clock_in_notes')->nullable();
            $table->text('clock_out_notes')->nullable();
            $table->enum('status', ['present', 'late', 'absent', 'half_day'])->default('present');
            $table->integer('work_duration')->nullable()->comment('Work duration in minutes');
            $table->boolean('is_verified')->default(false)->comment('Admin verification status');
            $table->timestamps();
            
            // Indexes for performance
            $table->index(['user_id', 'date']);
            $table->index('date');
            $table->index('status');
            $table->index(['date', 'status']);
            $table->unique(['user_id', 'date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};