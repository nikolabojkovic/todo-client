import { BackgroundColor, BsThemes, Themes } from "../models";
import { applyTheme } from "./applyTheme";
import { shadeColor } from "./shadeColor";


describe('applyTheme', () => {
  it('apply dark gray theme', () => {
    const root = {style: { setProperty: jest.fn()}} as any;
    const theme = {bsTheme: BsThemes.Dark, backgroundColor: BackgroundColor.DarkGray, primaryColor: '#ff0000'};

    applyTheme(theme, root);
    
    expect(root.style.setProperty).toBeCalledWith('--text-secondary-color', theme.primaryColor);
    expect(root.style.setProperty).toBeCalledWith('--text-secondary-color-light', shadeColor(theme.primaryColor, 20));
    expect(root.style.setProperty).toBeCalledWith('--background-primary-color', Themes.dark.gray.backgroundPrimaryColor);
    expect(root.style.setProperty).toBeCalledWith('--background-secondary-color', Themes.dark.gray.backgroundSecondaryColor);
    expect(root.style.setProperty).toBeCalledWith('--background-secondary-color-1', Themes.dark.gray.backgroundSecondaryColor1);
    expect(root.style.setProperty).toBeCalledWith('--background-ternary-color', Themes.dark.gray.backgroundTernaryColor);
    expect(root.style.setProperty).toBeCalledWith('--background-ternary-color-1', Themes.dark.gray.backgroundTernaryColor1);
    expect(root.style.setProperty).toBeCalledWith('--background-ternary-color-2', Themes.dark.gray.backgroundTernaryColor2);
   
    expect(root.style.setProperty).toBeCalledWith('--text-primary-color', Themes.dark?.textPrimaryColor);
    expect(root.style.setProperty).toBeCalledWith('--text-ternary-color', Themes.dark?.textTernaryColor);
    expect(root.style.setProperty).toBeCalledWith('--text-ternary-color-2', Themes.dark?.textTernaryColor2);
  });

  it('apply dark blue theme', () => {
    const root = {style: { setProperty: jest.fn()}} as any;
    const theme = {bsTheme: BsThemes.Dark, backgroundColor: BackgroundColor.DarkBlue, primaryColor: '#ff0000'};

    applyTheme(theme, root);
    
    expect(root.style.setProperty).toBeCalledWith('--text-secondary-color', theme.primaryColor);
    expect(root.style.setProperty).toBeCalledWith('--text-secondary-color-light', shadeColor(theme.primaryColor, 20));
    expect(root.style.setProperty).toBeCalledWith('--background-primary-color', Themes.dark.blue.backgroundPrimaryColor);
    expect(root.style.setProperty).toBeCalledWith('--background-secondary-color', Themes.dark.blue.backgroundSecondaryColor);
    expect(root.style.setProperty).toBeCalledWith('--background-secondary-color-1', Themes.dark.blue.backgroundSecondaryColor1);
    expect(root.style.setProperty).toBeCalledWith('--background-ternary-color', Themes.dark.blue.backgroundTernaryColor);
    expect(root.style.setProperty).toBeCalledWith('--background-ternary-color-1', Themes.dark.blue.backgroundTernaryColor1);
    expect(root.style.setProperty).toBeCalledWith('--background-ternary-color-2', Themes.dark.blue.backgroundTernaryColor2);
   
    expect(root.style.setProperty).toBeCalledWith('--text-primary-color', Themes.dark?.textPrimaryColor);
    expect(root.style.setProperty).toBeCalledWith('--text-ternary-color', Themes.dark?.textTernaryColor);
    expect(root.style.setProperty).toBeCalledWith('--text-ternary-color-2', Themes.dark?.textTernaryColor2);
  });

  it('apply dark red theme', () => {
    const root = {style: { setProperty: jest.fn()}} as any;
    const theme = {bsTheme: BsThemes.Dark, backgroundColor: BackgroundColor.DarkRed, primaryColor: '#ff0000'};

    applyTheme(theme, root);
    
    expect(root.style.setProperty).toBeCalledWith('--text-secondary-color', theme.primaryColor);
    expect(root.style.setProperty).toBeCalledWith('--text-secondary-color-light', shadeColor(theme.primaryColor, 20));
    expect(root.style.setProperty).toBeCalledWith('--background-primary-color', Themes.dark.red.backgroundPrimaryColor);
    expect(root.style.setProperty).toBeCalledWith('--background-secondary-color', Themes.dark.red.backgroundSecondaryColor);
    expect(root.style.setProperty).toBeCalledWith('--background-secondary-color-1', Themes.dark.red.backgroundSecondaryColor1);
    expect(root.style.setProperty).toBeCalledWith('--background-ternary-color', Themes.dark.red.backgroundTernaryColor);
    expect(root.style.setProperty).toBeCalledWith('--background-ternary-color-1', Themes.dark.red.backgroundTernaryColor1);
    expect(root.style.setProperty).toBeCalledWith('--background-ternary-color-2', Themes.dark.red.backgroundTernaryColor2);
   
    expect(root.style.setProperty).toBeCalledWith('--text-primary-color', Themes.dark?.textPrimaryColor);
    expect(root.style.setProperty).toBeCalledWith('--text-ternary-color', Themes.dark?.textTernaryColor);
    expect(root.style.setProperty).toBeCalledWith('--text-ternary-color-2', Themes.dark?.textTernaryColor2);
  });

  it('apply light gray theme', () => {
    const root = {style: { setProperty: jest.fn()}} as any;
    const theme = {bsTheme: BsThemes.Light, backgroundColor: BackgroundColor.LightGray, primaryColor: '#ff0000'};

    applyTheme(theme, root);
    
    expect(root.style.setProperty).toBeCalledWith('--text-secondary-color', theme.primaryColor);
    expect(root.style.setProperty).toBeCalledWith('--text-secondary-color-light', shadeColor(theme.primaryColor, 20));
    expect(root.style.setProperty).toBeCalledWith('--background-primary-color', Themes.light.gray.backgroundPrimaryColor);
    expect(root.style.setProperty).toBeCalledWith('--background-secondary-color', Themes.light.gray.backgroundSecondaryColor);
    expect(root.style.setProperty).toBeCalledWith('--background-secondary-color-1', Themes.light.gray.backgroundSecondaryColor1);
    expect(root.style.setProperty).toBeCalledWith('--background-ternary-color', Themes.light.gray.backgroundTernaryColor);
    expect(root.style.setProperty).toBeCalledWith('--background-ternary-color-1', Themes.light.gray.backgroundTernaryColor1);
    expect(root.style.setProperty).toBeCalledWith('--background-ternary-color-2', Themes.light.gray.backgroundTernaryColor2);
   
    expect(root.style.setProperty).toBeCalledWith('--text-primary-color', Themes.light?.textPrimaryColor);
    expect(root.style.setProperty).toBeCalledWith('--text-ternary-color', Themes.light?.textTernaryColor);
    expect(root.style.setProperty).toBeCalledWith('--text-ternary-color-2', Themes.light?.textTernaryColor2);
  });

  it('apply light blue theme', () => {
    const root = {style: { setProperty: jest.fn()}} as any;
    const theme = {bsTheme: BsThemes.Light, backgroundColor: BackgroundColor.LightBlue, primaryColor: '#ff0000'};

    applyTheme(theme, root);
    
    expect(root.style.setProperty).toBeCalledWith('--text-secondary-color', theme.primaryColor);
    expect(root.style.setProperty).toBeCalledWith('--text-secondary-color-light', shadeColor(theme.primaryColor, 20));
    expect(root.style.setProperty).toBeCalledWith('--background-primary-color', Themes.light.blue.backgroundPrimaryColor);
    expect(root.style.setProperty).toBeCalledWith('--background-secondary-color', Themes.light.blue.backgroundSecondaryColor);
    expect(root.style.setProperty).toBeCalledWith('--background-secondary-color-1', Themes.light.blue.backgroundSecondaryColor1);
    expect(root.style.setProperty).toBeCalledWith('--background-ternary-color', Themes.light.blue.backgroundTernaryColor);
    expect(root.style.setProperty).toBeCalledWith('--background-ternary-color-1', Themes.light.blue.backgroundTernaryColor1);
    expect(root.style.setProperty).toBeCalledWith('--background-ternary-color-2', Themes.light.blue.backgroundTernaryColor2);
   
    expect(root.style.setProperty).toBeCalledWith('--text-primary-color', Themes.light?.textPrimaryColor);
    expect(root.style.setProperty).toBeCalledWith('--text-ternary-color', Themes.light?.textTernaryColor);
    expect(root.style.setProperty).toBeCalledWith('--text-ternary-color-2', Themes.light?.textTernaryColor2);
  });

  it('apply light blue theme', () => {
    const root = {style: { setProperty: jest.fn()}} as any;
    const theme = {bsTheme: BsThemes.Light, backgroundColor: BackgroundColor.LightRed, primaryColor: '#ff0000'};

    applyTheme(theme, root);
    
    expect(root.style.setProperty).toBeCalledWith('--text-secondary-color', theme.primaryColor);
    expect(root.style.setProperty).toBeCalledWith('--text-secondary-color-light', shadeColor(theme.primaryColor, 20));
    expect(root.style.setProperty).toBeCalledWith('--background-primary-color', Themes.light.red.backgroundPrimaryColor);
    expect(root.style.setProperty).toBeCalledWith('--background-secondary-color', Themes.light.red.backgroundSecondaryColor);
    expect(root.style.setProperty).toBeCalledWith('--background-secondary-color-1', Themes.light.red.backgroundSecondaryColor1);
    expect(root.style.setProperty).toBeCalledWith('--background-ternary-color', Themes.light.red.backgroundTernaryColor);
    expect(root.style.setProperty).toBeCalledWith('--background-ternary-color-1', Themes.light.red.backgroundTernaryColor1);
    expect(root.style.setProperty).toBeCalledWith('--background-ternary-color-2', Themes.light.red.backgroundTernaryColor2);
   
    expect(root.style.setProperty).toBeCalledWith('--text-primary-color', Themes.light?.textPrimaryColor);
    expect(root.style.setProperty).toBeCalledWith('--text-ternary-color', Themes.light?.textTernaryColor);
    expect(root.style.setProperty).toBeCalledWith('--text-ternary-color-2', Themes.light?.textTernaryColor2);
  });

  it('do not apply theme when element is undefined', () => {
    const root = {style: { setProperty: jest.fn()}} as any;
    const theme = {bsTheme: BsThemes.Light, backgroundColor: BackgroundColor.LightRed, primaryColor: '#ff0000'};

    applyTheme(theme, null as unknown as HTMLElement);
    
    expect(root.style.setProperty).not.toBeCalledWith('--text-secondary-color', theme.primaryColor);
    expect(root.style.setProperty).not.toBeCalledWith('--text-secondary-color-light', shadeColor(theme.primaryColor, 20));
    expect(root.style.setProperty).not.toBeCalledWith('--background-primary-color', Themes.light.red.backgroundPrimaryColor);
    expect(root.style.setProperty).not.toBeCalledWith('--background-secondary-color', Themes.light.red.backgroundSecondaryColor);
    expect(root.style.setProperty).not.toBeCalledWith('--background-secondary-color-1', Themes.light.red.backgroundSecondaryColor1);
    expect(root.style.setProperty).not.toBeCalledWith('--background-ternary-color', Themes.light.red.backgroundTernaryColor);
    expect(root.style.setProperty).not.toBeCalledWith('--background-ternary-color-1', Themes.light.red.backgroundTernaryColor1);
    expect(root.style.setProperty).not.toBeCalledWith('--background-ternary-color-2', Themes.light.red.backgroundTernaryColor2);
   
    expect(root.style.setProperty).not.toBeCalledWith('--text-primary-color', Themes.light?.textPrimaryColor);
    expect(root.style.setProperty).not.toBeCalledWith('--text-ternary-color', Themes.light?.textTernaryColor);
    expect(root.style.setProperty).not.toBeCalledWith('--text-ternary-color-2', Themes.light?.textTernaryColor2);
  });
});

