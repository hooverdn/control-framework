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
class DistanceControl extends SingleTargetControl {

	constructor( controlCategories, camera ) {

		super( controlCategories, true );

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
		this._cameraWorld = new Vector3();
		this._stretchVector = new Vector3();
		//this._diffVector = new Vector3();
		this._newPoint = new Vector3();
		this._newPosition = new Vector3();
		this._frustum = new Frustum();
		this._temp2 = new Vector2();

	}

	changeDistance( object, point, start, end, rate ) {

		rate = rate || 1;
		this._v1.subVectors( end, start );

		if ( this._v1.y !== 0 ) {

			let scale = this.getScale( rate );
			if ( this._v1.y > 0 ) scale = 1 / scale;

			return this.stretchDistance( object, point, scale );

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
	stretchDistance( object, point, factor ) {

		// Convert to world coords; point is already in world coords.
		SWLUtils.getWorldCoordinates( object, this._objectWorld );
		SWLUtils.getWorldCoordinates( this.camera, this._cameraWorld );
		this._stretchVector.subVectors( this._objectWorld, this._cameraWorld );
		this._stretchVector.multiplyScalar( factor );


		// New position of object.
		this._newPosition.addVectors( this._stretchVector, this._cameraWorld );

		// The position to which the raycaster point will be moved.
		this._newPoint.subVectors( point, this._objectWorld );
		this._newPoint.add( this._newPosition );

		SWLUtils.computeCameraFrustum( this.camera, this._frustum );
		if ( this._frustum.containsPoint( this._newPoint ) && this._frustum.containsPoint( this._newPosition ) ) {

			SWLUtils.setWorldCoordinates( object, this._newPosition );
			return true;

		} else {

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

}


/**
 *  Control the distance of a target object from the camera using
 *  mouse movement.  If the mouse moves up, the object moves closer
 *  (and gets bigger) until the mouse is no longer on the target.  If
 *  the mouse moves down, the object moves away and get smaller.
 */
class DistanceMouseControl extends DistanceControl {

	/**
	 *  Constructor.
	 *
	 *  @param {THREE.PerspectiveCamera} camera The camera toward or
	 *  away from which the control will move the target object.
	 */
	constructor( camera ) {

		super( [ 'mouse' ], camera );

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
	_doStart( event /* , intersection */ ) {

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
	 *  @param {MouseEvent} event A mouse move event.
	 *  @param {Object} intersection An array or raycaster intersections
	 *  indicating the controllable objects under the mouse.  Must be
	 *  defined and nonempty.
	 */
	_doChange( event, intersection ) {

		this._endPos.set( event.clientX, event.clientY );

		if ( this.changeDistance( this._target, intersection.point, this._startPos, this._endPos, 2 ) ) {

			this._startPos.copy( this._endPos );
			return true;

		} else {

			return false;

		}

	}

}


/**
 *  A control that scales the distance between the camera and a target
 *  object based on a pinch gesture.  Requires at least a two-finger
 *  touch to use and only the first two fingers matter if there are
 *  more.
 */
class DistanceTouchControl extends DistanceControl {

	constructor( camera ) {

		super( [ 'touch' ], camera );

	}


	/**
	 *  It this control is not enabled, do nothing.  Otherwise, set
	 *  the object in the first (zero-th) intersection as the target
	 *  and remember the distance between the first two touches as the
	 *  starting distance for a future scaling.  Send a start event
	 *  for the new target.
	 *
	 *  @param {TouchEvent} event Must be a touch event with at least
	 *  two touches.
	 *
	 *  @param {Object[]} intersections Array of raycaster
	 *  intersections for possible target objects.  Must be defined
	 *  and nonempty.
	 */
	_doStart( event /*, intersection */ ) {

		this._temp2.set( event.touches[ 0 ].pageX - event.touches[ 1 ].pageX,
						 event.touches[ 0 ].pageY - event.touches[ 1 ].pageY );

		this._startPos.set( 0, - this._temp2.length() );

		return true;

	}

	/**
	 *  If this control is not enabled, do nothing.
	 *
	 *  <p>Otherwise, if the object in the first intersection is the
	 *  same as the current target, find the distance between the
	 *  first two touches and scale the distance from the camera
	 *  either up or down, depending on whether the distance between
	 *  touches has increased or decreased.  Emit a change event.
	 *
	 *  <p>Otherwise call the <code>endHandler</code>.
	 *
	 *  @param {TouchEvent} event Must be a touch event with at least
	 *  two touches.
	 *
	 *  @param {Object[]} intersections Array of raycaster
	 *  intersections for possible target objects.  Must be defined
	 *  and nonempty.
	 */
	_doChange( event, intersection ) {

		this._temp2.set( event.touches[ 0 ].pageX - event.touches[ 1 ].pageX,
						 event.touches[ 0 ].pageY - event.touches[ 1 ].pageY );
		this._endPos.set( 0, - this._temp2.length() );

		if ( this.changeDistance( this._target, intersection.point, this._startPos, this._endPos, 1.5 ) ) {

			this._startPos.copy( this._endPos );
			return true;

		} else {

			return false;

		}

	}

}


/**
 *  Control to scale the distance between its target object and the
 *  camera, moving the target object, using mouse wheel events.
 *
 *  <p>The wheel control does use a target the way other controls do,
 *  so it isn't really appropriate to send start and end events, so we will just override the <code>startHandler</code> and <code>changeHandler</code>, since we still want to in
 */
class DistanceWheelControl extends DistanceControl {

	/**
	 *  Constructor.  Just calls the constructor for DistanceControl.
	 *
	 *  @param {THREE.PerspectiveCamera} camera The camera relative to
	 *  which we scale distance.
	 */
	constructor( camera ) {

		super( [ 'wheel' ], camera );

	}

	/**
	 *  Same as <code>changeHandler</code>.
	 */
	startHandler( event, intersections ) {

		if ( ! this.enabled ) return false;

		this.changeHandler( event, intersections );
		return true;

	}

	/**
	 *  If this control is npt emabled, do nothing.
	 *
	 *  Otherwise, scale the vector from the camera to the object in
	 *  the first intersection up or down by the value returned by
	 *  <code>getScale</code>, provided that the stretch leaves the
	 *  intersection point inside the camera frustum.
	 *
	 *  @param {WheelEvent} event  A mouse wheel event.
	 *  @param {Object[]} intersections An array of raycaster
	 *  intersections indicating the controllable objects under the
	 *  mouse position.  The array must be defined and nonempty.
	 */
	changeHandler( event, intersections ) {

		if ( ! this.enabled || intersections.length === 0 ) return false;

		let intersection = intersections[ 0 ];
		let target = intersection.object;

		if ( event.deltaY !== 0 ) {

			let scale = this.getScale();
			if ( event.deltaY < 0 ) scale = 1 / scale;

			if ( this.stretchDistance( target, intersection.point, scale ) ) {

				this.dispatchEvent( { type: 'change', objects: [ target ] } );

			}

		}

		return true;

	}

}

export { DistanceMouseControl, DistanceTouchControl, DistanceWheelControl };
