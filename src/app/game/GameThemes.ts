import {SushiDesign} from "./Designs/SushiDesign";
import {DefaultDesign} from "./Designs/DefaultDesign";
import {AbstractDesign, IDesignConfig} from "./Designs/AbstractDesign";

export class GameThemes {
  private static themes = {
    'Default': DefaultDesign,
    'Sushi': SushiDesign,
  };

  public static getTheme(themeName: string, args: {canvas; config: IDesignConfig}|AbstractDesign) {
    if (args instanceof AbstractDesign) {
      return new this.themes[themeName](args);
    }
    return new this.themes[themeName](args.canvas, args.config);
  }
}
