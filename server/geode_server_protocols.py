from importlib import import_module

import math

import vtk
from vtk.web import protocols as vtk_protocols
from vtk.web import wslink as vtk_wslink

class OpenGeodeServerProtocol(vtk_wslink.ServerProtocol):

    # Application configuration
    modules = []
    db = dict()

    def __init__(self):
        self.setSharedObject("db", OpenGeodeServerProtocol.db)
        vtk_wslink.ServerProtocol.__init__(self)

    def initializeProtocols(self):
        if "geode_mouse" not in OpenGeodeServerProtocol.modules:
            OpenGeodeServerProtocol.modules.append("geode_mouse")
        if "geode_ui" not in OpenGeodeServerProtocol.modules:
            OpenGeodeServerProtocol.modules.append("geode_ui")
        # Bring used components
        self.registerVtkWebProtocol(vtk_protocols.vtkWebMouseHandler())
        self.registerVtkWebProtocol(vtk_protocols.vtkWebViewPort())
        delivery = vtk_protocols.vtkWebPublishImageDelivery(decode=False)
        delivery.deltaStaleTimeBeforeRender = 0.001
        self.registerVtkWebProtocol(delivery)

        # tell the C++ web app to use no encoding. ParaViewWebPublishImageDelivery must be set to decode=False to match.
        self.getApplication().SetImageEncoding(0)

        print(OpenGeodeServerProtocol.modules)
        for module_name in OpenGeodeServerProtocol.modules:
            module = import_module(module_name)
            for module_protocol in module.protocols:
                self.registerVtkWebProtocol(module_protocol())

    def north(self):
        cylinderHeight = 0.2
        cylinder = self.createCylinder(cylinderHeight, 20, 1)
        self.addColor(cylinder, 0, 150, 136)
        arrow = self.createArrow(cylinderHeight)
        N = self.createN(cylinderHeight)
        
        north = vtk.vtkAppendPolyData()
        north.SetInputData(cylinder)
        north.AddInputData(arrow)
        north.AddInputData(N)
        northMapper = vtk.vtkPolyDataMapper()
        northMapper.SetInputConnection(north.GetOutputPort())
        northActor = vtk.vtkActor()
        northActor.SetMapper(northMapper)
        return northActor
    
    def createCylinder(self, cylinderHeight, resolution, radius):
        angle = 2.0 * 3.14 / resolution
        points = vtk.vtkPoints()
        for i in range(resolution):
            x = math.cos(i * angle)
            y = -math.sin(i * angle)
            points.InsertNextPoint(x * radius, y * radius, 0.5 * cylinderHeight)
            points.InsertNextPoint(x * radius, y * radius, -0.5 * cylinderHeight)


        polygons = vtk.vtkCellArray()

        for i in range(resolution):
            polygons.InsertNextCell(4, [2*i,2*i+1,(2*i+3)%(2*resolution), (2*i+3)%(2*resolution)-1])
        top = [None] * resolution
        for i in range(resolution):
            top[i] = 2 * i
        polygons.InsertNextCell(resolution, top)
        bottom = [None] * resolution
        for i in range(resolution):
            bottom[i] = 2 * i + 1
        polygons.InsertNextCell(resolution, bottom)

        cylinder = vtk.vtkPolyData()
        cylinder.SetPoints(points)
        cylinder.SetPolys(polygons)
        return cylinder

    def createArrow(self, cylinderHeight):
        points = vtk.vtkPoints()
        def oneSidePoints(side, cylinderHeight, points):
            z = side * cylinderHeight
            points.InsertNextPoint(0, 0.8, z)
            points.InsertNextPoint(-0.5, 0, z)
            points.InsertNextPoint(0, 0.2, z)
            points.InsertNextPoint(0.5, 0, z)
        oneSidePoints(1, cylinderHeight, points)
        oneSidePoints(-1, cylinderHeight, points)

        polygons = vtk.vtkCellArray()
        polygons.InsertNextCell(4,[0, 1, 2, 3])
        polygons.InsertNextCell(4,[4, 5, 6, 7])

        def arrowSide(polygons, p0, p1):
            polygons.InsertNextCell(4,[p0, p1, p1 + 4, p0 + 4])
        for side in range(3):
            arrowSide(polygons, side, side + 1)
        arrowSide(polygons, 3, 0)
        arrow = vtk.vtkPolyData()
        arrow.SetPoints(points)
        arrow.SetPolys(polygons)
        return arrow

    def createN(self, cylinderHeight):
        points = vtk.vtkPoints()
        ytop = -0.2
        ybot = -0.7
        thick = 0.15
        x0 = -0.3
        def oneSidePoints(side, cylinderHeight, points, ytop, ybot, thick, x0):
            x1 = x0 + thick
            x2 = -x1
            x3 = -x0
            z = side * cylinderHeight
            points.InsertNextPoint(x0, ybot, z)
            points.InsertNextPoint(x0, ytop, z)
            points.InsertNextPoint(x1, ytop, z)
            points.InsertNextPoint(x2, ybot + thick, z)
            points.InsertNextPoint(x2, ytop, z)
            points.InsertNextPoint(x3, ytop, z)
            points.InsertNextPoint(x3, ybot, z)
            points.InsertNextPoint(x2, ybot, z)
            points.InsertNextPoint(x1, ytop - thick, z)
            points.InsertNextPoint(x1, ybot, z)
        oneSidePoints(1, cylinderHeight, points, ytop, ybot, thick, x0)
        oneSidePoints(-1, cylinderHeight, points, ytop, ybot, thick, x0)

        polygons = vtk.vtkCellArray()
        def NLetter(polygons, offset):
            polygons.InsertNextCell(4,[offset + 0, offset + 1, offset + 2, offset + 9])
            polygons.InsertNextCell(4,[offset + 2, offset + 3, offset + 7, offset + 8])
            polygons.InsertNextCell(4,[offset + 4, offset + 5, offset + 6, offset + 7])
        NLetter(polygons, 0)
        NLetter(polygons, 10)

        def NSide(polygons, p0, p1):
            polygons.InsertNextCell(4,[p0, p1, p1 + 10, p0 + 10])
        for side in range(9):
            NSide(polygons, side, side + 1)
        NSide(polygons, 9, 0)
        N = vtk.vtkPolyData()
        N.SetPoints(points)
        N.SetPolys(polygons)
        return N

    def addColor(self, ds, r, g, b):
        rgbArray = vtk.vtkUnsignedCharArray()
        rgbArray.SetNumberOfComponents(3)
        rgbArray.SetName("colors")
        for i in range(ds.GetPoints().GetNumberOfPoints()):
            rgbArray.InsertNextTuple3(r,g,b)
        print(rgbArray)
        print(ds.GetPoints().GetNumberOfPoints())
        ds.GetPointData().SetScalars(rgbArray)
        ds.Modified()

