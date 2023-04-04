// Import Leaflet into L in case you want to reference Leaflet types
import * as L from "leaflet";

// Declare the leaflet module so we can modify it
declare module "leaflet" {
  export interface IEasyPrintConstructorOptions {
    title?: string;
    position?: string;
    exportOnly?: boolean;
    hideControlContainer?: boolean;
    hidden?: boolean;
    sizeModes: string[];
  }

  export interface EasyPrint extends L.Control {
    printMap: (size: string, text: string) => void;
  }

  export function easyPrint(options?: IEasyPrintConstructorOptions): EasyPrint;
}
