# Mind Vault - MERN Stack Note-Taking App

Mind Vault is a feature-rich, cloud-based note-taking app built using the MERN (MongoDB, Express.js, React.js, Node.js) stack. It allows users to create, update, and manage their notes efficiently.

## Live Demo

You can access the live demo of the app [here](https://mind-vault.netlify.app).

## Features

- **User Authentication**: Secure authentication system using JWT for login and registration.
- **Create, Edit, and Delete Notes**: Simple and intuitive interface for managing your notes.
- **Tagging and Categorization**: Organize notes with tags for easy access.
- **Search Functionality**: Quickly search through notes by title or content.
- **Responsive Design**: Works on all screen sizes.
- **Persistent Storage**: All notes are saved in the cloud using MongoDB, ensuring you never lose important information.
  
## Tech Stack

- **MongoDB**: NoSQL database for storing user data and notes.
- **Express.js**: Backend framework for building REST APIs.
- **React.js**: Frontend library for building user interfaces.
- **Node.js**: Server-side runtime for handling requests and managing backend operations.
- **Netlify**: Hosting platform for deploying the app.

## Installation

To run this project locally, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/mind-vault.git
    ```
2. Navigate to the project directory:
    ```bash
    cd mind-vault
    ```
3. Install dependencies for both frontend and backend:
    ```bash
    cd client
    npm install
    cd ../server
    npm install
    ```
4. Set up environment variables:
    - Create a `.env` file in the `server` folder with the following keys:
        ```bash
        MONGO_URI=<your-mongodb-connection-string>
        JWT_SECRET=<your-jwt-secret>
        PORT=5000
        ```
5. Start the development servers:
    - Frontend:
        ```bash
        cd client
        npm start
        ```
    - Backend:
        ```bash
        cd server
        npm start
        ```
6. Open your browser and go to `http://localhost:8000` to view the app.

## Contributing

If you'd like to contribute to this project, feel free to open a pull request or raise an issue on GitHub.
