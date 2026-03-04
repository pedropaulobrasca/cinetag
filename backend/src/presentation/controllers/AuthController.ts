import { Request, Response, NextFunction } from 'express';
import { RegisterUser } from '../../application/use-cases/auth/RegisterUser';
import { LoginUser } from '../../application/use-cases/auth/LoginUser';

export class AuthController {
  constructor(
    private readonly registerUser: RegisterUser,
    private readonly loginUser: LoginUser,
  ) {}

  register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const output = await this.registerUser.execute(req.body);
      res.status(201).json(output);
    } catch (error) {
      next(error);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const output = await this.loginUser.execute(req.body);
      res.status(200).json(output);
    } catch (error) {
      next(error);
    }
  };
}
