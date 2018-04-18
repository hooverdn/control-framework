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

// doguleez: This control is meant as a replacement for the rotation
// control in OrbitControls.js in case you want to rotate a number of
// individual objects individually instead of orbiting the camera
// around a target.	 The handling of listeners is considerably boiled
// down from what OrbitControls.js does, since we only have one
// control.	 If you want to use the panning and dollying/zooming
// aspect of OrbitControls in connection with this control, you can -
// just OrbitControls.enableRotate to false.

// Possibly OrbitControls could be made into a framework into which
// one can plug controls like this one, indicating which mouse and
// touch events they should use, the framework signaling overall
// updates.

import { Quaternion, Vector3 } from 'three.js';
import { SingleTargetControl } from './SingleTargetControl';
import { SWLUtils } from '../utils/SWLUtils';

/**
 *  Control to rotate an object by dragging mouse or touch over it.
 *  The goal is to rotate the object so that the same point on the
 *  object stays under the mouse or touch.
 */
class RotationControl extends SingleTargetControl {

	constructor() {

		super( [ 'mouse', 'touch' ], true );

		//
		// internals
		//

		this._rotateStart = new Vector3();

		// these are essentially temporary variables so we don't
		// always have to create and destroy them
		this._rotateEnd = new Vector3();
		this._startLocal = new Vector3();
		this._endLocal = new Vector3();
		this._v1 = new Vector3();
		this._v2 = new Vector3();
		this._q = new Quaternion();

	}

	// internal

	/**
	 *  Rotate the object by the angle between <code>start</code> and
	 *  <code>end</code> positions, in polar coordinates.  The object
	 *  will be rotated so that the unit vector from
	 *  <code>object.position</code> toward <code>start</code> is
	 *  moved to the unit vector from <code>object.position</code>
	 *  toward <code>end</code>.
	 *
	 *  <p>Unless the rotation is too small, in which case it will be
	 *  skipped and this method will return false.  In that case, the
	 *  calling code is expected to save the <code>start</code> point
	 *  and try again later if the desired <code>end</code> point
	 *  changes.
	 *
	 *  @param object {THREE.Object3D} - the object to rotate.
	 *  @param start {THREE.Vector3} - starting point of the rotation.
	 *  @param end {THREE.Vector3} - ending point of the rotation.
	 *
	 *  @returns {boolean} <code>true</code> if the object is actually
	 *  rotated, <code>false</code> if the implied rotation is too
	 *  small to be worth making.
	 */
	_rotate( object, start, end ) {

		let pos = object.position;

		// convert start and end to object-local
		SWLUtils.worldCoordinatesToLocal( object, start, this._startLocal );
		SWLUtils.worldCoordinatesToLocal( object, end, this._endLocal );

		this._v1.subVectors( this._startLocal, pos );
		this._v1.normalize();
		this._v2.subVectors( this._endLocal, pos );
		this._v2.normalize();

		this._q.setFromUnitVectors( this._v1, this._v2 );
		var sinHalfAngle = Math.sqrt( 1 - this._q.w * this._q.w );
		if ( sinHalfAngle > 1 / ( 2 << 62 ) ) {

			object.quaternion.premultiply( this._q );
			return true;

		}

		return false;

	}


	/**
	 *  Set the first object (object nearest the camera) in an array
	 *  of raycaster intersections as the object to be rotated and use
	 *  the point at which the ray intersects it as the starting point
	 *  of a potential rotation.  Dispatch an event <code>{ type:
	 *  'start', objects: [ object ] }</code> indicating that this
	 *  object is now the targeted object of this control.
	 *
	 *  <p>Does nothing if the control is not enabled.
	 *
	 *  @param event {MouseEvent} - the event being handled.  Not used.
	 *  @param intersections {Object[]} - a nonempty array of raycaster intersections.
	 *
	 *  @returns <code>false</code>.
	 */
	_doStart( event, intersection ) {

		this._rotateStart.copy( intersection.point );
		return true;

	}

	/**
	 *  If this control is not enabled or if there is no target, to nothing.
	 *
	 *  Otherwise, if the object is the same as the currently
	 *  controlled object, then we attempt to rotate the object from
	 *  the saved starting point to the current point.  If the
	 *  rotation is done, an event of type "change" for this object is
	 *  dispatched and the current point becomes the starting point
	 *  for the next rotation.  If the rotation is not done, we leave
	 *  the starting point unchanged and send no events.
	 *
	 *  <p> If the object is different from the one currently
	 *  controlled, call the <code>endHandler</code>.
	 *
	 *  @param event {MouseEvent} - the event being handled.  Not used.
	 *  @param intersections {Object[]} - an array of raycaster
	 *  intersections.  The 3-D object in the first (nearest)
	 *  intersection is taken as the object to be controlled and the
	 *  position in that intersection as the point to use as the end
	 *  point of the current rotation or the start point of the next
	 *  one.
	 *
	 *  @returns <code>false</code>.
	 */
	_doChange( event, intersection ) {

		this._rotateEnd.copy( intersection.point );

		if ( this._rotate( this._target, this._rotateStart, this._rotateEnd ) ) {

			this._rotateStart.copy( this._rotateEnd );
			return true;


		} else {

			return false;

		}

	}

}

export { RotationControl };
