# Express TS 4th Workshop

## 📝 About the Project

This repository is for the **Express TS 6th Workshop**. It aims to establish a proper backend development environment using Express, TypeScript, PostgreSQL, TypeORM . The setup includes essential tools for code quality, and formatting, providing a strong foundation for building reliable and scalable applications.

## ✨ Features

- **ESLint** - Linter for identifying and fixing code errors and standardizing code style
- **Prettier** - Code formatter for consistent styling
- **Husky** - Git hooks for pre-commit checks, ensuring code quality before committing
- **Morgan** - HTTP request logger that provides insights into request details for easier debugging and monitoring
- **TypeORM** - ORM for database interactions, providing a clean and scalable approach to managing database operations

## ⚙️ Prerequisites

- **Node.js**: Version 20 or higher

Ensure you have Node.js installed on your machine. You can download it [here](https://nodejs.org/).

## 🔧 Installation

To set up the project locally, follow these steps:

1. **Clone the repository**

    ```bash
    git clone https://github.com/oat431/sixth-ts-ex-class-template
    ```

2. **Navigate to the project directory**

    ```bash
    cd sixth-ts-ex-class-template
    ```

3. **Install dependencies**

    ```bash
    npm install
    ```

> **Note**: Ensure you have Node.js version 20 or above for compatibility with this project.

## 🚀 Usage

1. Copy .env.example and rename it to .env.dev
2. Fill up the .env.dev with your database credentials
3. Run Script to create database

    ```bash
    npm run db-dev:create 
    ```

4. Run Script to server

    ```bash
    npm run dev
    ```

This setup ensures a well-documented and clean codebase, promoting best practices for backend development in TypeScript.

## 📄 License

no license (yet)
