# Tech Stack

## Build System & Tooling

- **Build Tool**: Vite 7.0.4
- **Package Manager**: npm
- **Module System**: ES Modules

## Core Technologies

- **Framework**: React 19.1.0
- **Language**: JavaScript (JSX)
- **Routing**: React Router DOM 7.7.1
- **Styling**: styled-components 6.1.19
- **HTTP Client**: Axios 1.11.0

## Key Libraries

### UI & Components
- reactstrap 9.2.3 - Bootstrap components
- rsuite 5.83.3 - UI component library
- react-icons 5.5.0 - Icon library
- react-select 5.10.2 - Select components
- react-switch 7.1.0 - Toggle switches
- react-toastify 11.0.5 - Toast notifications

### Forms & Validation
- formik 2.4.6 - Form management
- yup 1.7.0 - Schema validation

### Date & Time
- react-datepicker 8.7.0
- react-time-picker 8.0.2
- react-clock 6.0.0

### Calendar & Scheduling
- @fullcalendar/react 6.1.20
- @fullcalendar/daygrid 6.1.20
- @fullcalendar/interaction 6.1.20

### Charts & Visualization
- recharts 3.1.2

### Utilities
- lodash 4.17.21
- react-speech-recognition 4.0.1

## Development Tools

- ESLint 9.30.1 with React plugins
- @vitejs/plugin-react 4.6.0
- babel-plugin-styled-components 2.1.4

## Common Commands

```bash
# Development server (runs on all network interfaces)
npm run dev

# Production build
npm run build

# Lint code
npm run lint

# Preview production build (port 4173, accessible on network)
npm run preview
```

## Environment Configuration

- Uses `.env` file for environment variables
- Base URL configured via `VITE_BASE_URL` and `VITE_BASE_URL_LOCAL`
- Vite server configured to run on all network interfaces (host: true)

## API Configuration

- Base URL: Configured via environment variables
- Authentication: JWT token-based with automatic refresh
- Axios interceptors handle token refresh and 401 errors
- All API requests include Bearer token in Authorization header
