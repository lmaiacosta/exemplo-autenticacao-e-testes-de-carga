import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User, UserSchema } from './user.schema';
import { Connection, Error as MongooseError } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://admin:admin@backend-mongo:27017/mydatabase?authSource=admin', {
      connectionFactory: (connection: Connection) => {
        connection.on('error', (err: MongooseError) => {
          console.error('MongoDB connection error:', err);
        });
        connection.on('connected', () => {
          console.log('MongoDB connected');
        });
        connection.on('disconnected', () => {
          console.warn('MongoDB disconnected');
        });
        return connection;
      },
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}