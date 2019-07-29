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

import vtkProxySource from "vtk.js/Sources/Proxy/Core/SourceProxy";
import vtkImageMarchingCubes from "vtk.js/Sources/Filters/General/ImageMarchingCubes";

const Contour = {
  class: vtkProxySource,
  options: {
    autoUpdate: false, // For now...
    algoFactory: vtkImageMarchingCubes,
    proxyPropertyMapping: {
      contourValue: { modelKey: "algo", property: "contourValue" },
      computeNormals: { modelKey: "algo", property: "computeNormals" },
      mergePoints: { modelKey: "algo", property: "mergePoints" }
    },
    updateDomain(self, dataset) {
      const arrayToProcess =
        dataset.getPointData().getScalars() ||
        dataset.getPointData().getArrayByIndex(0);
      if (!arrayToProcess) {
        return;
      }
      const [min, max] = arrayToProcess.getRange();
      const step = Math.min(1, (max - min) / 500);
      self.updateProxyProperty("contourValue", {
        domain: { min, max, step }
      });
    },
    ui: [
      {
        label: "Contour Value",
        name: "contourValue",
        widget: "slider",
        propType: "slider",
        type: "double",
        size: 1,
        domain: { min: 0, max: 1000, step: 1 },
        doc: "Adjust contour value"
      },
      {
        label: "Compute Normals",
        name: "computeNormals",
        widget: "checkbox",
        type: "boolean",
        advanced: 0,
        size: 1,
        doc: "Compute normal to enable smooth surface"
      },
      {
        label: "Merge points",
        name: "mergePoints",
        widget: "checkbox",
        type: "boolean",
        advanced: 0,
        size: 1,
        doc: "Prevent point duplication by merging them"
      },
      {
        label: "Update",
        name: "update",
        propType: "ExecuteProperty",
        size: 1
      }
    ]
  }
};

export default {
  Contour
};
