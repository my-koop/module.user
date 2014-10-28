// Type definitions for module v0.0.0
// Project: https://github.com/my-koop/service.website
// Definitions by: Michael Ferris <https://github.com/Cellule/>
// Definitions: https://github.com/my-koop/type.definitions

/// <reference path="../mykoop/mykoop.d.ts" />
declare module mkuser {

  export class UserProfile {
    public email    : string;
    public firstname: string;
    public lastname : string;
    public birthdate: string;
    public phone    : string;
    public origin   : string;
  }

  export class Module implements mykoop.IModule {
    getModuleManager(): mykoop.ModuleManager;
    tryLogin(email: string, passwordHash: string, callback: (err: Error, result: boolean) => void): void;
    getSaltWithEmail(email: string, callback: (err: Error, result: string) => void): void;
    getSaltWithId(id: number, callback: (err: Error, result: string) => void): void;
    testEmailUnique(email: string, callback: (err: Error, result: boolean) => void): void;
    getProfile(id: number, callback: (err: Error, result: UserProfile) => void): void;
  }

}

