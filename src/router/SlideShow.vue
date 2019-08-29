<!--
Copyright (C) 2019 Geode-solutions

This file is a part of Geode library.

This library is free software; you can redistribute it and/or
modify it under the terms of the GNU Lesser General Public
License as published by the Free Software Foundation; either
version 2.1 of the License, or (at your option) any later version.

This library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Lesser General Public License for more details.
-->

<template>
  <div class="reveal">
    <div class="slides">
      <section><h3 class="display-3 py-3" style="line-height:70px">
        <span class="display-4 primary--text">OpenGeode </span><br/>
         an industrial open source geosciences meshing framework</h3>
        <span class="display-1"><b>Arnaud Botella</b> and Pierre Anquez</span><br/>
        <img src="@/assets/logo.png" height="150" width="150" style="margin-top:100px"/><br/>
        <span class="display-2" >Geode-solutions</span>
      </section>
      
      <section class="sectiontitle">I - Why another data model dedicated to Geosciences?
      </section>
      <section>
        <span class="slidetitle">BRep for CAD</span></br>

        <p>Need of a BRep in CAD for:</p>
        <img src="@/assets/Plane-Model.jpg" height="400">
        <p class="caption">Copyright © 2019 NeoMetrix Technologies, Inc.</p>
      </section>
      <section>Special needs for Geosciences</section>
      <section>First attempts</br>
        GeoMesh: JP, one article, 2013 - 2015<br/>
        RINGMesh: RING, RING team research, 2014 - 2017
      </section>
      <section>Key points
        <ul>
          <li>Geosciences</li>
          <li>Industrial quality</li>
          <li>Open source</li>
        </ul>
      </section>

      <section>II - OpenGeode</section>
      <section>
        <body>Industrial quality</body>
        <body>CI/CD</body>
      </section>
      <section>
        <body>Multi-platform</body>
        <body>Pre-compiled binaries for Linux, Windows and macOS</body>
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/1200px-Apple_logo_black.svg.png"  height="200" width="200">
      </section>
            <section>
        <body>Extensible</body>
        <body>Modules</body>
      </section>
      <section>
        <section>Redesigned UI
            <body>JS, web based</body>
        </section>
        <section style="height: 100%">
          <vtk-view />
        </section>
      </section>

      <section>III - BRep in OpenGeode</section>
      <section>
        <section>Assembly of Components
          <body>Corners, Lines, Surfaces, Blocks</body>
        </section>
        <section style="height: 100%">
          <vtk-view />
        </section>
      </section>
      <section>
        <section>Data structure
          <body>Mixins</body>
        </section>
        <section>
          Show code
          <pre><code>
            namespace geode
            {
                template < index_t dimension, template < index_t > class... Components >
                class GeoRepresentation : public Components< dimension >...
                {
                  // methods
                };
                class BRep : public GeoRepresentation< 3, Corners, Lines, Surfaces, Blocks >
                {
                  // methods
                };
            }
          </code></pre>
        </section>
      </section>
      <section>
        Non continuous indexing - UUID</br>
        Model edition 
      </section>

      <section>IV - Demo</section>
      
    </div>
  </div>
</template>

<script>
import Reveal from "reveal.js/js/reveal";
import "reveal.js/css/reveal.css";
import "reveal.js/css/theme/white.css";
import VtkView from "@/components/view/VtkView";

export default {
  name: "SlideShow",
  components: {
    VtkView
  },
  mounted() {
    Reveal.initialize({slideNumber: true});
  }
};
</script>

<style>
.reveal {
  font-family: Roboto;
}
.reveal .controls {
  color: var(--v-primary-base);
}
.reveal .progress {
  color: var(--v-primary-base);
}
.reveal .slide-number {
  left: 8px;
  color: var(--v-primary-base);
  background-color: rgba(0,0,0,0);
  font-size: 18px;
}
.reveal section img {
  border: 0px;
  background-color: rgba(0,0,0,0);
  box-shadow: 0 0 0px rgba(0, 0, 0, 0);
}
.sectiontitle {
	font-weight: bolder;
  color: brown;
}
.slidetitle {
	font-weight: bolder;
  color: var(--v-primary-base);
}
.caption {
	font-size: 14px;
  color: var(--v-primary-base);
  text-align: right;
}
</style>
