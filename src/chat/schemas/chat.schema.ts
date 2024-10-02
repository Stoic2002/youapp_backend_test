import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ChatDocument = Chat & Document;

@Schema()
export class Chat {
  @Prop({ required: true })
  participants: string[];

  _id: MongooseSchema.Types.ObjectId;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);