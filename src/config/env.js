import 'dotenv/config';

const { MONGODB_URI, ACCESS_CODE, CLIENT_ORIGIN = '*', PORT = '4000' } = process.env;

if (!MONGODB_URI || !ACCESS_CODE) {
  throw new Error('Please set MONGODB_URI and ACCESS_CODE in server/.env');
}

export const env = {
  mongoUri: MONGODB_URI,
  accessCode: ACCESS_CODE,
  clientOrigin: CLIENT_ORIGIN,
  port: Number(PORT),
};
