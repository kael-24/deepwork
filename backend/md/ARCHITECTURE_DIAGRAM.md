# Backend Architecture Diagram

## Request/Response Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLIENT (Frontend)                             │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
                    HTTP Request (JSON + Cookie)
                                  │
┌─────────────────────────────────────────────────────────────────┐
│                        Express Server                            │
├─────────────────────────────────────────────────────────────────┤
│  server.js (Main Entry Point)                                    │
│  ├─ CORS Middleware                                              │
│  ├─ express.json() Parser                                        │
│  ├─ cookieParser() Middleware                                    │
│  ├─ Routes ────────────────┐                                    │
│  └─ Error Handler ◄───────┐└─►                                  │
└────────────────────────────┼──────────────────────────────────┬─┘
                             │                                  │
                   Routes Register Paths                    Error Handler
                             │                                  │
┌─────────────────────────────▼──────────────────────────────┐ │
│                      ROUTES (routes/)                      │ │
├────────────────────────────────────────────────────────────┤ │
│ POST   /api/auth/login         ────► userLogin()           │ │
│ POST   /api/auth/signup        ────► userSignup()          │ │
│ POST   /api/auth/logout        ────► userLogout()          │ │
│ GET    /api/auth/check         ────► checkAuth()           │ │
│ POST   /api/auth/forget-pwd    ────► forgetPassword()      │ │
│ POST   /api/auth/reset-pwd     ────► resetPassword()       │ │
│ POST   /api/auth/google        ────► googleAuth()          │ │
│                                                             │ │
│ GET    /api/workouts           ────► getWorkouts()         │ │
│ GET    /api/workouts/:id       ────► getWorkout()          │ │
│ POST   /api/workouts           ────► createWorkout()       │ │
│ PUT    /api/workouts/:id       ────► editWorkout()         │ │
│ DELETE /api/workouts/:id       ────► deleteWorkout()       │ │
└─────────────────────────────┬──────────────────────────────┘ │
                              │                                │
                    Routes call Controllers ◄───┼──────────────┘
                              │
┌─────────────────────────────▼──────────────────────────────┐
│                  CONTROLLERS (controllers/)                 │
├────────────────────────────────────────────────────────────┤
│ userAuthController.js                                       │
│  ├─ userLogin()                                            │
│  ├─ userSignup()                                           │
│  ├─ userLogout()                                           │
│  ├─ checkAuth()                                            │
│  ├─ forgetPassword()                                       │
│  ├─ resetPassword()                                        │
│  └─ googleAuth()                                           │
│                                                            │
│ userEditController.js                                      │
│  └─ userEdit()                                             │
│                                                            │
│ workoutsController.js                                      │
│  ├─ getWorkouts()                                          │
│  ├─ getWorkout()                                           │
│  ├─ createWorkout()                                        │
│  ├─ editWorkout()                                          │
│  └─ deleteWorkout()                                        │
│                                                            │
│ Role: Validate input, call services, format responses      │
└─────────────────────────────┬──────────────────────────────┘
                              │
                    Controllers call Services
                              │
┌─────────────────────────────▼──────────────────────────────┐
│                    SERVICES (services/)                     │
├────────────────────────────────────────────────────────────┤
│ authService.js           │ userService.js   │ workoutService
│ ├─ createToken()         │ ├─ getUserById() │ ├─ getAllWorkouts()
│ ├─ login()              │ ├─ updateUserProfile()
│ └─ signup()             │                  │ ├─ getWorkoutById()
│                         │                  │ ├─ createNewWorkout()
│ Role: Pure business     │ Role: User ops   │ ├─ updateWorkout()
│ logic, no HTTP          │                  │ └─ deleteWorkout()
│                         │ Role: Workout ops
└─────────────────────────┬──────────────────────────────────┘
                          │
              Services call Models & Utilities
                          │
         ┌────────────────┼────────────────┐
         │                │                │
         ▼                ▼                ▼
    ┌────────────┐  ┌──────────────┐  ┌──────────────┐
    │   MODELS   │  │  UTILITIES   │  │  CONSTANTS   │
    │ (models/)  │  │   (utils/)   │  │(constants/)  │
    ├────────────┤  ├──────────────┤  ├──────────────┤
    │ userModel  │  │ Input        │  │ httpStatus   │
    │  ├─ userLogin    Validator   │  │  ├─ 200 OK
    │  ├─ userSignup   │ authHelpers│  │  ├─ 201 Created
    │  └─ userEdit │  │  sendResetEm│  │  ├─ 400 BadRequest
    │              │  │ ail         │  │  ├─ 401 Unauthorized
    │ workoutModel │  │             │  │  ├─ 404 NotFound
    │  ├─ getWorkouts  │             │  │  └─ 500 ServerError
    │  ├─ getWorkout   │             │  │
    │  ├─ createWorkout │            │  │ messages
    │  ├─ updateWorkout │            │  │  ├─ ERROR_MESSAGES
    │  └─ deleteWorkout │            │  │  └─ SUCCESS_MESSAGES
    │              │  │             │  │
    │ Role: Schema │  │ Role:       │  │ Role: Centralized
    │ & DB queries │  │ Helper      │  │ constants & messages
    └────────────┘  │ functions    │  └──────────────┘
                    └──────────────┘
                          │
         ┌────────────────┴────────────────┐
         │                                 │
         ▼                                 ▼
    ┌──────────────┐            ┌──────────────────┐
    │   MongoDB    │            │  Firebase Admin  │
    │              │            │  (Authentication)│
    │ • Users      │            │                  │
    │ • Workouts   │            │ • Verify ID Token
    └──────────────┘            └──────────────────┘
         ▲                            ▲
         └────────────────┬───────────┘
                          │
                 External Data Services
