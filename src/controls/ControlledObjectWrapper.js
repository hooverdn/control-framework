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

import { SphereBufferGeometry, MeshBasicMaterial, Mesh } from 'three.js';

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
class ControlledObjectWrapper {

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
	constructor( object, radius, sphereColor, sphereSections ) {

		/** @member {THREE.Object3D} THREE.Object3D to be controlled. */
		this.object = object;

		// Geometry and material for transparent sphere.

		// The two 12's are to make the sphere look reasonably good if
		// made visible as a highlight.  For practical use, 8 will do.
		sphereSections = sphereSections || 12;
		const sphereGeometry = new SphereBufferGeometry(

			radius,
			sphereSections,
			sphereSections

		);
		this._material =
			new MeshBasicMaterial( {

				color: sphereColor,
				transparent: true,
				opacity: 0.0

			} );

		/**
		 *  @member { THREE.Mesh } &ndash; &ndash; The transparent
		 *  sphere that stands as proxy for <code>this.object</code>
		 *  to a control.
		 */
		this.sphere = new Mesh( sphereGeometry, this._material );
		this.sphere.position.copy( object.position );

		const sphere = this.sphere;

		function copyPositionAndRotation() {

			object.position.copy( sphere.position );
			object.quaternion.copy( sphere.quaternion );

		}

		// Putting the onBeforeRender callback on object should
		// probably work better, but if object is a group or something
		// else that does not actually render, it will not fire.
		this.sphere.onBeforeRender = copyPositionAndRotation;
		//this.object.onBeforeRender = copyPositionAndRotation;

		object.parent.add( this.sphere );

		const scope = this;

		/**
		 *  Make our sphere partly opaque on receiving a start event
		 *  in which our sphere appears on the object list.
		 */
		this.startListener = function ( event ) {

			if ( ! event.objects || ! Array.isArray( event.objects ) ) return;

			for ( let idx = 0; idx < event.objects.length; idx ++ ) {

				if ( event.objects[ idx ] === scope.sphere ) {

					scope._material.opacity = 0.3;
					break;

				}

			}

		};

		/**
		 *  Make our sphere fully transparent on receiving an end
		 *  event in which our sphere appears on the object list.
		 */
		this.endListener = function ( event ) {

			if ( ! event.objects || ! Array.isArray( event.objects ) ) return;

			for ( let idx = 0; idx < event.objects.length; idx ++ ) {

				if ( event.objects[ idx ] === scope.sphere ) {

					scope._material.opacity = 0.0;
					break;

				}

			}

		};

	}

}

export { ControlledObjectWrapper };
