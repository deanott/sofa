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
    //createStairs(scene);

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
        x: 3,
        y: 3
    }

    scene.add(meshSofa);


}

///Source: https://gist.github.com/cowboyd/9529745
function createStairs(scene) {
    // MATERIALS
    var stepMaterialVertical = new THREE.MeshLambertMaterial({
        color: 0xA85F35
    });
    var stepMaterialHorizontal = new THREE.MeshLambertMaterial({
        color: 0xBC7349
    });

    var stepWidth = 500;
    var stepSize = 200;
    var stepThickness = 50;
    // height from top of one step to bottom of next step up
    var verticalStepHeight = stepSize;
    var horizontalStepDepth = stepSize * 2;

    var stepHalfThickness = stepThickness / 2;

    // +Y direction is up
    // Define the two pieces of the step, vertical and horizontal
    // THREE.CubeGeometry takes (width, height, depth)
    var stepVertical = new THREE.CubeGeometry(stepWidth, verticalStepHeight, stepThickness);
    var stepHorizontal = new THREE.CubeGeometry(stepWidth, stepThickness, horizontalStepDepth);
    var stepMesh;
    for (var i = 0; i < 6; i++) {
        var offsetY = i * (verticalStepHeight + stepThickness);
        var offsetZ = i * (horizontalStepDepth - stepThickness);
        // Make and position the vertical part of the step
        stepMesh = new THREE.Mesh(stepVertical, stepMaterialVertical);
        // The position is where the center of the block will be put.
        // You can define position as THREE.Vector3(x, y, z) or in the following way:
        stepMesh.position.x = 0; // centered at origin
        stepMesh.position.y = verticalStepHeight / 2 + offsetY; // half of height: put it above ground plane
        stepMesh.position.z = offsetZ; // centered at origin
        scene.add(stepMesh);

        // Make and position the horizontal part
        stepMesh = new THREE.Mesh(stepHorizontal, stepMaterialHorizontal);
        stepMesh.position.x = 0;
        // Push up by half of horizontal step's height, plus vertical step's height
        stepMesh.position.y = stepThickness / 2 + verticalStepHeight + offsetY;
        // Push step forward by half the depth, minus half the vertical step's thickness
        stepMesh.position.z = horizontalStepDepth / 2 - stepHalfThickness + offsetZ;
        scene.add(stepMesh);
    }
}


function moveObject(obj) {
    obj.position.x += obj.direction.x;
    obj.position.y += obj.direction.y ;

    // if edge is reached, bounce back
    if (obj.position.x < -worldSize.width + sofaSize.width ||
        obj.position.x > worldSize.width - sofaSize.width) {
        obj.direction.x = -obj.direction.x ;
    }

    if (obj.position.y < -worldSize.height +sofaSize.width ||
        obj.position.y > worldSize.height - sofaSize.width) {
        obj.direction.y = -obj.direction.y ;
    }
}

function animate() {
    requestAnimationFrame(animate);
    meshSofa.rotation.x += 0.005;
    meshSofa.rotation.y += 0.01;
    moveObject(meshSofa);
    renderer.render(scene, camera);
}
