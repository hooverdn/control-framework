/*
 * (MIT License)
 * Copyright 2017,2018  Douglas N. Hoover
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import { Frustum, Matrix4, Vector2, Vector3 } from 'three.js';

/**
 *  @namespace SWLUtils
 *  Utilities to help convert between screen, projected, world and
 *  local coordinates in Three.js.
 */
const SWLUtils = {

	/**
	 *  Get the position of <code>obj</code> in world coordinates.
	 *
	 *	This is here to parallel setWorldCoordinates&mdash;it just
	 *	wraps <code>obj.getWorldPosition.
	 *
	 *  @param {THREE.Object3D} obj - get the position of this <code>THREE.Object32</code>.
	 *  @param {THREE.Vector3} [world=new THREE.Vector3()] -
	 *  <code>THREE.Vector3</code> in which to return the world
	 *  coordinates.
	 *
	 *  @returns {THREE.Vector3} the position of <code>obj</code> in
	 *  world coordinates.
	 */
	getWorldCoordinates: function ( obj, world = new Vector3() ) {

		return obj.getWorldPosition( world );

	},

	/**
	 *  Get the position of <code>obj</code> using a vector in world coordinates.
	 *
	 *  @param {THREE.Object3D} obj - set the position of this <code>THREE.Object32</code>.
	 *  @param {THREE.Vector3} world - the world coordinates to set.
	 *
	 */
	setWorldCoordinates: function ( obj, world ) {

		obj.parent.updateMatrixWorld();
		obj.position.copy( world );
		obj.position.applyMatrix4( new Matrix4().getInverse( obj.parent.matrixWorld ) );

	},

	/**
     *  Convert a vector in world coordinates to local coordinates for
     *  the given object's parent.
	 *
	 *  @param {THREE.Object3D} obj - convert to local coordinates for this object's parent.
	 *  @param {THREE.Vector3} world - coordinates to convert.
	 *  @param {THREE.Vector3} [local=new THREE.Vector3()] - vector into which to return
	 *  the conversion of <code>world</code> to <code>obj</code>-local
	 *  coordinates.
	 *
	 *  @returns {THREE.Vector3} a vector containing the
	 *  <code>obj</code>-local conversion of <code>world</code>.
     */
	worldCoordinatesToLocal: function ( obj, world, local = new Vector3() ) {

		local.copy( world );

		obj.parent.updateMatrixWorld();
		obj.parent.worldToLocal( local );

		return local;

	},

	/**
	 *  Return the position of <code>obj</code> projected onto <code>camera</code>'s
	 *  near plane.
	 *
	 *  @param {THREE.Vector3} [vector=new THREE.Vector3()] - vector
	 *  into which to store the projection.
	 *
	 *  @returns {THREE.Vector3}
	 */
	getProjectedCoordinates: function ( obj, camera, vector = new Vector3() ) {

		vector = this.getWorldCoordinates( obj, vector );
		vector.project( camera );

		return vector;

	},

	/**
	 *  Convert a point on the camera's near plane to the point on the
	 *  screen, in <code>renderer.domElement</code> to which the
	 *  renderer will map it.
	 *
	 *  @param {THREE.Vector3()} vector - point on the camera's near plane.
	 *  @param {THREE.WebGLRenderer} renderer
	 *  @param {THREE.Vector2()} [screen=new THREE.Vector2()] - vector
	 *  in which the screen coordinates will be returned.  Its
	 *  coordinates will be set to <code>undefined</code> if
	 *  <code>vector</code> does not render to a point in
	 *  <code>renderer.domElement</code>.
	 *
	 *  @returns {THREE.Vector2()} the screen coordinates to which
	 *  <code>vector</code> will be rendered, or <code>null</code> if
	 *  <code>vector</code> does not render to a point in
	 *  <code>render.domElement</code>.
	 *
	 */
	projectedCoordinatesToScreen: function ( vector, screenWidth, screenHeight, screen = new Vector2() ) {

		var widthHalf = 0.5 * screenWidth;
		var heightHalf = 0.5 * screenHeight;

		screen.x = ( vector.x * widthHalf ) + widthHalf;
		screen.y = 	- ( vector.y * heightHalf ) + heightHalf;

		if ( screen.x >= 0 && screen.y >= 0 &&
			 screen.x < 2 * widthHalf && screen.y < 2 * heightHalf ) {

			return screen;

		} else {

			screen.set( undefined, undefined );
			return null;

		}

	},


	/**
	 *  Find the position on screen to which an object will be
	 *  rendered.
	 *
	 *  @param {THREE.Object3D} obj
	 *  @param {THREE.PerspectiveCamera} camera
	 *  @param {THREE.WebGLRenderer} renderer
	 *  @param {THREE.Vector2} [screen=new THREE.Vector2] point on
	 *  screen to which <code>obj.position</code> will be rendered.
	 *  Its coordinates will be set to undefined if
	 *  <code>obj.position</code> will not be rendered on screen.
	 *
	 *  @returns {THREE.Vector2()} the point on screen to which
	 *  <code>obj.position</code> will be rendered, or
	 *  <code>null</code> if it will not be rendered on screen.
	 */
	toScreenPosition: function ( obj, camera, screenWidth, screenHeight,
								 projected = new Vector3(),
								 screen = new Vector2() ) {

		this.getProjectedCoordinates( obj, camera, projected );
		return this.projectedCoordinatesToScreen( projected, screenWidth, screenHeight, screen );

	},

	/**
	 *  Map a vector representing the world coordinates of a point to
	 *  the point on the screen to which it will be rendered.
	 *
	 *  @param {THREE.Vector3} point - a vector representing the
	 *  world coordinates of a point in three dimensional space.
	 *  @param {THREE.PerspectiveCamera} camera
	 *  @param {THREE.WebGLRenderer} renderer
	 *  @param {THREE.Vector2} [screen=new THREE.Vector2()] - a vector
	 *  into which to store the screen coordinates to which
	 *  <code>point</code> will be rendered.  Its coordinates will be
	 *  set to <code>undefined</code> if the point does not render on screen.
	 *
	 *  @returns {THREE.Vector2} a vector containing the screen
	 *  coordinates to which <code>point</code> will be rendered, or
	 *  <code>null</code> if the point will not be rendered on screen.
	 */
	worldCoordsToScreen: function ( point, camera, screenWidth, screenHeight, screen = new Vector2() ) {

		point.project( camera );

		return this.projectedCoordinatesToScreen( point, screenWidth, screenHeight, screen );

	},


	/**
	 *  Convert a pair of screen coordinates to a point containing the
	 *  projected coordinates on the near camera plane that would render to it (0
	 *  for the z-coordinate).
	 *
	 *  @param {THREE.Vector2} screen
	 *  @param {THREE.WebGLRenderer} renderer
	 *  @param {THREE.Vector3} [projected=new THREE.Vector3()] -
	 *  vector in which to store the projected coordinates.
	 *
	 *  @returns {THREE.Vector3} a vector containing the projected
	 *  coordinates.
	 */
	screenCoordinatesToProjected: function ( screen, screenWidth, screenHeight, projected = new Vector3() ) {

		var widthHalf = 0.5 * screenWidth;
		var heightHalf = 0.5 * screenHeight;

		projected.set(

			( screen.x - widthHalf ) / widthHalf,
			- ( screen.y - heightHalf ) / heightHalf,
			0

		);

		return projected;

	},


	/**
	 *  Convert a point rendered to screen back to a point in world
	 *  coordinates on either the near or far plane of the camera.
	 *
	 *  @param {object} coords - relative coordinates of a point in
	 *  <code>renderer.domElement</code>.
	 *  @param {THREE.WebGLRenderer} renderer
	 *  @param {THREE.PerspectiveCamera} camera
	 *  @param {number} [plane=-1] - which plane to project
	 *  onto&mdash;the far plane if 1, otherwise the near plane.
	 *  @param {THREE.Vector3} [vector = new THREE.Vector3()] - vector
	 *  in which to return the computed coordinates.
	 *
	 *  @returns the position in world coordinates corresponding to
	 *  the input screen coordinates.
	 *
	 */
	screenCoordinatesToWorld: function (

		coords,
		screenWidth,
		screenHeight,
		camera,
		vector = new Vector3(),
		plane = - 1

	) {

		this.screenCoordinatesToProjected( coords, screenWidth, screenHeight, vector );

		vector.z = plane;
		vector.unproject( camera );

		return vector;

	},


	/**
	 *  Return the frustum of a perspective camera.
	 *
	 *  @param {THREE.PerspectiveCamera} camera
	 *  @param {THREE.Frustum} [frustum=new Three.Frustum()] - the frustum
	 *  that will be returned.
	 *
	 *  @returns {THREE.Frustum}
	 */
	computeCameraFrustum: function ( camera, frustum = new Frustum() ) {

		camera.updateMatrix(); // make sure camera's local matrix is updated
		camera.updateMatrixWorld(); // make sure camera's world matrix is updated
		camera.matrixWorldInverse.getInverse( camera.matrixWorld );

		frustum.setFromMatrix(

			new Matrix4().multiplyMatrices(

				camera.projectionMatrix,
				camera.matrixWorldInverse

			)

		);

		return frustum;

	},

};

// Temporary variable in which to compute projected coordinates in
// toScreenPosition.
//let projected = new Vector3();


export { SWLUtils };
