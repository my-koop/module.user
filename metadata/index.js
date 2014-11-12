var utils = require("mykoop-utils");
var routes = require("./routes");
var translations = require("../locales");
var endpoints = require("./endpoints");

var metaDataBuilder = new utils.MetaDataBuilder();
routes.addRoutes(metaDataBuilder);

metaDataBuilder.addData("translations", translations);
metaDataBuilder.addData("endpoints", endpoints);

var resMetaData = metaDataBuilder.get();
module.exports = resMetaData;
