import { Object3D, Camera, Vector3, Quaternion, Raycaster } from '../../libs/three137/three.module.js';
import { JoyStick } from '../../libs/JoyStick.js';
//import { Game } from './Game.js';

class Controller{
    constructor(game){
        this.clock = game.clock;
        this.game = game;
        this.tmpVec3 = new Vector3();

        const options1 = {
            left: true,
            app: this,
            onMove: this.onMove
        }
        const joystick1 = new JoyStick(options1);

        const options2 = {
            right: true,
            app: this,
            onMove: this.onLook
        }
        const joystick2 = new JoyStick(options2);
        console.dir(joystick2)
        console.log(joystick2)

        this.touchController = { joystick1, joystick2};

    }

    update(time){   
        console.log("as")
    }
}

export { Controller };