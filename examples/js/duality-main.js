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

import {

	Clock,
	Color,
	Group,
	PerspectiveCamera,
	PointLight,
	Scene,
	Vector3,
	WebGLRenderer,

	TetrahedronBufferGeometry,
	BoxBufferGeometry,
	OctahedronBufferGeometry,
	DodecahedronBufferGeometry,
	IcosahedronBufferGeometry,

} from 'three.js';

import { webgl, getWebGLErrorMessage } from 'Detector';
import {

	ControlManager,
	DirectionControl,
	DistanceMouseControl,
	DistanceTouchControl,
	DistanceWheelControl,
	RotationControl,
	MOUSE_BUTTONS,
	ControlledObjectWrapper,
	CameraMoveControl,
	CameraDistanceControl,
	CameraRotationControl,
	CameraZoomControl,

} from 'object-controls';

import DualPair from './DualPair.js';

const noflags = ControlManager.noflags;
var fov = 28;
var origin = new Vector3( 0, 0, 0 );

function init() {

	const clock = new Clock();
	const scene = new Scene();
	scene.background = new Color( 0x3f3f3f );
	//const text = document.getElementById( 'text' );
	const container = document.getElementById( 'webgl' );
	let height = window.innerHeight;// - text.clientHeight;
	let width = window.innerWidth;

	const cameraGroup = new Group();
	cameraGroup.position.z = 70;
	scene.add( cameraGroup );
	let camera;

	if ( width > height ) {

		camera = new PerspectiveCamera(
			Math.max( fov, 48 * height / width ),
			width / height,
			0.1,
			200
		);

	} else {

		camera = new PerspectiveCamera(
			Math.max( fov * height / width, 48 ),
			width / height,
			0.1,
			200
		);

	}

	cameraGroup.add( camera );
	camera.lookAt( origin );

	const renderer = new WebGLRenderer( { antialias: true } );
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( width, height );
	renderer.setClearColor( 0x000000, 1 );
	container.appendChild( renderer.domElement );

	const lights = [];
	lights[ 0 ] = new PointLight( 0xffffff, 1, 0 );
	lights[ 1 ] = new PointLight( 0xffffff, 1, 0 );
	lights[ 2 ] = new PointLight( 0xffffff, 1, 0 );

	lights[ 0 ].position.set( 0, 200, 0 );
	lights[ 1 ].position.set( 100, 200, 100 );
	lights[ 2 ].position.set( - 100, - 200, - 100 );

	scene.add( lights[ 0 ] );
	scene.add( lights[ 1 ] );
	scene.add( lights[ 2 ] );

	const tetraTetra = new DualPair(
		new TetrahedronBufferGeometry( 7 ),
		new TetrahedronBufferGeometry( 7 )
	);

	const tetraGroup = new Group();
	tetraGroup.add( tetraTetra.group );

	if ( width > height ) {

		tetraGroup.rotation.x = Math.PI / 8;
		tetraGroup.position.x = - 5;
		tetraGroup.position.y = 5;
		tetraTetra.setPosition( - 14, 0, 5 );

	} else {

		tetraGroup.rotation.x = Math.PI / 8;
		tetraGroup.position.x = - 5;
		tetraGroup.position.y = 5;
		tetraTetra.setPosition( 5, - 24, 0 );

	}

	tetraTetra.rotateDual( Math.PI / 2, 0, 0 );
	//tetraTetra.addTo( scene );
	scene.add( tetraGroup );

	const cubeOcta = new DualPair(
		new BoxBufferGeometry( 12, 12, 12 ),
		new OctahedronBufferGeometry( 6 )
	);

	cubeOcta.setPosition( 0, 0, 0 );
	cubeOcta.rotatePrimary( Math.PI / 8, 0, 0 );
	cubeOcta.rotateDual( Math.PI / 8, 0, 0 );
	cubeOcta.addTo( scene );

	const dodecaIcosa = new DualPair(

		new DodecahedronBufferGeometry( 8 ),
		new IcosahedronBufferGeometry( 8 )

	);

	if ( width > height ) {

		dodecaIcosa.setPosition( 19, 0, 0 );

	} else {

		dodecaIcosa.setPosition( 0, 19, 0 );

	}

	dodecaIcosa.rotateDual( Math.PI / 2, 0, 0 );
	dodecaIcosa.addTo( scene );

	const controlledObjectWrappers = [

		new ControlledObjectWrapper( tetraTetra.group, 8, 0xffff7f ),
		new ControlledObjectWrapper( cubeOcta.group, 8, 0xffff7f ),
		new ControlledObjectWrapper( dodecaIcosa.group, 8, 0xffff7f )

	];


	const controlledObjects = controlledObjectWrappers.map(	function ( wrapper ) {

		return wrapper.sphere;

	} );

	const controlManager = new ControlManager(
		camera,
		renderer.domElement,
		controlledObjects
	);
	const rotationControl = new RotationControl();
	//rotationControl.addEventListener( 'change', render );

	controlManager.addMouseControl( MOUSE_BUTTONS.LEFT, noflags, rotationControl );
	controlManager.addMouseControl(
		MOUSE_BUTTONS.LEFT | MOUSE_BUTTONS.RIGHT,
		noflags,
		rotationControl
	);
	controlManager.addMouseControl(
		MOUSE_BUTTONS.LEFT,
		ControlManager.shiftKey,
		rotationControl
	);
	controlManager.addTouchControl( 1, noflags, rotationControl );

	const distanceMouseControl = new DistanceMouseControl( camera );
	const distanceTouchControl = new DistanceTouchControl( camera );
	const distanceWheelControl = new DistanceWheelControl( camera );
	//distanceMouseControl.addEventListener( 'change', render );
	//distanceTouchControl.addEventListener( 'change', render );
	//distanceWheelControl.addEventListener( 'change', render );
	controlManager.addMouseControl( MOUSE_BUTTONS.WHEEL, noflags, distanceMouseControl );
	controlManager.addTouchControl( 2, noflags, distanceTouchControl );
	controlManager.addWheelControl( noflags, distanceWheelControl );

	const cameraDistanceControl = new CameraDistanceControl( camera );
	controlManager.addMouseControl(
		MOUSE_BUTTONS.WHEEL,
		ControlManager.shiftKey,
		cameraDistanceControl
	);

	const directionControlMouse = new DirectionControl( camera, renderer );
	//directionControl.addEventListener( 'change', render );
	controlManager.addMouseControl(
		MOUSE_BUTTONS.RIGHT,
		noflags,
		directionControlMouse
	);
	controlManager.addMouseControl(
		MOUSE_BUTTONS.LEFT | MOUSE_BUTTONS.RIGHT,
		noflags,
		directionControlMouse
	);
	controlManager.addMouseControl(
		MOUSE_BUTTONS.LEFT,
		ControlManager.shiftKey,
		directionControlMouse
	);
	controlManager.addTouchControl( 3, noflags, directionControlMouse );

	const cameraMoveControl = new CameraMoveControl( camera, renderer );
	controlManager.addMouseControl(
		MOUSE_BUTTONS.MIDDLE | MOUSE_BUTTONS.RIGHT,
		noflags,
		cameraMoveControl
	);

	const cameraZoomControl = new CameraZoomControl( camera, 0.1, 20 );
	controlManager.addMouseControl(
		MOUSE_BUTTONS.MIDDLE | MOUSE_BUTTONS.LEFT,
		noflags,
		cameraZoomControl
	);

	const cameraRotationControl =
		  new CameraRotationControl( camera, renderer.domElement );
	controlManager.addMouseControl(
		MOUSE_BUTTONS.MIDDLE | MOUSE_BUTTONS.LEFT | MOUSE_BUTTONS.RIGHT,
		noflags,
		cameraRotationControl
	);

	for ( let idx = 0; idx < controlledObjectWrappers.length; idx ++ ) {

		let wrapper = controlledObjectWrappers[ idx ];
		controlManager.addEventListener( 'start', wrapper.startListener, false );
		controlManager.addEventListener( 'end', wrapper.endListener, false );

	}

	let tcos = Math.cos( 2 * Math.PI / 3 );

	animate();


	function scaleAll() {

		const elapsedTime = clock.getElapsedTime();
		const cosTime1 = Math.cos( elapsedTime / 2 );
		const cosTime2 = Math.cos( 3 * elapsedTime / ( 2 * Math.PI ) );
		const cosTime3 = Math.cos( Math.E * elapsedTime / ( 2 * Math.PI ) );

		const tscalePrimary = ( 1 + tcos ) * ( 1 + cosTime1 ) - tcos;
		const tscaleDual = ( 1 + tcos ) * ( 1 - cosTime1 ) - tcos;
		tetraTetra.setScale( tscalePrimary, tscaleDual );


		const coScalePrimary = ( 1 / Math.sqrt( 3 ) - 1 ) * ( 1 - cosTime2 ) / 2 + 1;
		const coScaleDual = ( Math.sqrt( 3 ) - 1 ) * ( 1 - cosTime2 ) / 2 + 1;
		cubeOcta.setScale( coScalePrimary, coScaleDual );
		dodecaIcosa.setScale( 1 + cosTime3 / 8, 1 - cosTime3 / 8 );

	}


	let animating = false;
	function animate() {

		if ( ! document.hidden ) {

			scaleAll();
			render();
			requestAnimationFrame( animate );

		} else {

			animating = false;

		}

	}


	function render() {

		renderer.render( scene, camera );

	}


	document.addEventListener( 'visibilitychange', function () {

		if ( ! document.hidden && ! animating ) {

			animating = true;
			animate();

		}

	}, false );

	function onWindowResize() {

		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();

		renderer.setSize( window.innerWidth, window.innerHeight );

	}

	window.addEventListener( 'resize', onWindowResize );


}

if ( webgl ) {

	window.onload = init;

} else {

	window.onload = function () {

		const warning = getWebGLErrorMessage();
		document.getElementById( 'webgl' ).appendChild( warning );

	};

}

document.addEventListener( 'contextmenu', function ( e ) {

	e.preventDefault();

} );
