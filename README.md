# WriteNow

A full-stack social media and real-time chat application built with modern web technologies. WriteNow combines social posting features with messaging, allowing users to share posts, leave comments, and communicate in real time.

## 🚀 Features

### Authentication & User Management

- ✅ User registration and secure login
- ✅ Profile management with customizable profile pictures
- ✅ User dashboard with personal information
- ✅ Secure session handling with Passport.js
- ✅ Cloudinary integration for image storage

### Social Posting System

- ✅ Create, read, update, and delete posts
- ✅ Search functionality to find posts by keywords
- ✅ Interactive commenting system
- ✅ View other users' profiles and posts
- ✅ Personal dashboard to manage your content

### Real-Time Messaging

- ✅ One-on-one private messaging
- ✅ Real-time message delivery with Socket.IO
- ✅ Message read receipts (delivered/read status)
- ✅ Inbox view with conversation history
- ✅ Last message preview in chat list

### User Interface

- ✅ Responsive and mobile-friendly design
- ✅ Modern chat interface similar to WhatsApp
- ✅ Bootstrap 5 for responsive layouts
- ✅ Custom CSS styling
- ✅ Smooth animations and transitions

## 🛠 Technologies Used

### Backend

- **Node.js** (v20.14.0) - JavaScript runtime
- **Express.js** (v5.1.0) - Web framework
- **Socket.IO** (v4.8.1) - Real-time communication
- **MongoDB** - NoSQL database
- **Mongoose** (v8.15.0) - ODM for MongoDB
- **Passport.js** (v0.7.0) - Authentication middleware
- **Passport-Local** (v1.0.0) - Local authentication strategy

### Frontend

- **EJS** (v3.1.10) - Server-side templating engine
- **EJS-Mate** (v4.0.0) - Layout and partials support
- **Bootstrap 5** - CSS framework
- **Socket.IO Client** - Real-time communication client
- **HTML5/CSS3** - Markup and styling

### Database & Storage

- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **Mongoose** (v8.15.0) - Data modeling and validation
- **Cloudinary** (v1.30.0) - Cloud image and file storage
- **Multer** (v2.0.1) - File upload middleware
- **Multer-Storage-Cloudinary** (v4.0.0) - Cloudinary storage engine

### Security & Sessions

- **Express-Session** (v1.18.1) - Session management
- **Connect-Mongo** (v5.1.0) - MongoDB session store
- **Dotenv** (v16.5.0) - Environment variable management
- **Joi** (v17.13.3) - Data validation

### Utilities

- **Method-Override** (v3.0.0) - HTTP method override
- **Connect-Flash** (v0.1.1) - Flash messaging
- **Express-Socket.IO-Session** (v1.3.5) - Socket.IO session support
- **Serve-Favicon** (v2.5.1) - Favicon middleware

## 📁 Project Structure

```
WriteNow/
├── controllers/           # Route controllers for business logic
├── models/               # Database models
│   ├── comments.js      # Comment schema
│   ├── Message.js       # Message schema with read receipts
│   ├── posts.js         # Post schema
│   └── users.js         # User schema
├── routes/              # Express routes
│   ├── chat.js          # Chat/messaging routes
│   ├── comments.js      # Comment routes
│   ├── landing.js       # Landing page routes
│   ├── posts.js         # Post routes
│   └── users.js         # User authentication routes
├── public/              # Static files
│   ├── css/
│   │   ├── chat.css     # Chat styling
│   │   └── style.css    # Global styling
│   ├── js/
│   │   └── script.js    # Client-side JavaScript
│   ├── sounds/          # Audio files
│   └── images/          # Image assets
├── views/               # EJS templates
│   ├── includes/        # Reusable components
│   │   ├── flash.ejs    # Flash message template
│   │   ├── footer.ejs   # Footer component
│   │   └── navbar.ejs   # Navigation bar
│   ├── layouts/
│   │   └── boilerplate.ejs # Main layout
│   ├── landing/         # Landing page templates
│   ├── posts/           # Post templates
│   ├── users/           # User templates
│   ├── chat.ejs         # Chat interface
│   ├── chatList.ejs     # Inbox view
│   └── error.ejs        # Error page
├── utils/               # Utility functions
│   ├── ExpressError.js  # Custom error class
│   └── wrapAsync.js     # Async error wrapper
├── uploads/             # User uploads directory
├── app.js              # Main application file
├── middleware.js       # Custom middleware
├── cloudConfig.js      # Cloudinary configuration
├── schema.js           # Data validation schemas
└── package.json        # Project dependencies
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v20.14.0 or higher)
- MongoDB Atlas account or local MongoDB
- Cloudinary account for image storage
- npm (Node Package Manager)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/SimranKant/WriteNow.git
cd WriteNow
```

2. **Install dependencies:**

```bash
npm install
```

3. **Create environment variables:**
   Create a `.env` file in the root directory:

```env
PORT=3000
NODE_ENV=development
ATLASDB_URL=your_mongodb_connection_string
SECRET_CODE=your_session_secret
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
```

4. **Start the application:**

```bash
node app.js
```

The application will be available at `http://localhost:3000`

## 📖 Usage

### User Registration & Login

1. Navigate to the landing page
2. Click "Register" to create a new account
3. Enter username, email, and password
4. Login with your credentials
5. Update your profile with a profile picture

### Creating and Managing Posts

1. Click "Create Post" in the navbar
2. Add a title and description
3. Submit to publish
4. Edit or delete your posts from your dashboard
5. Search posts using the search bar

### Commenting

1. Click on a post to view details
2. Scroll to the comments section
3. Add your comment
4. Delete your own comments if needed

### Real-Time Messaging

1. Click "Messages" in the navbar
2. View your chat inbox
3. Click on a user to start chatting
4. Send messages in real-time

## 🔐 Security Features

- Password hashing with Passport.js
- Session-based authentication
- Environment variable protection for sensitive data
- Secure Cloudinary API integration
- Input validation with Joi
- Error handling and validation

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

- **Simran Kant** - Full Stack Developer
  - [GitHub](https://github.com/SimranKant)
  - [LinkedIn](https://www.linkedin.com/in/simrankant/)
