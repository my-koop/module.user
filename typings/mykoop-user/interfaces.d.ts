declare module UserInterfaces {

  export interface RegisterNewUser {
    email: string;
    firstname: string;
    lastname: string;
    birthdate?: Date;
    phone?: string;
    origin?: string;
    usageFrequency?: string;
    usageNote?: string;
    referral?: string;
    passwordToHash: string;
    confPassword: string;
  }
  export interface LoginRequestData {
    email: string;
    password: string;
  }
}
