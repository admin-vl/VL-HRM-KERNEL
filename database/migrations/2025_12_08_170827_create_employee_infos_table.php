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
        Schema::create('employee_infos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('title')->nullable();
            $table->string('father_or_husband', 50)->nullable();
            $table->string('mother_name', 50)->nullable();
            $table->string('contractor')->nullable();
            $table->string('grade', 20)->nullable();
            $table->string('cost_center')->nullable();
            $table->string('reporting_person', 50)->nullable();
            $table->string('physical_status', 30)->nullable();
            $table->string('pf_number', 30)->nullable();
            $table->string('pf_limit', 30)->nullable();
            $table->string('esi_number', 25)->nullable();
            $table->string('uan_number', 20)->nullable();
            $table->foreignId('location_id')->nullable()->constrained('locations')->onDelete('cascade');
            $table->string('esi_applicability', 20)->nullable();
            $table->string('tds_applicability')->nullable();
            $table->date('date_of_leaving')->nullable();
            $table->date('resignation_date')->nullable();
            $table->date('settlement_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_infos');
    }
};
