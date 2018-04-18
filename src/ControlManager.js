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

import { Raycaster, Vector2 } from 'three.js';
import { InvalidArgumentException } from './utils/PointerUtils';

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

const pointerCursor = 'pointer';
const defaultCursor = 'default';

// IE and possibly older versions of other browsers.
if ( ! Array.prototype.includes ) {

	Array.prototype.includes = function ( elem, start ) {

		start = start || 0;
		start = Math.max( start, 0 );

		for ( let idx = start; idx < this.length; idx ++ ) {

			if ( this[ idx ] === elem ) return true;

		}

		return false;

	};

}

/**
 *  A class to support using mouse, touch, or wheel events to
 *  manipulate any of a set of objects that the mouse is over or that
 *  is being touched.
 *
 *  Events are divided into categories:
 *
 *  <ul>
 *    <li>
 *       Mouse event together with a set of mouse buttons that are down
 *       when the event occurs.
 *    <li>
 *       Touch together with the number of touches in the event.
 *    </li>
 *    <li>
 *       Wheel.
 *    </li>
 *  </ul>
 *
 *  <p> A list of subcontrols with suitable event handling methods is
 *  associated with each category of event.  When an event in the
 *  category occurs, the controls in the category's list are invoked
 *  in order.
 *
 *  <p>A raycaster is used to determine what objects, if any, are
 *  under the mouse or touch.  Internally, local coordinates are
 *  converted to world coordinates, so neither objects nor camera need
 *  be immediate children of the scene.
 *
 *  <p>The subcontrols gathered in this aggregator are expected to
 *  move the objects rather than the camera, but it is possible to
 *  combine object controls with other controls like TrackballControls
 *  or OrbitControls, as the ControlManager will not stop
 *  propagation unless the control list for the category of event that
 *  has occurred is nonempty and there are target objects under the
 *  mouse or touch.  To avoid confusion on the part of the user, it
 *  will usually be best to avoid using managed controls for event
 *  categories that any unmanaged control will handle.
 *
 *  <p>For touch events, the location (<code>clientX</code>,
 *  <code>clientY</code>) of <code>event.touch[ 0 ] is used to
 *  determine which objects are affected.
 */
class ControlManager {

