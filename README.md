MUAM
====
Welcome to Multimode User Authentication for Microservices. The intent when
this project grows up, it will support internal authentication as well as
authentication with a variety of external authentication providers, as well
as supporting existing LDAP servers. In its current form, it does only
internal authentication.

Another intent is that the server container can be embedded in multiple
microservice applications, providing shared user defintion across multiple
apps with or without an external provider.

Dependencies
------------
The actual detailed dependencies for MUAM are documented in the following
files:

* web/packages.json
* server/requirements.txt

However, it is worth noting that this project is built using multiple 
open-source framework components from Wittle South Ventures:

* [SMOACKS](https://github.com/Wittle-South-LLC/smoacks) - 
  Generates the python microservice framework and API client
* [openapi-rim-app](https://github.com/Wittle-South-LLC/openapi-rim-app) - 
  Generates the client application framework
* [redux-immutable-model](https://github.com/Wittle-South-LLC/redux-immutable-model) -
  Runtime library managing persistent data

Artifacts
---------
This project can produce a variety of artifacts as described below.

### Deployment
The muam directory at the root is a Helm chart capable of deploying the 
app in production. It is dependent on the server and client images being
published first.

### Server API client PyPi module
In the server directory, you can publish a PyPi package that contains
classes that act as an API client, as well as command line utilities for
creating / importing users and groups.

To build the PyPi image, in the server directory:

* `rm dist/*`
* `python setup bdist_wheel`
* `twine upload -r local dist/*`

The intent of the PyPi image is to enable command-line manipulation of
MUAM objects within projects that integrate MUAM as a microservice.

### Client Container Image
To build the client container image, do the following in the web directory.

* `npm build`
* `docker build --tag=wittlesouth/muam-client:latest .`
* `docker push wittlesouth/muam-client:latest`

### Server Container Image
To build the server container, do the following in the server directory.

* `docker build --tag=wittlesouth/muam:latest .`
* `docker push wittlesouth/muam:latest`
