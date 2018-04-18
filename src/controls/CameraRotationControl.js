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

import { Euler, Object3D, Vector2, Vector3 } from 'three.js';
import { TargetlessControl } from './TargetlessControl';
import { SWLUtils } from '../utils/SWLUtils';
import { POINTER } from '../utils/PointerUtils';


let euler = new Euler( 0, 0, 0, 'YXZ' );
// object to use for finding the zenith on screen
let obj = new Object3D();
// temp vectors
let v2tmp = new Vector2();
let v3tmp = new Vector3();

/**
 *  Control to rotate the camera based on change of object relative to
 *  the camera based on change in pointer position (position of the
 *  mouse or of the first touch).  It works by rotating
 *  the camera in by the negative in the change in direction to the pointer.
 */
class CameraRotationControl extends TargetlessControl {

	/**
	 *  Constructor.
	 *
	 *  @param {THREE.PerspectiveCamera} camera The camera around
	 *  which the target object will be rotated.
	 */
	constructor( camera, domElement, rollAllowed, loopAllowed ) {

		super( [ 'mouse', 'touch' ], true );

		this._camera = camera;
		this._domElement = domElement;
		this._noRoll = ! rollAllowed;
		this._noLoop = ! loopAllowed;

		//
		// Internals
		//

		// Start position for a move - projection of position of
		// previous event on target.
		this._startPos = new Vector2();

		// End position of a move, world coordinates (projection of
		// event position on target at time of move.
		this._endPos = new Vector2();

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


	/**
	 *  Save the intersection point as the start position for a future
	 *  move.
	 *
	 *  @param {Event} event The event being handled (not used).
	 *  @param {Object} intersection The raycaster intersection of the
	 *  event position with the control target.
	 *
	 *  @return {boolean} Whether the operation succeeded.  Always true.
	 */
	_doStart( event ) {

		POINTER.getEventPosition( event, this._startPos );
		return true;

	}

	/**
	 *  Rotate the camera by the angle between the vectors
	 *  camera-start point and camera-current point.  Optionally
	 *  restrain the rotation so that the camera is always pointing up
	 *  (no roll) and never goes beyond straight up or straight down.
	 *
	 *  @param {Event} event The event being handled (not used).
	 *  @param {Object} intersection The raycaster intersection
	 *  indicating the point under the mouse on the target object.
	 *
	 *  @return {boolean} Whether a rotation actually took place.
	 */
	_doChange( event ) {


		POINTER.getEventPosition( event, this._endPos );
		let success = this._rotateCamera();

		this._startPos.copy( this._endPos );
		return success;

	}

	_rotateCamera() {

		euler.setFromQuaternion( this._camera.quaternion );
		console.log( 'euler ' + JSON.stringify( euler ) );
		let elevation = euler.x;
		let rotation = Math.PI / 2 - euler.y;

		// zenith - a point far above the camera
		obj.position.copy( this._camera.up );
		obj.position.applyQuaternion( this._camera.quaternion );
		obj.position.multiplyScalar( 10000 );
		SWLUtils.toScreenPosition( obj, this._camera,
								   this._domElement.width, this._domElement.height,
								   v3tmp, v2tmp );
		let factor = this._camera.rotation.x > 0 ? 1 : - 1;
		if ( v2tmp !== null &&
			 v2tmp.y > ( this._endPos.y + this._startPos.y ) / 2 ) {

			factor *= - 1;

		}

		let height = this._domElement.height;
		let fov = Math.PI * this._camera.fov / 180;
		elevation += ( this._endPos.y - this._startPos.y ) * fov / height;
		rotation += - /*factor * */( this._endPos.x - this._startPos.x ) * fov / height;

		this._startPos.copy( this._endPos );

		elevation = Math.max( Math.min( elevation, Math.PI / 2 ), - Math.PI / 2 );
		rotation %= 2 * Math.PI;
		euler.set( elevation, Math.PI / 2 - rotation, 0, 'YXZ' );
		this._camera.quaternion.setFromEuler( euler );

	}

}

export { CameraRotationControl };
