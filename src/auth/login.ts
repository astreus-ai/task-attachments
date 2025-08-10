/**
 * Login Controller - Authentication Module
 * Mock implementation for demonstration purposes
 */

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  token?: string;
  user?: {
    id: number;
    username: string;
    email: string;
  };
  error?: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

class LoginController {
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'default-secret-key';
  private readonly SALT_ROUNDS = 12;

  /**
   * Authenticate user with username and password
   * @param credentials - User login credentials
   * @returns Promise resolving to login response
   */
  async authenticate(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      // Input validation
      if (!credentials.username || !credentials.password) {
        return {
          success: false,
          error: 'Username and password are required'
        };
      }

      // Find user in database (mock implementation)
      const user = await this.findUserByUsername(credentials.username);
      
      if (!user) {
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(
        credentials.password, 
        user.passwordHash
      );

      if (!isValidPassword) {
        return {
          success: false,
          error: 'Invalid credentials'
        };
      }

      // Generate JWT token
      const token = this.generateToken(user);

      return {
        success: true,
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email
        }
      };

    } catch (error) {
      console.error('Authentication error:', error);
      return {
        success: false,
        error: 'Internal server error'
      };
    }
  }

  /**
   * Generate JWT token for authenticated user
   * @param user - User object
   * @returns JWT token string
   */
  private generateToken(user: User): string {
    const payload = {
      userId: user.id,
      username: user.username,
      email: user.email
    };

    return jwt.sign(payload, this.JWT_SECRET, {
      expiresIn: '24h',
      issuer: 'task-attachments-app'
    });
  }

  /**
   * Mock database lookup for user
   * In real implementation, this would query a database
   * @param username - Username to search for
   * @returns Promise resolving to user object or null
   */
  private async findUserByUsername(username: string): Promise<User | null> {
    // Mock user data - in production, this would be a database query
    const mockUsers: User[] = [
      {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        passwordHash: await bcrypt.hash('password123', this.SALT_ROUNDS),
        createdAt: new Date('2024-01-01')
      },
      {
        id: 2,
        username: 'user',
        email: 'user@example.com', 
        passwordHash: await bcrypt.hash('userpass', this.SALT_ROUNDS),
        createdAt: new Date('2024-01-02')
      }
    ];

    return mockUsers.find(user => user.username === username) || null;
  }

  /**
   * Validate JWT token
   * @param token - JWT token to validate
   * @returns Decoded token payload or null if invalid
   */
  validateToken(token: string): any {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      console.error('Token validation error:', error);
      return null;
    }
  }

  /**
   * Hash password for storage
   * @param password - Plain text password
   * @returns Promise resolving to hashed password
   */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }
}

export { LoginController, LoginRequest, LoginResponse };
export default LoginController;