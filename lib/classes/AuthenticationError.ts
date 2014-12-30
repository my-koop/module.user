import utils = require("mykoop-utils");

class AuthenticationError extends utils.errors {
  constructor(
    err: Error,
    msg: string,
    ...args: any[]
  ) {
    super(err, msg, args);
    this.statusCode = 403;
    this.context = "authentication";
  }
}

export = AuthenticationError;
