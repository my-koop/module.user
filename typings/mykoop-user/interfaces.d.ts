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
  export interface updatePassword {
    oldPassword: string;
    newPassword: string;
    confNewPassword: string;
  }

  export interface TryLogin {
    email: string;
    password: string;
  }
}