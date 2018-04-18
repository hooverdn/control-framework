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


class InvalidArgumentException extends Error {

	constructor( message ) {

		super( message );
		this.name = 'InvalidArgumentException';

	}

}

const EVENT_CATEGORIES = [

	'mouse',
	'touch',
	'wheel'

];


/**
 *  @namespace MOUSE_BUTTONS
 *  Codes for mouse buttons as used by MouseEvent.buttons.
 */
const MOUSE_BUTTONS = {

	// Official names
	PRIMARY: 1,
	SECONDARY: 2,
	AUXILIARY: 4,
	FOURTH: 8,
	FIFTH: 16,

	// Common names
	LEFT: 1,
	RIGHT: 2,
	MIDDLE: 4,
	WHEEL: 4,
	BACK: 8,
	FORWARD: 16,

};


/**
 *  @namespace POINTER
 *  Utilities to help with pointer events.
 */
const POINTER = {

	/**
	 *  Return the screen position associated with a mouse, touch, or
	 *  wheel event.
	 *
	 *  @param {Event} A mouse, touch, or wheel event.
	 *  @param {THREE.Vector2} [pos=new THREE.Vector2()] A vector in
	 *  which to store the position.
	 *  @param {number} touchNo The touch to use for the position,
	 *  counting from 0, or the last touch if there are not this many.
	 *
	 *  @return The vector <code>pos</code> with the position stored in it.
	 *  @throws {InvalidArgumentException} If <code>event</code> is
	 *  not the right kind of event.
	 */
	getEventPosition: function ( event, pos, touchNo ) {

		let posX, posY;

		var tp = event.type;
		if ( ! tp ) {

			throw new InvalidArgumentException( 'event.type undefined' );

		} else if ( tp === 'wheel' || tp.indexOf( 'mouse' ) === 0 ) {

			posX = event.clientX;
			posY = event.clientY;

		} else if ( tp.indexOf( 'touch' ) === 0 ) {

			touchNo = 0 || touchNo;
			touchNo = Math.min( touchNo, event.touches.length - 1 );

			posX = event.touches[ touchNo ].clientX;
			posY = event.touches[ touchNo ].clientY;

		} else {

			throw new InvalidArgumentException( 'bad event.type' );

		}

		pos = pos || new Vector2();
    	pos.set( posX, posY );

	}

};

export {

	InvalidArgumentException,
	EVENT_CATEGORIES,
	MOUSE_BUTTONS,
	POINTER

};
