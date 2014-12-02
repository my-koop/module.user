declare module mkuser {
  module RegisterNewUser {
    export interface Params {
      email: string;
      firstname: string;
      lastname: string;
      birthdate?: string;
      phone?: string;
      origin?: string;
      usageFrequency?: string;
      usageNote?: string;
      referral?: string;
      passwordToHash: string;
      confPassword: string;
    }
    export interface CallbackResult {
      id: number;
    }
    export interface Callback {
      (err: Error, result?: CallbackResult): void;
    }
  }

  module GetIdForEmail {
    export interface Params {
      email: string;
    }
    export interface CallbackResult extends Number {
      // id is -1 if not found
    }
    export interface Callback {
      (err: Error, result?: CallbackResult): void;
    }
  }
}

declare module UserInterfaces {

  export interface LoginRequestData {
    email: string;
    password: string;
  }
  export interface updatePassword {
    oldPassword: string;
    newPassword: string;
    confNewPassword: string;
  }
}

declare module User {
  module IdExists {
    export interface Params {
      id: number;
    }
    export interface Callback {
      (err?) : void;
    }
  }
}
