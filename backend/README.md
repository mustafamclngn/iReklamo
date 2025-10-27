# iReklamo Backend

A Flask-based REST API for the iReklamo complaint management system.

## Features

- User authentication and registration
- Complaint creation and management
- Raw SQL database operations (transitioned from SQLAlchemy ORM)
- MVC architectural pattern
- CORS support for frontend integration
- Environment-based configuration
- Placeholder structure for forms and input validation

**Note**: This backend has been refactored to use raw SQL instead of SQLAlchemy ORM. The current routes contain SQLAlchemy-specific operations with TODO comments indicating where raw SQL functions should be integrated. Database operations use a new `schema.sql` file instead of migrations.

## Project Structure

**MVC Architecture** - The backend follows a Model-View-Controller pattern:

```bash
backend/
├── app/
│   ├── __init__.py          # Application factory
│   ├── config.py            # Configuration settings
│   ├── extensions.py        # Flask extensions initialization
│   ├── controllers/         # Business logic (controller layer)
│   │   └── __init__.py      # Controller package
│   ├── models/              # Raw SQL database operations (model layer)
│   │   └── __init__.py      # Model package - contains SQL functions
│   ├── forms/               # Input validation and forms
│   │   └── __init__.py      # Forms package
│   └── routes/              # HTTP endpoints (view layer)
│       ├── __init__.py      # Routes package
│       ├── main.py          # Main routes (health, info)
│       ├── auth.py          # Authentication routes
│       └── complaints.py    # Complaint management routes
├── schema.sql               # Database schema for raw SQL
├── uploads/                 # File uploads directory
├── .env                     # Environment variables
├── .env.example             # Environment template
├── requirements.txt         # Python dependencies
├── Pipfile                  # Pipenv dependencies
├── Pipfile.lock             # Pipenv lock file
└── run.py                   # Application entry point
```

## Installation

1. **Install dependencies:**

   ```bash
   pip install -r requirements.txt
   ```

   Or using Pipenv:

   ```bash
   pipenv install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file with your configuration.

3. **Initialize the database:**

   ```bash
   # Run the schema.sql file to create tables
   sqlite3 app.db < schema.sql
   ```

   Or for MySQL/PostgreSQL:

   ```bash
   mysql -u username -p database_name < schema.sql
   ```

## Running the Application

**Development mode:**

```bash
python run.py
```

**Or using Flask CLI:**

```bash
export FLASK_APP=run.py
export FLASK_ENV=development
flask run
```

**Production mode:**

```bash
export FLASK_ENV=production
python run.py
```

## API Endpoints

### Main Routes

- `GET /` - Welcome message
- `GET /health` - Health check
- `GET /api` - API information

### Authentication Routes

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile

### Complaint Routes

- `GET /api/complaints` - Get all complaints
- `POST /api/complaints` - Create new complaint
- `GET /api/complaints/<id>` - Get specific complaint
- `PUT /api/complaints/<id>` - Update complaint
- `DELETE /api/complaints/<id>` - Delete complaint
- `GET /api/complaints/user/<user_id>` - Get user's complaints

## Configuration

The application supports multiple configuration environments:

- **development**: Debug enabled, SQLite database
- **production**: Production settings, environment-based config
- **testing**: In-memory database for testing

## Database Models

### User Model

- id, username, email, password_hash
- first_name, last_name
- is_active, is_admin
- created_at, updated_at
- Relationship with complaints

### Complaint Model

- id, title, description, category
- status, priority, location
- image_url, user_id
- created_at, updated_at

## Development

**Adding new routes:**

1. Create new blueprint in `app/routes/`
2. Register blueprint in `app/__init__.py`
3. Add routes with proper URL prefixes

**Database changes:**

1. Update schema.sql with new table structures or indexes
2. Implement raw SQL functions in `app/models/__init__.py`
3. Run updated schema against your database manually

## Security Notes

- Password hashing is not implemented (marked as TODO)
- JWT authentication is not implemented (marked as TODO)
- Update SECRET_KEY for production use
- Use HTTPS in production

## License

This project is part of the iReklamo system.
