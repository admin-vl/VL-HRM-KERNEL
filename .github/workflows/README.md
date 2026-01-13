# HRM React

A SaaS application for managing HR Operations And built with Laravel and React.

## Setup Instructions

### Manual Installation

1. Clone the repository
2. Install dependencies:
   ```
   composer install
   npm install
   ```
3. Copy `.env.example` to `.env` and configure your database
4. Generate application key:
   ```
   php artisan key:generate
   ```
5. Run migrations and seeders:
   ```
   php artisan migrate
   php artisan db:seed
   ```
6. Start the development server:
   ```
   php artisan serve
   npm run dev
   ```


## Features

- Multi-store management
- Role-based access control
- Subscription plans
- User management
- Store settings
- And more...