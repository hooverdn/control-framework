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

import { EdgesGeometry, FrontSide, FlatShading, Group, LineBasicMaterial, LineSegments, Mesh, MeshLambertMaterial } from 'three.js';

/**
 *  An way to group two Make meshes for two geometries with two different, but fixed,
 *  materials and put them together in a group.  Draw lines of different but fixed
 */
class DualPair {

	/**
	 *  Make primary and dual meshes with associated edgelines and put
	 *  them in groups so that primary and dual meshes, with their
	 *  edges, can be easily manipulated separately and together.
	 */
	constructor( primaryGeom, dualGeom ) {

		const primaryMaterial =
			  new MeshLambertMaterial( {

				  color: 0x156289,
				  emissive: 0x072534,
				  side: FrontSide,
				  flatShading: FlatShading,
				  transparent: false,

			  } );

		const dualMaterial =
			  new MeshLambertMaterial( {

				  color: 0xea9d76,
				  emissive: 0x52d444,
				  side: FrontSide,
				  flatShading: FlatShading,
				  transparent: false,

			  } );

		const primaryMesh = new Mesh( primaryGeom, primaryMaterial );
		const primaryLines = makeEdgeLines( primaryGeom, 0xffff00 );
		this.primaryGroup = new Group();
		this.primaryGroup.add( primaryMesh );
		this.primaryGroup.add( primaryLines );

		const dualMesh = new Mesh( dualGeom, dualMaterial );
		const dualLines = makeEdgeLines( dualGeom, 0xff00ff );
		this.dualGroup = new Group();
		this.dualGroup.add( dualMesh );
		this.dualGroup.add( dualLines );

		this.group = new Group();
		this.group.add( this.primaryGroup );
		this.group.add( this.dualGroup );

		function makeEdgeLines( geometry, color ) {

			const edges = new EdgesGeometry( geometry );
			const lineMaterial = new LineBasicMaterial( { color: color } );
			return new LineSegments( edges, lineMaterial );

		}

	}

	/**
	 *  Set the position of the group containing the meshes and edges
	 *  represented by this DualPair.
	 */
	setPosition( x, y, z ) {

		this.group.position.set( x, y, z );

	}

	/**
	 *  Add this object&#8217;s group to the given <code>Object3D</code>.
	 *
	 *  @param {THREE.Object3D} Add the group represented by this
	 *  DualPair to this <code>Object3D</code>, which will typically be
	 *  a scene or a group.
	 */
	addTo( object ) {

		object.add( this.group );

	}

	/**
	 *  Separately set the scale of the meshes, with their edge lines,
	 *  made from the primary and dual geometries.
	 */
	setScale( primaryScale, dualScale ) {

		this.primaryGroup.scale.set( primaryScale, primaryScale, primaryScale );
		this.dualGroup.scale.set( dualScale, dualScale, dualScale );

	}

	/**
	 *  Set the rotation coordinates of the primary mesh.
	 */
	rotatePrimary( x, y, z ) {

		this.primaryGroup.rotation.set( x, y, z );

	}

	/**
	 *  Set the rotation coordinates of the dual mesh.
	 */
	rotateDual( x, y, z ) {

		this.dualGroup.rotation.set( x, y, z );

	}

}

export default DualPair;