	/**
	 *  Constructor.
	 *
	 *  @param {THREE.PerspectiveCamera} camera - the camera will be
	 *  to initialize a raycaster to determine which objects, if any
	 *  are under the mouse pointer or touch.
	 *
	 *  @param domElement - the DOM element on which to listen for
	 *  events.  Typically this will be the renderer's
	 *  <code>domElement</code>.
	 *
	 *  @param {Array} - array of <code>THREE.Object32</code> target
	 *  objects that will be manipulated by this control's
	 *  subcontrols.  Each object must be detectable by a
	 *  <code>THREE.Raycaster</code>.  If you want to manipulate an
	 *  object that is not, such as a group, wrap it in a
	 *  <code>ControlledObjectWrapper</code> and use the wrappers
	 *  <code>sphere</code> element in this list of controlled
	 *  objects.
	 */
	constructor( camera, domElement, objects ) {

		this._camera = camera;
		this._domElement = domElement;
		this._objects = objects || [];
		this._controls = {

			mouse: [],
			touch: [],
			wheel: []

		};
		this._targetlessControls = {

			mouse: [],
			touch: [],
			wheel: []

		};
		this._currentControls = null;
		this._currentCategory = '';
		this._currentNum = 0;
		this._currentFlags = 0;

		this._prevButtons = 0;
		this._prevTouches = 0;

		this._raycaster = new Raycaster();

		this.enabled = true;

		this._mouse = new Vector2();


		// Define event handlers here, not to keep them truly private,
		// but because we have to make a closure anyway to use them as
		// event handlers.

		let self = this;


		/**
		 *  Handler for events that should clear the state of ("end")
		 *  all controls in the active control set.
		 *
		 *  @param {MouseEvent} event - the event to handle.
		 */
		this.onCancelEvent = function ( event ) {

			// there are supposed to be no "cancel" event handlers
			//self._onEvent( event, event.clientX, event.clientY, 'cancel', 0 );
			self._signalCurrentControls( 'endHandler', event, null );
			self._currentControls = null;

		};

		/**
		 *  Use mouse controls for <code>event.buttons</code> to handle the
		 *  event, controlling objects under the mouse point.
		 *
		 *  @param {MouseEvent} event - the event to handle.
		 */
		this.onMouseEvent = function ( event ) {

			self._onEvent( event, event.clientX, event.clientY, 'mouse', event.buttons );

		};

		/**
		 *  Use mouse touch for <code>event.touches.length</code> to
		 *  handle the event, controlling objects under the client
		 *  coordinates for <code>event.touches[ 0 ]</code>.
		 *
		 *  @param {TouchEvent} event - the event to handle.
		 */
		this.onTouchEvent = function ( event ) {

			// If event.touches.length is 0, no TouchEvent controller
			// should be triggered because none should be registered
			// for 0 touches.

			let len = event.touches.length;
			self._onEvent(

				event,
				len > 0 ? event.touches[ 0 ].clientX : 0,
				len > 0 ? event.touches[ 0 ].clientY : 0,
				'touch',
				len

			);

		};

		/**
		 *  Use wheel controls to handle the
		 *  event, controlling objects under the mouse point.
		 *
		 *  @param {WheelEvent} event - the event to handle.
		 */
		this.onWheelEvent = function ( event ) {

			self._onEvent( event, event.clientX, event.clientY, 'wheel', 0 );

		};


		/**
		 *  Send an event, with intersections, to all controls in the
		 *  current control set, calling the method indicated by
		 *  <code>handler</code>.
		 *
		 *  @param handler - Name of the handler method to call on each control.
		 *  @param event - The event.
		 *  @param intersections - The raycaster intersections for the
		 *  target objects under the pointer when the event occurred.
		 */
		this._signalCurrentControls = function ( handler, event, intersections ) {

			const controls = self._currentControls;
			const len = controls ? controls.length : 0;
			let haveActiveControl = false;
			for ( let idx = 0; idx < len; idx ++ ) {

				haveActiveControl =
					controls[ idx ][ handler ]( event, intersections ) ||
					haveActiveControl;

			}

			// return whether a control is active
			return haveActiveControl;

		};

		this._domElement.addEventListener( 'mousedown', this.onMouseEvent, false );
		this._domElement.addEventListener( 'mousemove', this.onMouseEvent, false );
		this._domElement.addEventListener( 'mouseup', this.onMouseEvent, false );
		this._domElement.addEventListener( 'mouseout', this.onCancelEvent, false );

		this._domElement.addEventListener( 'wheel', this.onWheelEvent, false );

		this._domElement.addEventListener( 'touchstart', this.onTouchEvent, false );
		this._domElement.addEventListener( 'touchend', this.onTouchEvent, false );
		this._domElement.addEventListener( 'touchmove', this.onTouchEvent, false );
		this._domElement.addEventListener( 'touchcancel', this.onTouchEvent, false );

	}

	//
	// public methods
	//

	/**
	 *  Remove all event listeners when done with this <code>ControlManager</code>.
	 */
	dispose() {

		this._domElement.removeEventListener( 'mousedown', this.onMouseEvent, false );
		this._domElement.removeEventListener( 'mousemove', this.onMouseEvent, false );
		this._domElement.removeEventListener( 'mouseup', this.onMouseEvent, false );
		this._domElement.removeEventListener( 'mouseout', this.onCancelEvent, false );

		this._domElement.removeEventListener( 'wheel', this.onWheelEvent, false );

		this._domElement.removeEventListener( 'touchstart', this.onTouchEvent, false );
		this._domElement.removeEventListener( 'touchmove', this.onTouchEvent, false );
		this._domElement.removeEventListener( 'touchend', this.onTouchEvent, false );

	}

