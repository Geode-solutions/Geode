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

function createProxyDefinition(
  classFactory,
  ui = [],
  links = [],
  definitionOptions = {},
  props = {}
) {
  return {
    class: classFactory,
    options: Object.assign({ links, ui }, definitionOptions),
    props
  };
}

// ----------------------------------------------------------------------------

function activateOnCreate(def) {
  /* eslint-disable no-param-reassign */
  def.options.activateOnCreate = true;
  return def;
}

// ----------------------------------------------------------------------------

function deepCopyPath(rootObj, pathSpec) {
  const path = typeof pathSpec === "string" ? pathSpec.split(".") : pathSpec;
  const newRootObj = Object.assign({}, rootObj);

  let obj = newRootObj;
  while (path.length) {
    const prop = path.shift();
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      if (obj[prop] instanceof Array) {
        // handles case when prop is an array
        obj[prop] = Array.from(obj[prop]);
      } else {
        // copy as object
        obj[prop] = Object.assign({}, obj[prop]);
      }
      obj = obj[prop];
    } else {
      throw new Error(`Invalid property path given: ${path}`);
    }
  }

  return newRootObj;
}

// ----------------------------------------------------------------------------

function objAssignPath(rootObj, pathSpec, value) {
  const path = typeof pathSpec === "string" ? pathSpec.split(".") : pathSpec;
  let obj = rootObj;

  while (path.length > 1) {
    const prop = path.shift();
    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
      obj = obj[prop];
    } else {
      throw new Error(`Invalid property path given: ${path}`);
    }
  }

  if (path.length === 1) {
    const lastProp = path.shift();
    obj[lastProp] = value;
  } else {
    throw new Error(`Invalid property path given: ${path}`);
  }
}

// ----------------------------------------------------------------------------
export default {
  createProxyDefinition,
  activateOnCreate,
  deepCopyPath,
  objAssignPath
};
