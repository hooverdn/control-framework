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

import { ObjectControl } from './ObjectControl';

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
class TargetlessControl extends ObjectControl {

	/**
	 *  Constructor
	 *
	 *  @param {boolean} [enabled=true] Whether the control will be enabled initially.
	 */
	constructor( controlCategories, enabled ) {

		super( controlCategories, enabled );
		this._isActive = false;

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
	startHandler( event /* , intersections */ ) {

		if ( ! this.enabled ) return;

		if ( this._doStart( event ) ) {

			this._isActive = true;
			this.dispatchEvent( { type: 'start', objects: [] } );
			return true;

		}

		return false;

	}

	_doStart( /* event */ ) {

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
	changeHandler( event /* , intersections */ ) {

		if ( ! ( this.enabled && this._isActive ) ) return;

		if ( this._doChange( event ) ) {

			this.dispatchEvent( { type: 'change', objects: [] } );
			return true;

		}

		return false;

	}

	_doChange( /* event */ ) {

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
	endHandler( event ) {

		this._isActive = false;
		this._doEnd();
		return this._isActive;

	}

	/**
	 *  Perform any finalization that the endHandler needs to do.  The
	 *  triggering event will be passed to it.  Usually does not need
	 *  to be overridden.
	 */
	_doEnd( /* event */ ) {}

}


export { TargetlessControl };
