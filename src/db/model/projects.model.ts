import * as mongoose from 'mongoose';

export const ProjectsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    url: { type: String, required: true },
    description: { type: String, required: true },
  },
  { versionKey: false },
);

export interface Projects {
  id: string;
  name: string;
  description: string;
  url: string;
}
