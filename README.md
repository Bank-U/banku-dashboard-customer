# BankU Dashboard Customer

A modern Angular-based dashboard application for BankU customers to manage their financial accounts and connect with banking services.

## Features

- **User Authentication**: Secure login and registration system
- **Plaid Integration**: Connect bank accounts using Plaid's Link API
- **Dashboard**: View and manage connected bank accounts
- **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Angular CLI (v16 or higher)

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

## Development

Run the development server:
```bash
npm start
```

The application will be available at `http://localhost:4200/`.

## Building for Production

Build the application for production:
```bash
npm run build
```

The build artifacts will be stored in the `dist/banku-dashboard-customer/` directory.

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

## Authentication

The application uses JWT-based authentication with the following features:

- Login and registration forms
- Token storage in localStorage
- HTTP interceptor for adding the token to requests
- Route guards for protecting authenticated routes

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
