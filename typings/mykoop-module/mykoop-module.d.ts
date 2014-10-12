// Type definitions for module v0.0.0
// Project: https://github.com/my-koop/service.website
// Definitions by: Michael Ferris <https://github.com/Cellule/>
// Definitions: https://github.com/my-koop/type.definitions

/// <reference path="../mykoop/mykoop.d.ts" />

// Rename mykoop-module to your purpose
declare module "mykoop-module" {
  import mykoop = require("mykoop");

  export class Module implements mykoop.IModule{
    method1(par1: string): string;
  }

}

