# ngHashi - Backend

## Key features

* ...

## Built With

* [ExpressJS](http://expressjs.com/) - Server software
* [NPM](https://www.npmjs.com/) - Dependency Management

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
