import { Request, Response } from 'express';
import { HrUserService } from './hr_user.service';
import { CreateHrUserInput, LoginInput } from './hr_user.validation';

export class HrUserController {
  constructor(private hrUserService: HrUserService) {}

  async createHrUser(req: Request, res: Response): Promise<void> {
    try {
      const userData: CreateHrUserInput = req.body;
      const user = await this.hrUserService.createHrUser(userData);
      
      res.status(201).json({
        success: true,
        message: 'HR user created successfully',
        data: user,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const loginData: LoginInput = req.body;
      const result = await this.hrUserService.login(loginData);
      
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result,
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(401).json({
          success: false,
          message: error.message,
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Internal server error',
        });
      }
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'Unauthorized',
        });
        return;
      }

      const user = await this.hrUserService.getHrUserById(userId);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  }
}
