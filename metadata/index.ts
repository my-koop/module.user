import utils = require("mykoop-utils");
import routes = require("./routes");
var translations = require("../locales");
import endpoints = require("./endpoints");
import permissions = require("./permissions");
import adminEditPlugins = require("./adminEditPlugins");
import uiHooks = require("./uiHooks");

var metaDataBuilder = new utils.MetaDataBuilder();
routes.addRoutes(metaDataBuilder);

metaDataBuilder.addData("translations", translations);
metaDataBuilder.addData("endpoints", endpoints);
metaDataBuilder.addData("permissions", permissions);
metaDataBuilder.addData("adminEditPlugins", adminEditPlugins);
metaDataBuilder.addData("uihooks", uiHooks);

var resMetaData = metaDataBuilder.get();
export = resMetaData;
