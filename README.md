# BankU Dashboard Customer

A modern Angular-based dashboard application for BankU customers to manage their financial accounts and connect with banking services.

## Features

- **User Authentication**: Secure login and registration system
- **Plaid Integration**: Connect bank accounts using Plaid's Link API
- **Dashboard**: View and manage connected bank accounts
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Updates**: Live transaction and balance updates
- **Financial Analytics**: Spending patterns and budget insights
- **Secure Data Handling**: End-to-end encryption

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Angular CLI (v16 or higher)
- Docker (optional, for containerized deployment)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/banku-dashboard-customer.git
   cd banku-dashboard-customer
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   - Update the Plaid credentials in `src/environments/environment.ts` for development
   - Update the Plaid credentials in `src/environments/environment.prod.ts` for production
   - Configure API endpoints in `src/environments/environment.*.ts`

## Development

Run the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200/`.

### Development Tools

- **Angular CLI**: For project scaffolding and development
- **Angular Material**: UI component library
- **RxJS**: Reactive programming library
- **NgRx**: State management
- **Jest**: Testing framework

## Building for Production

Build the application for production:
```bash
npm run build
```

The build artifacts will be stored in the `dist/banku-dashboard-customer/` directory.

### Production Deployment

1. Build the application:
   ```bash
   npm run build:prod
   ```

2. Deploy to your hosting service:
   - AWS S3 + CloudFront
   - Azure Static Web Apps
   - Google Cloud Storage
   - Netlify
   - Vercel

## Project Structure

```
banku-dashboard-customer/
├── src/
│   ├── app/
│   │   ├── components/         # Reusable UI components
│   │   │   └── plaid-link/     # Plaid Link integration component
│   │   ├── core/               # Core functionality
│   │   │   ├── guards/         # Route guards
│   │   │   ├── interceptors/   # HTTP interceptors
│   │   │   ├── models/         # Data models
│   │   │   └── services/       # Core services
│   │   ├── features/           # Feature modules
│   │   │   ├── auth/           # Authentication feature
│   │   │   └── dashboard/      # Dashboard feature
│   │   ├── services/           # Application services
│   │   │   ├── api.service.ts  # Base API service
│   │   │   └── plaid.service.ts # Plaid API service
│   │   ├── app.component.ts    # Root component
│   │   └── app.module.ts       # Root module
│   ├── environments/           # Environment configurations
│   ├── assets/                 # Static assets
│   └── styles/                 # Global styles
├── package.json                # Project dependencies
└── README.md                   # Project documentation
```

## Plaid Integration

The application integrates with Plaid to allow users to connect their bank accounts. The integration includes:

1. Creating a Link token from the backend
2. Initializing Plaid Link in the frontend
3. Handling the public token exchange
4. Storing the access token for future API calls

### Plaid Environment Setup

1. Create a Plaid account at https://dashboard.plaid.com
2. Get your API keys (Client ID, Secret, Public Key)
3. Configure the keys in your environment files
4. Set up webhook endpoints for transaction updates

## Authentication

The application uses JWT-based authentication with the following features:

- Login and registration forms
- Token storage in localStorage
- HTTP interceptor for adding the token to requests
- Route guards for protecting authenticated routes
- Session management
- Password reset functionality

## Testing

Run tests with:
```bash
npm test
```

### Test Coverage

Generate test coverage report:
```bash
npm run test:coverage
```

## Performance Optimization

- Lazy loading of modules
- Ahead-of-Time (AOT) compilation
- Tree shaking
- Code splitting
- Service worker for offline capabilities
- Image optimization
- Caching strategies

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Angular](https://angular.io/)
- [Plaid](https://plaid.com/)
- [Angular Material](https://material.angular.io/)
- [RxJS](https://rxjs.dev/)
- [NgRx](https://ngrx.io/)
