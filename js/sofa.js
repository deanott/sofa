/*Logic to remove sofa from stairway*/

var clock = new THREE.Clock();
var gridX = false;
var gridY = false;
var gridZ = false;
var axes = false;
var ground = true;

var worldSize = {
    width: 500,
    height: 500,
    depth: 100

}

var sofaSize = {
    width: 300,
    height: 75,
    depth: 100,

    armWidth: 20,
    armHeight: 123,

    backHeight: 150,
    backDepth: 20
}

var camera, scene, renderer;
var geometry, material, mesh;
var cameraControls, effectController;

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    scene = new THREE.Scene();

    createSofa(scene);
    specialStairs(scene);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);
}

function createSofa(scene) {
    sofa = new THREE.Geometry();

    coreSofa = new THREE.BoxGeometry(sofaSize.width, sofaSize.height, sofaSize.depth);
    backRestSofa = new THREE.BoxGeometry(sofaSize.width, sofaSize.backHeight, sofaSize.backDepth);
    armRestSofaLeft = new THREE.BoxGeometry(sofaSize.armWidth, sofaSize.armHeight, sofaSize.depth + sofaSize.backDepth);
    armRestSofaRight = new THREE.BoxGeometry(sofaSize.armWidth, sofaSize.armHeight, sofaSize.depth + sofaSize.backDepth);

    //Offset back
    for (var i = 0; i < backRestSofa.vertices.length; i++) backRestSofa.vertices[i].z -= sofaSize.depth / 2 + sofaSize.backDepth / 2;
    for (var i = 0; i < backRestSofa.vertices.length; i++) backRestSofa.vertices[i].y -= sofaSize.height / 2 - sofaSize.backHeight / 2;

    //Offset Rests
    for (var i = 0; i < armRestSofaLeft.vertices.length; i++) armRestSofaLeft.vertices[i].y -= sofaSize.height / 2 - sofaSize.armHeight / 2;
    for (var i = 0; i < armRestSofaLeft.vertices.length; i++) armRestSofaLeft.vertices[i].x -= sofaSize.width / 2 + sofaSize.armWidth / 2;
    for (var i = 0; i < armRestSofaLeft.vertices.length; i++) armRestSofaLeft.vertices[i].z -= sofaSize.backDepth / 2;

    for (var i = 0; i < armRestSofaRight.vertices.length; i++) armRestSofaRight.vertices[i].y -= sofaSize.height / 2 - sofaSize.armHeight / 2;
    for (var i = 0; i < armRestSofaRight.vertices.length; i++) armRestSofaRight.vertices[i].x += sofaSize.width / 2 + sofaSize.armWidth / 2;
    for (var i = 0; i < armRestSofaRight.vertices.length; i++) armRestSofaRight.vertices[i].z -= sofaSize.backDepth / 2;

    material = new THREE.MeshBasicMaterial({
        color: 0x00ccff,
        wireframe: true
    });

    meshCore = new THREE.Mesh(coreSofa, material);
    meshBack = new THREE.Mesh(backRestSofa, material);
    meshRestLeft = new THREE.Mesh(armRestSofaLeft, material);
    meshRestRight = new THREE.Mesh(armRestSofaRight, material);

    sofa.merge(meshCore.geometry, meshCore.matrix);
    sofa.merge(meshBack.geometry, meshBack.matrix);
    sofa.merge(meshRestLeft.geometry, meshRestLeft.matrix);
    sofa.merge(meshRestRight.geometry, armRestSofaRight.matrix);

    meshSofa = new THREE.Mesh(sofa, material);

    //add mesh direction
    meshSofa.direction = {
        x: 2,
        y: 2,
        z: 4
    }

    scene.add(meshSofa);

}

function specialStairs(scene){
  // MATERIALS

  material = new THREE.MeshBasicMaterial({
    color: 0x00cdef,
    wireframe: true
  });


  var stepWidth = sofaSize.width -0.1; //only just!
  var stepSize = sofaSize.armHeight;
  var stepThickness = 50;

  // height from top of one step to bottom of next step up
  var verticalStepHeight = stepSize;
  var horizontalStepDepth = stepSize * 4;

  var stepHalfThickness = stepThickness / 2;
  var steps = new THREE.Geometry();

  var offsetX = 0;
  var offsetY = 0;
  var offsetZ = 0;
  for (var i = 0; i < 4; i++) {
    var stepVertical = new THREE.CubeGeometry(stepWidth, verticalStepHeight, stepThickness);
    // Make and position the vertical part of the step
    stepGen = new THREE.Mesh(stepVertical, material);
    stepGen.geometry.translate(offsetX,offsetY,offsetZ);
    //Increase offset
    offsetY += verticalStepHeight;
    offsetZ -= verticalStepHeight;
    steps.merge(stepGen.geometry, stepGen.matrix);
  }

  stepMesh = new THREE.Mesh(steps, material);

  scene.add(stepMesh);
}

function moveObject(obj) {
    obj.position.x += obj.direction.x;
    obj.position.y += obj.direction.y;
    obj.position.z += obj.direction.z;
    // if edge is reached, bounce back
    if (obj.position.x < -worldSize.width + sofaSize.width/2 ||
        obj.position.x > worldSize.width - sofaSize.width/2) {
        obj.direction.x = -obj.direction.x ;
    }

    if (obj.position.y < -worldSize.height +sofaSize.width/2 ||
        obj.position.y > worldSize.height - sofaSize.width/2) {
        obj.direction.y = -obj.direction.y ;
    }

    if (obj.position.z < -worldSize.width - 10000 + sofaSize.width/2 ||
        obj.position.z > worldSize.width + 1000 - sofaSize.width/2) {
        obj.direction.z = -obj.direction.z ;
    }

}

function animate() {
    requestAnimationFrame(animate);
    meshSofa.rotation.x += 0.005;
    meshSofa.rotation.y += 0.01;
    moveObject(meshSofa);
    renderer.render(scene, camera);
}
