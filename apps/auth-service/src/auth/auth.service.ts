import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { User } from '../entities/user.entity';
import { RefreshToken } from '../entities/refresh-token.entity';
import { RegisterDto, LoginDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    @InjectRepository(RefreshToken) private tokenRepo: Repository<RefreshToken>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.userRepo.findOne({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);
    const user = this.userRepo.create({ ...dto, passwordHash });
    await this.userRepo.save(user);

    return this.generateTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.userRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.email = :email', { email: dto.email })
      .getOne();

    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.generateTokens(user);
  }

  async refresh(token: string) {
    const hash = crypto.createHash('sha256').update(token).digest('hex');
    const record = await this.tokenRepo.findOne({
      where: { tokenHash: hash, revoked: false },
      relations: ['user'],
    });

    if (!record || record.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Rotate: revoke old, issue new
    record.revoked = true;
    await this.tokenRepo.save(record);
    return this.generateTokens(record.user);
  }

  async logout(userId: string) {
    await this.tokenRepo.update({ userId, revoked: false }, { revoked: true });
    return { message: 'Logged out' };
  }

  private async generateTokens(user: User) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: this.config.get('JWT_EXPIRES_IN'),
    });

    const rawRefresh = crypto.randomBytes(64).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawRefresh).digest('hex');
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await this.tokenRepo.save(
      this.tokenRepo.create({ userId: user.id, tokenHash, expiresAt }),
    );

    return {
      accessToken,
      refreshToken: rawRefresh,
      user: { id: user.id, email: user.email, role: user.role, firstName: user.firstName },
    };
  }
}