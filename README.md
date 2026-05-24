# CamMedCare - Healthcare Platform MVP

A professional full-stack healthcare platform built with Next.js 16, Supabase, and shadcn/ui. Connect patients with doctors for online consultations.

## Features Implemented

### Authentication & Authorization
- Secure email/password authentication with Supabase Auth
- Role-based access control (Patient vs Doctor)
- Automatic profile creation on signup
- Protected routes and server actions

### User Profiles
- Doctor profiles with specialization, license, experience, consultation fee, ratings
- Patient profiles with medical history, allergies, emergency contacts
- Editable profile pages for both user types

### Text Consultations & Messaging
- Real-time messaging between patients and doctors
- Consultation request system
- Consultation status tracking (pending, accepted, rejected, completed, cancelled)
- Prescription management from doctors

### Appointment Scheduling
- Doctor availability slots management
- Configurable working hours and slot duration
- Day-of-week based scheduling

### Medical Records Management
- Patients can store and manage medical records
- Support for prescriptions, diagnoses, lab tests, imaging, and documents
- Record types with specific fields (medication details for prescriptions, diagnosis details, etc.)
- Privacy settings for records

### Notifications System
- Real-time notifications for consultations, messages, and events
- Notification management (read/unread, delete)
- Real-time subscription to new notifications

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **UI Components**: shadcn/ui with Radix UI
- **Styling**: Tailwind CSS v4
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Real-time subscriptions
- **Form Handling**: React Hook Form

## Project Structure

```
CamMedCare/
├── app/
│   ├── actions/              # Server actions
│   │   ├── auth.ts          # Authentication actions
│   │   └── notifications.ts # Notification actions
│   ├── context/             # React contexts
│   │   └── auth-context.tsx # Auth provider and hook
│   ├── doctor/              # Doctor pages
│   │   ├── profile/         # Profile management
│   │   ├── consultations/   # Consultation management
│   │   └── availability/    # Availability slots
│   ├── patient/             # Patient pages
│   │   ├── profile/         # Medical profile
│   │   ├── doctors/         # Browse doctors
│   │   ├── consultations/   # Consultation chat
│   │   └── records/         # Medical records
│   ├── dashboard/           # Main dashboard
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── lib/
│   ├── supabase.ts          # Supabase client
│   └── types.ts             # TypeScript types
├── components/              # shadcn/ui components
└── scripts/
    └── setup-database.sql   # Database schema
```

## Database Schema

### Tables
- `users` - User accounts (patients and doctors)
- `doctor_profiles` - Doctor professional information
- `patient_profiles` - Patient medical information
- `doctor_availability` - Doctor working hours
- `consultations` - Consultation requests and status
- `messages` - Consultation messages
- `appointments` - Scheduled appointments
- `medical_records` - Patient medical documents
- `notifications` - System notifications
- `doctor_reviews` - Patient reviews of doctors

All tables have Row Level Security (RLS) policies for data protection.

## Setup Instructions

### Prerequisites
- Node.js 18+
- Supabase account
- Git

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd cammedcare
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up the database:
   - Go to your Supabase project
   - Navigate to SQL Editor
   - Copy and run the SQL from `scripts/setup-database.sql`
   - Or use the migration system in v0

4. Start the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## User Workflows

### Doctor Workflow
1. Sign up as a doctor
2. Complete profile with specialization, license, and fees
3. Set availability slots
4. Wait for consultation requests
5. Accept/reject consultations
6. Chat with patients
7. Add prescriptions when complete

### Patient Workflow
1. Sign up as a patient
2. Complete medical profile
3. Browse available doctors
4. Request consultations
5. Chat with accepted doctors
6. View medical records and prescriptions
7. View notifications

## API Routes

- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `GET /api/doctors` - List doctors
- `GET /api/consultations` - Get consultations
- `POST /api/consultations` - Create consultation
- `POST /api/messages` - Send message
- `GET /api/notifications` - Get notifications

## Real-time Features

The app uses Supabase real-time subscriptions for:
- New messages in consultations
- Consultation status updates
- New notifications

## Security Considerations

- Row Level Security (RLS) policies on all tables
- Secure password hashing with Supabase Auth
- Server-side actions for sensitive operations
- Protected routes with authentication checks
- CORS configured for Supabase

## Next Steps for Production

1. Add email notifications
2. Implement video consultations
3. Add appointment reminders
4. Implement payment system (Stripe/Orange Money)
5. Add user verification (email verification, doctor license verification)
6. Implement audit logging
7. Add rate limiting
8. Set up monitoring and analytics
9. Implement backup and disaster recovery
10. Add compliance features (HIPAA for US, etc.)

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to vercel.com and import the repository
3. Set environment variables in Vercel settings
4. Deploy

```bash
vercel
```

### Set Environment Variables in Vercel

```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
```

## Contributing

Contributions are welcome! Please follow the existing code style and add tests for new features.

## License

MIT License

## Support

For issues or questions, please contact support@cammedcare.com or open an issue in the repository.

## Development Notes

- All database queries use Supabase SDK with TypeScript
- Real-time subscriptions are automatically cleaned up
- Authentication state is managed with React Context
- Server Actions are used for sensitive operations
- The app is fully responsive and works on mobile devices
