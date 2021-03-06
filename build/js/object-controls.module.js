import { Euler, EventDispatcher, Frustum, Matrix4, Mesh, MeshBasicMaterial, Object3D, Quaternion, Raycaster, SphereBufferGeometry, Spherical, Vector2, Vector3 } from 'three.js';

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

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

var InvalidArgumentException = function (_Error) {
	inherits(InvalidArgumentException, _Error);

	function InvalidArgumentException(message) {
		classCallCheck(this, InvalidArgumentException);

		var _this = possibleConstructorReturn(this, (InvalidArgumentException.__proto__ || Object.getPrototypeOf(InvalidArgumentException)).call(this, message));

		_this.name = 'InvalidArgumentException';

		return _this;
	}

	return InvalidArgumentException;
}(Error);

var EVENT_CATEGORIES = ['mouse', 'touch', 'wheel'];

/**
 *  @namespace MOUSE_BUTTONS
 *  Codes for mouse buttons as used by MouseEvent.buttons.
 */
var MOUSE_BUTTONS = {

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
	FORWARD: 16

};

/**
 *  @namespace POINTER
 *  Utilities to help with pointer events.
 */
var POINTER = {

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
	getEventPosition: function getEventPosition(event, pos, touchNo) {

		var posX = void 0,
		    posY = void 0;

		var tp = event.type;
		if (!tp) {

			throw new InvalidArgumentException('event.type undefined');
		} else if (tp === 'wheel' || tp.indexOf('mouse') === 0) {

			posX = event.clientX;
			posY = event.clientY;
		} else if (tp.indexOf('touch') === 0) {

			touchNo = 0 || touchNo;
			touchNo = Math.min(touchNo, event.touches.length - 1);

			posX = event.touches[touchNo].clientX;
			posY = event.touches[touchNo].clientY;
		} else {

			throw new InvalidArgumentException('bad event.type');
		}

		pos = pos || new Vector2();
		pos.set(posX, posY);
	}

};

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

var pointerCursor = 'pointer';
var defaultCursor = 'default';