```

---

## Component Relationships

```
                         ┌─────────────┐
                         │  MIDDLEWARE │
                         ├─────────────┤
                         │ requireAuth  │ ◄─ Checks JWT from cookie
                         │ errorHandler │ ◄─ Catches all errors
                         └─────────────┘

                    request ─────►┌───────────┐
                                  │CONTROLLER │
                                  └─────┬─────┘
                                        │
                                  call service
                                        │
                                    ┌───▼────────┐
                                    │  SERVICE   │
                                    └─────┬──────┘
                                          │
                        ┌─────────────────┼─────────────────┐
                   call model        use utility        use constant
                        │                  │                   │
                    ┌───▼────┐    ┌───────▼──────┐    ┌─────▼──────┐
                    │ MODEL  │    │   UTILITY    │    │  CONSTANT  │
                    │        │    │              │    │            │
                    │ Schema │    │ Validator    │    │ httpStatus │
                    │ Queries│    │ formatResp() │    │ messages   │
                    └────────┘    │ setCookie()  │    └────────────┘
                        │         └──────────────┘
                      ┌─▼───────────────┐
                      │ MongoDB/Firebase│
                      └──────────────────┘
```

---

## Data Flow: User Login

```
1. Client sends POST /api/auth/login with { email, password, rememberMe }
                                    │
                                    ▼
2. [Route Handler] ──────► routes/userAuthRoutes.js
   Matches: POST /login
                                    │
                                    ▼
3. [Controller] ──────► controllers/userAuthController.js
   - Validate email format
   - Validate password presence
   - Validate rememberMe is boolean
   - Call login() service
                                    │
                                    ▼
4. [Service] ──────► services/authService.js
   - Normalize email to lowercase
   - Call User.userLoginModel()
   - Create JWT token
   - Return { validatedUser, token }
                                    │
                                    ▼
5. [Model] ──────► models/userModel.js
   - Query database for user
   - Compare password with bcrypt
   - Throw error if invalid
   - Return user object
                                    │
                                    ▼
6. [Back to Service]
   - Got user from model
   - Create token with JWT
                                    │
                                    ▼
7. [Back to Controller]
   - Got result from service
   - Set HTTP-only cookie with token
   - Format user response (remove sensitive data)
                                    │
                                    ▼
8. Response: 200 OK with { name, email, provider, isAuthenticated }
                        + JWT cookie (HTTP-only)
```

---

## Error Handling Flow

```
Error thrown anywhere in request:
        │
        ▼
   try/catch or throw new Error()
        │
        ▼
   Bubbles up to Express
        │
        ▼
   [errorHandler Middleware] ◄─ Catches all errors
        │
        ├─ Log error
        ├─ Get error status (default 500)
        ├─ Get error message (or generic)
        ├─ In dev: include stack trace
        │
        ▼
   Response: { error: "message", stack?: "..." }
```

---

## Middleware Execution Order

```
Request ──┐
          ├──► CORS Middleware ──► Check if origin allowed
          ├──► express.json() ──► Parse JSON body
          ├──► cookieParser() ──► Parse cookies
          ├──► Route Handlers ──► Execute controller
          │
          └──► Error Handler ◄── Catches any errors thrown
```

---

## Key Design Patterns

### 1. **Layered Architecture**
```
HTTP Request
    ↓
[Controllers] ─── HTTP handling, validation
    ↓
[Services] ─── Business logic, transformations
    ↓
[Models] ─── Data persistence, queries
    ↓
Database
```

### 2. **Service Locator Pattern**
```
Import needed services:
  import { login, signup } from '../services/authService.js';
  import { updateUserProfile } from '../services/userService.js';
```

### 3. **Repository Pattern**
```
Models act as repositories:
  await User.userLoginModel(email, password);
  await Workout.createWorkoutModel(userId, name, exercises);
```

### 4. **Middleware Pattern**
```
Pre-process requests:
  app.use(cors());
  app.use(express.json());
  app.use(errorHandler);
```

---

## Performance Considerations

✓ **Efficient Layering**: Each layer does one job
✓ **Service Reuse**: Services used by multiple controllers  
✓ **Centralized Error Handling**: One place to optimize
✓ **Constants Caching**: Messages/codes never change
✓ **HTTP-only Cookies**: No JavaScript access to tokens
✓ **Password Hashing**: Bcrypt with salt rounds

---

This architecture is:
- **Scalable**: Easy to add features
- **Maintainable**: Clear structure, easy to find code
- **Testable**: Each layer can be tested independently
- **Secure**: Centralized error handling, config management
- **Professional**: Follows Node.js/Express best practices
