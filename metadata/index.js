var utils = require("mykoop-utils");
var routes = require("./routes");
var translations = require("../locales");
var endpoints = require("./endpoints");
var permissions = require("./permissions");
var contributions = require("./contributions");
var uiHooks = require("./uiHooks");
var metaDataBuilder = new utils.MetaDataBuilder();
routes.addRoutes(metaDataBuilder);
metaDataBuilder.addData("translations", translations);
metaDataBuilder.addData("endpoints", endpoints);
metaDataBuilder.addData("permissions", permissions);
metaDataBuilder.addData("contributions", contributions);
metaDataBuilder.addData("uihooks", uiHooks);
var resMetaData = metaDataBuilder.get();
module.exports = resMetaData;
