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
var controls;
var geometry, material_steps, mesh;
var cameraControls, effectController;



init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    controls = new THREE.OrbitControls( camera );

    scene = new THREE.Scene();

    createSofa(scene);
    specialStairs(scene, 87);

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

    material_steps = new THREE.MeshBasicMaterial({
        color: 0x00ccff,
        wireframe: true
    });

    meshCore = new THREE.Mesh(coreSofa, material_steps);
    meshBack = new THREE.Mesh(backRestSofa, material_steps);
    meshRestLeft = new THREE.Mesh(armRestSofaLeft, material_steps);
    meshRestRight = new THREE.Mesh(armRestSofaRight, material_steps);

    sofa.merge(meshCore.geometry, meshCore.matrix);
    sofa.merge(meshBack.geometry, meshBack.matrix);
    sofa.merge(meshRestLeft.geometry, meshRestLeft.matrix);
    sofa.merge(meshRestRight.geometry, armRestSofaRight.matrix);

    meshSofa = new THREE.Mesh(sofa, material_steps);

    //add mesh direction
    meshSofa.direction = {
        x: 2,
        y: 2,
        z: 4
    }

    scene.add(meshSofa);

}

function createWalls(scene, wallHeight, wallThickness, stepThickness) {
    new THREE.CubeGeometry(stepWidth, verticalStepHeight, stepThickness);

}

