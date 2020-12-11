## Docker Deployer
Generic deployer container to deploy to AWS. Mount configuration into container and run it to deploy a project.

It was forked off from digijin/docker-deployer to work better with Circle CI. 

## Usage
You'll need to create a volume and copy all the files to the `/deploy` folder
This should be called with a command similar to: 

```console
docker create -v /deploy --name artifact alpine:3.4 /bin/true
docker cp $PWD/. artifact:/deploy
docker run -e BEANSTALK_ENV='myenv' -e BUILD_NUMBER=213 eliaselmoujaber/docker-deployer
```

## Environment variables

Two variables are required, `BEANSTALK_ENV` and `BUILD_NUMBER`

#### BEANSTALK_ENV
This is the name of the environment in AWS
#### BUILD_NUMBER
This is used to enforce uniqueness in package naming when deploying to AWS (if you try deploy a version that already exists, AWS will just try redeploy the existing one rather than taking the new one)

Secrets can be injected through environment variables instead of secrets.json

#### ACCESS_KEY_ID
AWS Access key ID
#### SECRET_ACCESS_KEY
AWS Secret access key

## Copied Files

| file | purpose |
|--|--|
| /deploy/package.json | used for `name` and `version` |
| /deploy/secret.json | json file containing the `accessKeyId` and `secretAccessKey` for the account you are deploying to (this is not needed if using environment variables) |
| /deploy/package.zip | the artifact package you are deploying |
| /deploy/config/index.js | This should contain the AMI (e.g. `64bit Amazon Linux 2017.03 v2.7.4 running Multi-container Docker 17.03.1-ce (Generic)`), the region (e.g. `ap-southeast-2`) as well as a key for each environment, e.g. `{ stag: "stag config object", prod: "prod config object"}`.|


