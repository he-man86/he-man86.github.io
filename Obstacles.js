import * as THREE from '../../libs/three137/three.module.js';
import { Group, Vector3 } from '../../libs/three137/three.module.js';
import { GLTFLoader } from '../../libs/three137/GLTFLoader.js';
import { Explosion } from './Explosion.js';

class Obstacles{
    constructor(game){
        this.assetsPath = game.assetsPath;
        this.loadingBar = game.loadingBar;
		this.game = game;
		this.scene = game.scene;
        this.loadStar();
		this.tmpPos = new Vector3();
        this.obstacles = [];
        this.obstacleSpawnOffset = 0;
    }

    loadStar(){
    	const loader = new GLTFLoader( ).setPath(`${this.assetsPath}plane/`);
        this.ready = false;
        
		// Load a glTF resource
		loader.load(
			// resource URL
			'star.glb',
			// called when the resource is loaded
			gltf => {
                this.star = gltf.scene.children[0];
                this.star.name = 'star';
                this.initialize();
			},
			// called while loading is progressing
			xhr => {
                this.loadingBar.update('star', xhr.loaded, xhr.total );
			},
			// called when loading has errors
			err => {
				console.error( err );
			}
		);
	}	

	initialize(){
        const geometry = new THREE.SphereGeometry( 0.1, 32, 16 );
        const material = new THREE.MeshStandardMaterial( {
            roughness: 0.1,
            metalness: 1
        } );

        const obstacle1 = new Group();
        this.obstacles1 = [];
        for ( let i = 0; i < 500; i ++ ) {

            const mesh = new THREE.Mesh( geometry, material );

            mesh.position.x = Math.random() * 200 - 100;
            mesh.position.y = Math.random() * 200 - 100;
            mesh.position.z = Math.random() * 100 ;

            mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 40;

            obstacle1.add(mesh)
        }
        this.obstacles1.push(obstacle1);
        this.scene.add( obstacle1 );

        const obstacle2 = new Group();
        this.obstacles2 = [];
        for ( let i = 0; i < 500; i ++ ) {

            const mesh = new THREE.Mesh( geometry, material );

            mesh.position.x = Math.random() * 200 - 100;
            mesh.position.y = Math.random() * 200 - 100;
            mesh.position.z = Math.random() * 100 + 100;

            mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 40;

            obstacle2.add(mesh)
        }
        this.obstacles2.push(obstacle2);
        this.scene.add( obstacle2 );

		this.ready = true;
    }

    respawnObstacle( obstacle ){
    
        this.obstacleSpawnOffset += (Math.random() * 100) + 200;

        console.log(this.obstacleSpawnOffset)
        obstacle.position.set(
            Math.random() * 200 - 100, 
            Math.random() * 200 - 100, 
            this.obstacleSpawnOffset  );
		obstacle.userData.hit = false;
		obstacle.children.forEach( child => {
			child.visible = true;
		});
    }
    
    reset(){
        ;
    }

	update(pos, time){
        let collisionObstacle;

        this.obstacles1.forEach( obstacle =>{
            const relativePosZ = obstacle.position.z-pos.z;
            if (Math.abs(relativePosZ)<2 && !obstacle.userData.hit){
                collisionObstacle = obstacle;
            }
            if (pos.z > this.obstacleSpawnOffset + 100){
                this.respawnObstacle(obstacle); 
            }
        });

        this.obstacles2.forEach( obstacle =>{
            const relativePosZ = obstacle.position.z-pos.z;
            if (Math.abs(relativePosZ)<2 && !obstacle.userData.hit){
                collisionObstacle = obstacle;
            }
            if (pos.z > this.obstacleSpawnOffset + 100){
                this.respawnObstacle(obstacle); 
            }
        });
       
        if (collisionObstacle!==undefined){
			collisionObstacle.children.some( child => {
				child.getWorldPosition(this.tmpPos);
				const dist = this.tmpPos.distanceToSquared(pos);
				if (dist<5){
					collisionObstacle.userData.hit = true;
					this.hit(child);
                    return true;
                }
            })
            
        }
    }

    hit(obj){
		if (obj.name=='star'){
			obj.visible = false;
			this.game.incScore();
        }else{
            this.explosions.push( new Explosion(obj, this) );
			this.game.decLives();
        }
	}

}

export { Obstacles };