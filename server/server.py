          # import to process args
import sys
import os
from importlib import import_module

# import vtk modules.
import vtk
from vtk.web import protocols
from vtk.web import wslink as vtk_wslink
from wslink import server

from geode_server_protocols import OpenGeodeServerProtocol

import argparse

class Backend(OpenGeodeServerProtocol):

    # Application configuration
    view    = None
    authKey = "wslink-secret"

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
        
            axes = vtk.vtkAxesActor()
            widget = vtk.vtkOrientationMarkerWidget()
            widget.SetOrientationMarker(axes)
            # widget.SetOrientationMarker(self.north())
            widget.SetInteractor(renderWindowInteractor)
            widget.SetViewport( 0.0, 0.0, 0.2, 0.2 )
            # widget.SetOutlineColor( 0.9300, 0.5700, 0.1300 )
            # widget->SetOutlineColor(colors->GetColor3d("Wheat").GetRed(),
            #                         colors->GetColor3d("Wheat").GetGreen(),
            #                         colors->GetColor3d("Wheat").GetBlue());
            widget.EnabledOn()
            widget.InteractiveOn()


            renderer.ResetCamera()
            # renderWindow.OffScreenRenderingOn()
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

    parser.add_argument("-m", "--modules", nargs='*', default=[], help="additional modules")

    # Extract arguments
    args = parser.parse_args()

    print(args)

    # Configure our current application
    Backend.authKey = args.authKey
    OpenGeodeServerProtocol.modules = args.modules

    # Start server
    server.start_webserver(options=args, protocol=Backend)
