export * from './LocalSettingsProvider';
export * from './StorageProvider';
export * from './TodoProvider';

import settingsProvider from './LocalSettingsProvider';
import storageProvider from './StorageProvider';
import todoProvider from './TodoProvider';

export default {
  settingsProvider: settingsProvider,
  storageProvider: storageProvider,
  todoListProvider: todoProvider
};