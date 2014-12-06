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
    perms: any;
  }

  export interface UserProfile {
    email          ?: string;
    firstname      ?: string;
    lastname       ?: string;
    birthdate      ?: string;
    phone          ?: string;
    origin         ?: string;
    usageFrequency ?: string;
    usageNote      ?: string;
    referral       ?: string;
    referralSpecify?: string;
    permissions    ?: any;
  }

  export interface Module extends mykoop.IModule {
    userExists(
      params: User.IdExists.Params,
      callback: User.IdExists.Callback
    );
    __userExists(
      connection: mysql.IConnection,
      params: User.IdExists.Params,
      callback: User.IdExists.Callback
    );
    login(
      loginInfo: UserInterfaces.LoginRequestData,
      callback: (err: Error, result?: LoginResponse
    ) => void): void;
    getProfile(id: number, callback: (err: Error, result: UserProfile) => void): void;
    registerNewUser(
      profile: RegisterNewUser.Params,
      callback: RegisterNewUser.Callback
    );
    __registerNewUser(
      connection: mysql.IConnection,
      profile: RegisterNewUser.Params,
      callback: RegisterNewUser.Callback
    );
    updateProfile(id:number, profile: UserProfile, callback: (err: Error, result: boolean) => void ) : void;
    updatePassword(id:number, passwords:UserInterfaces.updatePassword, callback: (err: Error) => void) : void;
    getIdForEmail(
      params: GetIdForEmail.Params,
      callback: GetIdForEmail.Callback
    );
    __getIdForEmail(
      connection: mysql.IConnection,
      params: GetIdForEmail.Params,
      callback: GetIdForEmail.Callback
    );
    resetPassword(email, callback: (err: Error) => void) : void;
    getUsersList(params:{}, callback: (err, users) => void);
    __getUsersList(connection: mysql.IConnection, params: {}, callback: (err, users) => void);
    getNotesForId(params: {id: number}, callback: (err, notes) => void);
    __getNotesForId(connection: mysql.IConnection, params, callback);
    newNote(params: dbQueryStruct.NewNote, callback: (err: Error) => void);
    __newNote(connection: mysql.IConnection, params: dbQueryStruct.NewNote, callback);

    userActivation(
      params: mkuser.UserActivation.Params,
      callback: mkuser.UserActivation.Callback
    );
    __userActivation(
      connection: mysql.IConnection,
      params: mkuser.UserActivation.Params,
      callback: mkuser.UserActivation.Callback
    );
  }
}

