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

/**
 * @author doguleez / http://www.doguleez.com
 */

import { Spherical, Vector3 } from 'three.js';
import { SingleTargetControl } from './SingleTargetControl';
import { SWLUtils } from '../utils/SWLUtils';

/**
 *  Control to move a target object relative to the camera based on
 *  change in pointer position (position of the mouse or of the first
 *  touch).  It works by changing the direction from the camera to the
 *  target according to how the pointer moves.
 */
class CameraMoveControl extends SingleTargetControl {

	/**
	 *  Constructor.
	 *
	 *  @param {THREE.PerspectiveCamera} camera The camera around
	 *  which the target object will be rotated.
	 */
	constructor( camera ) {

		super( [ 'mouse' ], true );

		this._camera = camera;

		// Set this variable to false to disable this control
		this.enabled = true;

		//
		// Internals
		//

		// Target object
		this._target = null;

		// Start position for a move - projection of position of
		// previous event on target.
		this._startPos = new Vector3();

		// Temporaries created once here so we don't need to create
		// them everytime we need to use them.

		// End position of a move, world coordinates (projection of
		// event position on target at time of move.
		this._endPos = new Vector3();

		// Vector from camera to target, move start position, and move
		// end position, world coordinatese.
		this._v0 = new Vector3();
		this._v1 = new Vector3();
		this._v2 = new Vector3();

		// Spherical coordinates for _v1, _v2, _v3.
		this._s0 = new Spherical();
		this._s1 = new Spherical();
		this._s2 = new Spherical();

		// World coordinates of target and camera.
		this._targetWorld = new Vector3();
		this._cameraWorld = new Vector3();

	}

	/**
	 *  Find the spherical angles relative to the camera from the
	 *  position of the previous event to the position for this event.
	 *  Move the current target by adding these angles to its current
	 *  spherical angles relative to the camera.
	 */
	// _changeDirection() {

	// 	SWLUtils.getWorldCoordinates( this._target, this._targetWorld );
	// 	SWLUtils.getWorldCoordinates( this._camera, this._cameraWorld );

	// 	this._v0.subVectors( this._endPos, this._startPos );
	// 	this._v1.subVectors( this._targetWorld, this._cameraWorld ).normalize();
	// 	this._v0.projectOnPlane( this._v1 );

	// 	this._v0.multiplyScalar( 1.5 );
	// 	this._cameraWorld.sub( this._v0 );
	// 	SWLUtils.setWorldCoordinates( this._camera, this._cameraWorld );

	// 	return true;

	// }
	_changeDirection() {

		SWLUtils.getWorldCoordinates( this._target, this._targetWorld );
		SWLUtils.getWorldCoordinates( this._camera, this._cameraWorld );

		this._v0.subVectors( this._cameraWorld, this._targetWorld );
		this._v1.subVectors( this._cameraWorld, this._startPos );
		this._v2.subVectors( this._cameraWorld, this._endPos );

		this._s0.setFromVector3( this._v0 );
		this._s1.setFromVector3( this._v1 );
		this._s2.setFromVector3( this._v2 );

		this._s0.phi += this._s2.phi - this._s1.phi;
		this._s0.theta += this._s2.theta - this._s1.theta;

		this._cameraWorld.setFromSpherical( this._s0 );
		this._cameraWorld.add( this._targetWorld );
		SWLUtils.setWorldCoordinates( this._camera, this._cameraWorld );

		return true;

	}

	/**
	 *  It this control is enabled, set the object in the first
	 *  (zero-th) intersection as the target and set the intersection
	 *  point as the start position for a future move.  Send a start
	 *  event for this new target.
	 *
	 *  @param {Object[]} intersections Array of raycaster
	 *  intersections for possible target objects.  Must be defined
	 *  and nonempty.
	 */
	_doStart( event, intersection ) {

		this._startPos.copy( intersection.point );
		return true;

	}

	/**
	 *  If this control is npt emabled, do nothing.
	 *
	 *  <p>Otherwise, if the object in the first intersection is the same as the
	 *  target, rotate it around the camera by the angle between the
	 *  vector from the camera to the start position and the vector
	 *  from the camera to this new intersection point.  Emit a change
	 *  event for the target.
	 *
	 *  <p>Otherwise call the <code>endHandler</code>.
	 *
	 *  @param {Object[]} intersections Array of raycaster
	 *  intersections for possible target objects.  Must be defined
	 *  and nonempty.
	 */
	_doChange( event, intersection ) {

		this._endPos.copy( intersection.point );

		// _startPos should have moved to approximately _endPos.  Do
		// we need to adjust _startPos at all?

		return this._changeDirection();

	}

}

export { CameraMoveControl };