	/**
	 *  Append a list of controls to manage under the given category.
	 *
	 *  @param {string} category - 'mouse', 'touch', or 'wheel'.
     *  @param {number} num - if <code>category</code> is 'mouse', the
     *  codes for the required mouse buttons, ORed together.  If
     *  'touch', the number of fingers that must be touching.  If
     *  'wheel', the number 0.
	 *  @param {ObjectControl[]} - The controls to manage.
	 *  @throws {InvalidArgumentException} If any of the controls does
	 *  not support event category <code>category</code>.  No controls
	 *  will be added.
	 */
	_addControls( category, num, flags, controls ) {

		const len = controls.length;

		for ( let idx = 0; idx < len; idx ++ ) {

			if ( ! controls[ idx ].supportsEventCategory( category ) ) {

				throw new InvalidArgumentException( controls[ idx ].constructor.name + ' does not support event category ' + category );

			}

		}

		let controlCat = this._controls[ category ];
		if ( ! controlCat[ num ] ) {

			controlCat[ num ] = [];

		}
		if ( ! controlCat[ num ][ flags ] ) {

			controlCat[ num ][ flags ] = [];

		}

		// XXX: reset all the controls here ?
		for ( let idx = 0; idx < len; idx ++ ) {

			controlCat[ num ][ flags ].push( controls[ idx ] );

		}

	}

	_addTargetlessControls( category, num, flags, controls ) {

		const len = controls.length;

		for ( let idx = 0; idx < len; idx ++ ) {

			if ( ! controls[ idx ].supportsEventCategory( category ) ) {

				throw new InvalidArgumentException( controls[ idx ].constructor.name + ' does not support event category ' + category );

			}

		}

		let controlCat = this._targetlessControls[ category ];
		if ( ! controlCat[ num ] ) {

			controlCat[ num ] = [];

		}
		if ( ! controlCat[ num ][ flags ] ) {

			controlCat[ num ][ flags ] = [];

		}

		// XXX: reset all the controls here ?
		for ( let idx = 0; idx < controls.length; idx ++ ) {

			controlCat[ num ][ flags ].push( controls[ idx ] );

		}

	}

	/**
	 *  Append a list of controls to handle mouse events with the given
	 *  set of buttons pressed.
	 *
	 *  @param {number} - a number formed by ORing together the codes
	 *  (as used by <code>MouseEvent.buttons</code>) that must be
	 *  pressed for these controls to handle a
	 *  <code>MouseEvent</code>.
	 *  @param {ObjectControl[]} controls - the controls being added.
	 */
	addMouseControl( buttons, flags, ...controls ) {

		this._addControls( 'mouse', buttons, flags, controls );

	}

	addTargetlessMouseControl( buttons, flags, ...controls ) {

		this._addTargetlessControls( 'mouse', buttons, flags, controls );

	}

	/**
	 *  Append a list of controls to handle touch events with the given
	 *  set of buttons pressed.
	 *
	 *  @param {number} - the number of fingers that must be touching
	 *  (<code>TouchEvent.touches/length</code>) for these controls to
	 *  handle a <code>TouchEvent</code>.  Must be positive.
	 *  TouchEvents with 0 touches can only happen as touchend events.
	 *  They will trigger a control state reset, but no control
	 *  action.
	 *  @param {ObjectControl[]} controls - the controls being added.
	 */
	addTouchControl( touchCount, flags, ...controls ) {

		if ( touchCount < 0 ) {

			throw new Error( 'touchCount nonpositive in addTouchControl' );

		}

		this._addControls( 'touch', touchCount, flags, controls );

	}

	/**
	 *  Append a list of controls to handle touch events with the given
	 *  set of buttons pressed.
	 *
	 *  @param {number} - the number of fingers that must be touching
	 *  (<code>TouchEvent.touches/length</code>) for these controls to handle a
	 *  <code>TouchEvent</code>.
	 *  @param {ObjectControl[]} controls - the controls being added.
	 */
	addWheelControl( flags, ...controls ) {

		this._addControls( 'wheel', 0, flags, controls );

	}

