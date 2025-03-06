# Loan Management System

A modern web application for managing loans between lenders and borrowers, built with Next.js, Prisma, and Tailwind CSS.

## Project Overview

This loan management system allows users to:

- Create and manage users (lenders and borrowers)
- Create, view, edit, and track loans
- Monitor loan statuses (Pending, Active, Paid, Defaulted)
- View dashboard analytics with key metrics and recent activity

The application is built as a monorepo using Next.js App Router with React Server Components for efficient server-side rendering and client-side interactivity where needed.

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS 4, shadcn/ui
- **Backend**: Next.js API routes and Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: TBD
- **Deployment**: Vercel, NeonDB, GitHub

## Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/dmvvilela/jo-loan-management
   cd jo-loan-management
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following variables (see `.env.example` file):
   ```
   DATABASE_URL="postgresql://username:password@localhost:5432/loan_management"
   ```

4. Initialize the database:
   ```bash
   # Navigate to the web app directory
   cd apps/web
   
   # Generate Prisma client
   pnpm prisma generate
   
   # Push schema changes to the database
   pnpm prisma db push
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Adding new components

To add components to the app, run the following command at the root of the project:

```bash
pnpm dlx shadcn@latest add [component] -c apps/web
```

This will place the ui components in the `packages/ui/src/components` directory.

## Project Structure

```
├── apps/
│   └── web/                  # Main Next.js application
│       ├── app/              # App Router pages and layouts
│       │   ├── (dashboard)/  # Dashboard and protected routes
│       │   │   ├── loans/    # Loan management pages
│       │   │   └── users/    # User management pages
│       │   └── page.tsx      # Landing page
│       ├── components/       # React components
│       │   ├── layout/       # Layout components
│       │   ├── dashboard/    # Dashboard components
│       │   └── ...           # Other shared components
│       ├── lib/              # Utility functions and server actions
│       │   ├── server/       # Server-side code and data fetching
│       └── prisma/           # Prisma schema and migrations
│           ├── schema.prisma # Database schema
└── packages/
    └── ui/                   # Shared UI components (shadcn/ui)
        └── components/       # Reusable UI components
        └── utils/            # Utility functions

```

The application uses React Server Components (RSC) for most pages, with Client Components for interactive elements. This architecture eliminates the need for traditional API routes in many cases, as server components can directly access the database and perform server-side operations.

## Key Features

### Dashboard

The dashboard provides an overview of the loan system with:
- Total loan amount
- Number of users
- Total and active loans
- Recent loan activity
- Visual charts for loan distribution (mock data)

### User Management

- Create new users (lenders and borrowers)
- View existing users
- Associate users with loans

### Loan Management

- Create new loans with amount, interest rate, term, lender, and borrower
- View all created loans and track their status
- Edit loan details and update loan status

## Design Decisions

### Server Components vs. Client Components

We use React Server Components (RSC) for data-fetching and static content, while using Client Components for interactive elements. This approach:
- Reduces client-side JavaScript
- Improves initial page load performance
- Maintains interactivity where needed

### Data Fetching Strategy

We use Server Actions for data mutations and fetching, which:
- Eliminates the need for separate API routes in many cases
- Provides type safety between the client and server
- Simplifies error handling and form validation

### UI Component Library

We use shadcn/ui components for:
- Consistent design language
- Accessibility compliance
- Customizability with Tailwind CSS

## Accessibility

This application is built with accessibility in mind:
- Semantic HTML structure
- ARIA attributes for interactive elements
- Proper heading hierarchy
- Keyboard navigation support (`<Link />` component)
- Color contrast compliance
- Screen reader friendly tables and forms

## Future Enhancements

- Better and more detailed database schema
- Auth capabilities and security features
- Payment tracking and scheduling
- Document upload for loan agreements
- Email notifications for loan status changes
- Advanced reporting and analytics
- Mobile application

## Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License.
