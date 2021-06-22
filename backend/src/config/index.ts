/**
 * This file will contain all the configuration keys.
 * Throws error if in production and a key is not specified.
 */

const getEnvVariable = (key: string, isRequired = true) => {
  const value = process.env[key];
  if (!value && isRequired) throw new Error(`ENVIREMENT VARIABLE '${key}' NOT SPECIFIED.`);
};

const config = {
  DB: {
    USER: getEnvVariable('DB_USER'),
    PASSWORD: getEnvVariable('DB_PASSWORD'),
    SCHEMA: getEnvVariable('DB_SCHEMA'),
    HOST: getEnvVariable('DB_HOST'),
    DIALECT: getEnvVariable('DB_DIALECT')
  }
};

export default config;
