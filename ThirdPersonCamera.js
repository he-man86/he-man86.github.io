import * as THREE from '../../libs/three137/three.module.js';


class ThirdPersonCamera {
    constructor(params) {
      this._rotation = params.rotation;
      this._position = params.position;
      this._camera = params.camera;
  
      this._currentPosition = new THREE.Vector3();
      this._currentLookat = new THREE.Vector3();
    }
  
    _CalculateIdealOffset() {
      const idealOffset = new THREE.Vector3(0 , 0 , -10);
      idealOffset.applyQuaternion(this._rotation);
      idealOffset.add(this._position);
      return idealOffset;
    }
  
    _CalculateIdealLookat() {
      const idealLookat = new THREE.Vector3(0, 0, 50);
      idealLookat.applyQuaternion(this._rotation);
      idealLookat.add(this._position);
      return idealLookat;
    }
  
    Update(timeElapsed) {
      const idealOffset = this._CalculateIdealOffset();
      const idealLookat = this._CalculateIdealLookat();

      console.log(this._rotation)
      console.log(this._position)
     // console.log(this._position)
      // const t = 0.05;
      // const t = 4.0 * timeElapsed;
      const t = 1.0 - Math.pow(0.001, timeElapsed);
  
      this._currentPosition.lerp(idealOffset, t);
      this._currentLookat.lerp(idealLookat, t);
  
      this._camera.position.copy(this._currentPosition);
      this._camera.lookAt(this._currentLookat);
      
    }
  }
  
  
export { ThirdPersonCamera };