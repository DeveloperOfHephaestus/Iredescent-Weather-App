//importing core modules
import *as THREE from "../3D Core Modules/three.module.js";
import {SceneManager} from "../3D Core Modules/Scene_Manager.js";
import {Animation_Manager} from "../3D Core Modules/Animation_Manager.js";
import {Create_LoadManager} from "../3D Core Modules/CommonLoadingManager.js";
import {EffectComposer} from "../3D Core Modules/EffectComposer.js";
import {OrbitControls} from "../3D Core Modules/OrbitControls.js";
import {UnrealBloomPass} from "../3D Core Modules/UnrealBloomPass.js";
import {RenderPass} from "../3D Core Modules/RenderPass.js";


const APIkey="a51b5e88669648b0aa095336231709";
const parentDiv=document.getElementById("dataDiv");
const mainDiv=document.getElementById("mainDiv");
const text=document.getElementById("message")
const Dimensions={width:document.body.clientWidth,height:document.body.clientHeight};
var DidUserAllowed=false;
var Position={latitude:undefined,longitude:undefined};



navigator.geolocation.getCurrentPosition((p)=>{
    DidUserAllowed=true;
    Position.latitude=p.coords.latitude;
    Position.longitude=p.coords.longitude;
    FetchData(Position.latitude,Position.longitude);
},(er)=>{
   throw er.message;
   text.innerText="You have not allowed us to get Position , weather data cannot be obtained , please reload";
})



async function FetchData(latitude,longitude){
    
text.innerText="Fetching Hourly Data...";

    //this is url for getting current weather data
    const URL=`https://api.weatherapi.com/v1/forecast.json?key=
    ${APIkey}
    &q=${
        latitude
    },${longitude}
    &aqi=no1`;

  const data=await fetch(URL,{method:"get"});
  const results=await data.json();
  console.log(results);

  const dataArray=results.forecast.forecastday[0];
  console.log(dataArray);

  const dayCondition=dataArray.day;
  console.log("day-Condition",dayCondition);
  
  const hourConditions=dataArray.hour;
  console.log("hour-Condions",console.table(hourConditions));

CreateDataDivs(hourConditions);
text.innerText="Weather Hourly Data "
}


function CreateDataDivs(hourConditions){
    hourConditions.forEach((condition,index)=>{
        const div=document.createElement("div");
        div.classList="ForecastDiv";
        div.innerHTML=`
        <img src=https:/${condition.condition.icon} height=50px width=50px>
        <h3>${condition.time}<h3>
        <p>${condition.condition.text}</p>
        
        `
        parentDiv.appendChild(div);
        div.style.animation="showIn 0.3s linear 1 "+(index/10)+"s";

    })
}

//creating three scene
const scene=new THREE.Scene();
const camera=new THREE.PerspectiveCamera(45,Dimensions.width/Dimensions.height,0.1,1000);
const renderer=new THREE.WebGLRenderer({antialias:true});
camera.position.set(0,1,50);
renderer.setSize(Dimensions.width,Dimensions.height);
document.body.appendChild(renderer.domElement);
renderer.domElement.classList="Scene";


const l1=new THREE.PointLight("white",5);
const ambientLight=new THREE.AmbientLight("white",5);
const dirL=new THREE.DirectionalLight("white",2);
const dirL2=new THREE.DirectionalLight("white",2);
dirL2.translateZ(5)
scene.add(l1,dirL,dirL2,ambientLight);
const loadManager=Create_LoadManager(AddModels,Progress);
const sceneHandler=new SceneManager(scene,loadManager);
var AnimationHandler;
const orbitC=new OrbitControls(camera,document.body);
orbitC.autoRotate=true;
orbitC.autoRotateSpeed=0.5;
orbitC.enableZoom=false;
//bloom effect
const composer=new EffectComposer(renderer);
const renderScene=new RenderPass(scene,camera);
composer.addPass(renderScene);
const pass=new UnrealBloomPass( new THREE.Vector2( Dimensions.width, Dimensions.height ), 1.5, 1, 0.85 );
composer.addPass(pass);

const model=sceneHandler.Model_Adder("../assets/earth.glb","e");
const skybox=sceneHandler.Model_Adder("../assets/box.glb","b");



function Progress(url,loaded,total)
{
    const l=Math.floor((loaded/total)*100);
    mainDiv.setAttribute("data-","Loaded : "+l+" %");
}
function AddModels(){
//







mainDiv.classList="main";

sceneHandler.Add_Recursive_Collection([model,skybox]);
sceneHandler.Add_Recursive_Models([model,skybox]);
const lessOrEqualto770px=window.matchMedia("(max-width:770px)").matches;
const GreaterorEqualto900px=window.matchMedia("(min-width:900px)").matches;

let Model_reAdjust=()=>{
sceneHandler.ChangeScale("b",20,20,20);
sceneHandler.ChangeScale("e",0.01,0.01,0.01);

if(lessOrEqualto770px){
    sceneHandler.ChangePosition("e",-10,0,0)
   
}
if(GreaterorEqualto900px){
    sceneHandler.ChangePosition("e",-20,0,0);
    
}
console.log("model-reAdjusted to ",model.model.position)
}

Model_reAdjust();

//animations\
AnimationHandler=new Animation_Manager(sceneHandler);
AnimationHandler.IntroduceAnimation(model.animations[0],"e","test");
AnimationHandler.PlayAnimation("test");



//animate camera
camera.position.set(0,1,100);
let time=100;
let x=setInterval(()=>{
time-=0.5;
    camera.position.z=time;
   if(time<55){clearInterval(x)} 
},16)

//now fetch and display



AnimateLoop();

}

//animateLoop

function AnimateLoop(){
    requestAnimationFrame(AnimateLoop);
     if(AnimationHandler){
        AnimationHandler.Update();
     }
     orbitC.update();
     composer.render(scene,camera);
    //renderer.render(scene,camera);
}


