A Control Framework for three.js
================================

The idea of this project is to provide a system
for writing controls in `three.js` so that:

- Each control does one specific thing, such as rotate, move, or scale
  an object or rotate or move the camera.
- Provide a class hierarchy to take care of most of the housekeeping
  of writing a control, so that, when you write one, you can just focus
  on the functionality.
- Provide a control manager that can assign one or more controls to
  handle mouse or touch events with different buttons pressed or
  gestures.

If a mouse or touchpad is used, the handler triggered can also depend
on which shift keys are pressed.


### Example: Duality of Platonic Solids ###

In the `examples` there is a simple application that illustrates
duality among platonic solids and demonstrates the variety of things
that can be done with the control framework.  You can see it in action
on <a href="https://www.doguleez.com/3d/duality"
target="_blank">doguleez.com</a> or you can build it and serve it
yourself as described below.

The initial page of the describes the different things you can do with
the controls in it.


### Building the Control Framework ###

Note that this repository contains pre-built versions of the control
framework library and the duality example, so you don't have to build
unless you make changes to the code.  Further, the whole thing is
written with ES6 modules, so with minor tinkering you can just
use those directly and never build.

To build:

First, install `node.js`, if necessary.  Then:

    $ git clone <control framework url>
    $ cd control-framework
    $ npm install

Now do the following:

    $ npm run lib
	$ npm run duality

The first builds (concatenates) the framework library and the second does the same for the duality javascript, both using rollup.  It also builds concatenated ES6 modules for each.

Or you can do:

	$ npm run build-uglify
	$ npm run build-uglify-duality

which also compress the concatenated code and prepend the license.
But compressing is not really necessary because the code is quite
small.


### Serving the Duality Example ###

From the project root directory or from a directory
containing it, you can serve the planetarium though your favorite HTTP
server.  You will need to use an HTTP server rather than simply
reading `heliocentric.html` or `heliocentric-mobile.html` from file,
because browsers do not permit some WebGL operations for a page read
from file.

I use `http-server`, which you can install using `npm`.

    $ npm install http-server
    $ http-server -c-1

The "`-c-1`" is to prevent browser caching (because you are doing
development and always want the browser to use your latest code).

Now you should be able to access the duality example at

    http://localhost:8080/examples/index.html

This page gives instructions on how to use the controls.
