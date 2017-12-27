import {SushiDesign} from "../../_designs/SushiDesign";
import {ClassicDesign} from "../../_designs/ClassicDesign";
import {AbstractDesign, IDesignConfig} from "../../app/game/Designs/AbstractDesign";
import {WurzelimperiumDesign} from "../../_designs/WurzelimperiumDesign";
import {CircuitTalentDesign} from "../../_designs/CircuitTalentDesign";

export class GameThemes {
  private static themes: {} = {
    'Nikoli Classic': ClassicDesign,
    'Circuit-Talent': CircuitTalentDesign,
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
