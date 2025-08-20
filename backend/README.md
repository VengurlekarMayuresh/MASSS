# MASSS Healthcare Backend API

Backend API for the MASSS Healthcare Portal, providing healthcare provider search and management services for Mumbai.

## 🚀 Features

- **Healthcare Provider Search** - Find hospitals, clinics, pharmacies, and specialists in Mumbai
- **Advanced Filtering** - Search by area, specialty, type, and services
- **Provider Information** - Detailed provider profiles with ratings, reviews, and contact info
- **Mumbai-Focused** - Comprehensive data for Mumbai healthcare providers
- **RESTful API** - Clean, documented API endpoints
- **MongoDB Integration** - Scalable database with optimized queries
- **Authentication Ready** - JWT-based authentication system (to be implemented)

## 🏗️ Architecture

```
backend/
├── models/          # MongoDB schemas
├── controllers/     # Business logic
├── routes/          # API endpoints
├── middleware/      # Custom middleware
├── config/          # Configuration files
├── data/            # Sample data
└── server.js        # Main server file
```

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication (to be implemented)
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update `.env` with your configuration:
   ```env
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/masss-healthcare
   JWT_SECRET=your-super-secret-jwt-key-here
   ```

4. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

## 🚀 Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000`

## 📚 API Endpoints

### Healthcare Providers

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/providers` | Get all providers with pagination and filters |
| GET | `/api/providers/search` | Search providers by query, area, specialty |
| GET | `/api/providers/:id` | Get specific provider details |
| GET | `/api/providers/area/:area` | Get providers by Mumbai area |
| GET | `/api/providers/categories` | Get provider categories and counts |
| GET | `/api/providers/areas/popular` | Get popular Mumbai areas |

### Query Parameters

- `page` - Page number for pagination
- `limit` - Number of results per page
- `type` - Provider type (hospital, clinic, pharmacy, etc.)
- `specialty` - Medical specialty
- `area` - Mumbai area (Bandra, Andheri, Colaba, etc.)
- `search` - Text search in name, description, specialty
- `emergency` - Filter by emergency services
- `featured` - Filter featured providers
- `verified` - Filter verified providers

## 🗄️ Database Models

### Provider
- Basic info (name, type, specialty, description)
- Address (Mumbai-specific areas)
- Contact details
- Services and pricing
- Operating hours
- Ratings and reviews
- Facilities and insurance

### User (to be implemented)
- Patient and doctor profiles
- Authentication details
- Medical information
- Preferences

### Appointment (to be implemented)
- Booking management
- Status tracking
- Payment integration

## 🌆 Mumbai Healthcare Data

The system includes comprehensive data for Mumbai healthcare providers:

- **Hospitals**: Lilavati, Breach Candy, Bombay Hospital
- **Areas**: Bandra, Andheri, Colaba, Marine Lines, Breach Candy
- **Specialties**: Cardiology, Neurology, Orthopedics, Oncology
- **Types**: Hospitals, Clinics, Pharmacies, Dental, Eye Care, Mental Health

## 🔐 Authentication (Coming Soon)

- JWT-based authentication
- User registration and login
- Role-based access control
- Password encryption

## 📊 Sample API Response

```json
{
  "success": true,
  "count": 10,
  "total": 25,
  "page": 1,
  "totalPages": 3,
  "data": [
    {
      "_id": "60f7b3b3b3b3b3b3b3b3b3b3",
      "name": "Lilavati Hospital & Research Centre",
      "type": "hospital",
      "specialty": "Multi-Specialty",
      "address": {
        "area": "Bandra West",
        "city": "Mumbai"
      },
      "ratings": {
        "average": 4.8,
        "count": 1250
      }
    }
  ]
}
```

## 🧪 Testing

Test the API endpoints using tools like:
- Postman
- Insomnia
- cURL
- Thunder Client (VS Code extension)

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | localhost:27017 |
| `JWT_SECRET` | JWT signing secret | - |
| `NODE_ENV` | Environment mode | development |

## 🚧 Future Enhancements

- [ ] User authentication and authorization
- [ ] Appointment booking system
- [ ] Real-time notifications
- [ ] Payment gateway integration
- [ ] Admin dashboard
- [ ] Analytics and reporting
- [ ] Mobile app API
- [ ] Integration with external healthcare systems

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Built with ❤️ for MASSS Healthcare Portal**


