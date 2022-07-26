# Copyright (C) 2019 - 2022 Geode-solutions
#
# This file is a part of Geode library.
#
# This library is free software; you can redistribute it and/or
# modify it under the terms of the GNU Lesser General Public
# License as published by the Free Software Foundation; either
# version 2.1 of the License, or (at your option) any later version.
#
# This library is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
# Lesser General Public License for more details.

import math
import vtk

from wslink import register as exportRpc

from geode_protocols import GeodeProtocol


class GeodeDefault(GeodeProtocol):
    @exportRpc("geode.ui.background")
    def setBackground(self, viewId, r, g, b):
        self.getSharedObject("renderer").SetBackground(r, g, b)
        view = self.getView(viewId)
        view.Render()
        self.getApplication().InvokeEvent('UpdateEvent')

    @exportRpc("geode.actor.visibility")
    def updateVisibility(self, id, visibility):
        actor = self.getObject(id)["actor"]
        if type(actor) is dict:
            for components in actor.values():
                for object_actor in components.values():
                    object_actor.SetVisibility(visibility)
        else:
            actor.SetVisibility(visibility)
        self.render()

    @exportRpc("geode.camera.reset")
    def fastResetCamera(self, viewId):
        view = self.getView(viewId)
        view.GetRenderers().GetFirstRenderer().ResetCamera()
        self.render()

    @exportRpc("geode.camera.update")
    def fastUpdateCamera(self, view_id, focal_point, view_up, position, view_angle, clipping_range):
        view = self.getView(view_id)
        camera = view.GetRenderers().GetFirstRenderer().GetActiveCamera()
        camera.SetFocalPoint(focal_point)
        camera.SetViewUp(view_up)
        camera.SetPosition(position)
        camera.SetViewAngle(view_angle)
        camera.SetClippingRange(clipping_range)
        self.render()

    @exportRpc("geode.marker.geometry")
    def setMarkerGeometry(self, content):
        reader = vtk.vtkXMLPolyDataReader()
        reader.ReadFromInputStringOn()
        reader.SetInputString(content)
        mapper = vtk.vtkPolyDataMapper()
        mapper.SetInputConnection(reader.GetOutputPort())
        actor = vtk.vtkActor()
        actor.SetMapper(mapper)
        widget = self.getSharedObject("marker")
        widget.SetOrientationMarker(actor)
        widget.EnabledOn()

    @exportRpc("geode.marker.viewport")
    def setMarkerViewport(self, viewport):
        widget = self.getSharedObject("marker")
        widget.SetViewport(viewport)

    @exportRpc("geode.reset")
    def reset(self):
        self.getDataBase().clear()
        self.getRenderer().RemoveAllViewProps()

    def computeEpsilon(self, renderer, z):
        renderer.SetDisplayPoint(0, 0, z)
        renderer.DisplayToWorld()
        windowLowerLeft = renderer.GetWorldPoint()
        size = renderer.GetRenderWindow().GetSize()
        renderer.SetDisplayPoint(size[0], size[1], z)
        renderer.DisplayToWorld()
        windowUpperRight = renderer.GetWorldPoint()
        epsilon = 0
        for i in range(3):
            epsilon += (windowUpperRight[i] - windowLowerLeft[i]) * \
                (windowUpperRight[i] - windowLowerLeft[i])
        return math.sqrt(epsilon) * 0.0125

    @exportRpc("geode.mouse.menu")
    def menu(self, x, y, ids):
        renderer = self.getRenderer()
        picker = vtk.vtkWorldPointPicker()
        ret = picker.Pick([x, y, 0], renderer)
        point = picker.GetPickPosition()
        epsilon = self.computeEpsilon(renderer, point[2])
        bbox = vtk.vtkBoundingBox()
        bbox.AddPoint(point[0]+epsilon, point[1]+epsilon, point[2]+epsilon)
        bbox.AddPoint(point[0]-epsilon, point[1]-epsilon, point[2]-epsilon)
        for id in ids:
            if self.getObject(id)['bbox'].Intersects(bbox):
                return id
        return 0


protocols = [GeodeDefault]
