# Setup & Configuration Guide: Pair Drop ⚙️

This guide provides step-by-step instructions for developers to set up the Pair Drop development environment and deploy the application.

## 🛠️ Prerequisites

- **Node.js**: v18 or higher.
- **PostgreSQL**: A running instance (local or hosted).
- **npm**: v9 or higher.

## 📥 Getting Started

1.  **Clone the Repository**:
    ```bash
    git clone <repository-url>
    cd Pair-Drop
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Configuration**:
    Create a `.env` file in the root directory and add your PostgreSQL connection string:
    ```env
    DATABASE_URL=postgresql://user:password@localhost:5432/pairdrop
    NODE_ENV=development
    ```

4.  **Database Migration**:
    Push the schema to your database using Drizzle Kit:
    ```bash
    npm run db:push
    ```

5.  **Run in Development**:
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:5173`.

## 🏗️ Building for Production

To create a production-ready bundle:

1.  **Build**:
    ```bash
    npm run build
    ```
    This generates a `dist` folder containing the compiled frontend and backend.

2.  **Start Production Server**:
    ```bash
    npm start
    ```

## 📁 Project Structure

-   `/client`: React frontend source code.
-   `/server`: Express backend and database logic.
-   `/shared`: Shared Zod schemas and API contracts.

---

[Back to README](file:///m:/40.%20Go%20Lang%20Practice/Pair-Drop/readme.md)
