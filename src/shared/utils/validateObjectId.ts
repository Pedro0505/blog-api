import mongoose from 'mongoose';

const validateObjectId = (id: string) => mongoose.isValidObjectId(id);

export default validateObjectId;
