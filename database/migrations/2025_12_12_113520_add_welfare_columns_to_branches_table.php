<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('branches', function (Blueprint $table) {

            // NEW FIELD
            $table->string('professional_tax_rates')
                ->nullable()
                ->after('zip_code');

            $table->boolean('welfare_status')
                ->default(false)
                ->after('professional_tax_rates');

            $table->enum('welfare_type', ['fix', 'percent'])
                ->nullable()
                ->default('fix')
                ->after('welfare_status');

            $table->string('welfare_fund')
                ->nullable()
                ->after('welfare_type');
        });
    }

    public function down(): void
    {
        Schema::table('branches', function (Blueprint $table) {
            $table->dropColumn([
                'professional_tax_rates',
                'welfare_status',
                'welfare_type',
                'welfare_fund',
            ]);
        });
    }
};
