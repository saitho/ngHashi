# ngHashi - Frontend

## Key features

* 4 Hashi levels (maps)
  * progress saved within window (lost when refreshing the page)
  * timer that tracks how long you spent on a level
  * print levels if you want to solve them on the go or give them to your kids
* Hashi editor for creating own maps
  * Map validity checking through depth search
  * Import and export created maps (JSON)
  * Send in your levels to GitHub
* works on computers and tablets

## Built With

* [Angular 5](https://angular.io/) - The web framework used
* [NPM](https://www.npmjs.com/) - Dependency Management
* [Bootstrap](https://getbootstrap.com/) - Styling
* [ngBootstrap](https://ng-bootstrap.github.io) - Bootstrap components for use with Angular
* [Font Awesome](http://fontawesome.io/) - Icons

## Authors

* **Mario Lubenka** - *Initial work* - [saitho](https://github.com/saitho)

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