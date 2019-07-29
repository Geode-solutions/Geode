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

const Volume = [
  // { link: 'ColorBy', property: 'colorBy' },
  { link: "Visibility", property: "visibility", updateOnBind: true },
  // { link: 'UseShadow', property: 'useShadow' },
  // { link: 'SampleDistance', property: 'sampleDistance' },
  // { link: 'EdgeGradient', property: 'edgeGradient' },
  { link: "WW", property: "windowWidth", updateOnBind: true },
  { link: "WL", property: "windowLevel", updateOnBind: true },
  { link: "SliceX", property: "xSlice", updateOnBind: true },
  { link: "SliceY", property: "ySlice", updateOnBind: true },
  { link: "SliceZ", property: "zSlice", updateOnBind: true }
];

const Geometry = [
  { link: "GeometryColorBy", property: "colorBy", updateOnBind: true },
  { link: "Representation", property: "representation", updateOnBind: true },
  { link: "Opacity", property: "opacity", updateOnBind: true },
  {
    link: "InterpolateScalarsBeforeMapping",
    property: "interpolateScalarsBeforeMapping",
    updateOnBind: true
  },
  { link: "Visibility", property: "visibility", updateOnBind: true },
  { link: "PointSize", property: "pointSize", updateOnBind: true }
];

const Slice = [
  { link: "Visibility", property: "visibility", updateOnBind: true },
  { link: "WW", property: "windowWidth", updateOnBind: true },
  { link: "WL", property: "windowLevel", updateOnBind: true }
];

const Molecule = [
  { link: "Tolerance", property: "tolerance", updateOnBind: true },
  {
    link: "AtomicRadiusScaleFactor",
    property: "atomicRadiusScaleFactor",
    updateOnBind: true
  },
  { link: "BondRadius", property: "bondRadius", updateOnBind: true },
  { link: "DeltaBondFactor", property: "deltaBondFactor", updateOnBind: true },
  { link: "HideElements", property: "hideElements", updateOnBind: true }
];

const Glyph = [
  {
    link: "GlyphEdgeVisibility",
    property: "edgeVisibility",
    updateOnBind: true
  }
];

const Skybox = [
  { link: "SkyboxPosition", property: "position", updateOnBind: true }
];

export default {
  Volume,
  Geometry,
  Slice,
  Molecule,
  Glyph,
  Skybox
};
