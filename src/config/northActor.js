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

import macro from "vtk.js/Sources/macro";
import vtkDataArray from "vtk.js/Sources/Common/Core/DataArray";
import vtkActor from "vtk.js/Sources/Rendering/Core/Actor";
import vtkMapper from "vtk.js/Sources/Rendering/Core/Mapper";
import vtkCylinderSource from "vtk.js/Sources/Filters/Sources/CylinderSource";
import vtkAppendPolyData from "vtk.js/Sources/Filters/General/AppendPolyData";
import vtkPolyData from "vtk.js/Sources/Common/DataModel/PolyData";

const cylinderHeight = 0.2;

function addColor(ds, r, g, b) {
  const size = ds.getPoints().getData().length;
  const rgbArray = new Uint8Array(size);
  let offset = 0;

  while (offset < size) {
    rgbArray[offset++] = r;
    rgbArray[offset++] = g;
    rgbArray[offset++] = b;
  }

  ds.getPointData().setScalars(
    vtkDataArray.newInstance({
      name: "color",
      numberOfComponents: 3,
      values: rgbArray
    })
  );
}

function createArrow() {
  const nbVertices = 4;
  const points = new Float32Array(3 * 2 * nbVertices);
  let count = 0;

  function oneSidePoints(side) {
    const z = side * cylinderHeight;
    points[count++] = 0;
    points[count++] = 0.8;
    points[count++] = z;
    points[count++] = -0.5;
    points[count++] = 0;
    points[count++] = z;
    points[count++] = 0;
    points[count++] = 0.2;
    points[count++] = z;
    points[count++] = 0.5;
    points[count++] = 0;
    points[count++] = z;
  }
  oneSidePoints(1);
  oneSidePoints(-1);

  const polygons = new Uint32Array(30);
  count = 0;
  polygons[count++] = 4;
  polygons[count++] = 0;
  polygons[count++] = 1;
  polygons[count++] = 2;
  polygons[count++] = 3;

  polygons[count++] = 4;
  polygons[count++] = 4;
  polygons[count++] = 5;
  polygons[count++] = 6;
  polygons[count++] = 7;

  function arrowSide(p0, p1) {
    polygons[count++] = 4;
    polygons[count++] = p0;
    polygons[count++] = p1;
    polygons[count++] = p1 + nbVertices;
    polygons[count++] = p0 + nbVertices;
  }
  for (let side = 0; side < nbVertices - 1; side++) {
    arrowSide(side, side + 1);
  }
  arrowSide(nbVertices - 1, 0);
  const arrow = vtkPolyData.newInstance();
  arrow.getPoints().setData(points, 3);
  arrow.getPolys().setData(polygons);
  return arrow;
}

function createN() {
  const nbVertices = 10;
  const points = new Float32Array(3 * 2 * nbVertices);
  let count = 0;
  const ytop = -0.2;
  const ybot = -0.7;
  const thick = 0.15;
  const x0 = -0.3;
  const x1 = x0 + thick;
  const x2 = -x1;
  const x3 = -x0;
  function oneSidePoints(side) {
    const z = side * cylinderHeight;
    points[count++] = x0;
    points[count++] = ybot;
    points[count++] = z;
    points[count++] = x0;
    points[count++] = ytop;
    points[count++] = z;
    points[count++] = x1;
    points[count++] = ytop;
    points[count++] = z;
    points[count++] = x2;
    points[count++] = ybot + thick;
    points[count++] = z;
    points[count++] = x2;
    points[count++] = ytop;
    points[count++] = z;
    points[count++] = x3;
    points[count++] = ytop;
    points[count++] = z;
    points[count++] = x3;
    points[count++] = ybot;
    points[count++] = z;
    points[count++] = x2;
    points[count++] = ybot;
    points[count++] = z;
    points[count++] = x1;
    points[count++] = ytop - thick;
    points[count++] = z;
    points[count++] = x1;
    points[count++] = ybot;
    points[count++] = z;
  }
  oneSidePoints(1);
  oneSidePoints(-1);

  const polygons = new Uint32Array(80);
  count = 0;
  function NLetter(offset) {
    polygons[count++] = 4;
    polygons[count++] = offset + 0;
    polygons[count++] = offset + 1;
    polygons[count++] = offset + 2;
    polygons[count++] = offset + 9;

    polygons[count++] = 4;
    polygons[count++] = offset + 2;
    polygons[count++] = offset + 3;
    polygons[count++] = offset + 7;
    polygons[count++] = offset + 8;

    polygons[count++] = 4;
    polygons[count++] = offset + 4;
    polygons[count++] = offset + 5;
    polygons[count++] = offset + 6;
    polygons[count++] = offset + 7;
  }
  NLetter(0);
  NLetter(10);

  function NSide(p0, p1) {
    polygons[count++] = 4;
    polygons[count++] = p0;
    polygons[count++] = p1;
    polygons[count++] = p1 + nbVertices;
    polygons[count++] = p0 + nbVertices;
  }
  for (let side = 0; side < nbVertices - 1; side++) {
    NSide(side, side + 1);
  }
  NSide(nbVertices - 1, 0);
  const N = vtkPolyData.newInstance();
  N.getPoints().setData(points, 3);
  N.getPolys().setData(polygons);
  return N;
}

function vtkNorthActor(publicAPI, model) {
  // Set our className
  model.classHierarchy.push("vtkNorthActor");

  publicAPI.update = () => {
    const cylinder = vtkCylinderSource
      .newInstance(
        Object.assign({
          height: cylinderHeight,
          resolution: 20,
          direction: [0, 0, 1]
        })
      )
      .getOutputData();
    addColor(cylinder, 0, 150, 136);

    const color = [224, 242, 241];
    const arrow = createArrow();
    addColor(arrow, ...color);

    const N = createN();
    addColor(N, ...color);

    const source = vtkAppendPolyData.newInstance();
    source.setInputData(cylinder);
    source.addInputData(arrow);
    source.addInputData(N);

    // set mapper
    const mapper = vtkMapper.newInstance();
    mapper.setInputConnection(source.getOutputPort());
    publicAPI.setMapper(mapper);
  };

  publicAPI.update();
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

export const DEFAULT_VALUES = {
  config: {
    tipResolution: 60,
    tipRadius: 0.1,
    tipLength: 0.2,
    shaftResolution: 60,
    shaftRadius: 0.03,
    invert: false
  },
  xAxisColor: [255, 0, 0],
  yAxisColor: [255, 255, 0],
  zAxisColor: [0, 128, 0]
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  vtkActor.extend(publicAPI, model, initialValues);

  macro.setGet(publicAPI, model, ["config"]);
  macro.setGetArray(
    publicAPI,
    model,
    ["xAxisColor", "yAxisColor", "zAxisColor"],
    3,
    255
  );

  // Object methods
  vtkNorthActor(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, "vtkNorthActor");

// ----------------------------------------------------------------------------

export default { newInstance, extend };
