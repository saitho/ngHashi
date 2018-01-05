# ngHashi

ngHashi is a Angular-based interpretation of the Japanese puzzle game Hashi, originally designed by Nikoli.
It consists of an Angular frontend and a NodeJS backend.

## Prerequisites

First of all you will need NodeJS - get it here: https://nodejs.org/en/  
We recommend getting the latest version if you want to make sure the project runs well.

You can install the dependencies for both backend and frontend with this command:

```
npm install
```

## Running the frontend dev server

Next you will require Angular CLI 1.6.1 in order to run the project locally.
Install Angular CLI via:

```
npm install -g @angular/cli
```

Install the required dependencies if you haven't already done that:

```
npm run-script install:frontend
```

Run `npm run-script start:frontend` for a frontend dev server. Navigate to `http://localhost:4200/`.  
The app will automatically reload if you change any of the source files.

## Installing the backend dev server

Install the required dependencies if you haven't already done that:

```
npm run-script install:backend
```

Run `npm run-script start:backend` for a backend dev server. Navigate to `http://localhost:3000/`.
The app will automatically reload if you change any of the source files.

## Running the tests

### Unit Tests

No automated tests have been configured for this project yet.

### Coding style tests

This project uses TSLint. Run TSLint checks with one of the following commands:

```
npm run-script lint:backend
```

```
npm run-script lint:frontend
```

Make sure to activate TSLint in your IDE if available.

## Deployment

The Angular frontend app will be served via the backend's Express server in production mode.
For that the compiled Angular app has to be placed into the folder *frontend_dist/* inside the backend's *dist/* folder.

1. Run npm `npm run-script build` to build the applications. This will generate a */dist* folder for each project.
2. Copy the contents of the folder `frontend/dist/` ito `backend/dist/dist_frontend`.
3. Deploy the folder `backend/dist/` onto your server.

**Note:** Usually you are able to set the *--prod* flag in order to build the app for production. However there are issues with the game that makes it currently impossible to use that.

**Tip:** This deployment strategy was implemented for a deployment to Heroku using GitLab CI (see .gitlab-ci.yml).

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Mario Lubenka** - *Initial work* - [saitho](https://github.com/saitho)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
