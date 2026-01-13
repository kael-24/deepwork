# Quick Reference Guide

## File Organization at a Glance

| Folder | Purpose | What Goes Here |
|--------|---------|-----------------|
| `config/` | Configuration | DB connection, Firebase, env validation |
| `constants/` | Magic values | HTTP codes, error messages, success messages |
| `controllers/` | Request handlers | HTTP logic, input validation calls, service orchestration |
| `middleware/` | Cross-cutting | Auth, error handling, CORS, logging |
| `models/` | Data layer | MongoDB schemas, database query methods |
| `routes/` | Endpoints | URL paths, HTTP methods, controller mapping |
| `services/` | Business logic | Pure business logic, transformations, database calls |
| `utils/` | Helpers | Input validation, email, formatting, cookies |

---

## Common Tasks

### 🆕 Add a New Endpoint

1. **Create service method** in `services/`
```javascript
export const myNewFeature = async (data) => {
    // business logic here
};
```

2. **Create controller** in `controllers/`
```javascript
export const myNewController = async (req, res) => {
    const result = await myNewFeature(req.body);
    res.status(HTTP_STATUS.OK).json(result);
};
```

3. **Add route** in `routes/`
```javascript
router.post('/my-endpoint', myNewController);
```

4. **Add messages** in `constants/messages.js`
```javascript
MY_SUCCESS: 'My operation successful',
MY_ERROR: 'My operation failed',
```

---

### 🐛 Fix a Bug

| Bug Type | Location |
|----------|----------|
| Wrong response format | `controllers/` |
| Wrong HTTP status | `constants/httpStatus.js` |
| Wrong business logic | `services/` |
| Wrong validation | `utils/` |
| Wrong error message | `constants/messages.js` |
| Wrong database query | `models/` |

---

### 🔄 Refactor Existing Feature

**Don't:**
```javascript
// ❌ Logic in controller
export const myController = async (req, res) => {
    const user = await User.findById(req.user._id);
    user.name = req.body.name;
    await user.save();
    res.json(user);
}
```

**Do:**
```javascript
// ✅ Logic in service
export const updateUserName = async (userId, name) => {
    const user = await User.findByIdAndUpdate(userId, { name });
    return user;
};

// ✅ Controller calls service
export const myController = async (req, res) => {
    const user = await updateUserName(req.user._id, req.body.name);
    res.json(formatUserResponse(user));
}
```

---

## Import Patterns

### ✅ Good Imports

```javascript
// From index files (cleaner)
import { connectDB, firebaseAdmin } from '../config';
import { HTTP_STATUS, ERROR_MESSAGES } from '../constants';
import { formatUserResponse, setAuthCookie } from '../utils';

// Direct imports still work
import { login, signup } from '../services/authService.js';
```

### ❌ Avoid

```javascript
// Don't repeat path structure
import authService from '../services/authService.js';
const { login } = authService;

// Import entire module if you only need one thing
import * as userService from '../services/userService.js';
const { updateUser } = userService;
```

---

## Controller Template

```javascript
import { myService } from '../services';
import { HTTP_STATUS, ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants';
import { formatUserResponse } from '../utils';

/**
 * Brief description of what this does
 */
export const myController = async (req, res) => {
    try {
        // 1. Extract data
        const { email } = req.body;
        const userId = req.user._id;

        // 2. Validate
        emailValidator(email);

        // 3. Call service
        const result = await myService(userId, email);

        // 4. Format & send response
        res.status(HTTP_STATUS.OK).json({
            ...formatUserResponse(result),
            message: SUCCESS_MESSAGES.MY_SUCCESS,
        });
    } catch (err) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ 
            error: err.message 
        });
    }
}
```

---

## Service Template

```javascript
import User from '../models/userModel.js';
import { ERROR_MESSAGES } from '../constants';

/**
 * Description of business logic
 */
export const myService = async (userId, email) => {
    try {
        // Validate
        if (!email) throw new Error(ERROR_MESSAGES.EMAIL_REQUIRED);

        // Call model
        const result = await User.findByIdAndUpdate(userId, { email });

        if (!result) throw new Error(ERROR_MESSAGES.USER_NOT_FOUND);

        // Return
        return result;
    } catch (err) {
        // Don't catch HTTP errors, let them bubble up
        throw err;
    }
}
```

---

## HTTP Status Code Reference

