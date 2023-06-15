import * as mongoose from 'mongoose';

export const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, required: true },
  },
  { versionKey: false },
);

export interface Project {
  id: string;
  name: string;
  description: string;
  url: string;
}
