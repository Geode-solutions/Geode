/*
 * Copyright (C) 2019 - 2020 Geode-solutions
 *
 * This file is a part of Geode library.
 *
 * This library is free software; you can redistribute it and/or
 * modify it under the terms of the GNU Lesser General Public
 * License as published by the Free Software Foundation; either
 * version 2.1 of the License, or (at your option) any later version.
 *
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
 * Lesser General Public License for more details.
 *
 */

import { app, protocol, BrowserWindow } from "electron";
import { spawn } from "child_process";
import {
  createProtocol,
  installVueDevtools,
} from "vue-cli-plugin-electron-builder/lib";
import fs from "fs";
import path from "path";
import { ipcMain } from "electron";
import log from "electron-log";

Object.assign(console, log.functions);
console.log("======================");

const isDevelopment = process.env.NODE_ENV !== "production";
const isWindows = process.platform === "win32";
const appRoot = isDevelopment
  ? path.join(__dirname, "..")
  : path.dirname(app.getPath("exe"));

const Store = require("electron-store");
const cwd = fs.existsSync(path.join(appRoot, "config.json"))
  ? appRoot
  : app.getPath("userData");
const store = new Store({
  cwd,
  schema: {
    port: {
      type: "number",
      default: 8119,
    },
    modules: {
      type: "array",
      default: [],
    },
  },
});

// ? process.env.PORTABLE_EXECUTABLE_DIR
// : process.env.APPDIR;
console.log("DIRNAME ".concat(appRoot));
console.log(app.getPath("userData"));
console.log(app.getPath("exe"));
console.log(app.getPath("temp"));
console.log(app.getAppPath());
console.log(process.env.PORTABLE_EXECUTABLE_DIR);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win = null;
let server = null;

// Standard scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

function makeModuleAbsolute(module) {
  if (!path.isAbsolute(module)) {
    module = path.join(cwd, module);
  }
  return module;
}

function createWindow() {
  if (win) {
    return;
  }
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  win.on("closed", () => {
    win = null;
    if (server) {
      server.kill();
    }
  });
}

function addAbsolutePathToArray(input, output, dir) {
  input.forEach((value) => {
    if (!path.isAbsolute(value)) {
      value = path.join(dir, value);
    }
    output.push(value);
  });
}

function startServer() {
  let PythonPath = [];
  let LibrariesPath = [];
  const serverPath = path.join(appRoot, "server");
  console.log("serverPath ".concat(serverPath));
  let serverArguments = [
    path.join(serverPath, "server.py"),
    "-p ".concat(store.get("port")),
  ];
  let vtkInstall;
  if (isDevelopment) {
    serverArguments.push("-d");
    const serverToolsPath = path.join(
      appRoot,
      "node_modules/@geode/geode-tools"
    );
    PythonPath.push(path.join(serverToolsPath, "server"));
    PythonPath.push(path.join(appRoot, "wslink"));
    vtkInstall = path.join(serverToolsPath, "build/vtk/install");
  } else {
    vtkInstall = path.join(serverPath, "vtk");
  }
  const vtkBin = path.join(vtkInstall, "bin");
  console.log("vtkInstall ".concat(vtkInstall));

  const readModule = (module, dir) => {
    if (module.name) {
      modules.push(module.name);
    }
    console.log("=", module.name, "=");
    if (module.python) {
      addAbsolutePathToArray(module.python, PythonPath, dir);
    }
    if (module.lib) {
      addAbsolutePathToArray(module.lib, LibrariesPath, dir);
    }
  };

  const modules = [];
  store.get("modules").forEach((module) => {
    if (typeof module === "string") {
      module = makeModuleAbsolute(module);
      let rawdata = fs.readFileSync(module);
      let config = JSON.parse(rawdata);
      readModule(config, path.dirname(module));
    } else {
      readModule(module, cwd);
    }
  });
  if (modules.length) {
    serverArguments.push("-m ".concat(modules.join(",")));
  }
  const separator = isWindows ? ";" : ":";
  PythonPath.push(process.env.PYTHONPATH);
  process.env.PYTHONPATH = PythonPath.join(separator);
  if (isWindows) {
    LibrariesPath.push(vtkBin);
    LibrariesPath.push(process.env.PATH);
    process.env.PATH = LibrariesPath.join(separator);
  } else {
    LibrariesPath.push(path.join(vtkInstall, "lib"));
    LibrariesPath.push(process.env.LD_LIBRARY_PATH);
    process.env.LD_LIBRARY_PATH = LibrariesPath.join(separator);
  }
  console.log("PythonPath ".concat(PythonPath));
  console.log("LibrariesPath ".concat(LibrariesPath));
  console.log(serverArguments);
  server = spawn(path.join(vtkBin, "vtkpython"), serverArguments);
  server.stdout.on("data", (data) => {
    console.log(`server output: ${data}`);
    if (data.indexOf("Starting factory") !== -1) {
      createWindow();
    }
  });
  server.stderr.on("data", (data) => {
    console.log(`server error: ${data}`);
    if (data.indexOf("Starting factory") !== -1) {
      createWindow();
    }
  });
  server.on("close", (code) => {
    console.log(`server exited with code ${code}`);
    server = null;
    if (win) {
      win.close();
    }
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    console.log("ACTIVE !!!!!!");
    startServer();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  console.log("READY !!!!!!");
  startServer();
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtoolsmodules
    await installVueDevtools();
  }
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      app.quit();
    });
  }
}

process.on("uncaughtException", function (err) {
  console.log("uncaughtException:", err);
});

ipcMain.on("port", (event) => {
  event.returnValue = store.get("port");
});

ipcMain.on("cwd", (event) => {
  event.returnValue = cwd;
});
