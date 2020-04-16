#!/bin/bash

folder="$(dirname "$0")"
folder1="$(dirname "$0")/../OpenGeode.geode"
folder2="$(dirname "$0")/../OpenGeode"
export PYTHONPATH=$folder1/build/third_party/vtk/install/lib/python3.6/site-packages:$folder1/server/protocols:$folder2/build/opengeode/install/lib:$folder1/build/opengeode_geode/install/lib
export LD_LIBRARY_PATH=$folder1/build/third_party/vtk/install/lib/
python3 $folder/server/server.py -p 1234 -m geode_mesh geode_model