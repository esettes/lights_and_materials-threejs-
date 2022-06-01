import * as THREE from 'three';
import { OrbitControls } from './src/lib/OrbitControls.js';
import { RGBELoader } from './src/lib/RGBELoader.js';
import { TextGeometry } from './src/lib/TextGeometry.js';
import { Reflector } from './src/lib/Reflector.js';
import { GUI } from './src/lib/lil-gui.module.min.js';
import { Scene } from 'three';

const canvas = document.querySelector('#c'); 
const renderer = new THREE.WebGLRenderer({ canvas: canvas }); 

const properties = {
    fov: 70,
    width: window.innerWidth,
    height: window.innerHeight,
    near: 0.1, 
    far: 400 
}
const camera = new THREE.PerspectiveCamera(
    properties.fov, properties.width/properties.height, properties.near, properties.far); 
const scene = new THREE.Scene(); 

const controls = new OrbitControls(camera, canvas);



function main() {

    renderer.setSize(properties.width, properties.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true

    camera.position.set(0, 4, 25); 
    
    // config para que orbite 5 uds por encima del origen, update para que usen el nuevo objtivo 
    controls.target.set(0, 5, 0); 
    controls.update(); 
    
    
    scene.background = new THREE.Color('black'); 
    
    {
        
    }

    let loader = new THREE.TextureLoader();
    let geometry, groundMirror;
    
    { 
        /*const planeSize = 400; 
        const texture = loader.load('src/img/checker.png'); 
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        const repeats = planeSize / 2;
        texture.repeat.set(repeats, repeats);
    
    
    
        const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
        const planeMat = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });
        const mesh = new THREE.Mesh(planeGeo, planeMat);
        mesh.rotation.x = Math.PI * -.5;
        scene.add(mesh);*/
    } 

        // walls

    {
        const wallSize = 50;
        const wall = new THREE.PlaneGeometry(wallSize, 25);
        const wallText = loader.load( 'src/img/checker_dots.jpg' );
        wallText.wrapS = THREE.RepeatWrapping;
        wallText.wrapT = THREE.RepeatWrapping;
        wallText.magFilter = THREE.NearestFilter;
        wallText.repeat.set(wallSize/6, 30/6);
        const wallMat = new THREE.MeshPhongMaterial({ 
            map: wallText,
            //side: THREE.DoubleSide,
        })
        let wallMesh;
        wallMesh = new THREE.Mesh(wall, wallMat);
        wallMesh.position.set(0, wallSize/4, -wallSize/2);
            scene.add(wallMesh);

        wallMesh = new THREE.Mesh(wall, wallMat);
        wallMesh.position.set(wallSize /2, wallSize/4, 0);
        wallMesh.rotation.y = Math.PI * -.5;
            scene.add(wallMesh);

        wallMesh = new THREE.Mesh(wall, wallMat);
        wallMesh.position.set(-wallSize /2, wallSize/4, 0);
        wallMesh.rotation.y = Math.PI * .5;
            scene.add(wallMesh);


            // top and bottom

        const topWallSize = 50;
        const topWall = new THREE.PlaneGeometry(topWallSize, topWallSize);
        const topWallText = loader.load( 'src/img/checker_dots.jpg' );
        topWallText.wrapS = THREE.RepeatWrapping;
        topWallText.wrapT = THREE.RepeatWrapping;
        topWallText.magFilter = THREE.NearestFilter;
        topWallText.repeat.set(topWallSize/6, topWallSize/6);
        const topWallMat = new THREE.MeshPhongMaterial({ 
            map: topWallText,
            // side: THREE.DoubleSide,
        })

        wallMesh = new THREE.Mesh(topWall, topWallMat);
        wallMesh.position.set(0, topWallSize/2, 0);
        wallMesh.rotation.x = Math.PI * .5;
        //wallMesh.rotation.y = Math.PI * -1;
        wallMesh.rotation.z = Math.PI * -0.5;
            scene.add(wallMesh);

        const bottomWallMat = new THREE.MeshPhongMaterial({ 
            map: topWallText,
            //side: THREE.BackSide,
        })

        wallMesh = new THREE.Mesh(topWall, bottomWallMat);
        wallMesh.position.set(0, 0, 0);
        wallMesh.rotation.x = Math.PI * -.5;
        scene.add(wallMesh);
    } 


    //  mirror

    {
        geometry = new THREE.CircleGeometry( 12, 100 );
        groundMirror = new Reflector( geometry, {
            clipBias: 0.0001,
            textureWidth: window.innerWidth * window.devicePixelRatio,
            textureHeight: window.innerHeight * window.devicePixelRatio,
            color: 0xffFFFF
        } );
        groundMirror.position.y = 0.008;
        groundMirror.rotateX( - Math.PI / 2 );
        scene.add( groundMirror );
    }

        /*      OBJECTS     */ 

    {
        const cubeSize = 7; 
        const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize, 8, 8, 8); 
        //const cubeText = loader.load( 'src/img/checker_num.jpg' ); 

        const cubeMat = new THREE.MeshPhongMaterial({ 
            //map: cubeText,
            color: 0x3f7b9d,
            shininess: 100,
            wireframe: true,
            combine: THREE.AddOperation,
            // envMaps: reflection,
        })
        //cubeMat.blending = THREE.SubtractiveBlending;
        const mesh = new THREE.Mesh(cubeGeo, cubeMat); 
        mesh.position.set(cubeSize + 7, 3.55, 0); 
        scene.add(mesh);
    } 

    //

    {
        const sphereRadius = 3; 
        const sphereWidthDivisions = 32; 
        const sphereHeightDivisions = 16; 
        const sphereGeo = new THREE.SphereGeometry( sphereRadius, sphereWidthDivisions, sphereHeightDivisions,); 

        const sphereText = loader.load( 'src/img/uv_grid_opengl.jpg' ); 
        const sphereMat = new THREE.MeshPhongMaterial({ 
            map: sphereText,
            //color: 0x05DD05,
            flatShading: true,
            shininess: 100,
            //emissive: 0xc2ddc2,
            combine: THREE.AddOperation,
            
        })
        //sphereMat.blending = THREE.AdditiveBlending;
        const mesh = new THREE.Mesh( sphereGeo, sphereMat ); 
        mesh.position.set(-sphereRadius - 1, sphereRadius, 0); 
        scene.add( mesh );
    } 
        
    //

    {
        const diffuseColor = new THREE.Color().setHSL( 1.0, 0.5, 0.25 );

        const icosRadius = 3; // ui: radius 
        const icosDetail = 0; // ui: detail 
        const icosGeo = new THREE.IcosahedronGeometry(icosRadius, icosDetail); 

        const icosText = loader.load( 'src/img/checker_num.jpg' ); 
        const icosMat = new THREE.MeshPhysicalMaterial( {
            color: diffuseColor,
            metalness: 0,
            roughness: 1,
            clearcoat: 0, // - alpha,
            clearcoatRoughness: 0.0, // - beta,
            reflectivity:0, // - gamma,
            envMap: icosText
        });
        const mesh = new THREE.Mesh(icosGeo, icosMat); 
        mesh.position.set(-icosRadius - 5, icosRadius + 0.1, 9); 
        scene.add(mesh);
    } 

    //

    {
        const diffuseColor = new THREE.Color().setHSL(0.7, 0.25, 0.45 );

        const radius = 1.5; // ui: radius 
        const tubeRadius = 0.5; // ui: tubeRadius 
        const radialSegments = 20; // ui: radialSegments 
        const tubularSegments = 100; // ui: tubularSegments 
        const p = 2; // ui: p 
        const q = 3; // ui: q 

        const torusGeo = new THREE.TorusKnotGeometry( radius, tubeRadius, tubularSegments, radialSegments, p, q); 

        const torusText = loader.load( 'src/img/checker_num.jpg' );
        const torusMat = new THREE.MeshPhysicalMaterial( {
            color: diffuseColor,
            metalness: 0.5,
            roughness: 0,
            clearcoat: 0, // - alpha,
            clearcoatRoughness: 0.0, // - beta,
            reflectivity: 1.0, // - gamma,
            envMap: torusText
        });
        const mesh = new THREE.Mesh(torusGeo, torusMat); 
        mesh.position.set(radius + 7, radius + 2, 9); 
        scene.add(mesh);
    } 
    
    
    /*** ***            Agregar luces           *** ***/ 
        
        class ColorGUIHelper {
            constructor(object, prop) {
                this.object = object; 
                this.prop = prop; } 
                get value() { 
                    return `#${this.object[this.prop].getHexString()}`; 
                    } 
                set value(hexString) {
                    this.object[this.prop].set(hexString);
        }
    } 

    // para poder establecer tanto la posición de la luz(directional) como objetivo 
    function makeXYZGUI(gui, vector3, name, onChangeFn) { 
        const folder = gui.addFolder(name); 
        folder.add(vector3, 'x',-50, 50).onChange(onChangeFn); 
        folder.add(vector3,'y', -50, 50).onChange(onChangeFn); 
        folder.add(vector3, 'z', -50, 50).onChange(onChangeFn); 
        folder.open(); 
    } 
        
    //

    { 
        // AmbientLight 
        /*const color = 0xFFFFFF; 
        const intensity = 1; 
        const light = new THREE.AmbientLight(color, intensity); scene.add(light);*/


            //HemisphereColor 
        ColorGUIHelper 
        const skyColor = 0xffffff;  
        const groundColor = 0xffffff; 
        
        const intensity = 0.4; 
        const light = new THREE.HemisphereLight(skyColor, groundColor, intensity); 
        scene.add(light); 
        // DirectionalLight 
        
        const color = 0xFFFFFF; 
        const intensityDir = 0.5; 
        const lightDir = new THREE.DirectionalLight(color, intensityDir); 
        lightDir.position.set(0, 10, 20); 
        lightDir.target.position.set(10.7, 2.1, -50); 
        scene.add(lightDir); scene.add(lightDir.target); 
        const directionalHelper = new THREE.DirectionalLightHelper(lightDir); 
        scene.add(directionalHelper);

        const fogColor = 0xA3A3A9;
        const fogDensity = 0.01;
        scene.fog = new THREE.FogExp2(fogColor, fogDensity);

        function updateLight() { 
            lightDir.target.updateMatrixWorld(); 
            directionalHelper.update(); 
        } 
        updateLight(); 

        // config lil-gui 
        const gui = new GUI(); 
        //gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color'); para ambientlight 
        gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('skyColor'); 
        gui.addColor(new ColorGUIHelper(light, 'groundColor'), 'value').name('groundColor'); 
        gui.add(lightDir, 'Intensity', 0, 2, 0.01);
        gui.add(fogDensity,'Fog density', 0.001, 1);
        //gui.add(lightDir.target.position, 'x', -50, 50); 
        //gui.add(lightDir.target.position,'z', -50, 50); 
        //gui.add(lightDir.target.position, 'y', -50, 100); 
        
        
        makeXYZGUI(gui, lightDir.position, 'position', updateLight); 
        makeXYZGUI(gui, lightDir.target.position, 'target', updateLight); 
    } 
    

    //


    function resizeRendererToDisplaySize(renderer)
        {
            const canvas = renderer.domElement; 
            const width = canvas.clientWidth; 
            const height = canvas.clientHeight; 
            const needResize = canvas.width !== width || canvas.height !== height; 
            if (needResize) { 
                renderer.setSize(width, height, false); 
            } 
            return needResize;
        } 
        
        function render() {
            if (resizeRendererToDisplaySize(renderer)) { 
                const canvas = renderer.domElement; 
                camera.aspect = canvas.clientWidth / canvas.clientHeight; 
                camera.updateProjectionMatrix(); 
            } 
            renderer.render(scene, camera); 
            requestAnimationFrame(render);

        } 
    requestAnimationFrame(render);

} 
main();