import * as dotenv from 'dotenv';
dotenv.config();

const config = {
  database: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
  },
  weather: {
    key: process.env.WEATHER_KEY,
  },
};

export default config;
