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
        Schema::table('users', function (Blueprint $table) {
            $table->enum('role', ['employee', 'admin'])->default('employee');
            $table->string('employee_id')->nullable()->unique();
            $table->string('department')->nullable();
            $table->string('position')->nullable();
            $table->json('facial_data')->nullable()->comment('Encoded facial recognition data');
            $table->boolean('is_active')->default(true);
            
            $table->index('role');
            $table->index('employee_id');
            $table->index(['role', 'is_active']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['role', 'is_active']);
            $table->dropIndex(['employee_id']);
            $table->dropIndex(['role']);
            $table->dropColumn(['role', 'employee_id', 'department', 'position', 'facial_data', 'is_active']);
        });
    }
};