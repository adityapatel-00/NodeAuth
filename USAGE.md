# USAGE.md

Welcome to NodeAuth! This document will guide you through setting up, configuring, and using the NodeAuth authentication system. This system uses JWT for secure token management, email verification for user registration, and Prisma ORM to interact with your database.

## Table of Contents

1. [Setting Up NodeAuth](#setting-up-nodeauth)
2. [Environment Configuration](#environment-configuration)
3. [Initializing the Database](#initializing-the-database)
4. [API Endpoints](#api-endpoints)
5. [Token Management](#token-management)
6. [Customizing NodeAuth](#customizing-nodeauth)

---

## Setting Up NodeAuth

Follow these steps to set up NodeAuth in your own project:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/adityapatel-00/NodeAuth.git
   cd NodeAuth
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

---

## Environment Configuration

Before starting the server, you need to configure your environment variables. These variables control various settings like JWT secrets, email service configurations, and your database connection.

1. **Create an `.env` file** in the root directory of the project.

2. **Copy the contents of `.env.example`** to your `.env` file:

   ```bash
   cp .env.example .env
   ```

3. **Update the `.env` file** with your own settings:
   
   - **Server Port and Base URL**:
     - `SERVER_PORT`: Port to run the server on (default: `8000`).
     - `BASE_URL`: The base URL of your application.
   
   - **Token variables**:
     - `ACCESS_TOKEN_SECRET`: Secret key for signing the access token.
     - `REFRESH_TOKEN_SECRET`: Secret key for signing the refresh token.
     - `EMAIL_TOKEN_SECRET`: Secret key for email verification tokens.
     - `ACCESS_TOKEN_VALIDITY`: Expiration time for access tokens (e.g., `15m`).
     - `REFRESH_TOKEN_VALIDITY`: Expiration time for refresh tokens (e.g., `7d`).
   
   - **Email service variables** (Example for Gmail):
     - `HOST`: SMTP host (e.g., `smtp.gmail.com`).
     - `PORT`: SMTP port (e.g., `465` for Gmail).
     - `USER`: Your email address.
     - `PASS`: Your email password or app-specific password for Gmail.
   
   - **Database URL**:
     - `DATABASE_URL`: Your database connection string (example for PostgreSQL).

   Example `.env` values:

   ```ini
   SERVER_PORT=8000
   BASE_URL="http://localhost:8000/api/v1"

   ACCESS_TOKEN_SECRET=your-access-token-secret
   REFRESH_TOKEN_SECRET=your-refresh-token-secret
   EMAIL_TOKEN_SECRET=your-email-token-secret
   ACCESS_TOKEN_VALIDITY="15m"
   REFRESH_TOKEN_VALIDITY="7d"

   HOST="smtp.gmail.com"
   PORT=465
   USER=your-email@gmail.com
   PASS=your-email-password

   DATABASE_URL="postgresql://username:password@localhost:5432/your-database"
   ```

---

## Initializing the Database

To initialize the database, run the following steps to set up the necessary tables:

1. **Generate Prisma client**:

   This generates the Prisma client for your database.

   ```bash
   npx prisma generate
   ```

2. **Run database migrations**:

   Apply migrations to create the necessary tables (like `users`) in your database.

   ```bash
   npx prisma migrate dev
   ```

   This will create the database tables defined in your `prisma/schema.prisma` file. Ensure that your database connection string in `.env` is correctly configured.

3. **Check the database**:

   After running the migration, verify that the necessary tables (e.g., `users`) have been created in your database.

---

## API Endpoints

Once NodeAuth is set up and the server is running, you can access the following API endpoints:

### 1. **User Registration**

- **POST** `/auth/signup`

  Registers a new user by accepting the following data:
  - `firstName`: User's first name.
  - `lastName`: User's last name.
  - `email`: User's email address (used for email verification).
  - `password`: User's password.
  - `phoneNumber`: User's phone number.

  The server sends a verification email to the user's email address.

  **Request Body** (Example):

  ```json
  {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "password": "securepassword",
    "phoneNumber": "1234567890"
  }
  ```

### 2. **User Login**

- **POST** `/auth/login`

  Authenticates the user and returns an access token and refresh token. Requires:
  - `email`: User's email address.
  - `password`: User's password.

  **Request Body** (Example):

  ```json
  {
    "email": "john.doe@example.com",
    "password": "securepassword"
  }
  ```

  **Response** (Example):

  ```json
  {
    "message": "Login successful",
    "data": {
      "accessToken": "access_token_here",
      "refreshToken": "refresh_token_here"
    }
  }
  ```

### 3. **Email Verification**

- **GET** `/auth/verification/:token`

  Verifies the user's email address. The token is sent to the user’s email during registration.

  **URL Parameter**: `token` - The verification token sent to the user’s email.

### 4. **Token Refresh**

- **POST** `/auth/refresh-token`

  Refreshes the access token using the refresh token.

  **Request Body** (Example):

  ```json
  {
    "refreshToken": "refresh_token_here"
  }
  ```

### 5. **Request for New Verification Email**

- **POST** `/auth/verification`

  Sends a new email verification link to the user.

  **Request Body** (Example):

  ```json
  {
    "email": "john.doe@example.com"
  }
  ```

---

## Extra Route: User Info

You can add a protected route to fetch user information after authentication. The following route is an example of such an endpoint.

### 6. **User Info**

- **GET** `/user/info`

  Returns the authenticated user's information.

  **Response** (Example):

  ```json
  {
    "message": "Details fetched successfully",
    "data": {
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phoneNumber": "1234567890"
    }
  }
  ```

---

## Token Management

### Access Tokens

- **Short-lived token**: The access token has a short expiration time (typically 15 minutes).
- **Purpose**: It is used to authenticate the user in protected routes.

### Refresh Tokens

- **Long-lived token**: The refresh token has a long expiration time (typically days or weeks).
- **Purpose**: It allows the user to obtain a new access token without re-authenticating. Refresh tokens are stored securely and are used to keep the user logged in.

---

## Customizing NodeAuth

You can customize NodeAuth to fit your own project needs:

1. **Authentication Middleware**: The JWT authentication middleware can be found in `src/middleware/authentication.js`. You can modify this middleware to add custom logic to your authentication flow.

2. **User Model**: The user model schema is defined in `prisma/schema.prisma`. You can extend or modify the schema to include additional fields such as `roles` or `permissions`.

3. **Email Verification**: The email service logic can be customized in `src/services/emailService.js`. You can switch to a different email provider or modify the email template.

4. **Token Expiry**: The expiration time for both access and refresh tokens is set in `src/services/tokenService.js`. Adjust the expiry times according to your needs.

---

## Conclusion

NodeAuth provides a comprehensive authentication solution for your Node.js applications. By following this guide, you should be able to set up, use, and customize the authentication system according to your project’s needs.

For further inquiries or contributions, feel free to reach out.