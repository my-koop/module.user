import utils = require("mykoop-utils");

class AuthenticationError extends utils.errors {
  constructor(
    err: Error,
    msg: string,
    ...args: any[]
  ) {
    super(err, msg, args);
  }

  serialize(): ErrorInterfaces.SerializeResult {
    return {
      context: "authentication"
    };
  }
}

export = AuthenticationError;
