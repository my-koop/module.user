// Type definitions for module v0.0.0
// Project: https://github.com/my-koop/service.website
// Definitions by: Michael Ferris <https://github.com/Cellule/>
// Definitions: https://github.com/my-koop/type.definitions

/// <reference path="../mykoop/mykoop.d.ts" />
/// <reference path="./interfaces.d.ts" />
/// <reference path="./dbQueryStruct.d.ts" />
declare module mkuser {

  export interface LoginResponse {
    id: number;
    email: string;
  }

  export interface UserProfile {
    email          ?: string;
    firstname      ?: string;
    lastname       ?: string;
    birthdate      ?: Date;
    phone          ?: string;
    origin         ?: string;
    usageFrequency ?: string;
    usageNote      ?: string;
    referral       ?: string;
    referralSpecify?: string;
  }

  export interface Module extends mykoop.IModule {
    login(
      loginInfo: UserInterfaces.LoginRequestData,
      callback: (err: Error, result?: LoginResponse
    ) => void): void;
    getProfile(id: number, callback: (err: Error, result: UserProfile) => void): void;
    registerNewUser(profile: UserInterfaces.RegisterNewUser, callback: (err: Error, result: boolean) => void ) : void;
    updateProfile(id:number, profile: mkuser.UserProfile, callback: (err: Error, result: boolean) => void ) : void;
    updatePassword(id:number, passwords:UserInterfaces.updatePassword, callback: (err: Error) => void) : void;
    // id is -1 if not found
    __getIdForEmail(connection: mysql.IConnection, params: {email: string}, callback: (err, id: number) => void);
    getIdForEmail(params: {email: string}, callback: (err, id: number) => void);
  }

}

