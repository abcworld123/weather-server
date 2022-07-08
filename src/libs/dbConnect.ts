import config from 'config/config';
import mongoose from 'mongoose';

const { host, database, user, pass } = config.database;

export function dbConnect() {
  mongoose.connect(`mongodb://${host}/${database}`, { user, pass }, (err) => {
    err ? console.error(err) : console.info('\x1B[36mDB Connected.\x1B[0m');
  });
}
