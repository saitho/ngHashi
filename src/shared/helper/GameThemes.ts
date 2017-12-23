import {SushiDesign} from "../../app/game/Designs/SushiDesign";
import {ClassicDesign} from "../../app/game/Designs/ClassicDesign";
import {AbstractDesign, IDesignConfig} from "../../app/game/Designs/AbstractDesign";
import {WurzelimperiumDesign} from "../../app/game/Designs/WurzelimperiumDesign";

export class GameThemes {
  private static themes: {} = {
    'Nikoli Classic': ClassicDesign,
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
