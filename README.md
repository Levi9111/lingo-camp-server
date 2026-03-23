# Lingo Camp Server API Documentation

This server provides the backend for the Lingo Camp application, handling user management, class scheduling, and payments.

## Base URL
`http://localhost:3000/api`

## Authentication
Most routes require a JSON Web Token (JWT) in the `Authorization` header:
`Authorization: Bearer <token>`

---

## API Endpoints

### 1. Auth (JWT)
- **POST `/jwt`**
  - **Description**: Issues a JWT token.
  - **Body**:
    ```json
    { "email": "user@example.com", "name": "John Doe" }
    ```
  - **Response**: `{ "token": "..." }`

### 2. Users
- **GET `/users`**
  - **Description**: Returns all users.
- **POST `/users`**
  - **Description**: Creates a new user if they don't exist.
  - **Body**:
    ```json
    { "email": "user@example.com", "name": "John Doe", "photoURL": "..." }
    ```
- **PATCH `/users/admin/:id`**
  - **Description**: Promotes a user to Admin.
- **PATCH `/users/instructor/:id`**
  - **Description**: Promotes a user to Instructor.

### 3. Classes
- **GET `/classes`**
  - **Description**: Returns all classes (sorted by newest).
- **POST `/classes`** (Auth Required)
  - **Description**: Creates a new class.
  - **Body**:
    ```json
    { "name": "Spanish 101", "email": "instructor@example.com", "image": "...", "price": 50, "availableSeats": 20 }
    ```
- **GET `/classes/myclasses`** (Auth Required)
  - **Description**: Returns classes created by the logged-in instructor.
- **PATCH `/classes/:id/status`** (Auth Required)
  - **Description**: Updates class status (`pending`, `approved`, `denied`).
  - **Body**: `{ "status": "approved" }`
- **DELETE `/classes/:id`** (Auth Required)
  - **Description**: Deletes a class.

### 4. Courses (Cart Items)
- **GET `/courses?email=...`**
  - **Description**: Returns courses in a student's cart.
- **POST `/courses`** (Auth Required)
  - **Description**: Adds a class to the student's cart.
  - **Body**:
    ```json
    { "email": "student@example.com", "classId": "...", "name": "...", "price": 50, "availableSeats": 20 }
    ```
- **DELETE `/courses/:id`** (Auth Required)
  - **Description**: Removes a course from the cart.
- **PATCH `/courses/:id/decrease-seats`**
  - **Description**: Atomically decreases available seats.

### 5. Instructors
- **GET `/instructors`**
  - **Description**: Returns all instructors sorted by student count.

### 6. Payments
- **POST `/create-payment-intent`** (Auth Required)
  - **Description**: Creates a Stripe Payment Intent.
  - **Body**: `{ "price": 50 }`
- **POST `/payment`** (Auth Required)
  - **Description**: Saves payment record, removes from cart, and updates class seats.
  - **Body**:
    ```json
    { "email": "student@example.com", "transactionId": "...", "courseIdentity": "...", "price": 50 }
    ```
- **GET `/history`** (Auth Required)
  - **Description**: Returns payment history (Admins see all, students see their own).
- **DELETE `/history`** (Auth Required)
  - **Description**: Clears all payment history (Admin only).
