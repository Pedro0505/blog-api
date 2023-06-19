import * as mongoose from 'mongoose';

mongoose.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
  },
});

export const PostsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    content: { type: String, required: true },
    published: { type: String, required: true },
    category: { type: String, required: true },
  },
  { versionKey: false },
);

export interface Posts {
  id: string;
  title: string;
  description: string;
  content: string;
  published: string;
  category: string;
}
