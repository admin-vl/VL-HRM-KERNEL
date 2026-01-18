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
        Schema::create('dashboard_widgets', function (Blueprint $table) {
            $table->id();

            // Owner (User specific dashboard)
            $table->foreignId('user_id')
                ->constrained()
                ->cascadeOnDelete();

            // Widget configuration
            $table->string('title');
            $table->string('query_key'); // ex: totalEmployees, pendingLeaves
            $table->string('icon')->nullable(); // optional future use
            $table->string('color')->nullable(); // optional future use
            $table->integer('order')->default(0);

            // Control
            $table->boolean('is_active')->default(true);

            $table->timestamps();

            // Performance
            $table->index(['user_id', 'order']);
            $table->unique(['user_id', 'query_key']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('dashboard_widgets');
    }
};
