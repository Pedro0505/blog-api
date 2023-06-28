import mongoose from 'mongoose';

export class MongooseConnections {
  public async insert(collectionName: string, data: any[]) {
    try {
      await mongoose.connect(process.env.DATABASE_URL_TEST);

      const collection = mongoose.connection.collection(collectionName);

      await collection.insertMany(data);
      mongoose.connection.close();
    } catch (error) {
      console.error(error);
      mongoose.connection.close();
    }
  }

  public async remove(collectionName: string) {
    try {
      await mongoose.connect(process.env.DATABASE_URL_TEST);

      const collection = mongoose.connection.collection(collectionName);

      await collection.deleteMany({});
      mongoose.connection.close();
    } catch (error) {
      console.error(error);
      mongoose.connection.close();
    }
  }
}
