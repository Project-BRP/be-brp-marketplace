export const CLIENT_URL = {
  get LOCAL() {
    return process.env.CLIENT_URL_LOCAL as string;
  },

  get DEVELOPMENT() {
    return process.env.CLIENT_URL_DEVELOPMENT as string;
  },

  get PRODUCTION() {
    return process.env.CLIENT_URL_PRODUCTION as string;
  },
};

const currentEnv = process.env.NODE_ENV;
let clientUrl;

if (currentEnv === 'development') {
  clientUrl = CLIENT_URL.DEVELOPMENT;
} else if (currentEnv === 'production') {
  clientUrl = CLIENT_URL.PRODUCTION;
} else if (currentEnv === 'testing') {
  clientUrl = CLIENT_URL.LOCAL;
}

export const CLIENT_URL_CURRENT = clientUrl;