function specialStairs(scene, stepThickness){
  // MATERIALS

  material_steps = new THREE.MeshBasicMaterial({
    color: 0x00cdef,
    wireframe: true
  });

  material_wall = new THREE.MeshBasicMaterial({
    color: 0xFFFF00,
    wireframe: true
  });


  var stepWidth = sofaSize.width -0.1; //only just!
  var stepSize = sofaSize.armHeight;

  // height from top of one step to bottom of next step up
  var verticalStepHeight = stepSize/2;

  var stepHalfThickness = stepThickness / 2;
  var steps = new THREE.Geometry();

  var offsetX = 0;
  var offsetY = 0;
  var offsetZ = 0;

  var number_of_steps= 20;
  //Vertical stairs
  for (var i = 0; i < number_of_steps/2; i++) {
    var stepVertical = new THREE.CubeGeometry(stepWidth, verticalStepHeight, stepThickness);
    // Make and position the vertical part of the step
    stepGen = new THREE.Mesh(stepVertical, material_steps);
    stepGen.geometry.translate(offsetX,offsetY,offsetZ);
    //Increase offset
    offsetY += verticalStepHeight;
    offsetZ -= stepThickness;
    steps.merge(stepGen.geometry, stepGen.matrix);
  }




  //TODO: turn in stiars plate
  var sideStepThickness = stepWidth;
  var stepVertical = new THREE.CubeGeometry(stepWidth, verticalStepHeight, sideStepThickness);
  stepGen = new THREE.Mesh(stepVertical, material_steps);
  offsetZ -= (sideStepThickness - stepThickness )/2;
  stepGen.geometry.translate(offsetX,offsetY, offsetZ);
  steps.merge(stepGen.geometry, stepGen.matrix);
  offsetY += verticalStepHeight;

  //INtial stair offset
  offsetX += stepWidth/2 + stepThickness/2;

  //Horizontal stairs - just adding some roationa
  for (var i = 0; i <  number_of_steps/2; i++) {
      var stepVertical = new THREE.CubeGeometry(stepWidth, verticalStepHeight, stepThickness);
      var stepHorizontal = new THREE.CubeGeometry(stepWidth,verticalStepHeight,stepThickness);
      // Make and position the vertical part of the step
      stepGen = new THREE.Mesh(stepHorizontal, material_steps);

      stepGen.geometry.rotateY(-Math.PI /2);// TODO: roatte but keep offset
      stepGen.geometry.translate(offsetX,offsetY,offsetZ);
      steps.merge(stepGen.geometry, stepGen.matrix);



      //Increase offset
      offsetY += verticalStepHeight;
      offsetZ -= stepThickness;
      offsetX += stepThickness;
  }

  stepMesh = new THREE.Mesh(steps, material_steps);
  //add mesh direction
  stepMesh.direction = {
      x: 0.01,
      y: 0.01,
      z: 0.01
  }

  var steps_x_start = -window.innerWidth/2 + 200;
  var steps_y_start = -window.innerHeight/2 +100;
  var steps_z_start = -170

  //centering the stairs
  stepMesh.geometry.translate(steps_x_start, steps_y_start, steps_z_start);
  scene.add(stepMesh);


  /*Corresponding walls */
  
  let wall_height = number_of_steps * verticalStepHeight
  

  var wall_l = new THREE.CubeGeometry(0, wall_height, (number_of_steps/2) * stepThickness);
  
  console.log(wall_l)

  wall_l_mesh = new THREE.Mesh(wall_l, material_wall);
  //add mesh direction
  wall_l_mesh.direction = {
      x: 0.01,
      y: 0.01,
      z: 0.01
  }
  
//   wall_l_x_offset = - stepWidth / 2;
//   wall_l_y_offset = wall_height / 2    -  verticalStepHeight/2;
//   wall_l_z_offset = - ( (number_of_steps/2) * stepThickness )/2 + stepThickness/2 ;

//   wall_l_mesh.geometry.translate(steps_x_start + wall_l_x_offset, steps_y_start + wall_l_y_offset, steps_z_start + wall_l_z_offset);
//   scene.add(wall_l_mesh);




    var wall_r = new THREE.CubeGeometry(stepWidth, wall_height, (number_of_steps/2) * stepThickness);

    wall_r_mesh = new THREE.Mesh(wall_r, material_wall);
    //add mesh direction
    wall_r_mesh.direction = {
    x: 0.01,
    y: 0.01,
    z: 0.01
    }


    // wall_r_x_offset =  stepWidth / 2;
    // wall_r_y_offset = wall_height / 2    -  verticalStepHeight/2;
    // wall_r_z_offset = - ( (number_of_steps/2) * stepThickness )/2 + stepThickness/2 ;

    // wall_r_mesh.geometry.translate(steps_x_start  + wall_r_x_offset, steps_y_start + wall_r_y_offset, steps_z_start + wall_r_z_offset);
    // scene.add(wall_r_mesh);

    var wall_b_length = ((number_of_steps/2) * stepThickness) + stepHalfThickness
    var wall_b = new THREE.CubeGeometry(wall_b_length, wall_height,0);
    
    wall_b_mesh = new THREE.Mesh(wall_b, material_wall);
    //add mesh direction
    wall_b_mesh.direction = {
        x: 0.01,
        y: 0.01,
        z: 0.01
    }

    
    wall_b_x_offset =  wall_b_length/2;
    wall_b_y_offset = wall_height / 2    -  verticalStepHeight/2;
    wall_b_z_offset = - ( (number_of_steps/2) * stepThickness ) + stepThickness/2  - stepHalfThickness;

    wall_b_mesh.geometry.translate(steps_x_start  + wall_b_x_offset, steps_y_start + wall_b_y_offset, steps_z_start + wall_b_z_offset);
    scene.add(wall_b_mesh);







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
    // meshSofa.rotation.x += 0.005;
    // meshSofa.rotation.y += 0.01;
    // meshSofa.rotation.z -= 0.02;
    // moveObject(meshSofa);


    // stepMesh.rotation.x -= 0.001;
    // stepMesh.rotation.y -= 0.001;
    // stepMesh.rotation.z -= 0.001;
    
    // wall_l_mesh.rotation.x -= 0.001;
    // wall_l_mesh.rotation.y -= 0.001;
    // wall_l_mesh.rotation.z -= 0.001;

    // wall_r_mesh.rotation.x -= 0.001;
    // wall_r_mesh.rotation.y -= 0.001;
    // wall_r_mesh.rotation.z -= 0.001;

    // wall_b_mesh.rotation.x -= 0.001;
    // wall_b_mesh.rotation.y -= 0.001;
    // wall_b_mesh.rotation.z -= 0.001;
    
    
    //moveObject(stepMesh)

    controls.update();
    renderer.render(scene, camera);

    
}