```javascript
// Success
200 OK              - Request succeeded
201 Created         - Resource created
202 Accepted        - Request accepted
204 No Content      - Success, no body

// Client Error
400 Bad Request     - Invalid input
401 Unauthorized    - Not authenticated
403 Forbidden       - Authenticated but no permission
404 Not Found       - Resource not found
409 Conflict        - Resource conflict (email exists)
422 Unprocessable   - Semantic error

// Server Error
500 Internal Error  - Server error
503 Unavailable     - Service unavailable
```

---

## Error Message Pattern

### Create messages in `constants/messages.js`

```javascript
export const ERROR_MESSAGES = {
    // Group by domain
    // Auth errors
    EMAIL_REQUIRED: 'Email is required',
    PASSWORD_REQUIRED: 'Password is required',
    
    // Validation errors
    INVALID_EMAIL: 'Invalid email format',
    
    // Not found errors
    USER_NOT_FOUND: 'User not found',
    
    // Server errors
    DATABASE_ERROR: 'Database connection error',
};

export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Logged in successfully',
    LOGOUT_SUCCESS: 'Logged out successfully',
};
```

### Use in controller/service

```javascript
if (!email) throw new Error(ERROR_MESSAGES.EMAIL_REQUIRED);

res.status(200).json({ message: SUCCESS_MESSAGES.LOGIN_SUCCESS });
```

---

## Middleware Pattern

### Create middleware in `middleware/`

```javascript
/**
 * My middleware description
 */
export const myMiddleware = (req, res, next) => {
    // Pre-process request
    if (someCondition) {
        res.status(400).json({ error: 'Invalid' });
        return;
    }
    
    // Continue to next middleware/route
    next();
};
```

### Add to server.js

```javascript
app.use(myMiddleware);          // Global middleware
app.use('/api', myMiddleware);  // Specific path
router.get('/path', myMiddleware, controller); // Specific route
```

---

## Database Query Pattern

### In Model (models/userModel.js)

```javascript
userSchema.statics.myQueryMethod = async function(param1, param2) {
    try {
        const result = await this.findOne({ email: param1 });
        if (!result) throw new Error('Not found');
        return result;
    } catch (err) {
        throw err;
    }
};
```

### Call from Service

```javascript
const result = await User.myQueryMethod(email, password);
```

---

## Testing Mind-Checklist

Before pushing changes:

- [ ] Service logic is separate from HTTP code
- [ ] Constants are used instead of magic strings
- [ ] Error messages use constants
- [ ] HTTP status codes use constants
- [ ] No business logic in controllers
- [ ] Controllers call services
- [ ] Services call models
- [ ] Error handling is in try/catch or error handler
- [ ] Response format is consistent
- [ ] Sensitive data is filtered from responses

---

## Environment Variables

Required in `.env`:

```env
# Server
PORT=5000
NODE_ENV=development
IS_DEV=true

# Database
MONGO_URI=mongodb+srv://...

# Authentication
JWT_SECRET=your_secret_key_here

# Firebase
FIREBASE_SERVICE_ACCOUNT={"type":"service_account",...}

# Frontend URL
CLIENT_URL=http://localhost:5173
```

---

## Git Commit Messages

```bash
# Add new feature
git commit -m "feat: add password reset service"

# Fix bug
git commit -m "fix: correct error message in auth controller"

# Refactor
git commit -m "refactor: extract validation logic to service"

# Update docs
git commit -m "docs: update architecture guide"

# Add tests
git commit -m "test: add authService tests"
```

---

## Common Errors & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| `Cannot find module` | Wrong import path | Check file path and spelling |
| `undefined is not a function` | Service not exported | Add to `index.js` or import correctly |
| `ValidationError` | Input validation failed | Check validators are called |
| `jwt expired` | Token old | Generate new token |
| `CORS error` | Wrong origin | Check `allowedOrigins` in server.js |
| `MongoDB connection failed` | Wrong MONGO_URI | Check `.env` and MongoDB connection string |

---

## Useful Commands

```bash
# Start development server
npm run dev

# Start production server
npm start

# View file structure
tree -L 3 -I 'node_modules'

# Check recent git changes
git log --oneline -5

# See what changed
git status
```

---

## Remember

- ✅ Controllers are thin (HTTP only)
- ✅ Services are thick (business logic)
- ✅ Models are data (schemas & queries)
- ✅ Constants are centralized
- ✅ Errors are handled consistently
- ✅ Responses are formatted consistently
- ✅ Each file has one responsibility

---

For detailed explanations, see:
- [BACKEND_STRUCTURE.md](./BACKEND_STRUCTURE.md)
- [ARCHITECTURE_DIAGRAM.md](./ARCHITECTURE_DIAGRAM.md)
