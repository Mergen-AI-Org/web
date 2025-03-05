# Modern Supabase Authentication System

This project includes a modern authentication system built with Next.js and Supabase, featuring a sleek UI with light neon colors.

## Features

- 🔐 Complete authentication flow (login, signup, forgot password)
- 🎨 Modern UI with light neon color scheme
- 🛡️ Protected routes
- 🔄 Authentication state management
- 📱 Responsive design

## Setup Instructions

### 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in
2. Create a new project
3. Once your project is created, go to Project Settings > API
4. Copy your `URL` and `anon` public key

### 2. Configure Environment Variables

1. Create a `.env.local` file in the root of your project
2. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Run the Development Server

```bash
pnpm dev
```

## Authentication Flow

The authentication system includes the following pages:

- `/login` - Login page
- `/signup` - Signup page
- `/forgot-password` - Password reset request page
- `/dashboard` - Example protected page (only accessible when logged in)

## Components

### UI Components

- `Button.tsx` - Reusable button component with neon variants
- `Input.tsx` - Reusable input component with neon variants

### Auth Components

- `AuthContext.tsx` - Context provider for authentication state
- `ProtectedRoute.tsx` - HOC for protecting routes that require authentication

## Customization

### Neon Colors

The neon color palette is defined in `tailwind.config.js`. You can modify these colors to match your brand:

```js
// Neon color palette
neon: {
  pink: "#FF10F0",
  purple: "#B026FF",
  blue: "#00FFFF",
  green: "#39FF14",
  yellow: "#FFFF00",
  orange: "#FF9933",
},
```

### Styling

The components use Tailwind CSS for styling. You can customize the appearance by modifying the classes in the component files.

## Supabase Auth Features

This implementation uses the following Supabase auth features:

- Email/password authentication
- Password reset
- Session management

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
