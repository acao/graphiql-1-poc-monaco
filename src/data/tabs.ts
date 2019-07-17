import { IoIosApps, IoMdKeypad, IoIosFiling, IoMdCog, IoMdOptions, IoMdBook, IoMdRewind } from "react-icons/io";

export const tabs = [
  {
    id: "docs",
    defaultLabel: "Docs",
    icon: IoMdBook
  },
  {
    id: "collection",
    defaultLabel: "Project Collection",
    icon: IoIosFiling
  },
  {
    id: "history",
    defaultLabel: "History",
    icon: IoMdRewind
  },
  {
    id: "project-settings",
    defaultLabel: "Project Settings",
    icon: IoMdOptions
  },
  {
    id: "settings",
    defaultLabel: "Settings",
    icon: IoMdCog
  },
  {
    id: "keys",
    defaultLabel: "Keybindings",
    icon: IoMdKeypad
  },
  {
    id: "plugins",
    defaultLabel: "Plugins",
    icon: IoIosApps
  }
]
