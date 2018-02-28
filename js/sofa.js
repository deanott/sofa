/*Logic to remove sofa from stairway*/

var clock = new THREE.Clock();
var gridX = false;
var gridY = false;
var gridZ = false;
var axes = false;
var ground = true;

var worldSize = {
    width: 250,
    height: 250,
    depth: 10

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
var font;

var text_alert;

collidableMeshList = [];

var sofa_origin_position;

var loader = new THREE.FontLoader();
loader.load('https://raw.githubusercontent.com/mrdoob/three.js/master/examples/fonts/helvetiker_bold.typeface.json', function (font) {
    init(font);
    animate();
});

function create_text(textMesh, font) {

    var geometry = new THREE.TextGeometry(textMesh, {
        font: font,
        size: 120,
        height: 40,
        curveSegments: 2
    });

    geometry.computeBoundingBox();

    var centerOffset = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);

    var materials = [
        new THREE.MeshBasicMaterial({ color: 0xff0000, overdraw: 0.5 })
    ];

    var textMesh = new THREE.Mesh(geometry, materials);

    textMesh.position.x = centerOffset;
    textMesh.position.y = 0;
    textMesh.position.z = 0;
    textMesh.rotation.x = 0;

    text_alert = textMesh;
    scene.add(textMesh);
}

function init(font) {
    font = font;
    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    controls = new THREE.OrbitControls(camera);

    scene = new THREE.Scene();


    create_text(" N O  W A Y! ", font);
    text_alert.position.x = -100000000;


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

    /*STORE ORIGNAL SOFA POSITION */
    sofa_origin_position = meshSofa.position.clone();
}



