// import * as React from "react";

// type SettingType = "select" | "checkbox" | "text" | "radio";

// interface PluginSetting {
//   defaultLabel: string;
//   description?: string;
//   type: SettingType;
//   defaultValue: any;
// }

// interface PluginOptions {
//   name: string;
//   settings: { [settingName: string]: PluginSetting };
//   tabSettings?: { [settingName: string]: PluginSetting };
//   pluginComponents?: React.SFC[];
//   panelTabComponents?: React.SFC[];
//   settingsTabComponents?: React.SFC[];
// }

// interface PluginInstance {
//   enabled: boolean;
//   plugin: PluginOptions;
// }

// type PluginSettings = { [pluginName: string]: PluginSetting };

// export default class PluginManager {
//   plugins: PluginOptions[];
//   defaultSettings: PluginSettings;
//   constructor(plugins: PluginOptions[], defaultSettings: PluginSettings) {
//     this.plugins = plugins;
//     this.defaultSettings = defaultSettings;
//     this.ensureInstalled(plugins)
//     this.ensureEnabled(defaultSettings);
//     this.getKeybindings();
//     this.getSettings(defaultSettings);
//   }
//   public getAvailablePlugins() {}
//   public getPlugin(pluginName: string): PluginInstance | boolean {
//     const plugin = this.plugins.find(({ name }) => pluginName === name);
//     if (plugin) {
//       return plugin;
//     }
//     return false;
//   }
//   public ensureEnabled(settings: PluginSettings) {

//   }
//   async ensureInstalled(plugin: Plugin) {
//     if (this.isInstalled(plugin)) {
//       return true;
//     }
//     return installPlugin(plugin);
//   }
//   isInstalled(plugin: PluginOptions) {
//     return this.getPlugin(plugin.name).installed;
//   }
//   private async installPlugin(plugin: Plugin, options: PluginInstance) {
//     try {
//       const module = await import(plugin.name);
//       return module;
//     } catch (err) {
//       console.error(`There was an error installing plugin ${plugin.name}`);
//     }
//   }
// }
