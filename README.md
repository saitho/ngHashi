# Project

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.9.

## Angular command list

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

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
