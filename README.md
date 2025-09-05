# ShiftIQ - Task & Shift Management System

A comprehensive Next.js frontend application for managing tasks, shifts, attendance, and team workflows. Built with modern React patterns, TypeScript, and Tailwind CSS.

## Features

### 🔐 Authentication & Authorization

- Role-based access control (Admin, Manager, Staff)
- JWT-based authentication with localStorage persistence
- Protected routes and permission-based UI rendering

### 📋 Task Management

- **Task Templates**: Create reusable task templates with custom fields
- **Task Assignment**: Assign tasks to individuals, teams, or roles
- **Task Completion**: Staff can complete tasks with photo/note proof
- **Task Review**: Managers can review and grade completed tasks
- **Ad-Hoc Tasks**: Create one-time tasks without templates

### ⏰ Shift Management

- **Shift Scheduling**: Create and manage employee shifts
- **Break Management**: Schedule and track breaks
- **Time Clock**: Clock in/out with location verification
- **Attendance Tracking**: Monitor attendance and punctuality

### 📊 Reporting & Analytics

- **Performance Reports**: Track task completion and attendance rates
- **Visual Charts**: Interactive charts using Recharts
- **Data Export**: Export reports to CSV format
- **Custom Filters**: Filter reports by date, location, department

### 🔄 Dispute Management

- **Dispute Submission**: Staff can dispute failed task grades
- **Dispute Resolution**: Managers can approve/reject disputes
- **Audit Trail**: Track all dispute activities

### ⚙️ System Settings

- **Attendance Rules**: Configure grace periods and thresholds
- **Notification Settings**: Email and SMS notification preferences
- **Scoring System**: Customize penalties and scoring rules
- **Data Management**: Configure data retention policies

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI primitives
- **Forms**: React Hook Form with Zod validation
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Charts**: Recharts
- **Icons**: Lucide React
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd shiftiq
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Accounts

The application includes demo accounts for testing:

- **Admin**: admin@shiftiq.com / password
- **Manager**: manager@shiftiq.com / password
- **Staff**: staff@shiftiq.com / password

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard page
│   ├── tasks/            # Task management
│   ├── templates/        # Task templates
│   ├── assign/           # Task assignment
│   ├── reviews/          # Task reviews
│   ├── shifts/           # Shift management
│   ├── clock/            # Time clock
│   ├── disputes/         # Dispute management
│   ├── reports/          # Reports & analytics
│   └── settings/         # System settings
├── components/           # Reusable components
│   ├── ui/              # Base UI components
│   ├── layout/          # Layout components
│   ├── tasks/           # Task-related components
│   ├── shifts/          # Shift-related components
│   ├── reports/         # Report components
│   └── ...
├── lib/                 # Utilities and configurations
│   ├── types.ts         # TypeScript type definitions
│   ├── store.ts         # Zustand store
│   └── utils.ts         # Utility functions
└── ...
```

## Key Features Implementation

### Role-Based Access Control

- Admin: Full system access
- Manager: Task assignment, review, shift management
- Staff: Task completion, time clock, dispute submission

### Task Workflow

1. Admin creates task templates
2. Manager assigns tasks to staff
3. Staff completes tasks with proof
4. Manager reviews and grades tasks
5. Staff can dispute failed grades

### Shift Management

1. Manager creates shifts with breaks
2. Staff clock in/out for shifts
3. System tracks attendance and punctuality
4. Reports show attendance metrics

### Data Flow

- Mock data is used for demonstration
- All API calls are placeholder implementations
- State management handles UI updates
- Forms use validation with error handling

## Customization

### Adding New Features

1. Create new page in `app/` directory
2. Add components in `components/` directory
3. Update types in `lib/types.ts`
4. Add navigation links in sidebar
5. Update role permissions in store

### Styling

- Uses Tailwind CSS for styling
- Custom color scheme defined in `tailwind.config.js`
- Responsive design for mobile and desktop
- Dark mode support available

### State Management

- Global state managed with Zustand
- Form state handled by React Hook Form
- Server state managed by TanStack Query
- Local storage for authentication persistence

## Deployment

### Build for Production

```bash
npm run build
npm start
```

### Environment Variables

Create a `.env.local` file for environment-specific configurations:

```
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.
