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

import { Vector2 } from 'three.js';
import { TargetlessControl } from './TargetlessControl';


/**
 * @author doguleez / http://www.doguleez.com
 */
class CameraZoomControl extends TargetlessControl {

	constructor( camera, minZoom, maxZoom ) {

		super( [ 'mouse' ], true );

		this.camera = camera;
		this.minZoom = minZoom;
		this.maxZoom = maxZoom;

		//
		// internals
		//

		this._startPos = new Vector2();
		this._endPos = new Vector2();

		this._delta = new Vector2();

	}

	_changeZoom( start, end, rate ) {

		rate = rate || 1;
		this._delta.subVectors( end, start );

		if ( this._delta.y !== 0 ) {

			let scale = this.getScale( rate );
			if ( this._delta.y < 0 ) scale = 1 / scale;
			return this._changeZoom1( scale );


		}

		return false;

	}


	/**
	 *  Multiply the camera's zoom
	 *  by the given <code>factor</code>.
	 *
	 *  @param {number} factor - scalar factor by which to multiply
	 *  camera zoom.
	 *
	 *  @return {boolean} Whether the camera zoom actually changed.
	 */
	_changeZoom1( factor ) {

		let zoom = factor * this.camera.zoom;
		zoom = Math.max( Math.min( zoom, this.maxZoom ), this.minZoom );

		if ( zoom !== this.camera.zoom ) {

			this.camera.zoom = zoom;
			this.camera.updateProjectionMatrix();
			return true;

		} else {

			return false;

		}

	}


	/**
	 *  @returns the amount to scale at the given rate (0.95^{rate}),
	 *  arrived at by trial and error.
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
	_doChange( event ) {

		this._endPos.set( event.clientX, event.clientY );

		this._changeZoom( this._startPos, this._endPos, 2 );

		// update start pos regardless of success, because non-success
		// means "no move", not "too small to bother".
		this._startPos.copy( this._endPos );

		// we are still active
		return true;

	}

}

export { CameraZoomControl };
