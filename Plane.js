import { Vector3 } from '../../libs/three137/three.module.js';
import { GLTFLoader } from '../../libs/three137/GLTFLoader.js';
import * as THREE from '../../libs/three137/three.module.js';

class Plane{
    constructor(game){
        this.assetsPath = game.assetsPath;
        this.loadingBar = game.loadingBar;
        this.game = game;
        this.scene = game.scene;
        this.Joystick1Pos = this.game.Joystick1Pos;
        this.Joystick2Pos = this.game.Joystick2Pos;
        this.load();
        this.tmpPos = new Vector3();
        this.tmpPos2 = new THREE.Quaternion();
        this._rotation = new THREE.Quaternion();
        const axesHelper = new THREE.AxesHelper( 1 );
        this.scene.add( axesHelper );

    }

    get position(){
        if (this.plane!==undefined) this.plane.getWorldPosition(this.tmpPos);
       // console.log(this.tmpPos)
        return this.tmpPos;
    }

    get rotation(){
        if (this.plane!==undefined) //this.plane.getWorldQuaternion(this.tmpPos2);
        console.log(this._rotation)
        return this._rotation;
    }

    set visible(mode){
        this.plane.visible = mode;
    }

    load(){
    	const loader = new GLTFLoader( ).setPath(`${this.assetsPath}plane/`);
        this.ready = false;
        
		// Load a glTF resource
		loader.load(
			// resource URL
			'microplane.glb',
			// called when the resource is loaded
			gltf => {

				this.scene.add( gltf.scene );
                this.plane = gltf.scene;
                this.velocity = new Vector3(0,0,0.5);
                
                this.propeller = this.plane.getObjectByName("propeller");

                this.ready = true;
    
			},
			// called while loading is progressing
			xhr => {

				this.loadingBar.update('plane', xhr.loaded, xhr.total );
				
			},
			// called when loading has errors
			err => {

				console.error( err );

			}
		);
	}	

    reset(){
        this.plane.position.set(10, 0, 0);
        this.plane.rotation.set(0, 0, 0.2, 'XYZ');
        this.plane.visible = true;
        this.velocity.set(0,0,0.1);
    }

    update(time){
        if (this.propeller !== undefined) this.propeller.rotateZ(1);

        if (this.game.active){

            this.plane.rotation.set(this.Joystick1Pos.up*(Math.PI/2), 0, -this.Joystick2Pos.right*(Math.PI/2), 'ZXY');

            let a = new THREE.Euler( this.Joystick1Pos.up*(Math.PI/2), 0, -this.Joystick2Pos.right*(Math.PI/2), 'ZXY' );
            console.log(a)
            this._rotation.setFromEuler(a);            

            this.velocity.z = 0.1;
            this.plane.translateZ( this.velocity.z );      
            this.axesHelper.position.z = this.plane.position.z; 

        }else{
            this.plane.rotation.set(0, 0, Math.sin(time*3)*0.2, 'XYZ');
            //this.plane.position.y = Math.cos(time) * 1.5;
        }

    }
}

export { Plane };