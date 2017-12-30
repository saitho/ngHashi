import {SushiDesign} from "../../_designs/SushiDesign";
import {ClassicDesign} from "../../_designs/ClassicDesign";
import {AbstractDesign, IDesignConfig} from "../../_designs/AbstractDesign";
import {CircuitTalentDesign} from "../../_designs/CircuitTalentDesign";

export class GameThemes {
  private static themes: {} = {
    'Nikoli Classic': ClassicDesign,
    'Circuit-Talent': CircuitTalentDesign,
    'Sushi': SushiDesign,
  };

  public static getTheme(themeName: string, args: {canvas; canvasBg; config: IDesignConfig}|AbstractDesign): AbstractDesign {
    if (args instanceof AbstractDesign) {
      return new this.themes[themeName](args);
    }
    return new this.themes[themeName](args.canvas, args.canvasBg, args.config);
  }
}
