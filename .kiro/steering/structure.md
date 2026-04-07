# Project Structure

## Root Directory

```
├── public/              # Static assets (fonts, images)
├── src/                 # Source code
├── .env                 # Environment variables
├── index.html           # HTML entry point
├── vite.config.js       # Vite configuration
├── eslint.config.js     # ESLint configuration
└── package.json         # Dependencies and scripts
```

## Source Directory (`src/`)

### Core Files
- `main.jsx` - Application entry point, renders App with BrowserRouter
- `App.jsx` - Root component with route definitions
- `index.css` - Global CSS styles

### Key Directories

#### `src/pages/`
Page-level components organized by feature:
- Each major feature has its own folder (e.g., `Dashboard/`, `Employees/`, `Teams/`)
- Page components handle routing, state management, and layout
- Naming convention: PascalCase (e.g., `Dashboard.jsx`, `CreateEmployee.jsx`)

#### `src/components/`
Reusable UI components:
- Generic components (Button, InputComponent, DropdownComponent)
- Feature-specific components (Dashboard/Chart.jsx)
- Layout components (AdminLayout/)
- Naming convention: PascalCase

#### `src/helpers/`
Utility functions and API configuration:
- `api_helper.jsx` - Axios instance with interceptors for auth
- `auth_helper.jsx` - Authentication utilities
- `url_helper.jsx` - API endpoint constants
- `uploadMedia.jsx` - Media upload utilities
- `jwt-token-access/` - Token management

#### `src/theme/`
Styling configuration:
- `theme.jsx` - Color palette and typography scale
- `GlobalStyles.jsx` - Global font-face declarations and CSS reset
- `reactSelectStyles.jsx` - Custom styles for react-select

#### `src/route/`
- `index.jsx` - Route configuration (publicRoutes, privateRoutes)

#### `src/assets/`
Static assets organized by type:
- `images/` - SVG icons and images organized by feature
  - `Dashboard Images/`
  - `employee/`
  - `Login/`
  - `Team/`
  - etc.

#### `src/hooks/`
Custom React hooks (e.g., `formatINR.jsx`)

#### `src/contexts/`
React context providers (currently empty)

#### `src/data/`
Static data and mock data (currently empty)

## Routing Structure

### Public Routes
- `/` and `/login` - Login page
- `/forgot-password` - Password recovery

### Private Routes (under `/admin`)
All protected routes use `Authmiddleware` wrapper:

- `/admin/dashboard` - Dashboard with stats
- `/admin/peopleHub/employees` - Employee list
- `/admin/peopleHub/employees/create` - Create employee
- `/admin/peopleHub/employees/employeeProfile` - Employee details
- `/admin/peopleHub/teams` - Team management
- `/admin/peopleHub/branch` - Branch management
- `/admin/time-hub/leaveAttendance` - Leave management
- `/admin/time-hub/overTime-management` - Overtime tracking
- `/admin/time-hub/shiftManagement` - Shift scheduling
- `/admin/people/off-boarding` - Offboarding workflows

## File Naming Conventions

- **Components**: PascalCase (e.g., `Button.jsx`, `ReusableTable.jsx`)
- **Pages**: PascalCase (e.g., `Dashboard.jsx`, `OffBoarding.jsx`)
- **Helpers**: camelCase with .jsx extension (e.g., `api_helper.jsx`, `auth_helper.jsx`)
- **Folders**: Can use spaces or kebab-case (e.g., `Create Employee/`, `Dashboard Images/`)

## Import Patterns

- Relative imports from `src/` (e.g., `../../components/Button`)
- Theme imported as: `import theme from "../theme/theme"`
- Assets imported directly: `import Icon from "../../assets/images/..."`
- API helpers: `import { get, post } from "../helpers/api_helper"`
- URL constants: `import { LOGIN, DASHBOARD } from "../helpers/url_helper"`

## Component Architecture

### Page Components
- Handle routing and navigation
- Manage local state with useState
- Use styled-components for styling
- Import and compose reusable components
- Handle API calls via helpers

### Reusable Components
- Accept props for customization
- Use styled-components for styling
- Reference theme for colors and typography
- Export as default

### Styled Components
- Defined in same file as component
- Named with descriptive names (e.g., `Container`, `StyledButton`, `CardTitle`)
- Use theme values via props: `color: ${theme.colors.primary}`
- Support dynamic styling via props

## Authentication Flow

1. Public routes accessible without auth
2. Private routes wrapped in `Authmiddleware`
3. JWT tokens stored and managed via `auth_helper`
4. Axios interceptors handle token refresh on 401 errors
5. Failed refresh redirects to login page
