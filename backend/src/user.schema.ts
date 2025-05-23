import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  username!: string;

  @Prop()
  fullName?: string;

  @Prop()
  avatarUrl?: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop()
  lastLogin?: Date;
}

export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);