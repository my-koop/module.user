/// <reference path="typings/tsd.d.ts" />
import index = require("./lib/bridge");

import getUserEmail = require("./lib/frontend/getUserEmail");
import logoutUser = require("./lib/frontend/logoutUser");
import validatePermissions = require("./lib/common/validatePermissions");

export = index;
