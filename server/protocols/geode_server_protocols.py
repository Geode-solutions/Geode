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

from importlib import import_module

import math

import vtk
from vtk.web import protocols as vtk_protocols
from vtk.web import wslink as vtk_wslink


class GeodeServerProtocol(vtk_wslink.ServerProtocol):

    # Application configuration
    modules = []
    db = dict()

    def __init__(self):
        self.setSharedObject("db", GeodeServerProtocol.db)
        vtk_wslink.ServerProtocol.__init__(self)

    def initializeProtocols(self):
        if "geode_default" not in GeodeServerProtocol.modules:
            GeodeServerProtocol.modules.append("geode_default")
        # Bring used components
        self.registerVtkWebProtocol(vtk_protocols.vtkWebMouseHandler())
        self.registerVtkWebProtocol(vtk_protocols.vtkWebViewPort())
        delivery = vtk_protocols.vtkWebPublishImageDelivery(decode=False)
        delivery.deltaStaleTimeBeforeRender = 0.001
        self.registerVtkWebProtocol(delivery)

        # tell the C++ web app to use no encoding. ParaViewWebPublishImageDelivery must be set to decode=False to match.
        self.getApplication().SetImageEncoding(0)

        print(GeodeServerProtocol.modules)
        for module_name in GeodeServerProtocol.modules:
            module = import_module(module_name.strip()+"_protocols")
            for module_protocol in module.protocols:
                self.registerVtkWebProtocol(module_protocol())
