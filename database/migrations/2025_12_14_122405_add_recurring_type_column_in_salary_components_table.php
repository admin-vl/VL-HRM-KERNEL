<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('salary_components', function (Blueprint $table) {
            $table->enum('recurring_type', ['recurring', 'non-recurring'])->after('description')->default('non-recurring');
            DB::statement("
                ALTER TABLE salary_components
                MODIFY type
                ENUM('earning','deduction','reimbursement')
            ");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('salary_components', function (Blueprint $table) {
            $table->removeColumn('recurring_type');
            DB::statement("
                ALTER TABLE salary_components
                MODIFY type
                ENUM('earning','deduction')
            ");
        });
    }
};
