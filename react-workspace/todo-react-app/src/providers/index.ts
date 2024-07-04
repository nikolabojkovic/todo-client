export * from './LocalSettingsProvider';
export * from './StorageProvider';
export * from './TodoProvider';
export { default as settingsProvider } from './LocalSettingsProvider';
export { default as storageProvider } from './StorageProvider';
export { default as todoProvider } from './TodoProvider';

import settingsProvider from './LocalSettingsProvider';
import storageProvider from './StorageProvider';
import todoProvider from './TodoProvider';

export default {
  settingsProvider: settingsProvider,
  storageProvider: storageProvider,
  todoListProvider: todoProvider
};