# NodeAuth

NodeAuth is an authentication system built using **JWT (JSON Web Tokens)** for secure access and refresh token management. The project also includes user verification through email to ensure secure account activation.

## Features

- **Access Tokens:** For short-lived session management.
- **Refresh Tokens:** For long-lived user sessions and token renewal.
- **Email Verification:** To validate user registration.

## Technologies Used

- [Node.js](https://nodejs.org/) - JavaScript runtime for building scalable server-side applications.
- [Express](https://expressjs.com/) - Web framework for Node.js.
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) - Implementation of JSON Web Tokens for authentication.
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript for better development experience.

---

## Setup the Project

### Prerequisites

Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or above)
- [npm](https://www.npmjs.com/) (Node package manager)

### Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/adityapatel-00/NodeAuth.git
   cd NodeAuth
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables:

   - Copy `.env.example` to `.env`:

     ```bash
     cp .env.example .env
     ```

   - Update `.env` with your configurations (e.g., secret keys, email service credentials).

4. Build the project:

   ```bash
   npm run build
   ```

5. Start the server:

   ```bash
   npm start
   ```

---

## Folder Structure

```
NodeAuth/
│
├── src/                 # Main source code
│   ├── middleware/      # Middleware functions
│   ├── models/          # Database models
│   ├── routes/          # Application routes
│   └── services/        
│
├── .env.example         # Environment variable template
├── package.json         # Project metadata and dependencies
├── tsconfig.json        # TypeScript configuration
└── README.md            # Project documentation
```

---

## Scripts

Here are the npm scripts available in this project:

- `npm run build` - Compiles TypeScript to JavaScript.
- `npm start` - Starts the compiled app.

---

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to open a PR or file an issue.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## Contact

For any inquiries or support, please reach out to:

- **Author Name**: Aditya Surishetti
- **Email**: adityasurishetti@gmail.com
- **GitHub**: [adityapatel-00](https://github.com/adityapatel-00)

Let me know if you need any further edits!
