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

import { EventDispatcher } from 'three.js';

/*
 *  We don't actually use these classes&mdash;they are here to
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
class ObjectControl {

	/**
	 *  Signal the control that it is in the new control set when the
	 *  ObjectControlManager changes control sets.
	 *
	 *  <p>Normally a call to this method will cause the controller to
	 *  remember something about the event in its state and to add
	 *  some or all of the objects in the intersections to the
	 *  control's set of controlled objects.
	 *
	 *  <p>The controller will dispatch an event of the form
	 *  <code>{ type: 'start', objects: Object3D[] }</code>, where the
	 *  <code>objects</code> field will be an array of all objects taken
	 *  under control.  A listener could use the
	 *  events to highlight or show the position or rotation of the
	 *  objects taken under control.
	 *
	 *  @param {MouseEvent} event - a mouse down event.
	 *  @param intersections - an array of intersections returned
	 *  by <code>THREE.Raycaster.intersectObjects()</code>.
	 *
	 *  @returns {boolean} <code>true</code> (stop) if we should
	 *  stop processing this instance of the event using controls
	 *  in our list, <code>false if we should continue.
	 */
	startHandler( event, intersections ) {

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
	changeHandler( event, intersections ) {

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
	 *  @param {UIEvent} event - The event that is causing this
	 *  control to leave the control set.  Normally <code>event</code>
	 *  will be either a <code>mouseup</code> or <code>mouseout</code>
	 *  <code>MouseEvent</code> or a <code>touchend</code>
	 *  <code>TouchEvent</code>.
	 */
	endHandler( event, intersections ) {}

}



/**
 *  A class with methods for handling mouse down, move and up events.
 */
class MouseControl {

	/**
	 *  Handle a mouse down event when the mouse is clicked over
	 *  the objects in an array of THREE.Raycaster targets.
	 *
	 *  <p>A call to this method will dispatch an event of the form
	 *  <code>{ type: 'start', objects: Object3D[] }</code>.  The
	 *  <code>objects</code> will be an array of all objects taken
	 *  under control&mdash;those may not be all the objects in the
	 *  <code>intersections</code> array.  A listener could use the
	 *  events to highlight or show the position or rotation of the
	 *  objects taken under control.
	 *
	 *  @param {MouseEvent} event - a mouse down event.
	 *  @param intersections - an array of intersections returned
	 *  by <code>THREE.Raycaster.intersectObjects()</code>.
	 *
	 *  @returns {boolean} <code>true</code> (stop) if we should
	 *  stop processing this instance of the event using controls
	 *  in our list, <code>false if we should continue.
	 */
	mousedownHandler( event, intersections ) {

		return false;

	}


	/**
	 *  Handle a mouse move event when the mouse is moved over the
	 *  objects in an array of THREE.Raycaster targets.  Typically
	 *  this will involve some change in the properties of the objects
	 *  under control.
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
	mousemoveHandler( event, intersections ) {

		return false;

	}


	/**
	 *  Handle a mouse up event when the mouse is clicked over
	 *  the objects in an array of THREE.Raycaster targets.
	 *
	 *  This method event will ordinarily the the same as
	 *  <code>mousedownHandler</code> because both indicate that we
	 *  have arrived at this control due to a change in the set of
	 *  mouse buttons pressed..
	 *
	 *  @param {MouseEvent} event - a mouse up event.
	 *  @param intersections - an array of intersections returned
	 *  by <code>THREE.Raycaster.intersectObjects()</code>.
	 *
	 *  @returns {boolean} <code>true</code> (stop) if we should
	 *  stop processing this instance of the event using controls
	 *  in our list, <code>false if we should continue.
	 */
	mouseupHandler( event, intersections ) {

		return false;

	}


	/**
	 *  Reset the internal state of the control before starting to use
	 *  it in a new context.  This method will normally be called on
	 *  all controls in a control set whenever the
	 *  <code>ObjectControlManager</code> stops using that control
	 *  set, usually because it is switching to another one.
	 *
	 *  <p>If there are any objects under control, send an event
	 *  <code>{ type: 'end', objects: Object3D[] }</code> where the
	 *  <code>objects</code> field is an array of all objects
	 *  under control.
	 */
	reset() {}

}


/**
 *  Class with methods for handling touch start, move and end
 *  events.
 */
class TouchControl extends THREE.EventDispatcher {

	/**
	 *  Handle a touch start event when the touch is clicked over
	 *  the objects in an array of THREE.Raycaster targets.
	 *  Dispatches a start event for the object in each
	 *  intersection which is accepted for handling and registers
	 *  it as a target.
	 *
	 *  <p>A call to this method will dispatch an event of the form
	 *  <code>{ type: 'start', objects: Object3D[] }</code>.  The
	 *  <code>objects</code> will be an array of all objects taken
	 *  under control&mdash;those may not be all the objects in the
	 *  <code>intersections</code> array.  A listener could use the
	 *  events to highlight or show the position or rotation of the
	 *  objects taken under control.
	 *
	 *  @param {TouchEvent} event - a touch start event.
	 *  @param intersections - an array of intersections returned
	 *  by <code>THREE.Raycaster.intersectObjects()</code>.
	 *
	 *  @returns {boolean} <code>true</code> (stop) if we should
	 *  stop processing this instance of the event using controls
	 *  in our list, <code>false if we should continue.
	 */
	touchstartHandler( event, intersections ) {

		return false;

	}


	/**
	 *  Handle a touch move event when the touch is moved over
	 *  the objects in an array of THREE.Raycaster targets.
	 *  Dispatches a start event for the object in each
	 *  intersection which is accepted for handling and registers
	 *  it as a target.
	 *
	 *  @param {TouchEvent} event - a touch move event.
	 *  @param intersections - an array of intersections returned
	 *  by <code>THREE.Raycaster.intersectObjects()</code>.
	 *
	 *  @returns {boolean} <code>true</code> (stop) if we should
	 *  stop processing this instance of the event using controls
	 *  in our list, <code>false if we should continue.
	 */
	touchmoveHandler( event, intersections ) {

		return false;

	}


	/**
	 *  Handle a touch end event when the touch over
	 *  the objects in an array of THREE.Raycaster targets.
	 *  Dispatches a start event for the object in each
	 *  intersection which is accepted for handling and registers
	 *  it as a target.
	 *
	 *  @param {TouchEvent} event - a touch end event.
	 *  @param {Object[]} intersections - an array of intersections returned by
	 *  <code>THREE.Raycaster.intersectObjects()</code>, showing which
	 *  controlled objects are under the <code>event.touches[ 0 ]</code>.
	 *
	 *  @returns {boolean} <code>true</code> (stop) if we should
	 *  stop processing this instance of the event using controls
	 *  in our list, <code>false if we should continue.
	 */
	touchendHandler( event, intersections ) {

		throw new Error( 'called abstract method touchEndHandler' );

	}

	/**
	 *  Reset the internal state of the control before starting to use
	 *  it in a new context.  This method will normally be called on
	 *  all controls in a control set whenever the
	 *  <code>ObjectControlManager</code> stops using that control
	 *  set, usually because it is switching to another one.
	 *
	 *  <p>If there are any objects under control, send an event
	 *  <code>{ type: 'end', objects: Object3D[] }</code> where the
	 *  <code>objects</code> field is an array of all objects
	 *  under control.
	 */
	reset() {}

}


class WheelControl extends THREE.EventDispatcher {

	/**
	 *  Handle a mouse wheel event when the mouse is over the
	 *  objects in the given Raycaster intersections.
	 *
	 *  If the state of any of these objects is changed, an event
	 *  <code>{ type: 'change', objects: Object3D[] }</code> will be dispatched with 
	 *
	 *  @param {WheelEvent} event
	 *  @param {Object[]} intersections - an array of intersections returned by
	 *  <code>THREE.Raycaster.intersectObjects()</code>, showing which
	 *  controlled objects are under the mouse point.
	 *
	 *  @returns {boolean} <code>true</code> (stop) if we should
	 *  stop processing this instance of the event using controls
	 *  in our list, <code>false if we should continue.
	 */
	mousewheelHandler( event, intersections ) {

		return false;

	}

	/**
	 *  Reset the internal state of the control before starting to use
	 *  it in a new context.  This method will normally be called on
	 *  all controls in a control set whenever the
	 *  <code>ObjectControlManager</code> stops using that control
	 *  set, usually because it is switching to another one.
	 *
	 *  <p>If there are any objects under control, send an event
	 *  <code>{ type: 'end', objects: Object3D[] }</code> where the
	 *  <code>objects</code> field is an array of all objects
	 *  under control.
	 */
	reset() {}

}