function specialStairs(scene, stepThickness) {
    // MATERIALS

    material_steps = new THREE.MeshBasicMaterial({
        color: 0xff69b4,
        wireframe: true
    });

    material_wall = new THREE.MeshBasicMaterial({
        color: 0xFFFF00,
        wireframe: true
    });


    var stepWidth = sofaSize.width - 0.1; //only just!
    var stepSize = sofaSize.armHeight;

    // height from top of one step to bottom of next step up
    var verticalStepHeight = stepSize / 2;

    var stepHalfThickness = stepThickness / 2;
    var steps = new THREE.Geometry();

    var offsetX = 0;
    var offsetY = 0;
    var offsetZ = 0;

    var number_of_steps = 20;
    //Vertical stairs
    for (var i = 0; i < number_of_steps / 2; i++) {
        var stepVertical = new THREE.CubeGeometry(stepWidth, verticalStepHeight, stepThickness);
        // Make and position the verticaff69b4l part of the step
        stepGen = new THREE.Mesh(stepVertical, material_steps);
        stepGen.geometry.translate(offsetX, offsetY, offsetZ);
        //Increase offset
        offsetY += verticalStepHeight;
        offsetZ -= stepThickness;
        steps.merge(stepGen.geometry, stepGen.matrix);
    }




    //TODO: turn in stiars plate
    var sideStepThickness = stepWidth;
    var stepVertical = new THREE.CubeGeometry(stepWidth, verticalStepHeight, sideStepThickness);
    stepGen = new THREE.Mesh(stepVertical, material_steps);
    offsetZ -= (sideStepThickness - stepThickness) / 2;
    stepGen.geometry.translate(offsetX, offsetY, offsetZ);
    steps.merge(stepGen.geometry, stepGen.matrix);
    offsetY += verticalStepHeight;

    //INtial stair offset
    offsetX += stepWidth / 2 + stepThickness / 2;

    //Horizontal stairs - just adding some roationa
    for (var i = 0; i < number_of_steps / 2; i++) {
        var stepVertical = new THREE.CubeGeometry(stepWidth, verticalStepHeight, stepThickness);
        var stepHorizontal = new THREE.CubeGeometry(stepWidth, verticalStepHeight, stepThickness);
        // Make and position the vertical part of the step
        stepGen = new THREE.Mesh(stepHorizontal, material_steps);

        stepGen.geometry.rotateY(-Math.PI / 2);// TODO: roatte but keep offset
        stepGen.geometry.translate(offsetX, offsetY, offsetZ);
        steps.merge(stepGen.geometry, stepGen.matrix);



        //Increase offset
        offsetY += verticalStepHeight;
        offsetX += stepThickness;
    }

    stepMesh = new THREE.Mesh(steps, material_steps);
    collidableMeshList.push(stepMesh);


    var steps_x_start = -window.innerWidth / 2 + 200;
    var steps_y_start = -window.innerHeight / 2 + 100;
    var steps_z_start = -170

    //centering the stairs
    stepMesh.geometry.translate(steps_x_start, steps_y_start, steps_z_start);
    scene.add(stepMesh);


    /*Corresponding walls */

    let wall_height = (number_of_steps + 1) * verticalStepHeight

    var wall_l = new THREE.CubeGeometry(0, wall_height, ((number_of_steps / 2) * stepThickness) + sideStepThickness);
    wall_l_mesh = new THREE.Mesh(wall_l, material_wall);

    wall_l_x_offset = - stepWidth / 2;
    wall_l_y_offset = wall_height / 2 - verticalStepHeight / 2;
    wall_l_z_offset = - ((number_of_steps / 2) * stepThickness) / 2 + stepThickness / 2 - sideStepThickness / 2;

    wall_l_mesh.geometry.translate(steps_x_start + wall_l_x_offset, steps_y_start + wall_l_y_offset, steps_z_start + wall_l_z_offset);

    collidableMeshList.push(wall_l_mesh);
    scene.add(wall_l_mesh);




    var wall_r = new THREE.CubeGeometry(0, wall_height, (number_of_steps / 2) * stepThickness);
    wall_r_mesh = new THREE.Mesh(wall_r, material_wall);

    wall_r_x_offset = stepWidth / 2;
    wall_r_y_offset = wall_height / 2 - verticalStepHeight / 2;
    wall_r_z_offset = - ((number_of_steps / 2) * stepThickness) / 2 + stepThickness / 2;

    wall_r_mesh.geometry.translate(steps_x_start + wall_r_x_offset, steps_y_start + wall_r_y_offset, steps_z_start + wall_r_z_offset);

    collidableMeshList.push(wall_r_mesh);
    scene.add(wall_r_mesh);



    var wall_b_length = ((number_of_steps / 2) * stepThickness) + sideStepThickness

    var wall_b = new THREE.CubeGeometry(wall_b_length, wall_height, 0);
    wall_b_mesh = new THREE.Mesh(wall_b, material_wall);

    wall_b_x_offset = wall_b_length / 2 - (sideStepThickness / 2);
    wall_b_y_offset = wall_height / 2 - verticalStepHeight / 2;
    wall_b_z_offset = - (((number_of_steps / 2) - 1)) * stepThickness - (stepThickness / 2) - sideStepThickness;

    wall_b_mesh.geometry.translate(steps_x_start + wall_b_x_offset, steps_y_start + wall_b_y_offset, steps_z_start + wall_b_z_offset);

    collidableMeshList.push(wall_b_mesh);
    scene.add(wall_b_mesh);




    var wall_f_length = ((number_of_steps / 2) * stepThickness)

    var wall_f = new THREE.CubeGeometry(wall_f_length, wall_height, 0);
    wall_f_mesh = new THREE.Mesh(wall_f, material_wall);

    wall_f_x_offset = wall_f_length / 2 - (sideStepThickness / 2) + sideStepThickness;
    wall_f_y_offset = wall_height / 2 - verticalStepHeight / 2;
    wall_f_z_offset = - (((number_of_steps / 2) - 1)) * stepThickness - (stepThickness / 2) //- sideStepThickness;

    wall_f_mesh.geometry.translate(steps_x_start + wall_f_x_offset, steps_y_start + wall_f_y_offset, steps_z_start + wall_f_z_offset);

    collidableMeshList.push(wall_f_mesh);
    scene.add(wall_f_mesh);



}

