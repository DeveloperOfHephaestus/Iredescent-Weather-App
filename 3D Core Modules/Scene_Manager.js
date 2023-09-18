import *as THREE from "./three.module.js";
import { GLTFLoader } from "./GLTFLoader.js";

/**Creates a scene manager that can be used to add ,remove ,change props of 3d objects in scene 
 * @param {THREE.Loader} loadingManager takes a manager responsible for load tracking 
 * @param {THREE.Scene} three_Scene takes a three js scene instance
*/
export class SceneManager
{ Scene;
  Present_in_Scene=[];
  Geometries=[];
  Materials=[];
  Animations_of_Models=[];
  GLTFLoader=new GLTFLoader();
  LoadingManager;
  
  constructor(three_Scene,loadingManager)
  {this.Scene=three_Scene;
    this.LoadingManager=loadingManager;
    this.GLTFLoader.manager=this.LoadingManager;
  }
  Introduce_Geometry(geometry,Name)
  { this.Geometries.push({Geometry:geometry,Name:Name})
  }
  Introduce_Material(material,Name)
  { this.Materials.push({Material:material,Name:Name})
  }
  getGeometryByName(name){
   let found;
    this.Geometries.forEach(g=>{
    if(g.Name==name)
    found=g.Geometry;
  })
  return found;
  }
  getMaterialByName(name){
    let found;
     this.Materials.forEach(m=>{
     if(m.Name==name)
     found=m.Material;
   })
   return found
   }

   /**returns the object with name given at mesh-Wrapper or Model_Adder() present in collection */
   getObjectByName(name) //for meshes and models
   {let Model;
    this.Present_in_Scene.forEach(model=>{
    if(model.name==name)
    Model=model.model;
   })
   return Model
   }

   Add_to_Collection(model)
   {
    this.Present_in_Scene.push(model);
   }
   Add_to_Scene(name) //iuf you want to add recvursive like array like scene.add(a1,a2,a3......) etc
   {
     this.Scene.add(this.getObjectByName(name));
   }

   /**Adds the collection of  models wrapped as objects to Present_in_Scene 
    * @param {array}  array takes an array []
    * 
   */
   Add_Recursive_Collection(array) //adds all elements of array to collection
   { array.forEach(ele=>{this.Present_in_Scene.push(ele)});
   }

   /**Adds the collection of  models to the scene passed as array 
    * @param {array} array takes an array []  
    */
   Add_Recursive_Models(array)  //adds all elements of array to scene
   { array.forEach(ele=>{
    let getit=this.getObjectByName(ele.name);
    if((getit instanceof THREE.Object3D))
    this.Scene.add(getit);
    else console.error("either model is not loaded due to exception or it is not found")
   })

   }
   /**Removes the object with name from scene */
   Remove_from_Scene(name)
   {
    this.Scene.remove(this.getObjectByName(name));
   }
   /**Changes the rotation of object with name along x,y and z */
   ChangeRotation(name,x,y,z)
   {
    let obj=this.getObjectByName(name);
    obj.rotation.set(x,y,z);
   }
   /**Changes the position of object with name along x,y and z */
   ChangePosition(name,x,y,z)
   {
    let obj=this.getObjectByName(name);
    obj.position.set(x,y,z);
   }
   /**Changes the scale of obect with name along x ,y z */
   ChangeScale(name,x,y,z)
   {
    let obj=this.getObjectByName(name);
    obj.scale.set(x,y,z);
   }
  
   /**Returns a glb loaded model from url as {name,animations ,model} 
    * @prop {name} .name that you assign will be model's name for SceneManager
    * @prop {animations} .Includes the animations within the glb file 
    * @prop {model} ,this is actual glb scene ,  
   */
   Model_Adder(url,nameYouAssign)
   { let model={name:undefined,animations:undefined,model:undefined}  
    this.GLTFLoader.load(url,function(e){
    model.model=e.scene;
    model.animations=e.animations;
    model.name=nameYouAssign;
    })
    this.Animations_of_Models.push({of:model.name,animations:model.animations}); //wrapped as { of:"",animations:[]}
    return model;
   }
   Image_Textures_Maker(url,repeatX,repeatY,wrapS,wrapT)
   { let texture=new THREE.TextureLoader(this.LoadingManager).load(url);
     texture.repeat.set(repeatX,repeatY);
     texture.wrapS=wrapS;
     texture.wrapT=wrapT;
     return texture

   }
   Video_Textures_Maker(Video_ID,repeatX,repeatY,wrapS,wrapT)
   { let videoT=new THREE.VideoTexture(document.getElementById(Video_ID),THREE.UVMapping,wrapS,wrapT,THREE.LinearFilter,
    THREE.LinearFilter);
    document.addEventListener("mousemove",function(){document.getElementById(Video_ID).play()});
    return videoT
   }
  
   getAnimationsByName(nameOfAnimationClip)
   { let found
    this.Animations_of_Models.forEach(ani=>{
     if(ani.of==nameOfAnimationClip)
     found=ani.animations   
    })
    return found
   }
   Update()
   { 
    return true

   }


}