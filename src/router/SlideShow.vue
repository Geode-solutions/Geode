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
        <img src="@/assets/logo.png" height="150" width="150" style="margin-top:50px"/><br/>
        <span class="display-2" >Geode-solutions</span>
      </section>
      
      <section>
        <p class="sectiontitle">Introduction</p> 
          Why another data model dedicated to mesh Geosciences?
      </section>
      <section> 
        <span class="slidetitle">Geomodeling goal is understand subsurface</span><br/> 
        <p>Geological model</p> 
        <p class="sub-item">Describe geometry and properties</p> 
        <!-- Add vertical space -->
        <p>Physical simulations</p> 
        <p class="sub-item">Response to these geometry and properties</p> 
        <p class="message"> Meshes discretize model geometry and properties for numerical computations </p>
      </section>
      <section>
        <span class="slidetitle">Boundary Representations</span><br/>
        <img src="@/assets/Plane-Model.jpg" height="300">
        <p class="caption">Copyright © 2019 NeoMetrix Technologies, Inc.</p>

        <p>BRep <b class="primary--text">required</b> for meshing solids</p>
        <ul>
          <li class="sub-item">Mesh conformity</li>
          <li class="sub-item">Tags on mesh elements</li>
        </ul>
      </section>
      <section>
        <p class="slidetitle">Specific needs for Geosciences</p>
        <div class="fragment">
          <p> Multi-materials models </p>
          <img src="@/assets/faraj_2016.png" height="200">
          <p class="caption">Faraj et al., Computers & Graphics, 2016</p>
        </div>
        <div class="fragment">
          <p> Internal features (fractures, faults) </p>
          <img src="@/assets/caumon_2009.png" height="200">
          <p class="caption">Caumon et al., Math Geosci, 2009</p>
        </div>
      </section>

      <section>
        <p class="slidetitle">SDK providing data model for geological BReps</p>
        RINGMesh - SKUA-Gocad - Geo3DML
      </section>
      <section>
        <p class="slidetitle">Required features</p>
        <p class="py-5">Need for a data model that is</p>
        <ul>
          <li class="fragment sub-item">Dedicated for Geosciences</li>
          <li class="fragment sub-item">Reliable (industrial quality)</li>
          <li class="fragment sub-item">Handy (open, flexible, ...)</li>
        </ul>
        <p class="message fragment py-5">No data model <b>combines</b> these three points.</p>
      </section>
      <section>
        <p class="slidetitle">Our proposal</p>
        <img src="@/assets/inheritance.svg" >
      </section>

      <section class="sectiontitle">I - OpenGeode specifications</section>
      <section>
        <section>
          <p class="slidetitle">Industrial quality</p>
          <!-- <p>What is needed for ?</p> -->
          <p class="fragment">Reliability</p>
          <!-- <p class="fragment">Cross-platform</p>
          <p class="fragment">Various exchanges</p> -->
        </section>
        <section>
          <p class="slidetitle">Industrial quality</p>
          <p>Code quality</p>
          <p class="sub-item">Modern programming (CMake, C++11, ...)</p>
          <p class="sub-item">Clean & readable code</p>
          <p class="sub-item">Concurrency programming</p>
        </section>
        <section>
          <p class="slidetitle">Industrial quality</p>
          <p>Multi-platform</p>
          <p class="sub-item">Pre-compiled binaries for <br/> Linux, Windows and macOS</p>
          <img src="@/assets/linux.jpeg" height="150">
          <img src="@/assets/windows.png" height="150">
          <img src="@/assets/apple.png" height="150">
        </section>
        <section>
          <p class="slidetitle">Industrial quality</p>
          <p>Continuous Integration</p>
          <p class="sub-item">Tests, code coverage ~ 90%</p>
          <p>Continuous Deployment</p>
          <p class="sub-item">Using GitHub and Azure DevOps</p>
        </section>
      </section>
      <section>
        <section>
          <p class="slidetitle">Open model</p>  
          <p>Complete framework is accessible on GitHub</p>
          <p class="sub-item">Very permissive License (MIT)</p>
            <img src="@/assets/Github_GS.png" height="300"> 
        </section>
        <section>
          <p class="slidetitle">Open model</p>
          <p>Usage of open source dependencies:</p>
          <ul>
            <li>Async++: concurrency programming</li>
            <li>Bitsery: serialization of objects</li>
            <li>Spdlog: fast logger</li>
            <li>...</li>
          </ul>
        </section>
        <section>
          <p class="slidetitle">Open model</p>
          <p>Create an open source ecosystem:</p>
          <ul>
            <li>Open the door to contributions</li>
            <li>Capitalize on open source projects</li>
          </ul>
          <p class="message">Increase task force</p> 
          <img src="@/assets/groupe.jpg" height="200">
        </section>
      </section>
      <section>
        <p class="slidetitle">Extensibility</p>
        <p>Providing tools for creating modules</p>
        <p class="sub-item">Template repository</p>
        <p> flexible data structures</p>
        <img src="@/assets/lego.jpg" height="250">
      </section>
      <section>
        <section>
          <p class="slidetitle">Redesigned UI<p>
          <p>Using JavaScript and web-based technologies</p>
          <img src="@/assets/vue.png" height="150" class="mx-5"> 
          <img src="@/assets/vuetify.jpeg" height="150" class="mx-5">
        </section>
        <section style="height: 100%">
          <vtk-view view-type="View3D:UI"/>
        </section>
      </section>
      <section>
        <p class="slidetitle">Scriptability</p>
        <p>Providing JavaScript wrapper</p>
        <p class="sub-item">Rapid prototyping</p>
        <p class="sub-item">UI interaction from JavaScript to C++</p>
        <img src="@/assets/lego.jpg" height="250">
      </section>

      <section class="sectiontitle">II - OpenGeode features</section>
      <section>
        <section>
          <p class="slidetitle">Objects are assemblies of Components</p>
          <p class="sub-item">Corners, Lines, Surfaces, Blocks</p>
        </section>
        <section style="height: 100%">
          <vtk-view view-type="View3D:assembly"/>
        </section>
      </section>
      <section>
        <section>
          <p class="slidetitle">Assembly design</p>
          <p>Mixin pattern</p>
        </section>
        <section>
          <pre class="cpp"><code data-trim>
          template < index_t dimension, template < index_t > class... Components >
          class GeoRepresentation : public Components< dimension >...
          {
            // methods
          };
          class BRep : public GeoRepresentation< 3, Corners, Lines, Surfaces, Blocks >
          {
            // methods
          };
          </code></pre>
        </section>
      </section>
      <section>
        <p class="slidetitle">Ease model editing</p> 
        <p>Non continuous indexing</p>
        <p class="sub-item">Topology stored as a graph</p>
        <p class="sub-item">Components identified by UUIDs</p>

      </section>

      <section><p class="sectiontitle">III - Short demo</p>
      <p>Objectives: Graphical User Interface, extensibility, scriptability</p></section>


      <section class="slidetitle">Executed code</section>

      <section class="sectiontitle">Conclusions and perspectives</section>
      <section>OpenGeode is designed to be a C++ framework
          <ul>
            <li class="fragment">Fully compliant with Geosciences</li>
            <li class="fragment">Handy, Open, Free</li>
            <li class="fragment">Reaching industrial quality</li>
            <li class="fragment">Usable through JavaScript UI</li>
            <li class="fragment">Highly extensible</li>
          </ul>
      </section>

      <section> <p class="slidetitle">Perspectives</p>
              <section>
          <p >Export/Import</p>
          <p class="sub-item">From/to geological standard RESQML</p>
        </section>

      <section>
        <p> Graphical User Interface</p>
        <p class="sub-item">Soon open sourced (by the end of 2019)</p>
        <div class="fragment">
          <p class="sub-item">More information when ready on Twitter</p>
          <img src="@/assets/Twitter_GS.jpg" height="300"/> 
        </div>
      </section>
      </section>
      <section>
        <p class="slidetitle">So now...</p>
        <p>We think we are fully equipped to
        design fully reliable tools. <br/> Ex: 
        given a valid geological model, surface remeshing & tetrahedral meshing 
        <b class="fragment">100% reliable.</b></p>
        <p class="message fragment">For the next RINGMeeting!?</p>
      </section>
      
      <section>
        <p class="slidetitle">Thank you for your participation</p>
      </section>
      
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
    this.$store.commit("setBackground", "#00000000");
    Reveal.initialize({slideNumber: true, navigationMode: 'default'});
    Reveal.configure({
      keyboard: {
        40: function() {
          Reveal.down();
          window.dispatchEvent(new Event('resize'));
        }
      }
    });
  }
};
</script>

