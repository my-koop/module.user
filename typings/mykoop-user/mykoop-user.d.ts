// Type definitions for module v0.0.0
// Project: https://github.com/my-koop/service.website
// Definitions by: Michael Ferris <https://github.com/Cellule/>
// Definitions: https://github.com/my-koop/type.definitions

/// <reference path="../mykoop/mykoop.d.ts" />
/// <reference path="./interfaces.d.ts" />
declare module mkuser {

  export interface UserProfile {
    email    : string;
    firstname: string;
    lastname : string;
    birthdate?: string;
    phone    ?: string;
    origin   ?: string;
    usageFrequency?: string;
    usageNote?: string;
    referral?: string;
  }

  export interface Module extends mykoop.IModule {
    tryLogin(email: string, passwordHash: string, callback: (err: Error, result: boolean) => void): void;
    getProfile(id: number, callback: (err: Error, result: UserProfile) => void): void;
    registerNewUser(profile: UserInterfaces.RegisterNewUser, callback: (err: Error, result: boolean) => void ) : void;
  }

}

