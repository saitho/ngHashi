# ngHashi

ngHashi is a Angular implementation of the Japanese puzzle game Hashi, originally designed by Nikoli.

## Key features

* 4 Hashi levels (maps)
  * progress saved within window (lost when refreshing the page)
  * timer that tracks how long you spent on a level
* Hashi editor for creating own maps
  * Map validity checking through depth search
  * Import and export created maps (JSON)
  * Send in your levels to GitHub

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

First of all you will need NodeJS - get it here: https://nodejs.org/en/
We recommend getting the latest version if you want to make sure the project runs well.

### Installing

Next you will require Angular CLI 1.6.1 in order to run the project locally.
Install Angular CLI via:

```
npm install -g @angular/cli
```

Then install the required dependencies using:

```
npm install
```

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Running the tests

### Unit Tests

No automated tests have been configured for this project yet.

### Coding style tests

This project uses TSLint. Run TSLint checks with the following command:

```
ng lint
```

Make sure to activate TSLint in your IDE if available.

## Deployment

Deploying the project usually involves building the project and deploying the build to the deployment server.
Build the project with `ng build` and deploy the generated dist/ folder to your server.

**Note:** Usually you are able to set the *--prod* flag in order to build the app for production. However there are issues with the game that makes it currently impossible to use that.

**Tip:** This deployment strategy was implemented for a deployment to Heroku using GitLab CI (see .gitlab-ci.yml).

## Built With

* [Angular 5](https://angular.io/) - The web framework used
* [NPM](https://www.npmjs.com/) - Dependency Management
* [Bootstrap](https://getbootstrap.com/) - Styling
* [ngBootstrap](https://ng-bootstrap.github.io) - Bootstrap components for use with Angular
* [Font Awesome](http://fontawesome.io/) - Icons

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/your/project/tags). 

## Authors

* **Mario Lubenka** - *Initial work* - [saitho](https://github.com/saitho)

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Workflows

### Adding a new Hashi puzzle from a GitHub issue

GitHub issues can be created after a Hashi puzzle was designed using the built in editor.

1. Verify the map can be solved by playing it yourself :)
   - Use the path given in the GitHub issue or base64-serialize the configuration and add it at the and of route /play/
  (e.g. /play/eyJ0a......)
   - (No validator to check puzzles or reimport them yet...)
2. Go to the folder src/_maps/ and create a new json file according to the level name
3. Copy the configuration from the GitHub issue (JSON) and add it into your newly created file
4. Open src/shared/services/GameLevelsService.ts and add the following line into Promise in the `loadMaps` method:
   - Replace *[FILENAME]* with the name of your JSON file
5. That's it - the level should appear in the level selection
```
this.loadMap("_maps/[FILENAME].json"),
```
