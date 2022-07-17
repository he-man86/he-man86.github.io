import { Object3D, Camera, Vector3, Quaternion, Raycaster } from '../../libs/three137/three.module.js';
import { JoyStick } from '../../libs/JoyStickNew.js';

class Controller{
    constructor(game){
        this.clock = game.clock;
        this.game = game;
        this.tmpVec3 = new Vector3();

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
        this.game.Joystick1Pos.up = up;
    }

    onMoveJoystick2( up, right ){
        this.game.Joystick2Pos.right = -right;
    }

    update(time){   
        
    }

}

export { Controller };