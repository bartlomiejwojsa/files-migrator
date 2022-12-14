import { config as configDotenv } from 'dotenv';
import { resolve } from 'path';

switch (process.env.NODE_ENV) {
  case 'development':
    console.log("Environment is 'development'");
    configDotenv({
      path: resolve(__dirname, '../.env.development')
    });
    break;
  case 'production':
    console.log("Environment is 'production'");
    configDotenv({
      path: resolve(__dirname, '../.env.production')
    });
    break;
  // Add 'staging' and 'production' cases here as well!
  default:
    throw new Error(`'NODE_ENV' ${process.env.NODE_ENV} is not handled!`);
}

const throwIfNot = function <T, K extends keyof T>(
  obj: Partial<T>,
  prop: K,
  msg?: string
): T[K] {
  if (obj[prop] === undefined || obj[prop] === null) {
    throw new Error(
      msg || `Environment is missing variable ${String(prop)}`
    );
  } else {
    return obj[prop] as T[K];
  }
};

// Validate that we have our expected ENV variables defined!
[
  'DATA_PATH',
  'TARGET_PATH',
  'READY_TO_MIRATE_AFTER_S',
  'DELETE_SOURCE_FILES'
].forEach((v) => {
  throwIfNot(process.env, v);
});

// eslint-disable-next-line no-unused-vars
declare namespace NodeJS {
  export interface ProcessEnv {
    DATA_PATH: string;
    TARGET_PATH: string;
    READY_TO_MIRATE_AFTER_S: number
    DELETE_SOURCE_FILES: boolean
  }
}
