import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createProxyMiddleware } from 'http-proxy-middleware';

const SERVICE_MAP: Record<string, string> = {
  '/auth':          process.env.AUTH_SERVICE_URL!,
  '/bookings':      process.env.BOOKINGS_SERVICE_URL!,
  '/hotels':        process.env.HOTELS_SERVICE_URL!,
  '/payments':      process.env.PAYMENTS_SERVICE_URL!,
  '/search':        process.env.SEARCH_SERVICE_URL!,
  '/analytics':     process.env.ANALYTICS_SERVICE_URL!,
  '/notifications': process.env.NOTIFICATIONS_SERVICE_URL!,
  '/reviews':       process.env.REVIEWS_SERVICE_URL!,
  '/loyalty':       process.env.LOYALTY_SERVICE_URL!,
  '/currency':      process.env.CURRENCY_SERVICE_URL!,
};

// Routes that don't require a JWT
const PUBLIC_ROUTES = ['/auth/login', '/auth/register', '/auth/refresh', '/search'];

@Injectable()
export class ProxyMiddleware implements NestMiddleware {
  constructor(private jwt: JwtService, private config: ConfigService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const isPublic = PUBLIC_ROUTES.some(r => req.path.startsWith(r));

    if (!isPublic) {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) throw new UnauthorizedException('No token provided');
      try {
        const payload = this.jwt.verify(token, { secret: this.config.get('JWT_SECRET') });
        req.headers['x-user-id'] = payload.sub;
        req.headers['x-user-role'] = payload.role;
        req.headers['x-user-email'] = payload.email;
      } catch {
        throw new UnauthorizedException('Invalid token');
      }
    }

    const prefix = Object.keys(SERVICE_MAP).find(p => req.path.startsWith(p));
    if (!prefix) return res.status(404).json({ message: 'Route not found' });

    createProxyMiddleware({
      target: SERVICE_MAP[prefix],
      changeOrigin: true,
      on: {
        error: (err, req, res) => {
          (res as Response).status(502).json({ message: 'Service unavailable' });
        },
      },
    })(req, res, next);
  }
}