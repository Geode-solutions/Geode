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

import { VIEW_ORIENTATIONS, ANNOTATIONS } from "./viewConstants";
import vtkNorthActor from "./northActor";
import vtkWidgetManager from "vtk.js/Sources/Widgets/Core/WidgetManager";

// ----------------------------------------------------------------------------

function getNumberOfVisibleViews(proxyManager) {
  let nbViews = 0;
  proxyManager.getViews().forEach(v => {
    nbViews += v.getContainer() ? 1 : 0;
  });
  return nbViews;
}

// ----------------------------------------------------------------------------

function getViewActions(proxyManager) {
  const possibleActions = {
    crop: false
  };

  // To crop we need at list an image data
  proxyManager.getSources().forEach(s => {
    const ds = s.getDataset();
    if (ds && ds.isA && ds.isA("vtkImageData")) {
      possibleActions.crop = true;
    }
  });

  return possibleActions;
}

// ----------------------------------------------------------------------------

function getViewType(view) {
  return `${view.getProxyName()}:${view.getName()}`;
}

// ----------------------------------------------------------------------------

function getView(proxyManager, viewType) {
  const [type, name] = viewType.split(":");
  let view = null;
  const views = proxyManager.getViews();
  for (let i = 0; i < views.length; i++) {
    if (views[i].getProxyName() === type) {
      if (name) {
        if (views[i].getName() === name) {
          view = views[i];
        }
      } else {
        view = views[i];
      }
    }
  }

  if (!view) {
    view = proxyManager.createProxy("Views", type, { name });

    // Make sure represention is created for new view
    proxyManager
      .getSources()
      .forEach(s => proxyManager.getRepresentation(s, view));

    // Update orientation
    const { axis, orientation, viewUp } = VIEW_ORIENTATIONS[name];
    view.updateOrientation(axis, orientation, viewUp);

    // set background to transparent
    view.setBackground(0, 0, 0, 0);

    const north = vtkNorthActor.newInstance();
    view.registerOrientationAxis("north", north);
    view.setOrientationAxesType("north");

    if (!view.getReferenceByName("widgetManager")) {
      const widgetManager = vtkWidgetManager.newInstance();
      widgetManager.disablePicking();
      view.set({ widgetManager }, true);
    }
  }

  return view;
}

// ----------------------------------------------------------------------------

function updateViewsAnnotation(proxyManager) {
  const hasImageData = proxyManager
    .getSources()
    .find(s => s.getDataset().isA && s.getDataset().isA("vtkImageData"));
  const views = proxyManager.getViews();

  for (let i = 0; i < views.length; i++) {
    const view = views[i];
    view.setCornerAnnotation("se", "");
    if (view.getProxyName().indexOf("2D") !== -1 && hasImageData) {
      view.setCornerAnnotations(ANNOTATIONS, true);
    } else {
      view.setCornerAnnotation("nw", "");
    }
  }
}

// ----------------------------------------------------------------------------

function bindView(proxyManager, viewType, container) {
  let view = getView(proxyManager, viewType);
  view.setContainer(container);
  view.resize();
  return view;
}

// ----------------------------------------------------------------------------

export default {
  getViewType,
  bindView,
  getView,
  getViewActions,
  getNumberOfVisibleViews,
  updateViewsAnnotation
};
