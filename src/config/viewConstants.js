/*
 * Copyright (C) 2019 Geode-solutions
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

export const DEFAULT_VIEW_TYPE = "View3D:default";

export const VIEW_TYPES = [
  { text: "3D", value: "View3D:default" },
  { text: "Orientation Y", value: "View2D_Y:y" },
  { text: "Orientation X", value: "View2D_X:x" },
  { text: "Orientation Z", value: "View2D_Z:z" },
];

export const VIEW_TYPES_LPS = [
  { text: "3D", value: "View3D:default" },
  { text: "Sagittal", value: "View2D_Y:y" },
  { text: "Coronal", value: "View2D_X:x" },
  { text: "Axial", value: "View2D_Z:z" },
];

export const CURSOR_ANNOTATIONS = {
  se:
    "${valueArCursor}<br>${cursorIJK}&nbsp;/&nbsp;${cursorXYZ}<br>WL:&nbsp;${windowLevel}&nbsp;/&nbsp;WW:&nbsp;${windowWidth}",
};

export const ANNOTATIONS = {
  s: "Image&nbsp;size:&nbsp;${sliceWidth}&nbsp;x&nbsp;${sliceHeight}",
  nw:
    "Origin:&nbsp;${sliceOrigin}<br>Spacing:&nbsp;${sliceSpacing}&nbsp;mm<br>${sliceIndex}&nbsp;of&nbsp;${sliceCount}",
  se: "WL:&nbsp;${windowLevel}&nbsp;/&nbsp;WW:&nbsp;${windowWidth}",
};

export const VIEW_ORIENTATIONS = {
  default: {
    axis: 1,
    orientation: -1,
    viewUp: [0, 0, 1],
  },
  x: {
    axis: 0,
    orientation: 1,
    viewUp: [0, 0, 1],
  },
  y: {
    axis: 1,
    orientation: -1,
    viewUp: [0, 0, 1],
  },
  z: {
    axis: 2,
    orientation: -1,
    viewUp: [0, -1, 0],
  },
};
