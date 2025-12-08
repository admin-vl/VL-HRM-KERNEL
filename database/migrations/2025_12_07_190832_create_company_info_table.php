<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('company_info', function (Blueprint $table) {
            $table->id();

            // Foreign key to users table
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');

            // Your new company fields
            $table->string('company_name')->nullable();
            $table->text('address')->nullable();
            $table->string('tel')->nullable();
            $table->string('email')->nullable();
            $table->string('pan')->nullable();
            $table->string('tan')->nullable();
            $table->string('pf_code')->nullable();
            $table->string('esi_code')->nullable();
            $table->string('ptax_no')->nullable();
            $table->string('statutory_rates')->nullable();
            $table->string('company_logo')->nullable();

            // Signatory details
            $table->string('sign_name')->nullable();
            $table->string('sign_designation')->nullable();
            $table->string('sign_father_name')->nullable();
            $table->text('sign_address')->nullable();
            $table->string('sign_pan')->nullable();
            $table->string('sign_adhar')->nullable();
            $table->date('sign_dob')->nullable();
            $table->string('sign_email')->nullable();
            $table->string('sign_mobile')->nullable();

            // Auto employee code
            $table->string('employee_code')->nullable();

            $table->timestamps();
        });
    }
    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_info');
    }
};
