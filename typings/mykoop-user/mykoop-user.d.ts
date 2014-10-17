/// <reference path="../mykoop/mykoop.d.ts" />

declare module mykoop {
  export interface IModule {}
}

declare module mykoopuser {
  
  export class Module implements mykoop.IModule{
    get(): string;
  }

}