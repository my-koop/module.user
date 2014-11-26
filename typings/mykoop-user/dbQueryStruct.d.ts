 declare module dbQueryStruct {

  export interface RegisterUser {
    email: string;
    firstname: string;
    lastname: string;
    birthdate?: Date;
    phone?: string;
    origin?: string;
    usageFrequency?: string;
    usageNote?: string;
    referral?: string;
    pwdhash: string;
    salt: string;
    signupDate: Date;
  }

  export interface NewNote {
    targetId: number;
    date: Date;
    authorId: number;
    message: string;
  }
 }