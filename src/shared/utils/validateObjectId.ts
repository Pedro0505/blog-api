import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';

@Injectable()
class MongoValidator {
  public validateObjectId(id: string) {
    return mongoose.isValidObjectId(id);
  }
}

export default MongoValidator;
