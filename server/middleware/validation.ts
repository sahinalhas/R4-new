import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Input sanitization utility with comprehensive XSS protection
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>'"&]/g, (char) => {
      // HTML entity encoding for dangerous characters
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;'
      };
      return entities[char] || char;
    })
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers like onclick=
    .substring(0, 10000); // Limit length to prevent DoS
}

// Enhanced input validation middleware
export function validateRequestBody(schema: z.ZodSchema<any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if body exists
      if (!req.body) {
        return res.status(400).json({
          success: false,
          error: 'Request body is required'
        });
      }

      // Validate with schema
      const result = schema.safeParse(req.body);
      
      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid request data',
          details: process.env.NODE_ENV === 'development' ? result.error.issues : undefined
        });
      }
      
      // Replace body with validated data
      req.body = result.data;
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: 'Request validation failed'
      });
    }
  };
}

// Rate limiting helper with per-endpoint tracking
interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const rateLimitStore: RateLimitStore = {};

export function simpleRateLimit(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Create a compound key using IP + route pattern + method to prevent interference between endpoints
    // Use route pattern (e.g., /api/students/:id) instead of actual path (e.g., /api/students/123)
    // to ensure all requests to the same endpoint share the same counter
    const ip = req.ip || 'unknown';
    const routePattern = req.route?.path || req.path;
    const baseUrl = req.baseUrl || '';
    const fullRoute = `${req.method}:${baseUrl}${routePattern}`;
    const key = `${ip}:${fullRoute}`;
    const now = Date.now();
    
    // Clean up old entries periodically
    Object.keys(rateLimitStore).forEach(k => {
      if (rateLimitStore[k].resetTime < now) {
        delete rateLimitStore[k];
      }
    });
    
    // Check current key
    if (!rateLimitStore[key]) {
      rateLimitStore[key] = {
        count: 1,
        resetTime: now + windowMs
      };
    } else {
      rateLimitStore[key].count++;
    }
    
    if (rateLimitStore[key].count > maxRequests) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests. Please try again later.'
      });
    }
    
    next();
  };
}

// Parameter validation
export function validateParams(allowedParams: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const paramKeys = Object.keys(req.params);
    const invalidParams = paramKeys.filter(key => !allowedParams.includes(key));
    
    if (invalidParams.length > 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request parameters'
      });
    }
    
    // Sanitize parameter values
    for (const key of paramKeys) {
      if (typeof req.params[key] === 'string') {
        req.params[key] = sanitizeString(req.params[key]);
      }
    }
    
    next();
  };
}