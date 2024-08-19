import { first, of } from "rxjs";
import providers, { IStorageProvider } from "..";
import { BackgroundColor, BsThemes, IGeneralSettings, IPaginationSettings, ISearchSettings, ISettings, IThemeSettings, ListContainerType, PaginationType } from "../../models";
import localSettingsProvider from '../LocalSettingsProvider';
import { State } from "../../context";

const testData = {
  general: {
    isConfirmEnabled: true,
    isPaginationEnabled: true,
    isInfiniteScrollEnabled: false,
    listSizeType: ListContainerType.Fixed,
    fixedListSize: 400
  } as IGeneralSettings,
  search: {
    isSearchOnKeyPressEnabled: false,
    debounceTime: 600
  } as ISearchSettings,
  pagination: {
    paginationType: PaginationType.Rotate,
    maxVisiblePages: 5
  } as IPaginationSettings,
  theme: {
    backgroundColor: BackgroundColor.LightGray,
    primaryColor: '#ff9900',
    bsTheme: BsThemes.Light,
    primaryColorTopCord: -35,
    primaryColorLefCord: 135
  } as IThemeSettings
} as ISettings;

let localStorageProvider: IStorageProvider;

beforeEach(() => {
  localStorageProvider = {
    getItem: jest.fn().mockImplementation(() => of(JSON.stringify(testData))),
    setItem: jest.fn().mockImplementation(() => of({}))
  } as unknown as IStorageProvider;
  jest.spyOn(providers.storageProvider, 'getItem').mockImplementation(localStorageProvider.getItem);
  jest.spyOn(providers.storageProvider, 'setItem').mockImplementation(localStorageProvider.setItem);
});

describe('LocalSettingsProvider', () => {
  it('loadSettings', (done) => {
    localSettingsProvider.loadSettings()
    .pipe(first())
    .subscribe((settings: ISettings) => {
      expect(settings !== null).toBeTruthy();
      expect(settings).toEqual(testData);
      done();
    }); 
  }, 100);

  it('loadSettings case no data', (done) => {
    jest.spyOn(providers.storageProvider, 'getItem').mockImplementation(jest.fn().mockImplementation(() => of(undefined)));
    localSettingsProvider.loadSettings()
    .pipe(first())
    .subscribe((settings: ISettings) => {
      expect(settings !== null).toBeTruthy();
      expect(settings).toEqual((new State([])).settings as ISettings);
      done();
    }); 
  }, 100);

  it('saveSettings', (done) => {
    localSettingsProvider.saveSettings(testData)
    .pipe(first())
    .subscribe(() => {
      expect(localStorageProvider.setItem).toBeCalledWith('todo-settings', testData);
      done();
    }); 
  }, 100);
});