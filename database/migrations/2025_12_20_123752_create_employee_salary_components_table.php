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
        Schema::create('employee_salary_components', function (Blueprint $table) {
            $table->id();
            $table->foreignId('employee_salary_id')->nullable()->constrained('employee_salaries')->onDelete('cascade');
            $table->foreignId('salary_components_id')->nullable()->constrained('salary_components')->onDelete('cascade');
            $table->decimal('amount', 10, 2)->default(0);
            $table->tinyInteger('type')->default(1)->comment('1=recurring, 2=non recurring');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('employee_salary_components');
    }
};
