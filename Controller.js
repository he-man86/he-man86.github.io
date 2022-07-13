import { Object3D, Camera, Vector3, Quaternion, Raycaster } from '../../libs/three137/three.module.js';
import { JoyStick } from '../../libs/JoyStick.js';
//import { Game } from './Game.js';

class Controller{
    constructor(game){
        this.clock = game.clock;
        this.game = game;
        this.tmpVec3 = new Vector3();

        this.Joystick1Pos = this.game.Joystick1Pos;
        this.Joystick2Pos = this.game.Joystick2Pos;

        if('ontouchstart' in document.documentElement){

            const options1 = {
                left: true,
                app: this,
                onMove: this.onMoveJoystick1
            }
            const joystick1 = new JoyStick(options1);

            const options2 = {
                right: true,
                app: this,
                onMove: this.onMoveJoystick2
            }
            const joystick2 = new JoyStick(options2);

            this.touchController = { joystick1, joystick2};
        }

    }

    onMoveJoystick1( up, right ){
        this.Joystick1Pos.up = up;
        this.Joystick1Pos.right = -right;
    }

    onMoveJoystick2( up, right ){
        this.Joystick2Pos.up = up; 
        this.Joystick2Pos.right = -right;
    }

    update(time){   
        
    }
}

export { Controller };