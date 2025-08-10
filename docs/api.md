# Task Attachments API Documentation

## Overview

This API provides authentication and user management functionality for the Task Attachments application. The API follows RESTful principles and returns JSON responses.

**Base URL:** `https://api.task-attachments.com/v1`

**Authentication:** Bearer token (JWT)

## Authentication Endpoints

### POST /auth/login

Authenticate a user with username and password.

#### Request

```json
{
  "username": "string",
  "password": "string"
}
```

#### Response

**Success (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Error (401 Unauthorized):**
```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

**Error (400 Bad Request):**
```json
{
  "success": false,
  "error": "Username and password are required"
}
```

### POST /auth/logout

Log out the current user (invalidate token).

#### Headers
```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### POST /auth/refresh

Refresh an existing JWT token.

#### Headers
```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

## User Management Endpoints

### GET /users/profile

Get current user profile information.

#### Headers
```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00Z",
  "lastLoginAt": "2024-01-10T12:00:00Z"
}
```

### PUT /users/profile

Update user profile information.

#### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request
```json
{
  "email": "newemail@example.com",
  "firstName": "John",
  "lastName": "Doe"
}
```

#### Response

**Success (200 OK):**
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "newemail@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

## Task Management Endpoints

### GET /tasks

Retrieve all tasks for the authenticated user.

#### Headers
```
Authorization: Bearer <token>
```

#### Query Parameters
- `status` (optional): Filter by task status (`pending`, `in_progress`, `completed`)
- `limit` (optional): Number of tasks to return (default: 50, max: 100)
- `offset` (optional): Offset for pagination (default: 0)

#### Response

**Success (200 OK):**
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive API documentation",
      "status": "in_progress",
      "priority": "high",
      "dueDate": "2024-01-15T23:59:59Z",
      "createdAt": "2024-01-01T09:00:00Z",
      "updatedAt": "2024-01-10T14:30:00Z"
    }
  ],
  "total": 1,
  "limit": 50,
  "offset": 0
}
```

### POST /tasks

Create a new task.

#### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request
```json
{
  "title": "New task title",
  "description": "Task description",
  "priority": "medium",
  "dueDate": "2024-02-01T23:59:59Z"
}
```

#### Response

**Success (201 Created):**
```json
{
  "success": true,
  "task": {
    "id": 2,
    "title": "New task title",
    "description": "Task description",
    "status": "pending",
    "priority": "medium",
    "dueDate": "2024-02-01T23:59:59Z",
    "createdAt": "2024-01-10T15:00:00Z"
  }
}
```

### PUT /tasks/{id}

Update an existing task.

#### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

#### Request
```json
{
  "status": "completed",
  "priority": "low"
}
```

#### Response

**Success (200 OK):**
```json
{
  "success": true,
  "task": {
    "id": 2,
    "title": "New task title",
    "status": "completed",
    "priority": "low",
    "updatedAt": "2024-01-10T16:00:00Z"
  }
}
```

### DELETE /tasks/{id}

Delete a task.

#### Headers
```
Authorization: Bearer <token>
```

#### Response

**Success (200 OK):**
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

## File Attachment Endpoints

### POST /tasks/{id}/attachments

Upload file attachments to a task.

#### Headers
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

#### Request
Form data with file uploads

#### Response

**Success (201 Created):**
```json
{
  "success": true,
  "attachments": [
    {
      "id": 1,
      "filename": "document.pdf",
      "size": 1024576,
      "mimeType": "application/pdf",
      "uploadedAt": "2024-01-10T17:00:00Z",
      "url": "https://api.task-attachments.com/files/abc123"
    }
  ]
}
```

## Error Responses

All error responses follow this format:

```json
{
  "success": false,
  "error": "Error message description",
  "code": "ERROR_CODE",
  "details": {}
}
```

### HTTP Status Codes

- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `400 Bad Request` - Invalid request data
- `401 Unauthorized` - Authentication required or failed
- `403 Forbidden` - Access denied
- `404 Not Found` - Resource not found
- `422 Unprocessable Entity` - Validation errors
- `429 Too Many Requests` - Rate limit exceeded
- `500 Internal Server Error` - Server error

## Rate Limiting

API requests are limited to 100 requests per minute per user. Rate limit information is included in response headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1673366400
```

## Security Considerations

- All API endpoints require HTTPS
- JWT tokens expire after 24 hours
- Passwords must be at least 8 characters long
- Failed login attempts are rate limited
- All file uploads are scanned for malware
- SQL injection protection implemented
- XSS protection enabled

## SDK Examples

### JavaScript/Node.js

```javascript
const API_BASE = 'https://api.task-attachments.com/v1';

// Login
const loginResponse = await fetch(`${API_BASE}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john_doe',
    password: 'password123'
  })
});

const { token } = await loginResponse.json();

// Get tasks
const tasksResponse = await fetch(`${API_BASE}/tasks`, {
  headers: { 'Authorization': `Bearer ${token}` }
});

const { tasks } = await tasksResponse.json();
```

### Python

```python
import requests

API_BASE = 'https://api.task-attachments.com/v1'

# Login
login_response = requests.post(f'{API_BASE}/auth/login', json={
    'username': 'john_doe',
    'password': 'password123'
})

token = login_response.json()['token']

# Get tasks
tasks_response = requests.get(f'{API_BASE}/tasks', 
    headers={'Authorization': f'Bearer {token}'})

tasks = tasks_response.json()['tasks']
```

## Changelog

### v1.0.0 (2024-01-01)
- Initial API release
- Basic authentication endpoints
- Task CRUD operations
- File attachment support

### v1.1.0 (2024-01-10)  
- Added rate limiting
- Improved error responses
- Enhanced security measures
- SDK examples added