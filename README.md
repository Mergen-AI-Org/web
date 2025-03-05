# Dietitian Dashboard

A modern web application for dietitians to manage patients, appointments, and diet plans.

## Features

- **Patient Management**: Add, view, and manage patient profiles
- **Appointment Scheduling**: Schedule and manage appointments
- **Modern Authentication**: Secure login and user management
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Environment Setup

1. Clone the repository
2. Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

### Database Setup

1. Create a new Supabase project
2. Create the following tables in your Supabase database:

#### Patients Table

```sql
CREATE TABLE patients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  age INTEGER,
  gender TEXT,
  dateOfBirth DATE,
  height TEXT,
  weight TEXT,
  allergies TEXT,
  medicalConditions TEXT,
  lastVisit DATE,
  nextAppointment DATE,
  status TEXT NOT NULL,
  dietPlan TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Appointments Table

```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  patientId UUID REFERENCES patients(id),
  patientName TEXT NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  duration INTEGER NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

You can also run the complete schema with indexes and triggers by executing the SQL in `scripts/schema.sql`.

### Seeding the Database

To seed the database with sample data, you can use one of the following methods:

#### JavaScript Seeding (Recommended)

```bash
# Run the JavaScript seeding script
npm run seed
```

## Development

### Project Structure

- `app/`: Next.js app directory
  - `dashboard/`: Dashboard pages
    - `patients/`: Patient management pages
    - `appointments/`: Appointment management pages
  - `auth/`: Authentication pages
- `components/`: Reusable React components
- `lib/`: Utility functions and API clients
  - `api.ts`: API functions for data fetching
  - `supabase.ts`: Supabase client and typed API functions
  - `types.ts`: TypeScript interfaces for the application
- `public/`: Static assets
- `scripts/`: Utility scripts
  - `seed.js`: JavaScript database seeding script
  - `seed-db.ts`: TypeScript database seeding script
  - `schema.sql`: Complete database schema with indexes and triggers

### Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the application for production
- `npm run start`: Start the production server
- `npm run lint`: Run ESLint
- `npm run seed`: Seed the database with sample data (JavaScript)

## License

This project is licensed under the MIT License - see the LICENSE file for details.
