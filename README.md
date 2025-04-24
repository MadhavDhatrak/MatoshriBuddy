# MatoshriBuddy

MatoshriBuddy is a comprehensive platform for discovering, creating, and participating in college events. Connect, engage, and make the most of your college experience.
)

## Features

- **Event Discovery**: Browse and search for events by category, date, or keywords
- **Event Creation**: Easily create and manage your own events
- **User Authentication**: Secure login and registration system
- **Event Registration**: Register for events with a single click
- **User Dashboard**: Manage your created and registered events
- **Modern UI**: Responsive and interactive user interface

## Tech Stack

### Frontend
- React
- Material UI
- React Router
- Axios
- JWT Authentication

### Backend
- Node.js
- Express
- MongoDB/Mongoose
- JWT Authentication
- Multer for file uploads
- Nodemailer for email notifications

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/MatoshriBuddy.git
cd MatoshriBuddy
```

2. Install dependencies for both frontend and backend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

3. Create a `.env` file in the backend directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/event-hoster
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=90d
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_email_password
```

4. Start the servers:

```bash
# Start backend server
cd backend
npm start

# Start frontend development server
cd ../frontend
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Register/Login**: Create an account or log in to access all features
2. **Explore Events**: Browse events on the home page
3. **Create Events**: Navigate to "Create Event" to host your own event
4. **Manage Events**: Use the dashboard to track events you've created or registered for

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Material UI](https://mui.com/) for the wonderful UI components
- [Unsplash](https://unsplash.com/) for the beautiful images
- All the open-source libraries that made this project possible