function moveObject(obj, direction) {
    obj.position.x += direction.x;
    obj.position.y += direction.y;
    obj.position.z += direction.z;
    // if edge is reached, bounce back
    if (obj.position.x < -worldSize.width + sofaSize.width / 2 ||
        obj.position.x > worldSize.width - sofaSize.width / 2) {
        obj.direction.x = -obj.direction.x;
    }

    if (obj.position.y < -worldSize.height + sofaSize.width / 2 ||
        obj.position.y > worldSize.height - sofaSize.width / 2) {
        obj.direction.y = -obj.direction.y;
    }

    if (obj.position.z < -worldSize.width - 10000 + sofaSize.width / 2 ||
        obj.position.z > worldSize.width + 1000 - sofaSize.width / 2) {
        obj.direction.z = -obj.direction.z;
    }

}



function sleep(milliseconds) {
    var start = new Date().getTime();
    for (var i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > milliseconds) {
            break;
        }
    }
}


var text_alert_ticker = 0;

var current_move_to_make = 1;
var moves_to_make = [];

var moves_regession_rate = 5 * 60;

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

function animate() {
    requestAnimationFrame(animate);


    if (moves_to_make.length > current_move_to_make) {
        console.log("Makeing moves: ", moves_to_make[current_move_to_make][0],  moves_to_make[current_move_to_make][1]);

        meshSofa.rotation = moves_to_make[current_move_to_make][0]
        moveObject(meshSofa, moves_to_make[current_move_to_make][1])

        current_move_to_make = current_move_to_make + 1;
        

    } else {

        console.log(current_move_to_make)
        //Store current postion
        moves_to_make.push([meshSofa.rotation.clone(),meshSofa.position.clone()]);

        let spd = 0.2;
        
        meshSofa.rotation.x += getRandomArbitrary(0.5,-0.5);
        meshSofa.rotation.y += getRandomArbitrary(0.5,-0.5);
        meshSofa.rotation.z += getRandomArbitrary(0.5,-0.5);


        //add mesh direction
        direction = {
            x: getRandomArbitrary(-spd, spd),
            y: getRandomArbitrary(-spd, spd),
            z: getRandomArbitrary(-spd, spd)
      }

        moveObject(meshSofa, direction);

    }

    //Gulp store that history for deep learning feed
    // console.log(history_of_moves)
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


    /*COllision dection */
    //Source: http://stemkoski.github.io/Three.js/Collision-Detection.htmls
    // collision detection:
    //   determines if any of the rays from the cube's origin to each vertex
    //		intersects any face of a mesh in the array of target meshes
    //   for increased collision accuracy, add more vertices to the cube;
    //		for example, new THREE.CubeGeometry( 64, 64, 64, 8, 8, 8, wireMaterial )
    //   HOWEVER: when the origin of the ray is within the target mesh, collisions do not occur

    var originPoint = meshSofa.position.clone();

    for (var vertexIndex = 0; vertexIndex < meshSofa.geometry.vertices.length; vertexIndex++) {
        var localVertex = meshSofa.geometry.vertices[vertexIndex].clone();
        var globalVertex = localVertex.applyMatrix4(meshSofa.matrix);
        var directionVector = globalVertex.sub(meshSofa.position);

        var ray = new THREE.Raycaster(originPoint, directionVector.clone().normalize());
        var collisionResults = ray.intersectObjects(collidableMeshList);
        if (collisionResults.length > 0 && collisionResults[0].distance < directionVector.length()) {
            console.log("HIT")


            var centerTextOffset = -0.5 * (text_alert.geometry.boundingBox.max.x - text_alert.geometry.boundingBox.min.x);

            text_alert.position.x = centerTextOffset;
            text_alert.lookAt(camera.position);
            
            /* dumping a copy of the moves */

            //Let's just remove the last 20 frames moves because who cares xD


            if (moves_to_make.length >moves_regession_rate) moves_to_make = moves_to_make.slice(0, moves_to_make.length - moves_regession_rate);

           
            meshSofa.position.x = sofa_origin_position.x;
            meshSofa.position.y = sofa_origin_position.y;
            meshSofa.position.z = sofa_origin_position.z;
            current_move_to_make = 0;


        } else {
            text_alert.position.x = -100000;

        }

    }






    controls.update();
    renderer.render(scene, camera);


}
