/*Logic to remove sofa from stairway*/

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

init();
animate();

function init() {

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;

    scene = new THREE.Scene();

    sofa = new THREE.Geometry();

    coreSofa = new THREE.BoxGeometry(sofaSize.width, sofaSize.height, sofaSize.depth);
    backRestSofa = new THREE.BoxGeometry(sofaSize.width,sofaSize.backHeight,sofaSize.backDepth);
    armRestSofaLeft = new THREE.BoxGeometry(sofaSize.armWidth,sofaSize.armHeight,sofaSize.depth + sofaSize.backDepth);
    armRestSofaRight = new THREE.BoxGeometry(sofaSize.armWidth,sofaSize.armHeight,sofaSize.depth + sofaSize.backDepth);

    //Offset back
    for(var i = 0 ; i < backRestSofa.vertices.length; i++) backRestSofa.vertices[i].z -= sofaSize.depth/2 + sofaSize.backDepth/2;
    for(var i = 0 ; i < backRestSofa.vertices.length; i++) backRestSofa.vertices[i].y -= sofaSize.height/2 - sofaSize.backHeight/2;

    //Offset Rests
    for(var i = 0 ; i < armRestSofaLeft.vertices.length; i++) armRestSofaLeft.vertices[i].y -=  sofaSize.height/2 - sofaSize.armHeight/2;
    for(var i = 0 ; i < armRestSofaLeft.vertices.length; i++) armRestSofaLeft.vertices[i].x -=  sofaSize.width/2 + sofaSize.armWidth/2;
    for(var i = 0 ; i < armRestSofaLeft.vertices.length; i++) armRestSofaLeft.vertices[i].z -=  sofaSize.backDepth/2;

    for(var i = 0 ; i < armRestSofaRight.vertices.length; i++) armRestSofaRight.vertices[i].y -=  sofaSize.height/2 - sofaSize.armHeight/2;
    for(var i = 0 ; i < armRestSofaRight.vertices.length; i++) armRestSofaRight.vertices[i].x +=  sofaSize.width/2 + sofaSize.armWidth/2;
    for(var i = 0 ; i < armRestSofaRight.vertices.length; i++) armRestSofaRight.vertices[i].z -=  sofaSize.backDepth/2;

    material = new THREE.MeshBasicMaterial({
        color: 0xff0000,
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

    mesh = new THREE.Mesh(sofa, material);
    scene.add(mesh);

    //
    // mesh = new THREE.Mesh(backRestSofa, material);
    // scene.add(mesh);
    //
    //
    // mesh = new THREE.Mesh(armRestSofa, material);
    // scene.add(mesh);



    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(renderer.domElement);

}

function animate() {

    requestAnimationFrame(animate);

    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;

    renderer.render(scene, camera);

}