<style>
.reveal {
  font-family: Roboto;
}
.reveal section ul {
  list-style: none; /* Remove default bullets */
}

.reveal section ul li::before {
  content: "\25A0";  
  color: var(--v-primary-base); 
  display: inline-block;
  width: 2em; 
  margin-left: -2em; 
}


.reveal .controls {
  color: var(--v-primary-base);
}
.reveal .progress {
  color: var(--v-primary-base);
  height:8px;
}
.reveal .slide-number {
  left: 8px;
  color: var(--v-primary-base);
  background-color: rgba(0,0,0,0);
  font-size: 18px;
}
.reveal section p {
  margin: 5px;
}
.reveal section img {
  border: 0px;
  background-color: rgba(0,0,0,0);
  box-shadow: 0 0 0px rgba(0, 0, 0, 0);
  margin-bottom: 0px;
}
.sectiontitle {
	font-weight: bolder;
  color: brown;
}
.slidetitle {
	font-weight: bolder;
  color: var(--v-primary-base);
}
.sub-item {
  font-size:smaller;
	font-weight: light;
  color : slategrey;
}
.message {
  font-size:larger;
  color : var(--v-primary-base);
}
.caption {
	font-size: 14px;
  color: var(--v-primary-base);
  text-align: right;
}
</style>
