import utils = require("mykoop-utils");
import routes = require("./routes");
var translations = require("../locales");
import endpoints = require("./endpoints");

var metaDataBuilder = new utils.MetaDataBuilder();
routes.addRoutes(metaDataBuilder);

metaDataBuilder.addData("translations", translations);
metaDataBuilder.addData("endpoints", endpoints);

var resMetaData = metaDataBuilder.get();
export = resMetaData;