// IE and possibly older versions of other browsers.
if (!Array.prototype.includes) {

	Array.prototype.includes = function (elem, start) {

		start = start || 0;
		start = Math.max(start, 0);

		for (var idx = start; idx < this.length; idx++) {

			if (this[idx] === elem) return true;
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

var ControlManager = function () {

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
	function ControlManager(camera, domElement, objects) {
		classCallCheck(this, ControlManager);


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

		var self = this;

		/**
   *  Handler for events that should clear the state of ("end")
   *  all controls in the active control set.
   *
   *  @param {MouseEvent} event - the event to handle.
   */
		this.onCancelEvent = function (event) {

			// there are supposed to be no "cancel" event handlers
			//self._onEvent( event, event.clientX, event.clientY, 'cancel', 0 );
			self._signalCurrentControls('endHandler', event, null);
			self._currentControls = null;
		};

		/**
   *  Use mouse controls for <code>event.buttons</code> to handle the
   *  event, controlling objects under the mouse point.
   *
   *  @param {MouseEvent} event - the event to handle.
   */
		this.onMouseEvent = function (event) {

			self._onEvent(event, event.clientX, event.clientY, 'mouse', event.buttons);
		};

		/**
   *  Use mouse touch for <code>event.touches.length</code> to
   *  handle the event, controlling objects under the client
   *  coordinates for <code>event.touches[ 0 ]</code>.
   *
   *  @param {TouchEvent} event - the event to handle.
   */
		this.onTouchEvent = function (event) {

			// If event.touches.length is 0, no TouchEvent controller
			// should be triggered because none should be registered
			// for 0 touches.

			var len = event.touches.length;
			self._onEvent(event, len > 0 ? event.touches[0].clientX : 0, len > 0 ? event.touches[0].clientY : 0, 'touch', len);
		};

		/**
   *  Use wheel controls to handle the
   *  event, controlling objects under the mouse point.
   *
   *  @param {WheelEvent} event - the event to handle.
   */
		this.onWheelEvent = function (event) {

			self._onEvent(event, event.clientX, event.clientY, 'wheel', 0);
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
		this._signalCurrentControls = function (handler, event, intersections) {

			var controls = self._currentControls;
			var len = controls ? controls.length : 0;
			var haveActiveControl = false;
			for (var idx = 0; idx < len; idx++) {

				haveActiveControl = controls[idx][handler](event, intersections) || haveActiveControl;
			}

			// return whether a control is active
			return haveActiveControl;
		};

		this._domElement.addEventListener('mousedown', this.onMouseEvent, false);
		this._domElement.addEventListener('mousemove', this.onMouseEvent, false);
		this._domElement.addEventListener('mouseup', this.onMouseEvent, false);
		this._domElement.addEventListener('mouseout', this.onCancelEvent, false);

		this._domElement.addEventListener('wheel', this.onWheelEvent, false);

		this._domElement.addEventListener('touchstart', this.onTouchEvent, false);
		this._domElement.addEventListener('touchend', this.onTouchEvent, false);
		this._domElement.addEventListener('touchmove', this.onTouchEvent, false);
		this._domElement.addEventListener('touchcancel', this.onTouchEvent, false);
	}

	//
	// public methods
	//

	/**
  *  Remove all event listeners when done with this <code>ControlManager</code>.
  */


	createClass(ControlManager, [{
		key: 'dispose',
		value: function dispose() {

			this._domElement.removeEventListener('mousedown', this.onMouseEvent, false);
			this._domElement.removeEventListener('mousemove', this.onMouseEvent, false);
			this._domElement.removeEventListener('mouseup', this.onMouseEvent, false);
			this._domElement.removeEventListener('mouseout', this.onCancelEvent, false);

			this._domElement.removeEventListener('wheel', this.onWheelEvent, false);

			this._domElement.removeEventListener('touchstart', this.onTouchEvent, false);
			this._domElement.removeEventListener('touchmove', this.onTouchEvent, false);
			this._domElement.removeEventListener('touchend', this.onTouchEvent, false);
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

	}, {
		key: '_addControls',
		value: function _addControls(category, num, flags, controls) {

			var len = controls.length;

			for (var idx = 0; idx < len; idx++) {

				if (!controls[idx].supportsEventCategory(category)) {

					throw new InvalidArgumentException(controls[idx].constructor.name + ' does not support event category ' + category);
				}
			}

			var controlCat = this._controls[category];
			if (!controlCat[num]) {

				controlCat[num] = [];
			}
			if (!controlCat[num][flags]) {

				controlCat[num][flags] = [];
			}

			// XXX: reset all the controls here ?
			for (var _idx = 0; _idx < len; _idx++) {

				controlCat[num][flags].push(controls[_idx]);
			}
		}
	}, {
		key: '_addTargetlessControls',
		value: function _addTargetlessControls(category, num, flags, controls) {

			var len = controls.length;

			for (var idx = 0; idx < len; idx++) {

				if (!controls[idx].supportsEventCategory(category)) {

					throw new InvalidArgumentException(controls[idx].constructor.name + ' does not support event category ' + category);
				}
			}

			var controlCat = this._targetlessControls[category];
			if (!controlCat[num]) {

				controlCat[num] = [];
			}
			if (!controlCat[num][flags]) {

				controlCat[num][flags] = [];
			}

			// XXX: reset all the controls here ?
			for (var _idx2 = 0; _idx2 < controls.length; _idx2++) {

				controlCat[num][flags].push(controls[_idx2]);
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

	}, {
		key: 'addMouseControl',
		value: function addMouseControl(buttons, flags) {
			for (var _len = arguments.length, controls = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
				controls[_key - 2] = arguments[_key];
			}

			this._addControls('mouse', buttons, flags, controls);
		}
	}, {
		key: 'addTargetlessMouseControl',
		value: function addTargetlessMouseControl(buttons, flags) {
			for (var _len2 = arguments.length, controls = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
				controls[_key2 - 2] = arguments[_key2];
			}

			this._addTargetlessControls('mouse', buttons, flags, controls);
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

	}, {
		key: 'addTouchControl',
		value: function addTouchControl(touchCount, flags) {

			if (touchCount < 0) {

				throw new Error('touchCount nonpositive in addTouchControl');
			}

			for (var _len3 = arguments.length, controls = Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
				controls[_key3 - 2] = arguments[_key3];
			}

			this._addControls('touch', touchCount, flags, controls);
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

	}, {
		key: 'addWheelControl',
		value: function addWheelControl(flags) {
			for (var _len4 = arguments.length, controls = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
				controls[_key4 - 1] = arguments[_key4];
			}

			this._addControls('wheel', 0, flags, controls);
		}

		// should we allow only one copy of each control?
		/**
   *  Remove a control from the control list belonging to the given
   *  category and number.  Does nothing if the control is not in
   *  that list.
   *
   *
   */

	}, {
		key: '_removeControl',
		value: function _removeControl(category, num, flags, control) {

			var controls = this._controls[category][num][flags];

			if (controls) {

				for (var idx = controls.indexOf(control); idx !== -1; idx = controls.indexOf(control)) {

					controls.splice(idx, 1);
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

	}, {
		key: 'removeMouseControl',
		value: function removeMouseControl(buttons, flags, control) {

			this.removeControl('mouse', buttons, flags, control);
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

	}, {
		key: 'removeTouchControl',
		value: function removeTouchControl(touchCount, flags, control) {

			this.removeControl('touch', touchCount, flags, control);
		}

		/**
   *  Remove a control from the list of controls used to handle
   *  wheel events.  If the control is not on the list, nothing will
   *  happen.
   *
   *  @param {ObjectControl} control - the control to be removed.
   */

	}, {
		key: 'removeWheelControl',
		value: function removeWheelControl(control) {

			this.removeControl('wheel', 0, control);
		}

		/**
   *  Add an object to the set of controlled objects.  The object
   *  will not be added again if the object is already being controlled.
   *
   *  @param {THREE.Object3D} object - new object to control.
   */

	}, {
		key: 'addObject',
		value: function addObject(object) {

			if (this._objects.indexOf(object) === -1) {

				this._objects.push(object);
			}
		}

		/**
   *  Remove an object from the set of controlled objects.  Nothing
   *  happens if the object is not being controlled.
   *
   *  @param {THREE.Object3D} object - object to remove from control.
   */

	}, {
		key: 'removeObject',
		value: function removeObject(object) {

			var objects = this._objects;

			var idx = objects.indexOf(object);
			if (idx !== -1) {

				objects.splice(idx, 1);
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

	}, {
		key: '_getIntersections',
		value: function _getIntersections(clientX, clientY) {

			var element = this._domElement === document ? this._domElement.body : this._domElement;
			var rect = element.getBoundingClientRect();

			this._mouse.x = (clientX - rect.left) / rect.width * 2 - 1;
			this._mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

			this._raycaster.setFromCamera(this._mouse, this._camera);

			return this._raycaster.intersectObjects(this._objects, false);
		}

		/**
   *  Handle the event using controls in the list for the given
   *  class (in their order in the list, affecting objects whose
   *  projection on contains the given screen point.
   */

	}, {
		key: '_onEvent',
		value: function _onEvent(event, clientX, clientY, category, num) {

			if (this.enabled === false) {

				this._domElement.style.cursor = defaultCursor;
				return;
			}

			var intersections = this._getIntersections(clientX, clientY);

			//let controlFamily = intersections.length > 0 ? this._controls : this._targetlessControls;
			var flags = ControlManager.getFlags(event);

			if (this._currentCategory !== category || this._currentNum !== num || this._currentFlags !== flags) {

				var sameCatAndNum = this._currentCategory === category && this._currentNum === num;
				var moreFlags = ControlManager.moreFlags(this._currentFlags, flags);

				this._currentCategory = category;
				this._currentFlags = flags;
				this._currentNum = num;

				this._signalCurrentControls('endHandler', event, this._intersections, true);

				if (['mousedown', 'touchstart', 'wheel'].includes(event.type) || sameCatAndNum && moreFlags) {

					var controlFamily = this._controls;
					var controlCat = controlFamily[category];
					var controls1 = controlCat ? controlCat[num] || null : null;
					var _controls = controls1 ? controls1[flags] || null : null;
					this._currentControls = _controls;

					if (this._signalCurrentControls('startHandler', event, intersections)) {

						// one of our controls is active
						event.preventDefault();
						event.stopPropagation();

						if (['mousedown', 'touchstart'].includes(event.type)) {

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

			if (this._currentControls && this._currentControls.length > 0) {

				if (this._signalCurrentControls('changeHandler', event, intersections)) {

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

	}, {
		key: 'addEventListener',
		value: function addEventListener(eventType, listener, options) {

			for (var key in this._controls) {

				if (this._controls.hasOwnProperty(key)) {

					for (var idx = 0; idx < this._controls[key].length; idx++) {

						var controls1 = this._controls[key][idx];
						for (var jdx = 0; controls1 && jdx < controls1.length; jdx++) {

							var _controls2 = controls1[jdx];
							for (var kdx = 0; _controls2 && kdx < _controls2.length; kdx++) {

								_controls2[kdx].addEventListener(eventType, listener, options);
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

	}, {
		key: 'removeEventListener',
		value: function removeEventListener(eventType, listener, options) {

			for (var key in this._controls) {

				if (this._controls.hasOwnProperty(key)) {

					for (var idx = 0; idx < this._controls[key].length; idx++) {

						var controls1 = this._controls[key][idx];
						for (var jdx = 0; controls1 && jdx < controls1.length; jdx++) {

							var _controls3 = controls1[jdx];
							for (var kdx = 0; _controls3 && kdx < _controls3.length; kdx++) {

								_controls3[kdx].removeEventListener(eventType, listener, options);
							}
						}
					}
				}
			}
		}
	}]);
	return ControlManager;
}();

ControlManager.getFlags = function (event) {

	var flags = ControlManager.noflags;

	if (event.shiftKey) flags |= ControlManager.shiftKey;
	if (event.ctrlKey) flags |= ControlManager.ctrlKey;
	if (event.altKey) flags |= ControlManager.altKey;
	if (event.metaKey) flags |= ControlManager.metaKey;

	return flags;
};

ControlManager.moreFlags = function (flags1, flags2) {

	return (flags1 & ~flags2) === 0;
};

ControlManager.shiftKey = 1;
ControlManager.ctrlKey = 2;
ControlManager.altKey = 4;
ControlManager.metaKey = 8;

ControlManager.noflags = 0;

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

/*
 *  This class indicates the interfaces that a control must implement
 *  to be registered as a MouseControl, TouchControl or WheelControl
 *  in ObjectControlManager.  If this were Java, these would be
 *  declared as <code>interface</code>s and they would be the types of
 *  arguments to <code>ObjectControlManager.addMouseControl</code>,
 *  etc.
 *
 *  <p>As things are, there does not seem to be any value in extending
 *  these classes, so we just use them in the JSDoc for the
 *  <code>addXyzControl</code> methods in
 *  <code>ObjectControlManager</code>.
 */

/**
 *  A class with methods for handling mouse down, move and up events.
 */

var ObjectControl = function (_EventDispatcher) {
	inherits(ObjectControl, _EventDispatcher);

	/**
  *
  *  @param {string[]} eventCategories Which event categories this
  *  control supports.  These will be things like "mouse", "touch",
  *  or "wheel" and are used by the master control to decide
  *  whether a control can be added as a mouse, touch, or wheel
  *  control, or any kind of control that may be added later.
  *  @param {boolean} [enabled=true] Whether this control will
  *  start off being enabled.
  */
	function ObjectControl(eventCategories, enabled) {
		classCallCheck(this, ObjectControl);

		var _this = possibleConstructorReturn(this, (ObjectControl.__proto__ || Object.getPrototypeOf(ObjectControl)).call(this));

		_this.eventCategories = eventCategories.slice();
		_this.enabled = enabled === undefined ? true : !!enabled;

		return _this;
	}

	/**
  *  Signal the control that it is in the new control set when the
  *  ObjectControlManager changes control sets.
  *
  *  <p>Normally a call to this method will cause the controller to
  *  remember something about the event in its state and to add
  *  some or all of the objects in the intersections to the
  *  control's set of controlled objects.
  *
  *  <p>The controller will dispatch an event of the form <code>{
  *  type: 'start', objects: Object3D[] }</code>, where the
  *  <code>objects</code> field will be an array of all objects
  *  taken under control.  A listener could use the events to
  *  highlight or show the position or rotation of the objects
  *  taken under control.
  *
  *  @param {UIEvent} event - Probably a <code>mousedown</code>, a
  *  <code>touchstart</code>, or a wheel event.
  *  @param intersections - an array of intersections returned
  *  by <code>THREE.Raycaster.intersectObjects()</code>.
  *
  *  @returns {boolean} <code>true</code> (stop) if we should
  *  stop processing this instance of the event using controls
  *  in our list, <code>false if we should continue.
  */


	createClass(ObjectControl, [{
		key: 'startHandler',
		value: function startHandler(event, intersections) {

			return false;
		}

		/**
   *  Handle an event that indicates a change in a pointer or wheel
   *  value.  Typically this change in value will trigger some
   *  change in the properties of the objects under control.
   *
   *  <p>A call to this method will dispatch an event of the form
   *  <code>{ type: 'change', objects: Object3D[] }</code>.
   *
   *  <p>If some of the objects under control are not contained in
   *  the intersections passed to thie method, an 'end' event is
   *  sent for them and they are removed from the set of objects
   *  under control.  If any new objects appear among the
   *  intersections, they <i>may</i> be taken under control as in
   *  <code>mousedownHandler</code> and a 'start' event is sent
   *  for those that are taken under control.
   *
   *  @param {MouseEvent} event - a mouse move event.
   *  @param intersections - an array of intersections returned
   *  by <code>THREE.Raycaster.intersectObjects()</code>.
   *
   *  @returns {boolean} <code>true</code> (stop) if we should
   *  stop processing this instance of the event using controls
   *  in our list, <code>false if we should continue.
   */

	}, {
		key: 'changeHandler',
		value: function changeHandler(event, intersections) {

			return false;
		}

		/**
   *  Notify the control that it is leaving the active control set.
   *  Usually the control will just reset itself to its initial
   *  state, but the event that causes it to leave the control set
   *  and the intersections are provided in case the control should
   *  finalize its actions somehow.
   *
   *  <p>This method will be called on each control in the old
   *  control set before startHandler is called on the controls in
   *  the new control set.
   *
   *  <p>If there are any objects under control, send an event
   *  <code>{ type: 'end', objects: Object3D[] }</code> where the
   *  <code>objects</code> field is an array of all objects
   *  under control.
   *
   *  <p>No intersections are sent with this call because a) they
   *  should not be relevant to this control; and b) they are not
   *  always available, for example if a <code>mouseout</code> event
   *  triggers a cancel.
   *
   *  @param {UIEvent} event - The event that is causing this
   *  control to leave the control set.  Normally <code>event</code>
   *  will be either a <code>mouseup</code> or <code>mouseout</code>
   *  <code>MouseEvent</code> or a <code>touchend</code>
   *  <code>TouchEvent</code>.
   */

	}, {
		key: 'endHandler',
		value: function endHandler(event) {

			return false;
		}
	}, {
		key: 'supportsEventCategory',
		value: function supportsEventCategory(eventCategory) {

			return this.eventCategories.indexOf(eventCategory) >= 0;
		}
	}, {
		key: 'supportsEvent',
		value: function supportsEvent(event) {

			var eventType = event.type;
			var categories = this.eventCategories;

			for (var idx = 0; idx < categories; idx++) {

				if (eventType.indexOf(categories[idx]) === 0) {

					return true;
				}
			}

			return true;
		}
	}]);
	return ObjectControl;
}(EventDispatcher);

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

/*
 *  We use this class to
 *  indicate the interfaces that a control must implement to be
 *  registered as a MouseControl, TouchControl or WheelControl in
 *  ObjectControlManager.  If this were Java, these would be declared
 *  as <code>interface</code>s and they would be the types of
 *  arguments to <code>ObjectControlManager.addMouseControl</code>,
 *  etc.
 *
 *  <p>As things are, there does not seem to be any value in extending
 *  these classes, so we just use them in the JSDoc for the
 *  <code>addXyzControl</code> methods in
 *  <code>ObjectControlManager</code>.
 */

/**
 *  A class with methods for handling mouse down, move and up events.
 */

var SingleTargetControl = function (_ObjectControl) {
	inherits(SingleTargetControl, _ObjectControl);

	/**
  *  Constructor
  *
  *  @param {boolean} [allowNonTop=true] If true, the control will
  *  continue to control its target even if it is behind other
  *  objects.
  *  @param {boolean} [enabled=true] Whether the control will be
  *  enabled initially.
  */
	function SingleTargetControl(controlCategories, allowNonTop, enabled) {
		classCallCheck(this, SingleTargetControl);

		/**
   *  @member _allowNonTop If true, continue controlling the
   *  target as long as it is under the mouse, even if it is
   *  behind other objects.
   */
		var _this = possibleConstructorReturn(this, (SingleTargetControl.__proto__ || Object.getPrototypeOf(SingleTargetControl)).call(this, controlCategories, enabled));

		_this._allowNonTop = allowNonTop === undefined ? true : !!allowNonTop;

		/**
   *  @member _target
   *  The object under control or <code>null</code> if there is none.
   */
		_this._target = null;

		return _this;
	}

	/**
  *  Signal the control that it is in the new control set when the
  *  ObjectControlManager changes control sets.
  *
  *  <p>Normally a call to this method will cause the controller to
  *  remember something about the event in its state and to add
  *  some or all of the objects in the intersections to the
  *  control's set of controlled objects.
  *
  *  <p>The controller will dispatch an event of the form <code>{
  *  type: 'start', objects: Object3D[] }</code>, where the
  *  <code>objects</code> field will be an array of all objects
  *  taken under control.  A listener could use the events to
  *  highlight or show the position or rotation of the objects
  *  taken under control.
  *
  *  @param {UIEvent} event - Probably a <code>mousedown</code>, a
  *  <code>touchstart</code>, or a wheel event.
  *  @param intersections - an array of intersections returned
  *  by <code>THREE.Raycaster.intersectObjects()</code>.
  *
  *  @returns {boolean} <code>true</code> (stop) if we should
  *  stop processing this instance of the event using controls
  *  in our list, <code>false if we should continue.
  */


	createClass(SingleTargetControl, [{
		key: 'startHandler',
		value: function startHandler(event, intersections) {

			if (!this.enabled || intersections.length === 0) return false;

			var intersection = intersections[0];
			this._target = intersection.object;

			if (this._doStart(event, intersection)) {

				this.dispatchEvent({ type: 'start', objects: [this._target] });
				return true;
			} else {

				this._target = null;
				return false;
			}
		}
	}, {
		key: '_doStart',
		value: function _doStart() /* event, intersection */{

			return true;
		}

		/**
   *  Handle an event that indicates a change in a pointer or wheel
   *  value.  Typically this change in value will trigger some
   *  change in the properties of the objects under control.
   *
   *  <p>A call to this method will dispatch an event of the form
   *  <code>{ type: 'change', objects: Object3D[] }</code>.
   *
   *  <p>If some of the objects under control are not contained in
   *  the intersections passed to thie method, an 'end' event is
   *  sent for them and they are removed from the set of objects
   *  under control.  If any new objects appear among the
   *  intersections, they <i>may</i> be taken under control as in
   *  <code>mousedownHandler</code> and a 'start' event is sent
   *  for those that are taken under control.
   *
   *  @param {MouseEvent} event - a mouse move event.
   *  @param intersections - an array of intersections returned
   *  by <code>THREE.Raycaster.intersectObjects()</code>.
   *
   *  @returns {boolean} <code>true</code> (stop) if we should
   *  stop processing this instance of the event using controls
   *  in our list, <code>false if we should continue.
   */

	}, {
		key: 'changeHandler',
		value: function changeHandler(event, intersections) {

			if (!this.enabled || this._target === null) return false;

			var len = intersections.length;
			if (len === 0) return this.endHandler(event);

			var idx = 0;
			var found = this._target === intersections[0].object;

			if (!found && this._allowNonTop) {

				for (idx = 1; idx < len; idx++) {

					if (this._target === intersections[idx].object) {

						found = true;
						break;
					}
				}
			}

			if (found) {

				if (this._doChange(event, intersections[idx])) {

					this.dispatchEvent({ type: 'change', objects: [this._target] });
				}
			} else {

				this.endHandler(event);
			}

			return found;
		}
	}, {
		key: '_doChange',
		value: function _doChange() /* event, intersection */{

			return true;
		}

		/**
   *  Notify the control that it is leaving the active control set.
   *  Usually the control will just reset itself to its initial
   *  state, but the event that causes it to leave the control set
   *  and the intersections are provided in case the control should
   *  finalize its actions somehow.
   *
   *  <p>This method will be called on each control in the old
   *  control set before startHandler is called on the controls in
   *  the new control set.
   *
   *  <p>If there are any objects under control, send an event
   *  <code>{ type: 'end', objects: Object3D[] }</code> where the
   *  <code>objects</code> field is an array of all objects
   *  under control.
   *
   *  <p>No intersections are sent with this call because a) they
   *  should not be relevant to this control; and b) they are not
   *  always available, for example if a <code>mouseout</code> event
   *  triggers a cancel.
   *
   *  @param {UIEvent} event - The event that is causing this
   *  control to leave the control set.  Normally <code>event</code>
   *  will be either a <code>mouseup</code> or <code>mouseout</code>
   *  <code>MouseEvent</code> or a <code>touchend</code>
   *  <code>TouchEvent</code>.
   */

	}, {
		key: 'endHandler',
		value: function endHandler(event) {

			if (this._target) {

				this._doEnd(event);
				this.dispatchEvent({ type: 'end', objects: [this._target] });
			}

			this._target = null;
			return false;
		}

		/**
   *  Perform any finalization that the endHandler needs to do.  The
   *  triggering event will be passed to it.  Usually does not need
   *  to be overridden.
   */

	}, {
		key: '_doEnd',
		value: function _doEnd() /* event */{}
	}]);
	return SingleTargetControl;
}(ObjectControl);

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
 *  @namespace SWLUtils
 *  Utilities to help convert between screen, projected, world and
 *  local coordinates in Three.js.
 */
var SWLUtils = {

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
	getWorldCoordinates: function getWorldCoordinates(obj) {
		var world = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Vector3();


		return obj.getWorldPosition(world);
	},

	/**
  *  Get the position of <code>obj</code> using a vector in world coordinates.
  *
  *  @param {THREE.Object3D} obj - set the position of this <code>THREE.Object32</code>.
  *  @param {THREE.Vector3} world - the world coordinates to set.
  *
  */
	setWorldCoordinates: function setWorldCoordinates(obj, world) {

		obj.parent.updateMatrixWorld();
		obj.position.copy(world);
		obj.position.applyMatrix4(new Matrix4().getInverse(obj.parent.matrixWorld));
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
	worldCoordinatesToLocal: function worldCoordinatesToLocal(obj, world) {
		var local = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Vector3();


		local.copy(world);

		obj.parent.updateMatrixWorld();
		obj.parent.worldToLocal(local);

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
	getProjectedCoordinates: function getProjectedCoordinates(obj, camera) {
		var vector = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : new Vector3();


		vector = this.getWorldCoordinates(obj, vector);
		vector.project(camera);

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
	projectedCoordinatesToScreen: function projectedCoordinatesToScreen(vector, screenWidth, screenHeight) {
		var screen = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new Vector2();


		var widthHalf = 0.5 * screenWidth;
		var heightHalf = 0.5 * screenHeight;

		screen.x = vector.x * widthHalf + widthHalf;
		screen.y = -(vector.y * heightHalf) + heightHalf;

		if (screen.x >= 0 && screen.y >= 0 && screen.x < 2 * widthHalf && screen.y < 2 * heightHalf) {

			return screen;
		} else {

			screen.set(undefined, undefined);
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
	toScreenPosition: function toScreenPosition(obj, camera, screenWidth, screenHeight) {
		var projected = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : new Vector3();
		var screen = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : new Vector2();


		this.getProjectedCoordinates(obj, camera, projected);
		return this.projectedCoordinatesToScreen(projected, screenWidth, screenHeight, screen);
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
	worldCoordsToScreen: function worldCoordsToScreen(point, camera, screenWidth, screenHeight) {
		var screen = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : new Vector2();


		point.project(camera);

		return this.projectedCoordinatesToScreen(point, screenWidth, screenHeight, screen);
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
	screenCoordinatesToProjected: function screenCoordinatesToProjected(screen, screenWidth, screenHeight) {
		var projected = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : new Vector3();


		var widthHalf = 0.5 * screenWidth;
		var heightHalf = 0.5 * screenHeight;

		projected.set((screen.x - widthHalf) / widthHalf, -(screen.y - heightHalf) / heightHalf, 0);

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
	screenCoordinatesToWorld: function screenCoordinatesToWorld(coords, screenWidth, screenHeight, camera) {
		var vector = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : new Vector3();
		var plane = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : -1;


		this.screenCoordinatesToProjected(coords, screenWidth, screenHeight, vector);

		vector.z = plane;
		vector.unproject(camera);

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
	computeCameraFrustum: function computeCameraFrustum(camera) {
		var frustum = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : new Frustum();


		camera.updateMatrix(); // make sure camera's local matrix is updated
		camera.updateMatrixWorld(); // make sure camera's world matrix is updated
		camera.matrixWorldInverse.getInverse(camera.matrixWorld);

		frustum.setFromMatrix(new Matrix4().multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse));

		return frustum;
	}

};

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

/**
 *  Control to move a target object relative to the camera based on
 *  change in pointer position (position of the mouse or of the first
 *  touch).  It works by changing the direction from the camera to the
 *  target according to how the pointer moves.
 */

var DirectionControl = function (_SingleTargetControl) {
	inherits(DirectionControl, _SingleTargetControl);

	/**
  *  Constructor.
  *
  *  @param {THREE.PerspectiveCamera} camera The camera around
  *  which the target object will be rotated.
  */
	function DirectionControl(camera) {
		classCallCheck(this, DirectionControl);

		var _this = possibleConstructorReturn(this, (DirectionControl.__proto__ || Object.getPrototypeOf(DirectionControl)).call(this, ['mouse', 'touch'], true));

		_this._camera = camera;

		//
		// Internals
		//

		// Target object
		_this._target = null;

		// Start position for a move - projection of position of
		// previous event on target.
		_this._startPos = new Vector3();

		// Temporaries created once here so we don't need to create
		// them everytime we need to use them.

		// End position of a move, world coordinates (projection of
		// event position on target at time of move.
		_this._endPos = new Vector3();

		// Vector from camera to target, move start position, and move
		// end position, world coordinatese.
		_this._v0 = new Vector3();
		_this._v1 = new Vector3();
		_this._v2 = new Vector3();

		// Spherical coordinates for _v1, _v2, _v3.
		_this._s0 = new Spherical();
		_this._s1 = new Spherical();
		_this._s2 = new Spherical();

		// World coordinates of target and camera.
		_this._targetWorld = new Vector3();
		_this._cameraWorld = new Vector3();

		return _this;
	}

	/**
  *  Find the spherical angles relative to the camera from the
  *  position of the previous event to the position for this event.
  *  Move the current target by adding these angles to its current
  *  spherical angles relative to the camera.
  */


	createClass(DirectionControl, [{
		key: '_changeDirection',
		value: function _changeDirection() {

			SWLUtils.getWorldCoordinates(this._target, this._targetWorld);
			SWLUtils.getWorldCoordinates(this._camera, this._cameraWorld);

			this._v0.subVectors(this._targetWorld, this._cameraWorld);
			this._v1.subVectors(this._startPos, this._cameraWorld);
			this._v2.subVectors(this._endPos, this._cameraWorld);

			this._s0.setFromVector3(this._v0);
			this._s1.setFromVector3(this._v1);
			this._s2.setFromVector3(this._v2);

			this._s0.phi += this._s2.phi - this._s1.phi;
			this._s0.theta += this._s2.theta - this._s1.theta;

			this._targetWorld.setFromSpherical(this._s0);
			this._targetWorld.add(this._cameraWorld);
			SWLUtils.setWorldCoordinates(this._target, this._targetWorld);

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

	}, {
		key: '_doStart',
		value: function _doStart(event, intersection) {

			this._startPos.copy(intersection.point);

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

	}, {
		key: '_doChange',
		value: function _doChange(event, intersection) {

			this._endPos.copy(intersection.point);

			if (this._changeDirection()) {

				this._startPos.copy(this._endPos);
				return true;
			} else {

				return false;
			}
		}
	}]);
	return DirectionControl;
}(SingleTargetControl);

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

var DistanceControl = function (_SingleTargetControl) {
	inherits(DistanceControl, _SingleTargetControl);

	function DistanceControl(controlCategories, camera) {
		classCallCheck(this, DistanceControl);

		var _this = possibleConstructorReturn(this, (DistanceControl.__proto__ || Object.getPrototypeOf(DistanceControl)).call(this, controlCategories, true));

		_this.camera = camera;

		_this.raycaster = new Raycaster();

		// Set to false to disable this control
		_this.enabled = true;

		//
		// internals
		//

		_this._startPos = new Vector2();
		_this._endPos = new Vector2();

		_this._v1 = new Vector3();

		_this._objectWorld = new Vector3();
		_this._cameraWorld = new Vector3();
		_this._stretchVector = new Vector3();
		//this._diffVector = new Vector3();
		_this._newPoint = new Vector3();
		_this._newPosition = new Vector3();
		_this._frustum = new Frustum();
		_this._temp2 = new Vector2();

		return _this;
	}

	createClass(DistanceControl, [{
		key: 'changeDistance',
		value: function changeDistance(object, point, start, end, rate) {

			rate = rate || 1;
			this._v1.subVectors(end, start);

			if (this._v1.y !== 0) {

				var scale = this.getScale(rate);
				if (this._v1.y > 0) scale = 1 / scale;

				return this.stretchDistance(object, point, scale);
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

	}, {
		key: 'stretchDistance',
		value: function stretchDistance(object, point, factor) {

			// Convert to world coords; point is already in world coords.
			SWLUtils.getWorldCoordinates(object, this._objectWorld);
			SWLUtils.getWorldCoordinates(this.camera, this._cameraWorld);
			this._stretchVector.subVectors(this._objectWorld, this._cameraWorld);
			this._stretchVector.multiplyScalar(factor);

			// New position of object.
			this._newPosition.addVectors(this._stretchVector, this._cameraWorld);

			// The position to which the raycaster point will be moved.
			this._newPoint.subVectors(point, this._objectWorld);
			this._newPoint.add(this._newPosition);

			SWLUtils.computeCameraFrustum(this.camera, this._frustum);
			if (this._frustum.containsPoint(this._newPoint) && this._frustum.containsPoint(this._newPosition)) {

				SWLUtils.setWorldCoordinates(object, this._newPosition);
				return true;
			} else {

				return false;
			}
		}

		/**
   *  @returns the amount to scale at the given rate (0.95^{rate},
   *  empirically determined.
   */

	}, {
		key: 'getScale',
		value: function getScale(rate) {

			rate = rate || 1.0;
			return Math.pow(0.95, rate);
		}
	}]);
	return DistanceControl;
}(SingleTargetControl);

/**
 *  Control the distance of a target object from the camera using
 *  mouse movement.  If the mouse moves up, the object moves closer
 *  (and gets bigger) until the mouse is no longer on the target.  If
 *  the mouse moves down, the object moves away and get smaller.
 */


var DistanceMouseControl = function (_DistanceControl) {
	inherits(DistanceMouseControl, _DistanceControl);

	/**
  *  Constructor.
  *
  *  @param {THREE.PerspectiveCamera} camera The camera toward or
  *  away from which the control will move the target object.
  */
	function DistanceMouseControl(camera) {
		classCallCheck(this, DistanceMouseControl);
		return possibleConstructorReturn(this, (DistanceMouseControl.__proto__ || Object.getPrototypeOf(DistanceMouseControl)).call(this, ['mouse'], camera));
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


	createClass(DistanceMouseControl, [{
		key: '_doStart',
		value: function _doStart(event /* , intersection */) {

			this._startPos.set(event.clientX, event.clientY);

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

	}, {
		key: '_doChange',
		value: function _doChange(event, intersection) {

			this._endPos.set(event.clientX, event.clientY);

			if (this.changeDistance(this._target, intersection.point, this._startPos, this._endPos, 2)) {

				this._startPos.copy(this._endPos);
				return true;
			} else {

				return false;
			}
		}
	}]);
	return DistanceMouseControl;
}(DistanceControl);

/**
 *  A control that scales the distance between the camera and a target
 *  object based on a pinch gesture.  Requires at least a two-finger
 *  touch to use and only the first two fingers matter if there are
 *  more.
 */


var DistanceTouchControl = function (_DistanceControl2) {
	inherits(DistanceTouchControl, _DistanceControl2);

	function DistanceTouchControl(camera) {
		classCallCheck(this, DistanceTouchControl);
		return possibleConstructorReturn(this, (DistanceTouchControl.__proto__ || Object.getPrototypeOf(DistanceTouchControl)).call(this, ['touch'], camera));
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


	createClass(DistanceTouchControl, [{
		key: '_doStart',
		value: function _doStart(event /*, intersection */) {

			this._temp2.set(event.touches[0].pageX - event.touches[1].pageX, event.touches[0].pageY - event.touches[1].pageY);

			this._startPos.set(0, -this._temp2.length());

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

	}, {
		key: '_doChange',
		value: function _doChange(event, intersection) {

			this._temp2.set(event.touches[0].pageX - event.touches[1].pageX, event.touches[0].pageY - event.touches[1].pageY);
			this._endPos.set(0, -this._temp2.length());

			if (this.changeDistance(this._target, intersection.point, this._startPos, this._endPos, 1.5)) {

				this._startPos.copy(this._endPos);
				return true;
			} else {

				return false;
			}
		}
	}]);
	return DistanceTouchControl;
}(DistanceControl);

/**
 *  Control to scale the distance between its target object and the
 *  camera, moving the target object, using mouse wheel events.
 *
 *  <p>The wheel control does use a target the way other controls do,
 *  so it isn't really appropriate to send start and end events, so we will just override the <code>startHandler</code> and <code>changeHandler</code>, since we still want to in
 */


var DistanceWheelControl = function (_DistanceControl3) {
	inherits(DistanceWheelControl, _DistanceControl3);

	/**
  *  Constructor.  Just calls the constructor for DistanceControl.
  *
  *  @param {THREE.PerspectiveCamera} camera The camera relative to
  *  which we scale distance.
  */
	function DistanceWheelControl(camera) {
		classCallCheck(this, DistanceWheelControl);
		return possibleConstructorReturn(this, (DistanceWheelControl.__proto__ || Object.getPrototypeOf(DistanceWheelControl)).call(this, ['wheel'], camera));
	}

	/**
  *  Same as <code>changeHandler</code>.
  */


	createClass(DistanceWheelControl, [{
		key: 'startHandler',
		value: function startHandler(event, intersections) {

			if (!this.enabled) return false;

			this.changeHandler(event, intersections);
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

	}, {
		key: 'changeHandler',
		value: function changeHandler(event, intersections) {

			if (!this.enabled || intersections.length === 0) return false;

			var intersection = intersections[0];
			var target = intersection.object;

			if (event.deltaY !== 0) {

				var scale = this.getScale();
				if (event.deltaY < 0) scale = 1 / scale;

				if (this.stretchDistance(target, intersection.point, scale)) {

					this.dispatchEvent({ type: 'change', objects: [target] });
				}
			}

			return true;
		}
	}]);
	return DistanceWheelControl;
}(DistanceControl);

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

/**
 *  Control to rotate an object by dragging mouse or touch over it.
 *  The goal is to rotate the object so that the same point on the
 *  object stays under the mouse or touch.
 */

var RotationControl = function (_SingleTargetControl) {
	inherits(RotationControl, _SingleTargetControl);

	function RotationControl() {
		classCallCheck(this, RotationControl);

		//
		// internals
		//

		var _this = possibleConstructorReturn(this, (RotationControl.__proto__ || Object.getPrototypeOf(RotationControl)).call(this, ['mouse', 'touch'], true));

		_this._rotateStart = new Vector3();

		// these are essentially temporary variables so we don't
		// always have to create and destroy them
		_this._rotateEnd = new Vector3();
		_this._startLocal = new Vector3();
		_this._endLocal = new Vector3();
		_this._v1 = new Vector3();
		_this._v2 = new Vector3();
		_this._q = new Quaternion();

		return _this;
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


	createClass(RotationControl, [{
		key: '_rotate',
		value: function _rotate(object, start, end) {

			var pos = object.position;

			// convert start and end to object-local
			SWLUtils.worldCoordinatesToLocal(object, start, this._startLocal);
			SWLUtils.worldCoordinatesToLocal(object, end, this._endLocal);

			this._v1.subVectors(this._startLocal, pos);
			this._v1.normalize();
			this._v2.subVectors(this._endLocal, pos);
			this._v2.normalize();

			this._q.setFromUnitVectors(this._v1, this._v2);
			var sinHalfAngle = Math.sqrt(1 - this._q.w * this._q.w);
			if (sinHalfAngle > 1 / (2 << 62)) {

				object.quaternion.premultiply(this._q);
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

	}, {
		key: '_doStart',
		value: function _doStart(event, intersection) {

			this._rotateStart.copy(intersection.point);
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

	}, {
		key: '_doChange',
		value: function _doChange(event, intersection) {

			this._rotateEnd.copy(intersection.point);

			if (this._rotate(this._target, this._rotateStart, this._rotateEnd)) {

				this._rotateStart.copy(this._rotateEnd);
				return true;
			} else {

				return false;
			}
		}
	}]);
	return RotationControl;
}(SingleTargetControl);

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
 *	Class to wrap an object we want to control using one or more of our object
 *	controls, so that the object actually being controlled is a
 *	transparent sphere.
 *
 *  <p>Normally, the object being wrapped will be a group.  That way
 *  all the objects in the group can be controlled together using one
 *  or more object controls.  It can, however, still be useful to wrap
 *  a mesh whose geometry has sharp edges, if you want to use
 *  RotationControl on it, as the sphere will rotate more smoothly.
 *
 *  <p>The center of the sphere will be the position of the object
 *  wrapped.  The caller must give a radius to use for the sphere.
 *  Usually the radius should be chosen so that the sphere contains
 *  the main part of the object, but not necessarily projections that
 *  stick way out.
 *
 *  <p>To use <code>ControlledObjectWrapper</code> with a set object
 *  control, give <code>wrapper.sphere</code> to the supervising
 *  <code>MultiObjectControls</code>.
 */

var ControlledObjectWrapper =

/**
 *  Wrap an object, usually, but not necessarily, a group, so that
 *  a related sphere will be controlled by any object controllers
 *  that we want to use on the given object.
 *
 *  @param {THREE.Object3D} object The object to control.
 *
 *  @param {number} radius The radius of the transparent
 *  sphere to create, through which <code>object</code> will be
 *  controlled.  The center of the sphere will be the position of
 *  <code>object</code>.
 */
function ControlledObjectWrapper(object, radius, sphereColor, sphereSections) {
	classCallCheck(this, ControlledObjectWrapper);


	/** @member {THREE.Object3D} THREE.Object3D to be controlled. */
	this.object = object;

	// Geometry and material for transparent sphere.

	// The two 12's are to make the sphere look reasonably good if
	// made visible as a highlight.  For practical use, 8 will do.
	sphereSections = sphereSections || 12;
	var sphereGeometry = new SphereBufferGeometry(radius, sphereSections, sphereSections);
	this._material = new MeshBasicMaterial({

		color: sphereColor,
		transparent: true,
		opacity: 0.0

	});

	/**
  *  @member { THREE.Mesh } &ndash; &ndash; The transparent
  *  sphere that stands as proxy for <code>this.object</code>
  *  to a control.
  */
	this.sphere = new Mesh(sphereGeometry, this._material);
	this.sphere.position.copy(object.position);

	var sphere = this.sphere;

	function copyPositionAndRotation() {

		object.position.copy(sphere.position);
		object.quaternion.copy(sphere.quaternion);
	}

	// Putting the onBeforeRender callback on object should
	// probably work better, but if object is a group or something
	// else that does not actually render, it will not fire.
	this.sphere.onBeforeRender = copyPositionAndRotation;
	//this.object.onBeforeRender = copyPositionAndRotation;

	object.parent.add(this.sphere);

	var scope = this;

	/**
  *  Make our sphere partly opaque on receiving a start event
  *  in which our sphere appears on the object list.
  */
	this.startListener = function (event) {

		if (!event.objects || !Array.isArray(event.objects)) return;

		for (var idx = 0; idx < event.objects.length; idx++) {

			if (event.objects[idx] === scope.sphere) {

				scope._material.opacity = 0.3;
				break;
			}
		}
	};

	/**
  *  Make our sphere fully transparent on receiving an end
  *  event in which our sphere appears on the object list.
  */
	this.endListener = function (event) {

		if (!event.objects || !Array.isArray(event.objects)) return;

		for (var idx = 0; idx < event.objects.length; idx++) {

			if (event.objects[idx] === scope.sphere) {

				scope._material.opacity = 0.0;
				break;
			}
		}
	};
};

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

/**
 *  Control to move a target object relative to the camera based on
 *  change in pointer position (position of the mouse or of the first
 *  touch).  It works by changing the direction from the camera to the
 *  target according to how the pointer moves.
 */

var CameraMoveControl = function (_SingleTargetControl) {
	inherits(CameraMoveControl, _SingleTargetControl);

	/**
  *  Constructor.
  *
  *  @param {THREE.PerspectiveCamera} camera The camera around
  *  which the target object will be rotated.
  */
	function CameraMoveControl(camera) {
		classCallCheck(this, CameraMoveControl);

		var _this = possibleConstructorReturn(this, (CameraMoveControl.__proto__ || Object.getPrototypeOf(CameraMoveControl)).call(this, ['mouse'], true));

		_this._camera = camera;

		// Set this variable to false to disable this control
		_this.enabled = true;

		//
		// Internals
		//

		// Target object
		_this._target = null;

		// Start position for a move - projection of position of
		// previous event on target.
		_this._startPos = new Vector3();

		// Temporaries created once here so we don't need to create
		// them everytime we need to use them.

		// End position of a move, world coordinates (projection of
		// event position on target at time of move.
		_this._endPos = new Vector3();

		// Vector from camera to target, move start position, and move
		// end position, world coordinatese.
		_this._v0 = new Vector3();
		_this._v1 = new Vector3();
		_this._v2 = new Vector3();

		// Spherical coordinates for _v1, _v2, _v3.
		_this._s0 = new Spherical();
		_this._s1 = new Spherical();
		_this._s2 = new Spherical();

		// World coordinates of target and camera.
		_this._targetWorld = new Vector3();
		_this._cameraWorld = new Vector3();

		return _this;
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


	createClass(CameraMoveControl, [{
		key: '_changeDirection',
		value: function _changeDirection() {

			SWLUtils.getWorldCoordinates(this._target, this._targetWorld);
			SWLUtils.getWorldCoordinates(this._camera, this._cameraWorld);

			this._v0.subVectors(this._cameraWorld, this._targetWorld);
			this._v1.subVectors(this._cameraWorld, this._startPos);
			this._v2.subVectors(this._cameraWorld, this._endPos);

			this._s0.setFromVector3(this._v0);
			this._s1.setFromVector3(this._v1);
			this._s2.setFromVector3(this._v2);

			this._s0.phi += this._s2.phi - this._s1.phi;
			this._s0.theta += this._s2.theta - this._s1.theta;

			this._cameraWorld.setFromSpherical(this._s0);
			this._cameraWorld.add(this._targetWorld);
			SWLUtils.setWorldCoordinates(this._camera, this._cameraWorld);

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

	}, {
		key: '_doStart',
		value: function _doStart(event, intersection) {

			this._startPos.copy(intersection.point);
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

	}, {
		key: '_doChange',
		value: function _doChange(event, intersection) {

			this._endPos.copy(intersection.point);

			// _startPos should have moved to approximately _endPos.  Do
			// we need to adjust _startPos at all?

			return this._changeDirection();
		}
	}]);
	return CameraMoveControl;
}(SingleTargetControl);

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

var CameraDistanceControl = function (_SingleTargetControl) {
	inherits(CameraDistanceControl, _SingleTargetControl);

	function CameraDistanceControl(camera) {
		classCallCheck(this, CameraDistanceControl);

		var _this = possibleConstructorReturn(this, (CameraDistanceControl.__proto__ || Object.getPrototypeOf(CameraDistanceControl)).call(this, ['mouse'], true));

		_this.camera = camera;

		_this.raycaster = new Raycaster();

		// Set to false to disable this control
		_this.enabled = true;

		//
		// internals
		//

		_this._startPos = new Vector2();
		_this._endPos = new Vector2();

		_this._v1 = new Vector3();

		_this._objectWorld = new Vector3();
		_this._cameraLocal = new Vector3();
		_this._cameraWorld = new Vector3();
		_this._stretchVector = new Vector3();
		_this._frustum = new Frustum();

		return _this;
	}

	createClass(CameraDistanceControl, [{
		key: '_changeDistance',
		value: function _changeDistance(object, point, start, end, rate) {

			rate = rate || 1;
			this._v1.subVectors(end, start);

			if (this._v1.y !== 0) {

				var scale = this.getScale(rate);
				if (this._v1.y > 0) scale = 1 / scale;
				return this._stretchDistance(object, point, scale);
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

	}, {
		key: '_stretchDistance',
		value: function _stretchDistance(object, point, factor) {

			// Convert to world coords; point is already in world coords.
			this._cameraLocal.copy(this.camera.position);
			SWLUtils.getWorldCoordinates(object, this._objectWorld);
			SWLUtils.getWorldCoordinates(this.camera, this._cameraWorld);
			this._stretchVector.subVectors(this._objectWorld, this._cameraWorld);
			this._stretchVector.multiplyScalar(factor);

			// new camera position
			this._cameraWorld.subVectors(this._objectWorld, this._stretchVector);
			SWLUtils.setWorldCoordinates(this.camera, this._cameraWorld);
			SWLUtils.computeCameraFrustum(this.camera, this._frustum);
			if (this._frustum.containsPoint(point) && this._frustum.containsPoint(this._objectWorld)) {

				return true;
			} else {

				// restore old camera position
				this.camera.position.copy(this._cameraLocal);
				return false;
			}
		}

		/**
   *  @returns the amount to scale at the given rate (0.95^{rate},
   *  empirically determined.
   */

	}, {
		key: 'getScale',
		value: function getScale(rate) {

			rate = rate || 1.0;
			return Math.pow(0.95, rate);
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

	}, {
		key: '_doStart',
		value: function _doStart(event) {

			this._startPos.set(event.clientX, event.clientY);

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

	}, {
		key: '_doChange',
		value: function _doChange(event, intersection) {

			this._endPos.set(event.clientX, event.clientY);

			var success = this._changeDistance(this._target, intersection.point, this._startPos, this._endPos, 2);

			// update start pos regardless of success, because non-success
			// means "no move", not "too small to bother".
			this._startPos.copy(this._endPos);

			return success;
		}
	}]);
	return CameraDistanceControl;
}(SingleTargetControl);

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

/*
 *  We use this class to
 *  indicate the interfaces that a control must implement to be
 *  registered as a MouseControl, TouchControl or WheelControl in
 *  ObjectControlManager.  If this were Java, these would be declared
 *  as <code>interface</code>s and they would be the types of
 *  arguments to <code>ObjectControlManager.addMouseControl</code>,
 *  etc.
 *
 *  <p>As things are, there does not seem to be any value in extending
 *  these classes, so we just use them in the JSDoc for the
 *  <code>addXyzControl</code> methods in
 *  <code>ObjectControlManager</code>.
 */

/**
 *  A class with methods for handling mouse down, move and up events.
 */

var TargetlessControl = function (_ObjectControl) {
	inherits(TargetlessControl, _ObjectControl);

	/**
  *  Constructor
  *
  *  @param {boolean} [enabled=true] Whether the control will be enabled initially.
  */
	function TargetlessControl(controlCategories, enabled) {
		classCallCheck(this, TargetlessControl);

		var _this = possibleConstructorReturn(this, (TargetlessControl.__proto__ || Object.getPrototypeOf(TargetlessControl)).call(this, controlCategories, enabled));

		_this._isActive = false;

		return _this;
	}

	/**
  *  Signal the control that it is in the new control set when the
  *  ObjectControlManager changes control sets.
  *
  *  <p>Normally a call to this method will cause the controller to
  *  remember something about the event in its state and to add
  *  some or all of the objects in the intersections to the
  *  control's set of controlled objects.
  *
  *  <p>The controller will dispatch an event of the form <code>{
  *  type: 'start', objects: Object3D[] }</code>, where the
  *  <code>objects</code> field will be an array of all objects
  *  taken under control.  A listener could use the events to
  *  highlight or show the position or rotation of the objects
  *  taken under control.
  *
  *  @param {UIEvent} event - Probably a <code>mousedown</code>, a
  *  <code>touchstart</code>, or a wheel event.
  *  @param intersections - an array of intersections returned
  *  by <code>THREE.Raycaster.intersectObjects()</code>.
  *
  *  @returns {boolean} <code>true</code> (stop) if we should
  *  stop processing this instance of the event using controls
  *  in our list, <code>false if we should continue.
  */


	createClass(TargetlessControl, [{
		key: 'startHandler',
		value: function startHandler(event /* , intersections */) {

			if (!this.enabled) return;

			if (this._doStart(event)) {

				this._isActive = true;
				this.dispatchEvent({ type: 'start', objects: [] });
				return true;
			}

			return false;
		}
	}, {
		key: '_doStart',
		value: function _doStart() /* event */{

			return true;
		}

		/**
   *  Handle an event that indicates a change in a pointer or wheel
   *  value.  Typically this change in value will trigger some
   *  change in the properties of the objects under control.
   *
   *  <p>A call to this method will dispatch an event of the form
   *  <code>{ type: 'change', objects: Object3D[] }</code>.
   *
   *  <p>If some of the objects under control are not contained in
   *  the intersections passed to thie method, an 'end' event is
   *  sent for them and they are removed from the set of objects
   *  under control.  If any new objects appear among the
   *  intersections, they <i>may</i> be taken under control as in
   *  <code>mousedownHandler</code> and a 'start' event is sent
   *  for those that are taken under control.
   *
   *  @param {MouseEvent} event - a mouse move event.
   *  @param intersections - an array of intersections returned
   *  by <code>THREE.Raycaster.intersectObjects()</code>.
   *
   *  @returns {boolean} <code>true</code> (stop) if we should
   *  stop processing this instance of the event using controls
   *  in our list, <code>false if we should continue.
   */

	}, {
		key: 'changeHandler',
		value: function changeHandler(event /* , intersections */) {

			if (!(this.enabled && this._isActive)) return;

			if (this._doChange(event)) {

				this.dispatchEvent({ type: 'change', objects: [] });
				return true;
			}

			return false;
		}
	}, {
		key: '_doChange',
		value: function _doChange() /* event */{

			return true;
		}

		/**
   *  Notify the control that it is leaving the active control set.
   *  Usually the control will just reset itself to its initial
   *  state, but the event that causes it to leave the control set
   *  and the intersections are provided in case the control should
   *  finalize its actions somehow.
   *
   *  <p>This method will be called on each control in the old
   *  control set before startHandler is called on the controls in
   *  the new control set.
   *
   *  <p>If there are any objects under control, send an event
   *  <code>{ type: 'end', objects: Object3D[] }</code> where the
   *  <code>objects</code> field is an array of all objects
   *  under control.
   *
   *  <p>No intersections are sent with this call because a) they
   *  should not be relevant to this control; and b) they are not
   *  always available, for example if a <code>mouseout</code> event
   *  triggers a cancel.
   *
   *  @param {UIEvent} event - The event that is causing this
   *  control to leave the control set.  Normally <code>event</code>
   *  will be either a <code>mouseup</code> or <code>mouseout</code>
   *  <code>MouseEvent</code> or a <code>touchend</code>
   *  <code>TouchEvent</code>.
   */

	}, {
		key: 'endHandler',
		value: function endHandler(event) {

			this._isActive = false;
			this._doEnd();
			return this._isActive;
		}

		/**
   *  Perform any finalization that the endHandler needs to do.  The
   *  triggering event will be passed to it.  Usually does not need
   *  to be overridden.
   */

	}, {
		key: '_doEnd',
		value: function _doEnd() /* event */{}
	}]);
	return TargetlessControl;
}(ObjectControl);

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

var euler = new Euler(0, 0, 0, 'YXZ');
// object to use for finding the zenith on screen
var obj = new Object3D();
// temp vectors
var v2tmp = new Vector2();
var v3tmp = new Vector3();

/**
 *  Control to rotate the camera based on change of object relative to
 *  the camera based on change in pointer position (position of the
 *  mouse or of the first touch).  It works by rotating
 *  the camera in by the negative in the change in direction to the pointer.
 */

var CameraRotationControl = function (_TargetlessControl) {
	inherits(CameraRotationControl, _TargetlessControl);

	/**
  *  Constructor.
  *
  *  @param {THREE.PerspectiveCamera} camera The camera around
  *  which the target object will be rotated.
  */
	function CameraRotationControl(camera, domElement, rollAllowed, loopAllowed) {
		classCallCheck(this, CameraRotationControl);

		var _this = possibleConstructorReturn(this, (CameraRotationControl.__proto__ || Object.getPrototypeOf(CameraRotationControl)).call(this, ['mouse', 'touch'], true));

		_this._camera = camera;
		_this._domElement = domElement;
		_this._noRoll = !rollAllowed;
		_this._noLoop = !loopAllowed;

		//
		// Internals
		//

		// Start position for a move - projection of position of
		// previous event on target.
		_this._startPos = new Vector2();

		// End position of a move, world coordinates (projection of
		// event position on target at time of move.
		_this._endPos = new Vector2();

		return _this;
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


	createClass(CameraRotationControl, [{
		key: '_doStart',
		value: function _doStart(event) {

			POINTER.getEventPosition(event, this._startPos);
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

	}, {
		key: '_doChange',
		value: function _doChange(event) {

			POINTER.getEventPosition(event, this._endPos);
			var success = this._rotateCamera();

			this._startPos.copy(this._endPos);
			return success;
		}
	}, {
		key: '_rotateCamera',
		value: function _rotateCamera() {

			euler.setFromQuaternion(this._camera.quaternion);
			console.log('euler ' + JSON.stringify(euler));
			var elevation = euler.x;
			var rotation = Math.PI / 2 - euler.y;

			// zenith - a point far above the camera
			obj.position.copy(this._camera.up);
			obj.position.applyQuaternion(this._camera.quaternion);
			obj.position.multiplyScalar(10000);
			SWLUtils.toScreenPosition(obj, this._camera, this._domElement.width, this._domElement.height, v3tmp, v2tmp);
			var factor = this._camera.rotation.x > 0 ? 1 : -1;
			if (v2tmp !== null && v2tmp.y > (this._endPos.y + this._startPos.y) / 2) {

				factor *= -1;
			}

			var height = this._domElement.height;
			var fov = Math.PI * this._camera.fov / 180;
			elevation += (this._endPos.y - this._startPos.y) * fov / height;
			rotation += -( /*factor * */this._endPos.x - this._startPos.x) * fov / height;

			this._startPos.copy(this._endPos);

			elevation = Math.max(Math.min(elevation, Math.PI / 2), -Math.PI / 2);
			rotation %= 2 * Math.PI;
			euler.set(elevation, Math.PI / 2 - rotation, 0, 'YXZ');
			this._camera.quaternion.setFromEuler(euler);
		}
	}]);
	return CameraRotationControl;
}(TargetlessControl);

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

var CameraZoomControl = function (_TargetlessControl) {
	inherits(CameraZoomControl, _TargetlessControl);

	function CameraZoomControl(camera, minZoom, maxZoom) {
		classCallCheck(this, CameraZoomControl);

		var _this = possibleConstructorReturn(this, (CameraZoomControl.__proto__ || Object.getPrototypeOf(CameraZoomControl)).call(this, ['mouse'], true));

		_this.camera = camera;
		_this.minZoom = minZoom;
		_this.maxZoom = maxZoom;

		//
		// internals
		//

		_this._startPos = new Vector2();
		_this._endPos = new Vector2();

		_this._delta = new Vector2();

		return _this;
	}

	createClass(CameraZoomControl, [{
		key: '_changeZoom',
		value: function _changeZoom(start, end, rate) {

			rate = rate || 1;
			this._delta.subVectors(end, start);

			if (this._delta.y !== 0) {

				var scale = this.getScale(rate);
				if (this._delta.y < 0) scale = 1 / scale;
				return this._changeZoom1(scale);
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

	}, {
		key: '_changeZoom1',
		value: function _changeZoom1(factor) {

			var zoom = factor * this.camera.zoom;
			zoom = Math.max(Math.min(zoom, this.maxZoom), this.minZoom);

			if (zoom !== this.camera.zoom) {

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

	}, {
		key: 'getScale',
		value: function getScale(rate) {

			rate = rate || 1.0;
			return Math.pow(0.95, rate);
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

	}, {
		key: '_doStart',
		value: function _doStart(event) {

			this._startPos.set(event.clientX, event.clientY);

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

	}, {
		key: '_doChange',
		value: function _doChange(event) {

			this._endPos.set(event.clientX, event.clientY);

			this._changeZoom(this._startPos, this._endPos, 2);

			// update start pos regardless of success, because non-success
			// means "no move", not "too small to bother".
			this._startPos.copy(this._endPos);

			// we are still active
			return true;
		}
	}]);
	return CameraZoomControl;
}(TargetlessControl);

export { EVENT_CATEGORIES, MOUSE_BUTTONS, ControlManager, DirectionControl, DistanceMouseControl, DistanceTouchControl, DistanceWheelControl, RotationControl, ControlledObjectWrapper, CameraMoveControl, CameraDistanceControl, CameraRotationControl, CameraZoomControl };
