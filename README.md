
# Monitize.club - Content Monetization Platform

## Project Overview

Monitize.club is a platform where creators can monetize their content by selling access to various media types including text, images, videos, audio, and documents. The platform facilitates secure content hosting, payment processing, and consumption of premium content.

## Live Demo

**URL**: https://monitize.club

## Key Features

- **User Authentication**: Secure login and registration system
- **Content Creation**: Support for multiple content types (text, links, images, videos, audio, documents)
- **Content Monetization**: Pricing, purchasing, and access control for content
- **Creator Dashboard**: Analytics, earnings tracking, and content management
- **Secure Media Delivery**: Protected access to purchased content
- **Payment Processing**: Built-in transaction system with platform fee structure
- **User Profiles**: Customizable creator profiles with social links
- **Content Discovery**: Marketplace for browsing available content

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **UI Components**: shadcn/ui (Radix UI-based components)
- **Routing**: React Router DOM
- **Form Management**: React Hook Form with Zod validation
- **State Management**: React Context API and React Query
- **Backend**: Supabase (Authentication, Database, Storage, Edge Functions)
- **Data Visualization**: Recharts for analytics
- **Icons**: Lucide React

## Project Structure

### Core Components

- **Authentication**
  - User registration, login, and profile management
  - Protected routes and content access control

- **Content Management**
  - Content creation with multiple media type support
  - Content editing and scheduling
  - File upload functionality

- **Payment System**
  - Transaction processing with platform fee calculation
  - Purchase history tracking
  - Creator earnings management

- **User Interface**
  - Responsive design for all device sizes
  - Dynamic content previews
  - Glassmorphism UI elements

### Key Files and Directories

```
├── src/
│   ├── components/        # UI components
│   │   ├── auth/          # Authentication components
│   │   ├── content/       # Content-related components
│   │   ├── dashboard/     # Dashboard components
│   │   ├── navigation/    # Navigation components
│   │   ├── profile/       # User profile components
│   │   ├── search/        # Search functionality
│   │   └── ui/            # Reusable UI components
│   │
│   ├── contexts/          # React Context providers
│   │   └── NotificationContext.tsx
│   │
│   ├── hooks/             # Custom React hooks
│   │   ├── content/       # Content-related hooks
│   │   │   ├── useContentMapping.ts
│   │   │   ├── useContentTransaction.ts
│   │   │   ├── useSecureFileUrl.ts
│   │   │   └── ...
│   │   └── ...
│   │
│   ├── integrations/      # External service integrations
│   │   └── supabase/      # Supabase client and types
│   │
│   ├── lib/              # Utility libraries
│   │   ├── fileUtils.ts  # File handling utilities
│   │   └── utils.ts      # General utilities
│   │
│   ├── pages/            # Page components
│   │   ├── Dashboard.tsx
│   │   ├── ViewContent.tsx
│   │   ├── Profile.tsx
│   │   └── ...
│   │
│   ├── services/         # Business logic services
│   │   ├── PaymentDistributionService.ts
│   │   └── WithdrawalService.ts
│   │
│   ├── styles/           # CSS and styling files
│   │
│   ├── types/            # TypeScript type definitions
│   │   ├── content.ts
│   │   └── transaction.ts
│   │
│   ├── utils/            # Utility functions
│   │   └── paymentUtils.ts
│   │
│   ├── App.tsx           # Main application component
│   └── main.tsx          # Application entry point
│
├── public/               # Static assets
│
└── supabase/             # Supabase configuration
    ├── functions/        # Edge Functions
    └── migrations/       # Database migrations
```

## Core Functionality

### Content Creation Flow

1. Users create an account or log in
2. Access the content creation form
3. Select content type (text, link, image, video, audio, document)
4. Fill in content details (title, teaser, price, etc.)
5. Upload files if needed
6. Set optional scheduling and expiry dates
7. Publish or schedule the content

### Content Consumption Flow

1. Users browse available content on the marketplace
2. View content previews with teaser information
3. Purchase content (if premium) or access directly (if free)
4. Content is unlocked and accessible in the user's library
5. Secure URLs are generated for media files

### Payment Flow

1. User initiates a purchase
2. System checks if content has already been purchased
3. Transaction is recorded in the database
4. Platform fee is calculated (7% of the content price)
5. Creator earnings are calculated (93% of the content price)
6. User gets immediate access to the content
7. Creator's earnings balance is updated

### Media Security

The platform uses secure media delivery through Supabase Edge Functions:
- Media files are stored in protected buckets
- Temporary secure URLs are generated for authenticated and authorized users
- URLs expire after a short period for enhanced security

## Database Schema

### Main Tables

- **contents**: Stores content metadata and references
- **transactions**: Records payment transactions
- **profiles**: User profile information
- **withdrawal_requests**: Creator withdrawal requests
- **withdrawal_details**: Banking and payment details for withdrawals

## Setup and Installation

### Prerequisites

- Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)
- Supabase account (for backend services)

### Local Development

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Install dependencies
npm i

# Start the development server
npm run dev
```

### Deployment

The project is deployed through the Lovable platform. To deploy your own instance:

1. Open [Lovable](https://monitize.club)
2. Click on Share -> Publish
3. Follow the deployment instructions

## Custom Domain Setup

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

## Creator Earnings and Withdrawals

Creators can:
1. Track their earnings in their profile dashboard
2. Request withdrawals when they reach the minimum threshold
3. Add and verify their payment details (UPI or Bank Transfer)
4. Track withdrawal status and history

## Contributing

To contribute to the project:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For any questions or feedback, please reach out to the project maintainers through the GitHub repository.
