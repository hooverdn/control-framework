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

import { Frustum, Raycaster, Vector2, Vector3 } from 'three.js';
import { SingleTargetControl } from './SingleTargetControl';
import { SWLUtils } from '../utils/SWLUtils';


/**
 * @author doguleez / http://www.doguleez.com
 */
class CameraDistanceControl extends SingleTargetControl {

	constructor( camera ) {

		super( [ 'mouse' ], true );

		this.camera = camera;

		this.raycaster = new Raycaster();

		// Set to false to disable this control
		this.enabled = true;

		//
		// internals
		//

		this._startPos = new Vector2();
		this._endPos = new Vector2();

		this._v1 = new Vector3();

		this._objectWorld = new Vector3();
		this._cameraLocal = new Vector3();
		this._cameraWorld = new Vector3();
		this._stretchVector = new Vector3();
		this._frustum = new Frustum();

	}

	_changeDistance( object, point, start, end, rate ) {

		rate = rate || 1;
		this._v1.subVectors( end, start );

		if ( this._v1.y !== 0 ) {

			let scale = this.getScale( rate );
			if ( this._v1.y > 0 ) scale = 1 / scale;
			return this._stretchDistance( object, point, scale );


		}

		return false;

	}


	/**
	 *  Multiply the vector from the camera to
	 *  <code>object.position</code> by the given <code>factor</code>
	 *  and move <code>object</code> to the corresponding new
	 *  position.  But only do this if the position given by
	 *  <code>point</code> on <code>object</code> is moved to a new
	 *  position that is still in the camera frustum.  (This
	 *  limitation is to prevent the object from being moved to a
	 *  position where a raycaster will no longer find it and it can
	 *  no longer be controlled.)
	 *
	 *  @param {THREE.Object3D} object - object to move.
	 *  @param {number} factor - scalar factor by which to multiply
	 *  the vector from camera to <code>object</code>.
	 *  @param {THREE.Vector3} point - a point in world coordinates.
	 *  If the stretch would move this point, relative to the
	 *  <code>object</code> position, to a point outside the camera
	 *  frustum, the stretch will not be performed.
	 */
	_stretchDistance( object, point, factor ) {

		// Convert to world coords; point is already in world coords.
		this._cameraLocal.copy( this.camera.position );
		SWLUtils.getWorldCoordinates( object, this._objectWorld );
		SWLUtils.getWorldCoordinates( this.camera, this._cameraWorld );
		this._stretchVector.subVectors( this._objectWorld, this._cameraWorld );
		this._stretchVector.multiplyScalar( factor );

		// new camera position
		this._cameraWorld.subVectors( this._objectWorld, this._stretchVector );
		SWLUtils.setWorldCoordinates( this.camera, this._cameraWorld );
		SWLUtils.computeCameraFrustum( this.camera, this._frustum );
		if ( this._frustum.containsPoint( point ) && this._frustum.containsPoint( this._objectWorld ) ) {

			return true;

		} else {

			// restore old camera position
			this.camera.position.copy( this._cameraLocal );
			return false;

		}

	}


	/**
	 *  @returns the amount to scale at the given rate (0.95^{rate},
	 *  empirically determined.
	 */
	getScale( rate ) {

		rate = rate || 1.0;
		return Math.pow( 0.95, rate );

	}

	/**
	 *  If this control is not enabled, do nothing.  Otherwise, set
	 *  the object in the first intersection as the target.  Record
	 *  the mouse position on screen as the starting point for a
	 *  future change event.  Emit a start event for the target.
	 *
	 *  @param {MouseEvent} A mouse event.
	 *  @param {Object[]} An array or raycaster intersections
	 *  indicating the controllable objects under the mouse.  Must be
	 *  defined and nonempty.
	 */
	_doStart( event ) {

		this._startPos.set( event.clientX, event.clientY );

		return true;

	}

	/**
	 *  If this control is not enabled, do nothing.
	 *
	 *  <p>Otherwise, if the object in the first intersection is the same
	 *  as the target, scale the vector from the camera to the target
	 *  by the square of the standard factor, either down (toward) if
	 *  the mouse movement was up (y coordinate increased) or up
	 *  (away) if the mouse movement was down (y coordinate
	 *  decreased).  Record the current mouse position as the starting
	 *  point for the next change event.  Emit a change event for the
	 *  target.
	 *
	 *  <p>Otherwise call the end handler.
	 *
	 *  @param {MouseEvent} A mouse move event.
	 *  @param {Object[]} An array or raycaster intersections
	 *  indicating the controllable objects under the mouse.  Must be
	 *  defined and nonempty.
	 */
	_doChange( event, intersection ) {

		this._endPos.set( event.clientX, event.clientY );

		let success = this._changeDistance( this._target, intersection.point, this._startPos, this._endPos, 2 );

		// update start pos regardless of success, because non-success
		// means "no move", not "too small to bother".
		this._startPos.copy( this._endPos );

		return success;

	}

}

export { CameraDistanceControl };
