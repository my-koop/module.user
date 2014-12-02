 declare module dbQueryStruct {

  export interface RegisterUser {
    email: string;
    firstname: string;
    lastname: string;
    birthdate?: string;
    phone?: string;
    origin?: string;
    usageFrequency?: string;
    usageNote?: string;
    referral?: string;
    pwdhash: string;
    salt: string;
    signupDate?: Date;
  }

  export interface NewNote {
    targetId: number;
    authorId: number;
    message: string;
  }
 }
