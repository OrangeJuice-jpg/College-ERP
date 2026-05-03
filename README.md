# Vaish College of Engineering ERP System

This is a full-stack ERP system designed for Vaish College of Engineering, Rohtak. The project is structured to provide a seamless experience for managing various aspects of the college, including student information, faculty management, financial operations, and inventory control.

## Project Structure

The project is organized into several key directories:

- **apps/**: Contains the main applications for the web and server.
  - **web/**: The frontend application built with React.
  - **server/**: The backend application built with Node.js and Express.
  
- **packages/**: Contains shared code and types used across applications.

- **infra/**: Contains infrastructure-related files, including Docker configurations.

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or pnpm
- Docker (for running the application in containers)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd vaish-erp
   ```

2. Install dependencies for the web application:
   ```
   cd apps/web
   npm install
   ```

3. Install dependencies for the server application:
   ```
   cd ../server
   npm install
   ```

4. Install dependencies for the shared package:
   ```
   cd ../shared
   npm install
   ```

### Running the Application

To run the web application:

1. Navigate to the web directory:
   ```
   cd apps/web
   ```

2. Start the development server:
   ```
   npm start
   ```

To run the server application:

1. Navigate to the server directory:
   ```
   cd apps/server
   ```

2. Start the server:
   ```
   npm start
   ```

### Docker Setup

To run the application using Docker, you can use the provided `docker-compose.yml` file.

1. Navigate to the infra directory:
   ```
   cd infra
   ```

2. Start the services:
   ```
   docker-compose up
   ```

### Features

- **Dashboard**: Overview of key metrics and information.
- **Student Management**: Add, update, and view student details.
- **Faculty Management**: Manage faculty information and assignments.
- **Finance Management**: Handle financial transactions and reporting.
- **Inventory Management**: Track and manage college inventory.

### Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

### License

This project is licensed under the MIT License. See the LICENSE file for details.