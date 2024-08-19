import { BackgroundColor, BsThemes, Themes } from "../models";
import { shadeColor } from "./shadeColor";

export function applyTheme(theme: any, element: HTMLElement) {

  if (!element) {
    return;
  }
  
  let appTheme: any = {};
  const bsTheme: any = theme.bsTheme === BsThemes.Dark ? Themes.dark : Themes.light;

  switch(theme.backgroundColor) {
    case BackgroundColor.DarkGray:
      appTheme = Themes.dark.gray;
    break;
    case BackgroundColor.DarkBlue:
      appTheme = Themes.dark.blue; 
    break;
    case BackgroundColor.DarkRed: 
      appTheme = Themes.dark.red;
    break;
    case BackgroundColor.LightGray:
      appTheme = Themes.light.gray;
    break;
    case BackgroundColor.LightBlue:
      appTheme = Themes.light.blue; 
    break;
    case BackgroundColor.LightRed: 
      appTheme = Themes.light.red;
    break;
  }

  element.style.setProperty('--text-secondary-color', theme.primaryColor);
  element.style.setProperty('--text-secondary-color-light', shadeColor(theme.primaryColor, 20));

  element.style.setProperty('--background-primary-color', appTheme.backgroundPrimaryColor);
  element.style.setProperty('--background-secondary-color', appTheme.backgroundSecondaryColor);
  element.style.setProperty('--background-secondary-color-1', appTheme.backgroundSecondaryColor1);
  element.style.setProperty('--background-ternary-color', appTheme.backgroundTernaryColor);
  element.style.setProperty('--background-ternary-color-1', appTheme.backgroundTernaryColor1);
  element.style.setProperty('--background-ternary-color-2', appTheme.backgroundTernaryColor2);

  element.style.setProperty('--text-primary-color', bsTheme?.textPrimaryColor);
  element.style.setProperty('--text-ternary-color', bsTheme?.textTernaryColor);
  element.style.setProperty('--text-ternary-color-2', bsTheme?.textTernaryColor2);
}