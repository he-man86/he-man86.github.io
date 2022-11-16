import * as THREE from '../../libs/three137/three.module.js';
import { RGBELoader } from '../../libs/three137/RGBELoader.js';
import { LoadingBar } from '../../libs/LoadingBar.js';
import { Plane } from './Plane.js';
import { Obstacles } from './Obstacles.js';
import { Controller } from './Controller.js';
import { ThirdPersonCamera } from './ThirdPersonCamera.js';
//import { SFX } from '../../libs/SFX.js';

class Game{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
        
        this.loadingBar = new LoadingBar();
        this.loadingBar.visible = false;

        this.clock = new THREE.Clock();

		this.assetsPath = '../../assets/';
        
        const fov = 60;
        const aspect = 1920 / 1080;
        const near = 1.0;
        const far = 1000.0;
        this.camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
        this.camera.position.set(25, 10, 25);

		this.scene = new THREE.Scene();
      //  this.scene.add(this.camera);

		const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        ambient.position.set( 0.5, 1, 0.25 );
		this.scene.add(ambient);
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
		container.appendChild( this.renderer.domElement );
        this.setEnvironment();
        
        this.active = false;
        this.Joystick1Pos = { up:0 };
        this.Joystick2Pos = { right:0 };
        this.load();

        window.addEventListener('resize', this.resize.bind(this) );

        const btn = document.getElementById('playBtn');
        btn.addEventListener('click', this.startGame.bind(this));


	}
	
    startGame(){
        const gameover = document.getElementById('gameover');
        const instructions = document.getElementById('instructions');
        const btn = document.getElementById('playBtn');

        gameover.style.display = 'none';
        btn.style.display = 'none';

        this.score = 0;
        this.bonusScore = 0;
        this.lives = 3;

        let elm = document.getElementById('score');
        elm.innerHTML = this.score;
        
        elm = document.getElementById('lives');
        elm.innerHTML = this.lives;

        this.plane.reset();
        this.obstacles.reset();

        this.active = true;

        //this.sfx.play('engine');
    }

    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight ); 
    }

    setEnvironment(){
        const loader = new RGBELoader().setPath(this.assetsPath);
        const pmremGenerator = new THREE.PMREMGenerator( this.renderer );
        pmremGenerator.compileEquirectangularShader();
        
        const self = this;
        
        loader.load( 'hdr/venice_sunset_1k.hdr', ( texture ) => {
          const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
          pmremGenerator.dispose();

          self.scene.environment = envMap;

        }, undefined, (err)=>{
            console.error( err.message );
        } );
    }
    
	load(){
        this.loadSkybox();
        this.loading = true;
        this.loadingBar.visible = true;

        this.plane = new Plane(this);
        this.obstacles = new Obstacles(this);
        this.controller = new Controller(this);
        //console.log(this.plane.position)
        //console.log(this.plane.rotation)
        this.thirdPersonCamera = new ThirdPersonCamera({
            camera: this.camera,
            rotation: this.plane.rotation,
            position:this.plane.position,
          });

        //this.loadSFX();
    }

    loadSFX(){
        this.sfx = new SFX(this.camera, this.assetsPath + 'plane/');

        this.sfx.load('explosion');
        this.sfx.load('engine', true);
        this.sfx.load('gliss');
        this.sfx.load('gameover');
        this.sfx.load('bonus');
    }

    loadSkybox(){
        this.scene.background = new THREE.CubeTextureLoader()
	        .setPath( `${this.assetsPath}/plane/paintedsky/` )
            .load( [
                'px.jpg',
                'nx.jpg',
                'py.jpg',
                'ny.jpg',
                'pz.jpg',
                'nz.jpg'
            ], () => {
                this.renderer.setAnimationLoop(this.render.bind(this));
            } );
    }
    
    gameOver(){
        this.active = false;

        const gameover = document.getElementById('gameover');
        const btn = document.getElementById('playBtn');

        gameover.style.display = 'block';
        btn.style.display = 'block';

        this.plane.visible = false;

        this.sfx.stopAll();
        this.sfx.play('gameover');
    }

    incScore(){
        this.score++;

        const elm = document.getElementById('score');

        if (this.score % 3==0){
            this.bonusScore += 3;
            this.sfx.play('bonus');
        }else{
            this.sfx.play('gliss');
        }

        elm.innerHTML = this.score + this.bonusScore;
    }

    decLives(){
        this.lives--;

        const elm = document.getElementById('lives');

        elm.innerHTML = this.lives;

        if (this.lives==0) setTimeout(this.gameOver.bind(this), 1200);

        this.sfx.play('explosion');
    }

	render() {
        if (this.loading){
            if (this.plane.ready && this.obstacles.ready){
                this.loading = false;
                this.loadingBar.visible = false;
            }else{
                return;
            }
        }

        const dt = this.clock.getDelta();
        const time = this.clock.getElapsedTime();

        this.controller.update(time);
        this.plane.update(time);

       this.plane.rotation;
       this.plane.position;
        if (this.active){
            this.obstacles.update(this.plane.position, dt);
        }
    
       // console.log(this.thirdPersonCamera._rotation);
        this.thirdPersonCamera.Update(time);
    
        this.renderer.render( this.scene, this.camera );

    }
}

export { Game };