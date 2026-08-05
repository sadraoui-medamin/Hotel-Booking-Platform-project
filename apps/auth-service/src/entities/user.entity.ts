import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from '@stayvista/shared-types';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  email!: string;

  @Column({ nullable: true, select: false })
  passwordHash!: string | null;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.RECEPTIONIST })
  role!: UserRole;

  @Column({ default: true })
  isActive!: boolean;

  @Column({ nullable: true })
  googleId!: string | null;

  @Column({ nullable: true })
  firstName!: string | null;

  @Column({ nullable: true })
  lastName!: string | null;

  @Column({ nullable: true })
  avatar!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
