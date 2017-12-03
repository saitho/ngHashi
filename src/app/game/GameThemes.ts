import {SushiDesign} from "./Designs/SushiDesign";
import {DefaultDesign} from "./Designs/DefaultDesign";
import {AbstractDesign, IDesignConfig} from "./Designs/AbstractDesign";
import {WurzelimperiumDesign} from "./Designs/WurzelimperiumDesign";

export class GameThemes {
  private static themes: {} = {
    'Default': DefaultDesign,
    'Sushi': SushiDesign,
    'Wurzelimperium': WurzelimperiumDesign,
  };

  public static getThemes(): string[] {
    return Object.keys(this.themes);
  }

  public static getTheme(themeName: string, args: {canvas; canvasBg; config: IDesignConfig}|AbstractDesign): AbstractDesign {
    if (args instanceof AbstractDesign) {
      return new this.themes[themeName](args);
    }
    return new this.themes[themeName](args.canvas, args.canvasBg, args.config);
  }
}
