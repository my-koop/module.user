/// <reference path="../mykoop/mykoop.d.ts" />

declare module "mykoop-user" {
  import mykoop = require("mykoop");

  export class Module implements mykoop.IModule{
    get(): string;
  }

}