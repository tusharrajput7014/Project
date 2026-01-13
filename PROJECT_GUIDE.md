# Service Platform - React Application

A comprehensive service marketplace platform built with React, featuring two types of users (Providers and Users) with integrated chat, video calling, and payment functionality.

## 🚀 Features

### For Providers

- **Create Services**: Set up services with custom pricing, duration, and descriptions
- **Manage Bookings**: View and manage all service bookings
- **Real-time Chat**: Communicate with users who book services
- **Video Calls**: Conduct video consultations with users
- **Dashboard**: Track earnings, active services, and booking statistics

### For Users

- **Browse Services**: Search and filter through available services
- **Secure Payments**: Pay for services using Stripe integration
- **Book Services**: Reserve services from providers
- **Real-time Chat**: Communicate with providers
- **Video Calls**: Join video sessions with providers
- **Booking Management**: Track all bookings and their status

## 🛠️ Tech Stack

- **React** - UI framework
- **React Router** - Client-side routing
- **Stripe** - Payment processing
- **WebRTC** - Video calling (via getUserMedia API)
- **LocalStorage** - Data persistence (replace with backend in production)
- **Lucide React** - Icons

## 📦 Installation

1. **Clone and navigate to the project:**

   ```bash
   cd project
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start the development server:**

   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Stripe Setup (Optional for Production)

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your publishable key from the Stripe Dashboard
3. Update the key in `src/components/Payment.jsx`:
   ```javascript
   const stripePromise = loadStripe("your_publishable_key_here");
   ```

### WebRTC Setup (For Production)

The current video implementation uses the browser's WebRTC getUserMedia API for local video. For production:

1. Set up a signaling server (Socket.io, WebSocket)
2. Implement STUN/TURN servers for NAT traversal
3. Use SimplePeer or PeerJS for peer-to-peer connections

## 📱 Usage

### Getting Started

1. **Register/Login:**

   - Choose "User" or "Provider" account type
   - Enter email and password
   - Click Register/Login

2. **As a Provider:**

   - Click "Add Service" to create new services
   - Set service details (title, price, duration, category)
   - View bookings in the dashboard
   - Click "Chat" or "Video" to communicate with users

3. **As a User:**
   - Browse available services
   - Use search and filters to find services
   - Click "Book Now" to purchase a service
   - Complete payment with test card: `4242 4242 4242 4242`
   - Access chat and video features after booking

## 🗂️ Project Structure

```
project/
├── src/
│   ├── components/
│   │   ├── Login.jsx           # Authentication component
│   │   ├── ProviderDashboard.jsx  # Provider interface
│   │   ├── UserDashboard.jsx   # User interface
│   │   ├── Chat.jsx            # Real-time chat
│   │   ├── VideoCall.jsx       # Video calling
│   │   └── Payment.jsx         # Payment processing
│   ├── context/
│   │   ├── AuthContext.jsx     # User authentication state
│   │   └── ServiceContext.jsx  # Service & booking management
│   ├── App.jsx                 # Main app component with routing
│   ├── App.css                 # Global styles
│   ├── main.jsx                # Entry point
│   └── index.css               # Base styles
├── public/                     # Static assets
├── package.json                # Dependencies
└── README.md                   # This file
```

## 🔑 Key Components

### Context Providers

**AuthContext:**

- Manages user authentication state
- Handles login, register, logout
- Stores user data in localStorage

**ServiceContext:**

- Manages services and bookings
- CRUD operations for services
- Booking creation and management

### Protected Routes

Routes are protected based on user authentication and role:

- `/` - Login page (redirects if authenticated)
- `/provider/dashboard` - Provider only
- `/user/dashboard` - User only
- `/chat/:bookingId` - Both (authenticated)
- `/video/:bookingId` - Both (authenticated)
- `/payment` - User only

## 🚧 Development Notes

### Current Implementation

- **Data Storage**: Uses localStorage (replace with backend API)
- **Authentication**: Basic email/password (add JWT, OAuth in production)
- **Video Calls**: Local video only (implement WebRTC signaling)
- **Payments**: Stripe test mode (configure production keys)
- **Chat**: Stored locally (implement Socket.io/WebSocket)

### Production Recommendations

1. **Backend API:**

   - Create REST/GraphQL API (Node.js, Express, etc.)
   - Use PostgreSQL/MongoDB for data persistence
   - Implement proper authentication (JWT, sessions)

2. **Real-time Features:**

   - Set up Socket.io server for chat
   - Implement WebRTC signaling server
   - Use Redis for real-time data

3. **Payment Processing:**

   - Configure Stripe webhooks
   - Implement payment intents on backend
   - Add payment history and receipts

4. **Security:**

   - Add input validation
   - Implement rate limiting
   - Use HTTPS in production
   - Add CORS configuration
   - Sanitize user inputs

5. **Features to Add:**
   - Email notifications
   - Calendar/scheduling system
   - Rating and review system
   - File sharing in chat
   - Screen sharing in video calls
   - Service categories and tags
   - Advanced search/filters
   - User profiles with avatars
   - Payment refunds/disputes

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🐛 Known Issues

- Video calls show only local video (implement WebRTC for remote streams)
- Chat messages only stored locally (needs backend for persistence)
- No real payment processing (uses Stripe test mode)
- No push notifications
- Limited mobile responsiveness (needs optimization)

## 📄 License

This project is open source and available for educational purposes.

## 🤝 Contributing

Feel free to fork this project and make improvements. Some areas that need work:

- Mobile responsive design
- Backend API implementation
- Real WebRTC video/audio streaming
- Advanced booking features
- Admin dashboard

## 📞 Support

For questions or issues, please create an issue in the repository.

---

**Note:** This is a demonstration project. Before deploying to production, implement proper security measures, backend infrastructure, and thorough testing.