	// should we allow only one copy of each control?
	/**
	 *  Remove a control from the control list belonging to the given
	 *  category and number.  Does nothing if the control is not in
	 *  that list.
	 *
	 *
	 */
	_removeControl( category, num, flags, control ) {

		let controls =	this._controls[ category ][ num ][ flags ];

		if ( controls ) {

			for ( let idx = controls.indexOf( control );
				  idx !== - 1;
				  idx = controls.indexOf( control ) ) {

				controls.splice( idx, 1 );

			}

		}

	}


	/**
	 *  Remove a control from the list of controls for handling mouse
	 *  events with the given set of buttons pressed.
	 *
	 *  @param {number} buttons - value of MouseEvent.buttons
	 *  corresponding to the list of controls to be used.
	 *  @param {ObjectControl} control - the control to be removed.
	 */
	removeMouseControl( buttons, flags, control ) {

		this.removeControl( 'mouse', buttons, flags, control );

	}


	/**
	 *  Remove a control from the list of controls for handling mouse
	 *  events with the given set of buttons pressed.
	 *
	 *  @param {number} touchCount - remove the control from the list
	 *  of controls that handle touches with <code>touchCount</code>
	 *  fingers touching the screen.  corresponding to the list of
	 *  controls to be used.
	 *  @param {ObjectControl} control - the control to be removed.
	 */
	removeTouchControl( touchCount, flags, control ) {

		this.removeControl( 'touch', touchCount, flags, control );

	}


	/**
	 *  Remove a control from the list of controls used to handle
	 *  wheel events.  If the control is not on the list, nothing will
	 *  happen.
	 *
	 *  @param {ObjectControl} control - the control to be removed.
	 */
	removeWheelControl( control ) {

		this.removeControl( 'wheel', 0, control );

	}


	/**
	 *  Add an object to the set of controlled objects.  The object
	 *  will not be added again if the object is already being controlled.
	 *
	 *  @param {THREE.Object3D} object - new object to control.
	 */
	addObject( object ) {

		if ( this._objects.indexOf( object ) === - 1 ) {

			this._objects.push( object );

		}

	}


	/**
	 *  Remove an object from the set of controlled objects.  Nothing
	 *  happens if the object is not being controlled.
	 *
	 *  @param {THREE.Object3D} object - object to remove from control.
	 */
	removeObject( object ) {

		let objects = this._objects;

		let idx = objects.indexOf( object );
		if ( idx !== - 1 ) {

			objects.splice( idx, 1 );

		}

	}


	//
	// internals
	//

	/**
	 *  Use a raycaster to get a list of raycaster intersections (in
	 *  order of distance from the camera) for objects whose
	 *  projections onto the screen contain the given screen
	 *  coordinates.
	 */
	_getIntersections( clientX, clientY ) {

		let element = this._domElement === document ? this._domElement.body : this._domElement;
		let rect = element.getBoundingClientRect();

		this._mouse.x = ( ( clientX - rect.left ) / rect.width ) * 2 - 1;
		this._mouse.y = - ( ( clientY - rect.top ) / rect.height ) * 2 + 1;

		this._raycaster.setFromCamera( this._mouse, this._camera );

		return this._raycaster.intersectObjects( this._objects, false );

	}


