class UserModuleControllers {
  private moduleManager: mykoop.ModuleManager;
  private user: mkuser.Module;
  private routerModule: mykoop.Router;

  constructor(user: mkuser.Module) {
    this.user = user;
    this.moduleManager = this.user.getModuleManager();
    this.routerModule = <mykoop.Router>this.moduleManager.get("router");
  }

  attach(
    params: mykoop.RouteParams,
    controller: (
      req: express.Request,
      res: express.Response,
      next?: Function
    ) => void
  ) {
    this.routerModule.addRoute(params, controller.bind(this.user));
  }
}

export = UserModuleControllers;
