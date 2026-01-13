# Backend Project Structure Guide

## Overview
This backend follows modern Node.js/Express best practices with a **layered architecture** that separates concerns and promotes code reusability.

## Directory Structure

```
backend/
├── config/                    # Configuration files
│   ├── db.js                 # MongoDB connection setup
│   ├── firebaseAdmin.js      # Firebase initialization
│   ├── env.js                # Environment variables validation
│   └── index.js              # Config exports
│
├── constants/                # Centralized constants
│   ├── httpStatus.js         # HTTP status codes (200, 400, 500, etc.)
│   ├── messages.js           # Success & error messages
│   └── index.js              # Constants exports
│
├── controllers/              # Request handlers & business orchestration
│   ├── userAuthController.js # Auth operations (login, signup, logout, etc.)
│   ├── userEditController.js # User profile updates
│   ├── workoutsController.js # Workout CRUD operations
│   └── index.js              # Controllers exports
│
├── middleware/               # Express middleware
│   ├── requireAuth.js        # JWT authentication middleware
│   └── errorHandler.js       # Centralized error handling
│
├── models/                   # Database schemas & model methods
│   ├── userModel.js          # User schema with static methods
│   └── workoutsModel.js      # Workouts schema with static methods
│
├── routes/                   # API route definitions
│   ├── userAuthRoutes.js     # Auth endpoints
│   ├── workoutRoutes.js      # Workout endpoints
│   └── index.js              # Routes exports
│
├── services/                 # Business logic & data operations
│   ├── authService.js        # Auth-related business logic (token creation, login, signup)
│   ├── userService.js        # User operations (profile updates, fetch user)
│   ├── workoutService.js     # Workout operations (CRUD logic)
│   └── index.js              # Services exports
│
├── utils/                    # Helper functions & utilities
│   ├── InputValidator.js     # Input validation functions
│   ├── sendResetEmail.js     # Email sending utilities
│   ├── authHelpers.js        # Cookie & response formatting helpers
│   └── index.js              # Utils exports
│
├── firebase/                 # Firebase config files (deprecated - moved to config/)
│   └── serviceAccountKey.json
│
├── .env                      # Environment variables (DO NOT COMMIT)
├── package.json              # Dependencies & scripts
├── server.js                 # Express app initialization & startup
└── README.md                 # Backend documentation

```

## Architecture Pattern

### Layer Breakdown

#### 1. **Controllers** (`controllers/`)
- Handle HTTP requests/responses
- Validate input using utils
- Call service layer for business logic
- Format and send responses
- **Role**: Orchestration & presentation

```javascript
export const userLogin = async (req, res) => {
    // 1. Validate input
    emailValidator(email);
    
    // 2. Call service
    const result = await login(email, password, rememberMe);
    
    // 3. Set cookies & send response
    setAuthCookie(res, result.token);
    res.status(HTTP_STATUS.OK).json(formatUserResponse(result.validatedUser));
}
```

#### 2. **Services** (`services/`)
- Contain pure business logic
- Handle data transformations
- Call models/database layer
- **NO** HTTP-specific code
- **Role**: Business logic & data operations

```javascript
export const login = async (email, password, rememberMe) => {
    const normalizedEmail = email.toLowerCase();
    const validatedUser = await User.userLoginModel(normalizedEmail, password);
    const token = createToken(validatedUser._id, rememberMe);
    return { validatedUser, token };
}
```

#### 3. **Models** (`models/`)
- Define MongoDB schemas
- Implement static methods for database operations
- Handle data validation at schema level
- **Role**: Data layer & persistence

```javascript
userSchema.statics.userLoginModel = async function (email, password) {
    const user = await this.findOne({ email });
    // ... validation & return
}
```

#### 4. **Routes** (`routes/`)
- Define API endpoints
- Map HTTP methods to controller functions
- Apply middleware (auth, validation)
- **Role**: Route definitions

```javascript
router.post('/login', userLogin);
router.get('/auth/check', requireAuth, checkAuth);
```

#### 5. **Middleware** (`middleware/`)
- Pre-request processing
- Authentication, validation, logging
- Error handling
- **Role**: Cross-cutting concerns

#### 6. **Utilities** (`utils/`)
- Pure helper functions
- Validation, formatting, encryption
- No side effects
- **Role**: Reusable helpers

#### 7. **Constants** (`constants/`)
- Centralized magic strings & numbers
- HTTP status codes, error messages
- Easy to maintain & translate
- **Role**: Single source of truth

#### 8. **Config** (`config/`)
- Environment setup
- Database connections
- External service initialization
- **Role**: Infrastructure setup

---

## Data Flow Example

### Request: User Login

