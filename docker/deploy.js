var Beanstalkify = require("beanstalkify");
var path = require("path");
var fs = require("fs");

var secretLocation = "/deploy/secret.json";
var configLocation = "/deploy/config/index.js";
var packageLocation = "/deploy/package.json";
var artifactLocation = "/deploy/package.zip";

//preflight checks
if (!fs.existsSync(artifactLocation)) {
  console.error("Error: Could not find artifact at " + artifactLocation);
  process.exit(1);
}



var accessKeyId = process.env.ACCESS_KEY_ID;
var secretAccessKey = process.env.SECRET_ACCESS_KEY;

if(!accessKeyId){
  
  if (!fs.existsSync(secretLocation)) {
    console.error("Error: Could not find secrets file at " + secretLocation);
    process.exit(1);
  }
  
  var secret = require("/deploy/secret");
  if (!secret.accessKeyId) {
    console.error("Error: /deploy/secret.json does not contain accessKeyId");
    process.exit(1);
  }
  if (!secret.secretAccessKey) {
    console.error(
      "Error: /deploy/secret.json does not contain secretAccessKey"
    );
    process.exit(1);
  }
  accessKeyId = secret.accessKeyId
  secretAccessKey = secret.secretAccessKey

}

if (!fs.existsSync(configLocation)) {
  console.error("Error: Could not find config file at " + configLocation);
  process.exit(1);
}
var config = require("/deploy/config");
var ami = config.ami;
if (!ami) {
  console.error("Error: config does not contain ami");
  process.exit(1);
}
var region = config.region;
if (!region) {
  console.error("Error: config does not contain region");
  process.exit(1);
}

var env = process.env.BEANSTALK_ENV;
if (!env) {
  console.error("Error: BEANSTALK_ENV environment variable has not been set");
  process.exit(1);
}
var buildNumber = process.env.BUILD_NUMBER;
if (!env) {
  console.error("Error: BUILD_NUMBER environment variable has not been set");
  process.exit(1);
}

var beanstalkConfig = config[env];
if (!beanstalkConfig) {
  console.error("Error: could not find environment " + env + " in config");
  process.exit(1);
}

if (!fs.existsSync(packageLocation)) {
  console.error(
    "Error: Could not find package.json file at " + packageLocation
  );
  process.exit(1);
}
var package = require(packageLocation);

var project = package.name;
if (!project) {
  console.error("Error: Could not find name in package.json");
  process.exit(1);
}

var version = package.version;
if (!version) {
  console.error("Error: Could not find version in package.json");
  process.exit(1);
}

version = version + "BUILD" + buildNumber;
env = project + "-" + env + "-env";

//give artifact proper name
var filepath = "/deploy/" + project + "-v" + version + ".zip";
fs.copyFileSync(artifactLocation, filepath)


console.log("preflight passed, deploying.")
// process.exit(0);


// Deploy
var beanstalk = new Beanstalkify({
  accessKeyId: accessKeyId,
  secretAccessKey: secretAccessKey,
  region: region
});

beanstalk
  .deploy({
    archiveFilePath: filepath,
    environmentName: env,
    awsStackName: ami,
    beanstalkConfig: beanstalkConfig
  })
  .then(
    function(data) {
      console.log(data); // {app_name: 'test-website', app_version: 'foo', env_name: 'test-website-prod', env_url: 'tech-website-12345.ap-southeast-2.elasticbeanstalk.com'}
    },
    function(reason) {
      console.warn(reason);
    }
  );

// Clean application versions
// application.cleanApplicationVersions('application name'); // Returns a promise
