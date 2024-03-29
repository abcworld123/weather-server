import * as dotenv from 'dotenv';
dotenv.config();

const config = {
  database: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  key: {
    kma: process.env.KEY_KMA,
    ow: process.env.KEY_OW,
    map: process.env.KEY_MAP,
  },
  reg: {
    nx: process.env.NX,
    ny: process.env.NY,
    ta: process.env.TA_REG,
    ml: process.env.ML_REG,
    homeRegName: process.env.HOME_REG_NAME,
  },
};

export default config;
