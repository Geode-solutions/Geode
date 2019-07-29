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

function newInstance(updateFn, getAllProxiesFn) {
  const subscriptions = [];

  function removeListeners() {
    while (subscriptions.length) {
      subscriptions.pop().unsubscribe();
    }
  }

  function listenToProxyChange(proxy) {
    subscriptions.push(proxy.onModified(updateFn));
  }

  function resetListeners() {
    removeListeners();
    getAllProxiesFn().forEach(listenToProxyChange);
  }

  return Object.freeze({
    removeListeners,
    listenToProxyChange,
    resetListeners
  });
}

export default { newInstance };
