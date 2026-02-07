import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError } from 'zod';

export const validateRequest = (schema: ZodSchema, target: 'body' | 'query' = 'body') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const data = target === 'body' ? req.body : req.query;
      const validatedData = schema.parse(data);
      
      if (target === 'body') {
        req.body = validatedData;
      } else {
        req.query = validatedData;
      }
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errorMessages,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }
    }
  };
};
