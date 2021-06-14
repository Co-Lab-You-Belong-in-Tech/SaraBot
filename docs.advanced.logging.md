// Import LogLevel from the package
const { App, LogLevel } = require('@slack/bolt');

// Log level is one of the options you can set in the constructor
const app = new App({
  token,
  signingSecret,
  logLevel: LogLevel.DEBUG,
});
