import dotenv from 'dotenv';

dotenv.config();

const config = {
  github: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
  mongoDB: {
    url: process.env.MONGODB_URL,
  },
  session: {
    secret: process.env.SESSION_SECRET,
    ttl: parseInt(process.env.SESSION_TTL),
  },
  gmail: {
    gmailpass: process.env.GMAIL_PASS,
  },
  port: process.env.PORT || 3000,
};

export default config;

