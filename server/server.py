# Copyright (C) 2019 - 2021 Geode-solutions
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

import sys
import os
from importlib import import_module

# import vtk modules.
import vtk
from vtk.web import protocols
from vtk.web import wslink as vtk_wslink
from wslink import server

from geode_server_protocols import GeodeServerProtocol

import argparse

class Backend(GeodeServerProtocol):

    # Application configuration
    view    = None
    authKey = "wslink-secret"
    debug   = False

    def initialize(self):
        self.initializeProtocols()
        global renderer, renderWindow, renderWindowInteractor, cone, mapper, actor

        # Update authentication key to use
        self.updateSecret(Backend.authKey)

        # Create default pipeline (Only once for all the session)
        if not Backend.view:
            # VTK specific code
            renderer = vtk.vtkRenderer()
            self.setSharedObject("renderer", renderer)
            renderer.SetBackground(0.4, 0.4, 0.4)
            renderWindow = vtk.vtkRenderWindow()
            renderWindow.AddRenderer(renderer)

            renderWindowInteractor = vtk.vtkRenderWindowInteractor()
            self.setSharedObject("test", renderWindowInteractor)

            renderWindowInteractor.SetRenderWindow(renderWindow)
            renderWindowInteractor.GetInteractorStyle().SetCurrentStyleToTrackballCamera()

            widget = vtk.vtkOrientationMarkerWidget()
            widget.SetInteractor( renderWindowInteractor )
            self.setSharedObject("marker", widget)

            renderer.ResetCamera()
            print("Backend.debug ", Backend.debug)
            renderWindow.SetOffScreenRendering(not Backend.debug)
            renderWindow.Render()

            # VTK Web application specific
            Backend.view = renderWindow
            self.getApplication().GetObjectIdMap().SetActiveObject("VIEW", renderWindow)

# =============================================================================
# Main: Parse args and start server
# =============================================================================

if __name__ == "__main__":
    # Create argument parser
    parser = argparse.ArgumentParser(description="VTK/Web Cone web-application")

    # Add default arguments
    server.add_arguments(parser)

    parser.add_argument("-m", "--modules", type=str, help="additional modules")

    # Extract arguments
    args = parser.parse_args()

    print(args)

    # Configure our current application
    Backend.authKey = args.authKey
    Backend.debug = args.debug
    print("modules", args.modules)
    if args.modules:
        GeodeServerProtocol.modules = args.modules.split(",")

    # Start server
    server.start_webserver(options=args, protocol=Backend)
