import utils = require("mykoop-utils");
import routes = require("./routes");
var translations = require("../locales/index");
import endpoints = require("./endpoints");

var metaData = new utils.MetaData();
routes.addRoutes(metaData);

metaData.addData("translations", translations);
metaData.addData("endpoints", endpoints);

var resMetaData = metaData.get();
export = resMetaData;
