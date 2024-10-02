import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type MessageDocument = Message & Document;

@Schema()
export class Message {
  @Prop({ required: true })
  sender: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true })
  chatId: string;

  @Prop({ default: Date.now })
  time_created: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);