	/**
	 *  Handle the event using controls in the list for the given
	 *  class (in their order in the list, affecting objects whose
	 *  projection on contains the given screen point.
	 */
	_onEvent( event, clientX, clientY, category, num ) {

		if ( this.enabled === false ) {

			this._domElement.style.cursor = defaultCursor;
			return;

		}

		let intersections = this._getIntersections( clientX, clientY );

		//let controlFamily = intersections.length > 0 ? this._controls : this._targetlessControls;
		let flags = ControlManager.getFlags( event );

		if ( this._currentCategory !== category ||
			 this._currentNum !== num ||
			 this._currentFlags !== flags ) {

			let sameCatAndNum =
				( this._currentCategory === category ) &&
				( this._currentNum === num );
			let moreFlags = ControlManager.moreFlags( this._currentFlags, flags );

			this._currentCategory = category;
			this._currentFlags = flags;
			this._currentNum = num;

			this._signalCurrentControls( 'endHandler', event, this._intersections, true );

			if ( [ 'mousedown', 'touchstart', 'wheel' ].includes( event.type ) ||
				 ( sameCatAndNum && moreFlags ) ) {

				let controlFamily = this._controls;
				let controlCat = controlFamily[ category ];
				let controls1 = controlCat ? controlCat[ num ] || null : null;
				let controls = controls1 ? controls1[ flags ] || null : null;
				this._currentControls = controls;

				if ( this._signalCurrentControls( 'startHandler', event, intersections ) ) {

					// one of our controls is active
					event.preventDefault();
					event.stopPropagation();

					if ( [ 'mousedown', 'touchstart' ].includes( event.type ) ) {

						this._domElement.style.cursor = pointerCursor;

					}

					return;

				}

			} else {

				this._currentControls = null;

			}

			this._domElement.style.cursor = defaultCursor;
			return;

		}

		if ( this._currentControls && this._currentControls.length > 0 ) {

			if ( this._signalCurrentControls( 'changeHandler', event, intersections ) ) {

				// one of our controls is active
				event.preventDefault();
				event.stopPropagation();
				//this._domElement.style.cursor = pointerCursor;

			} else {

				this._domElement.style.cursor = defaultCursor;

			}

		} else {

			this._domElement.style.cursor = defaultCursor;

		}

	}

	/**
	 *  Convenience method to add an event listener to all the
	 *  controls currently being managed.
	 *
	 *  @param {string} eventType The type of the event.  Should be
	 *  "start", "change", or "end".
	 *  @param listener An event listener, that is a function taking
	 *  an event as an argument.
	 *  @param [options] The options to use when calling
	 *  <code>addEventListener</code>.
	 */
	addEventListener( eventType, listener, options ) {

		for ( let key in this._controls ) {

			if ( this._controls.hasOwnProperty( key ) ) {

				for ( let idx = 0; idx < this._controls[ key ].length; idx ++ ) {

					let controls1 = this._controls[ key ][ idx ];
					for ( let jdx = 0; controls1 && jdx < controls1.length; jdx ++ ) {

						let controls = controls1[ jdx ];
						for ( let kdx = 0; controls && kdx < controls.length; kdx ++ ) {

							controls[ kdx ].addEventListener( eventType, listener, options );

						}

					}

				}

			}

		}

	}

	/**
	 *  Convenience method to remove an event listener from all
	 *  controls currently being managed.
	 *
	 *  @param {string} eventType The type of the event.  Should be
	 *  "start", "change", or "end".
	 *  @param listener An event listener, that is a function taking
	 *  an event as an argument.
	 *  @param [options] The options to use when calling
	 *  <code>removeEventListener</code>.  For compatibility with all
	 *  browsers, these should be the same as the options used when
	 *  the listener was added.
	 */
	removeEventListener( eventType, listener, options ) {

		for ( let key in this._controls ) {

			if ( this._controls.hasOwnProperty( key ) ) {

				for ( let idx = 0; idx < this._controls[ key ].length; idx ++ ) {

					let controls1 = this._controls[ key ][ idx ];
					for ( let jdx = 0; controls1 && jdx < controls1.length; jdx ++ ) {

						let controls = controls1[ jdx ];
						for ( let kdx = 0; controls && kdx < controls.length; kdx ++ ) {

							controls[ kdx ].removeEventListener( eventType, listener, options );

						}

					}

				}

			}

		}

	}

}

ControlManager.getFlags = function ( event ) {

	let flags = ControlManager.noflags;

	if ( event.shiftKey ) flags |= ControlManager.shiftKey;
	if ( event.ctrlKey ) flags |= ControlManager.ctrlKey;
	if ( event.altKey ) flags |= ControlManager.altKey;
	if ( event.metaKey ) flags |= ControlManager.metaKey;

	return flags;

};

ControlManager.moreFlags = function ( flags1, flags2 ) {

	return ( flags1 & ~ flags2 ) === 0;

};

ControlManager.shiftKey = 1;
ControlManager.ctrlKey = 2;
ControlManager.altKey = 4;
ControlManager.metaKey = 8;

ControlManager.noflags = 0;



export { ControlManager };
