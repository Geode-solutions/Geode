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
// import glob from "glob";
import {
  createProtocol,
  installVueDevtools,
} from "vue-cli-plugin-electron-builder/lib";
import path from "path";

console.log("======================");

const Store = require("electron-store");

const store = new Store({
  schema: {
    port: {
      type: "number",
      default: 1234,
    },
    modules: {
      type: "array",
      default: [],
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          path: { type: "string" },
          python: {
            type: "array",
            items: {
              type: "string",
            },
          },
          lib: {
            type: "array",
            items: {
              type: "string",
            },
          },
        },
        // required: ["name", "path", "python", "lib"],
      },
    },
  },
});

const isDevelopment = process.env.NODE_ENV !== "production";
const isWindows = process.platform === "win32";
const appRoot = isDevelopment ? path.join(__dirname, "..") : process.env.APPDIR;
console.log("DIRNAME", appRoot);
console.log(process.env);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win = null;
let server = null;

// Standard scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

function startServer() {
  let PythonPath = [];
  let LibrariesPath = [];
  const serverPath = path.join(appRoot, "server");
  console.log("serverPath ", serverPath);
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
    vtkInstall = path.join(serverToolsPath, "build/vtk/install");
  } else {
    vtkInstall = path.join(serverPath, "vtk");
  }
  const vtkBin = path.join(vtkInstall, "bin");
  console.log("vtkInstall ", vtkInstall);

  const modules = [];
  store.get("modules").forEach((module) => {
    modules.push(module.name);
    console.log("=", module.name, "=");
    console.log(module.python);
    PythonPath = PythonPath.concat(module.python);
    LibrariesPath = LibrariesPath.concat(module.lib);
  });
  if (modules.length) {
    serverArguments.push("-m ".concat(modules.join(" ")));
  }
  console.log(PythonPath);
  const separator = isWindows ? ";" : ":";
  PythonPath.push(process.env.PYTHONPATH);
  process.env.PYTHONPATH = PythonPath.join(separator);
  console.log(process.env.PYTHONPATH);
  if (isWindows) {
    LibrariesPath.push(vtkBin);
    LibrariesPath.push(process.env.PATH);
    process.env.PATH = LibrariesPath.join(separator);
  } else {
    LibrariesPath.push(path.join(vtkInstall, "lib"));
    LibrariesPath.push(process.env.LD_LIBRARY_PATH);
    process.env.LD_LIBRARY_PATH = LibrariesPath.join(separator);
  }
  server = spawn(path.join(vtkBin, "vtkpython"), serverArguments);
  server.stdout.on("data", (data) => {
    console.log(`server: ${data}`);
  });
  server.stderr.on("data", (data) => {
    console.log(`server: ${data}`);
  });
  server.on("close", (code) => {
    console.log(`server exited with code ${code}`);
    server = null;
  });
}

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: path.join(__dirname, "icons/64x64.png"),
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
    startServer();
    createWindow();
  }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  startServer();
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    await installVueDevtools();
  }
  createWindow();
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
