const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = async function () {
  const scene = new BABYLON.Scene(engine);
  // scene.clearColor = new BABYLON.Color3.Black();

  //camera-1
  var camera = new BABYLON.DeviceOrientationCamera(
    "DevOr_camera",
    new BABYLON.Vector3(0, 0, -10),
    scene
  );

  camera.setTarget(new BABYLON.Vector3(0, 0, 0));

  camera.angularSensibility = 1;
  camera.moveSensibility = 1;

  camera.attachControl(canvas, true);

  camera.lowerRadiusLimit = 4;
  camera.upperRadiusLimit = 9;

  //camera-2
  const alpha = -Math.PI / 4;
  const beta = Math.PI / 3;
  const radius = 6;
  const target = new BABYLON.Vector3(0, 0, 0);

  const camera2 = new BABYLON.ArcRotateCamera(
    "Camera",
    alpha,
    beta,
    radius,
    target,
    scene
  );

  camera2.attachControl(canvas, true);
  camera2.lowerRadiusLimit = 4;
  camera2.upperRadiusLimit = 9;

  const light = new BABYLON.HemisphericLight(
    "light",
    new BABYLON.Vector3(1, 1, 0)
  );

  const videoLayer = new BABYLON.Layer("videoLayer", null, scene, true);
  const videoTexture = BABYLON.VideoTexture.CreateFromWebCam(
    scene,
    (videoTexture) => {
      videoTexture._invertY = false;
      videoTexture;
      videoLayer.texture = videoTexture;
    },
    {
      minWidth: 640,
      minHeight: 480,
      maxWidth: 1920,
      maxHeight: 1080,
      deviceId: "",
      facingMode: "environment",
    }
  );

  // model
  const fish = BABYLON.SceneLoader.ImportMesh(
    "",
    "",
    "clownFish.glb",
    scene,
    function (meshes) {
      meshes[0].scaling = new BABYLON.Vector3(5, 5, 5);
      // meshes[0].setAbsolutePosition(BABYLON.Vector3(0, 0, 0));
    }
  );

  var advancedTexture =
    BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

  var button1 = BABYLON.GUI.Button.CreateSimpleButton("but1", "View1");
  button1.top = "320px";
  button1.width = 0.4;
  button1.height = 0.1;
  button1.color = "white";
  button1.fontSize = 50;
  button1.background = "green";
  button1.onPointerUpObservable.add(function () {
    // alert("you did it!");
    scene.activeCameras.push(camera2);
  });
  var button2 = BABYLON.GUI.Button.CreateSimpleButton("but1", "View2");
  button2.top = "170px";
  button2.width = 0.4;
  button2.height = 0.1;
  button2.color = "white";
  button2.fontSize = 50;
  button2.background = "green";
  button2.onPointerUpObservable.add(function () {
    scene.activeCameras.push(camera);
  });
  advancedTexture.addControl(button1);
  advancedTexture.addControl(button2);

  return scene;
};
scene = createScene();
console.log(scene);
scene.then(function (returnedScene) {
  sceneToRender = returnedScene;
});

// Run render loop to render future frames.
engine.runRenderLoop(function () {
  if (sceneToRender) {
    sceneToRender.render();
  }
});
