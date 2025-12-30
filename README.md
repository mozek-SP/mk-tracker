# MK Branch Expense Tracker

Modern expense tracking system for MK branches, built with Next.js 15, Tailwind CSS, and Framer Motion.

## Features

- **Dashboard**: Real-time overview of expenses, repair costs, and asset health.
- **Branch Management**: CRUD operations for branch locations.
- **Asset Tracking**: Manage machines and devices with status tracking.
- **Expense Logging**: Record maintenance and service expenses.
- **Excel Integration**: Import/Export functionality for all data entities.
- **Responsive Design**: Mobile-friendly interface with "MK Coral" branding.
- **Secure Access**: Authentication system with protected routes.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Utils**: `xlsx` (Excel), `date-fns`, `lucide-react`

## Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Run Locally**:
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000)

3.  **Build for Production**:
    ```bash
    npm run build
    ```

## Environment Variables

Create a file named `.env.local` for local development. For Vercel deployment, add these in the Project Settings.

```env
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=mk1234
```

## Deployment on Vercel

The project is configured for zero-config deployment on Vercel.

1.  Push code to GitHub/GitLab/Bitbucket.
2.  Import project in Vercel.
3.  Add the Environment Variables.
4.  Click **Deploy**.