```
POST /api/auth/login
    ↓
[CORS Middleware] - Check origin
    ↓
[Express JSON] - Parse body
    ↓
[Controller: userLogin] - Validate input, call service
    ↓
[Service: login] - Business logic, normalize data, create token
    ↓
[Model: userLoginModel] - Query database, compare password
    ↓
[Database: MongoDB] - Find user & return
    ↓
[Service] - Create JWT token, return user & token
    ↓
[Controller] - Set cookie, format response
    ↓
Response: { name, email, provider, isAuthenticated }
```

---

## Key Improvements Made

### ✅ **Separation of Concerns**
- Controllers: Request handling only
- Services: Business logic only
- Models: Data persistence only

### ✅ **Centralized Constants**
- `constants/httpStatus.js` - All HTTP codes
- `constants/messages.js` - All messages
- Easy to update, internationalize, or change

### ✅ **Reusable Utilities**
- `authHelpers.js` - Cookie & response formatting
- `InputValidator.js` - Input validation
- `sendResetEmail.js` - Email operations

### ✅ **Error Handling**
- `middleware/errorHandler.js` - Centralized error handling
- Consistent error responses
- Better error logging

### ✅ **Configuration Management**
- `config/env.js` - Environment validation
- Single source of configuration
- Easy to add new env vars

### ✅ **Index Files for Easy Imports**
- `controllers/index.js` - Export all controllers
- `services/index.js` - Export all services
- `config/index.js` - Export all configs
- Easier imports: `import { connectDB, firebaseAdmin } from './config'`

---

## Best Practices Applied

### 1. **Don't Repeat Yourself (DRY)**
- Extracted `setCookieToken()` → `setAuthCookie()` utility
- Extracted validation logic → Services layer
- Extracted messages → Constants

### 2. **Single Responsibility Principle**
- Each file has one purpose
- Controllers orchestrate, don't contain logic
- Services contain logic, don't handle HTTP

### 3. **Error Handling**
- Try-catch in services
- Centralized error middleware
- Consistent error messages

### 4. **Security**
- HTTP-only cookies for JWT
- CORS configuration
- Password hashing with bcrypt
- Environment variable protection

### 5. **Scalability**
- Easy to add new features (create new service + controller)
- Easy to modify business logic (update service)
- Easy to change external services (update config)

---

## How to Add a New Feature

### Example: Add "Change Email" Feature

1. **Create/Update Service** (`services/userService.js`)
```javascript
export const changeUserEmail = async (userId, newEmail) => {
    emailValidator(newEmail);
    const updatedUser = await User.updateOne({ _id: userId }, { email: newEmail });
    return updatedUser;
};
```

2. **Create Controller** (`controllers/userEditController.js`)
```javascript
export const changeEmail = async (req, res) => {
    const { newEmail } = req.body;
    const updatedUser = await changeUserEmail(req.user._id, newEmail);
    res.status(HTTP_STATUS.OK).json(formatUserResponse(updatedUser));
};
```

3. **Add Route** (`routes/userAuthRoutes.js`)
```javascript
router.put('/email', requireAuth, changeEmail);
```

4. **Add Messages** (`constants/messages.js`)
```javascript
EMAIL_CHANGE_SUCCESS: 'Email updated successfully',
```

---

## File Responsibilities

| File | Responsibility |
|------|-----------------|
| `server.js` | App initialization, middleware setup, error handler |
| `controllers/*` | HTTP request handling, input validation calls, service orchestration |
| `services/*` | Business logic, data transformation, model calls |
| `models/*` | Schema definition, database queries (statics) |
| `routes/*` | Endpoint definitions, controller mapping |
| `middleware/*` | Auth, logging, error handling, CORS |
| `utils/*` | Pure helper functions, no side effects |
| `constants/*` | Magic strings, HTTP codes, messages |
| `config/*` | Environment setup, external services |

---

## Environment Variables Required

```env
# Server
PORT=5000
NODE_ENV=development
IS_DEV=true

# Database
MONGO_URI=mongodb://...

# Authentication
JWT_SECRET=your_secret_key

# Firebase
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}

# Frontend
CLIENT_URL=http://localhost:5173
```

---

## Common Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# Install dependencies
npm install

# Update controllers to use new services
# 1. Create service
# 2. Update controller to import service
# 3. Replace business logic with service call
```

---

## Next Steps for Frontend Alignment

Once you align the frontend structure similarly:

1. **Folder Structure**: `src/api/`, `src/hooks/`, `src/components/`, `src/services/`
2. **API Service Layer**: Extract all API calls to `src/services/api/`
3. **State Management**: Separate Zustand stores by domain
4. **Constants**: Frontend constants matching backend messages

---

## Questions?

- **Where should I put X?** → Check the "Architecture Pattern" section
- **How do I add a new feature?** → Follow "How to Add a New Feature"
- **Where do I put validation?** → Controllers call utils, services throw errors
- **Where do I put error handling?** → Middleware error handler + try-catch in services
