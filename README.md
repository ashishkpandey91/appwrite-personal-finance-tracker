# Personal Finance Tracker

A modern web application for tracking personal finances, built with React, TypeScript, and Appwrite.

## Features

- **Transaction Management**: Track income and expenses with detailed categorization
- **Budget Planning**: Set and monitor monthly budgets by category
- **Analytics Dashboard**: Visualize spending patterns with interactive charts
- **Currency Converter**: Built-in tool for currency conversions
- **PWA Support**: Install as a mobile app for offline access
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **State Management**: Redux Toolkit
- **Backend**: Appwrite (BaaS)
- **Charts**: Recharts
- **UI Components**: Radix UI, Shadcn/ui
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Appwrite account and project

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/appwrite-personal-finance-tracker.git
cd appwrite-personal-finance-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Configure Appwrite:
   - Create a `.env` file in the root directory
   - Add your Appwrite credentials:
```env
VITE_APPWRITE_ENDPOINT=your_appwrite_endpoint
VITE_APPWRITE_PROJECT_ID=your_project_id
VITE_APPWRITE_DATABASE_ID=your_database_id
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:5173](http://localhost:5173) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking

## Project Structure

```
src/
├── components/       # Reusable UI components
├── features/        # Redux slices and logic
├── pages/           # Page components
├── services/        # API services (Appwrite)
├── store/           # Redux store configuration
├── types/           # TypeScript type definitions
└── lib/             # Utility functions
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
