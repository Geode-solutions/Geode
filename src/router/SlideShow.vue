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
      
      <section>
        <p class="sectiontitle">Introduction</p> 
          Why another data model dedicated to Geosciences?
      </section>
      <section> 
        <span class="slidetitle">The geomodeling goal is simulating physics</span><br/> 
        <p>Geological model</p> 
        <p class="sub-item">Describe geometry and properties</p> 
        <!-- Add vertical space -->
        <p>Physical simulations</p> 
        <p class="sub-item">Response to these geometry and properties</p> 
        <p class="message"> Meshes are used to transcribe geometry and properties to simulators</p>
      </section>
      <section>
        <span class="slidetitle">BRep for CAD</span><br/>
        <img src="@/assets/Plane-Model.jpg" height="300">
        <p class="caption">Copyright © 2019 NeoMetrix Technologies, Inc.</p>

        <p>Need of a BRep in CAD for meshing solid</p>
        <ul>
          <li>Mesh conformity</li>
          <li>Tags on mesh elements</li>
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
        <p class="slidetitle">First attempts</p>
        <img src="@/assets/attempt.svg" >
      </section>
      <section>
        <p class="slidetitle">Key points </p>
        <p class="py-5">Need for a data model that is:</p>
        <ul>
          <li class="fragment">Dedicated for Geosciences</li>
          <li class="fragment">Reliable (industrial quality)</li>
          <li class="fragment">Handy (open, flexible, ...)</li>
        </ul>
        <p class="message fragment py-5">No data model combine these three points.</p>
      </section>
      <section>
        <p class="slidetitle">Inheritance</p>
        <img src="@/assets/inheritance.svg" >
      </section>

      <section class="sectiontitle">I - OpenGeode: requirements</section>
      <section>
        <section>
          <p class="slidetitle">Industrial quality</p>
          <p>What is needed?</p>
          <p class="fragment">Reliability</p>
        </section>
        <section>
          <p class="slidetitle">Industrial quality</p>
          <p>Code quality</p>
          <p class="sub-item">Modern programming (CMake, C++, ...)</p>
        </section>
        <section>
          <p class="slidetitle">Industrial quality</p>
          <p>Multi-platform</p>
          <p>Pre-compiled binaries for <br/> Linux, Windows and macOS</p>
          <img src="@/assets/linux.jpeg" height="200">
          <img src="@/assets/windows.png" height="200">
          <img src="@/assets/apple.png" height="200">
        </section>
                <section>
          <p class="slidetitle">Industrial quality</p>
          <p>Continuous Integration</p>
          <p>Continuous Deployment</p>
          <p class="sub-item">Using GitHub and Azure DevOps</p>
        </section>
        <section>
          <p class="slidetitle">Industrial quality</p>
          <p>Export/Import</p>
          <p class="sub-item">From/to standard mesh file formats (stl, ply, obj)</p>
          <p class="sub-item">From/to geological standard RESQML</p>
        </section>
      </section>
      <section>
        <section>
          <p class="slidetitle">Open model</p>  
          <p>Core code is freely accessible on GitHub</p>
          <div class="align-center">
            <img src="@/assets/github.png" height="200"> 
             Geode-solutions
          </div>
          <p class="sub-item">Very permissive License (MIT)</p>
        </section>
        <section>
          <p class="slidetitle">Open model</p>
          <p>Usage of open source dependancies:</p>
          <ul>
            <li>Async++: concurrency programming</li>
            <li>Bitsery: serialization of objects</li>
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
        <p class="sub-item">Template repository, flexible data structures</p>
        <img src="@/assets/lego.jpg" height="250">
      </section>
      <section>
        <section>
          <p class="slidetitle">Redesigned UI<p>
          <p>Using JS and web-based technologies</p>
          <img src="@/assets/vue.png" height="150" class="mx-5"> 
          <img src="@/assets/vuetify.png" height="150" class="mx-5">
        </section>
        <section style="height: 100%">
          <vtk-view view-type="View3D:UI"/>
        </section>
      </section>

      <section class="sectiontitle">II - OpenGeode: data model</section>
      <section>
        <section>
          <p class="slidetitle">Models are assemblies of Components</p>
          <p class="sub-item">Corners, Lines, Surfaces, Blocks</p>
        </section>
        <section style="height: 100%">
          <vtk-view view-type="View3D:assembly"/>
        </section>
      </section>
      <section>
        <section>
          <p class="slidetitle">Data structure</p>
          <p>Mixins</p>
        </section>
        <section>
          <pre><code>
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
        <p class="slidetitle">Non continuous indexing</p>
        <p>Using unordered maps of UUIDs</p>
        <p class="message">Enable easy model editing</p> 
      </section>

      <section class="sectiontitle">III - Short demo</section>

      <section class="sectiontitle">Conclusions and perspectives</section>
      <section>OpenGeode is designed to be a framework
          <ul>
            <li>Dedicated to Geosciences</li>
            <li class="fragment">Handy & Open</li>
            <li class="fragment">Reaching industrial quality</li>
            <li class="fragment">Highly extensible</li>
          </ul>
      </section>

      <section>
        <p class="slidetitle">User Interface 
        <p>Still in progress</p>
        <p class="fragment">Soon open sourced (by the end of 2019)</p>
        <div class="fragment">
          <p class="sub-item mt-5 pt-5">If you want to stay tuned, follow us</p>
          <img src="@/assets/twitter.png" height="100"> @GeodeSolutions
        </div>
      </section>

      <section>
        <p class="slidetitle">So now...</p>
        <p>We think we are fully equipped to
        design tools for meshing/remeshing<br/>
        <b>100% of valid geological models.</b></p>
        <p class="message fragment">Planned for the next RINGMeeting!</p>
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
    Reveal.initialize({slideNumber: true});
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
