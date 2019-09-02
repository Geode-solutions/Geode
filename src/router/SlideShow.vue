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
        <ul>
          <li>Geosciences</li>
          <li>Industrial quality</li>
          <li>Open source</li>
        </ul>
      </section>
      <section>
        <p class="slidetitle">Inheritance</p>
        <img src="@/assets/inheritance.svg" >
      </section>

      <section class="sectiontitle">II - OpenGeode requirements</section>
      <section>
        <section>
          <p class="slidetitle">Industrial quality</p>
          <p>What is needed?</p>
        </section>
        <section>
          <p class="slidetitle">Industrial quality</p>
          <p>Code quality</p>
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
        </section>
        <section>
          <p class="slidetitle">Industrial quality</p>
          <p>Export/Import</p>
        </section>
      </section>
      <section>
        <section>
          <p class="slidetitle">Open source model</p>
          <p>Core code is freely accessible on GitHub</p>
          <img src="@/assets/github.png" height="200"> Geode-solutions
          <p>Very permissive License (MIT)</p>
        </section>
        <section>
          <p class="slidetitle">Open source model</p>
          <p>Usage of open source dependancies:</p>
          <ul>
            <li>Async++: concurrency programming</li>
            <li>Bitsery: serialization of objects</li>
            <li>others...</li>
          </ul>
        </section>
        <section>
          <p class="slidetitle">Open source model</p>
          <p>Create of an open source ecosystem:</p>
          <ul>
            <li>Open the door to contributions</li>
            <li>Capitalize on open source projects</li>
          </ul>
          <p>Can be seen as one wide task force</p> 
          <img src="@/assets/groupe.jpg" height="300">
        </section>
      </section>
      <section>
        <p class="slidetitle">Extensibility</p>
        <p>Modules</p>
        <img src="@/assets/lego.jpg" height="300">
      </section>
      <section>
        <section>
          <p class="slidetitle">Redesigned UI<p>
          <p>JS, web based</p>
          <img src="@/assets/vue.png" height="300">
        </section>
        <section style="height: 100%">
          <vtk-view view-type="View3D:UI"/>
        </section>
      </section>

      <section class="sectiontitle">III - OpenGeode data model</section>
      <section>
        <section>
          <p class="slidetitle">Assembly of Components</p>
          <p>Corners, Lines, Surfaces, Blocks</p>
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
        <p>Enable easy model editing</p> 
      </section>

      <section class="sectiontitle">IV - Short demo</section>

      <section class="sectiontitle">Perspectives</section>
      <section>
        <p class="slidetitle">User Interface 
        <p>still in progress</p>
        <p>Soon open sourced</p>
        <p>If you want to stay tuned, follow us</p>
        <img src="@/assets/twitter.png" height="200"> @GeodeSolutions
      </section>

            <section>
        <p class="slidetitle">Thank you for your participation!</p>
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
.caption {
	font-size: 14px;
  color: var(--v-primary-base);
  text-align: right;
}
</style>
