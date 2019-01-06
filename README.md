## Docker Deployer

Generic deployer container. Mount configuration into container and run it to deploy a project.


Requirements:

keys should be mounted into /opt/deploy/keys

artifact file should be mounted into /opt/deploy/package.zip

config should be mounted into /opt/deploy/config/index.js
config should have a key for each environment, e.g. { stag: "stag config object", prod: "prod config object"}

package json should be mounted into /opt/deploy/package.json