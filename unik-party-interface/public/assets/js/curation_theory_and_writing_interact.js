/* eslint-disable no-undef */
var mouse = { x: -9999, y: -9999 };
var factor = 10;
var renderer, scene, camera, raycaster, controls, textureLoader;
var stats;
let keyHoriz = 0;
let keyVert = 0;

var objects = [];
var INTERSECTED;
var clicked = false;
var hovered = "";
var focused = false;
var holding = false;
var mainHovered = false;
var raycastObjects = [];
var t = 0;
var speed = 1;
var speedLerp = 1;
var cam_lerp = 200;

var highlight_line;
var fade_opacity = 0.1;
var sphereMaterial;
var outerSphere;
var hdri_def;
var back_timeout;

function init_three() {
  var wi = $(window).outerWidth();
  var h = $(window).outerHeight();

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(wi, h);
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  renderer.setClearColor(0xffffff, 0);

  $(".interact").prepend(renderer.domElement);

  var gl = renderer.context;
  // if (!gl.getExtension('OES_texture_float')) {
  //     // console.log( 'OES_texture_float not supported' );
  // }
  // if (!gl.getExtension('OES_texture_float_linear')) {
  //     // console.log( 'OES_texture_float_linear not supported' );
  // }

  //CAMERA鈥撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€�

  factor = h / 140;
  if (window.innerWidth < 500) {
    factor = h / 200;
  }
  camera = new THREE.OrthographicCamera(
    wi / -factor,
    wi / factor,
    h / factor,
    h / -factor,
    -1000,
    1000
  );
  camera.position.set(-200, 200, -200);
  camera.rotation.set(-10, 0, 0);
  scene = new THREE.Scene();

  //LIGHTS鈥撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€�

  //AMBIENT LIGHT
  var ambient = new THREE.AmbientLight(0xffffff, 1);
  scene.add(ambient);

  var directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
  directionalLight.position.set(5, 10, -5);
  scene.add(directionalLight);

  //TEXTURES鈥撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€撯€�

  textureLoader = new THREE.TextureLoader(manager);

  var init_map;
  if (projects.length > 0) {
    init_map = projects[getRandomProject()].map;
  } else {
    init_map = root + "/assets/img/hdri_2.jpg";
  }

  var hdri = textureLoader.load(init_map);
  hdri.mapping = THREE.EquirectangularReflectionMapping;
  hdri.wrapS = THREE.MirroredRepeatWrapping;
  hdri.wrapT = THREE.MirroredRepeatWrapping;

  hdri_def = textureLoader.load(root + "/assets/img/hdri_2.jpg");
  hdri_def.mapping = THREE.EquirectangularReflectionMapping;
  hdri_def.wrapS = THREE.MirroredRepeatWrapping;
  hdri_def.wrapT = THREE.MirroredRepeatWrapping;

  var manager = new THREE.LoadingManager();
  manager.onProgress = function (item, loaded, total) {
    // console.log( item, loaded, total );
  };

  var loader = new THREE.FBXLoader();
  loader.load(root + "/assets/fbx/sky_box.fbx", function (object) {
    object.traverse(function (child) {
      if (child.isMesh) {
        var sky_color = 0x5f5f5f;
        var sky_opacity = 1;
        if (current_page.includes("undergraduate")) {
          sky_color = 0xffffff;
          sky_opacity = 1;
        }

        child.material = new THREE.MeshBasicMaterial({
          color: sky_color,
          opacity: sky_opacity,
          map: hdri,
          transparent: true,
          side: THREE.BackSide,
        });
        outerSphere = child;
      }
    });

    object.scale.set(0.7, 0.7, 0.7);
    scene.add(object);
  });
  // var geometry = new THREE.SphereGeometry( 600, 4, 4 );
  // var material = new THREE.MeshBasicMaterial( {color: 0xffffff, map: hdri, transparent: true, side: THREE.BackSide} );
  // outerSphere = new THREE.Mesh( geometry, material );
  // scene.add( outerSphere );

  sphereMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    envMap: hdri,
    roughness: 0.3,
    metalness: 1,
    transparent: true,
  });

  new THREE.FontLoader().load("/assets/SimHei_Regular.json", function (font) {
    window._font = font;

    for (var i = 0; i < projects.length; i++) {
      createProject(i, projects[i]);
    }
  });

  function createProject(index, project) {
    var mat = sphereMaterial.clone();
    if (project.map != "") {
      var tex_map = textureLoader.load(project.map, function (tex) {
        mat.envMap = tex;
        mat.envMap.mapping = THREE.CubeReflectionMapping;
      });
    } else {
      mat.envMap = hdri_def;
    }
    var size = 3;

    var geometry = new THREE.SphereGeometry(size, 32, 32);
    var sphere = new THREE.Mesh(geometry, mat);
    var dist = 100;
    var x = (parseFloat(project.pos_x) * 2 - 1) * dist;
    var y = (parseFloat(project.pos_y) * 2 - 1) * dist;
    var z = (parseFloat(project.pos_z) * 2 - 1) * dist * -1;
    sphere.position.set(x, y, z);
    sphere.userData.title = project.project;
    sphere.userData.author = project.author;
    sphere.userData.course = project.course;
    sphere.userData.dest = project.dest;
    sphere.userData.tags = project.tags;
    sphere.userData.preview = project.preview;
    sphere.userData.alt = project.alt;
    sphere.userData.map = project.map;
    scene.add(sphere);
    objects.push(sphere);

    const txtGeo = new THREE.TextGeometry("测试测试abcd1234", {
      font: window._font,
      size: 5,
      height: 0,
      curveSegments: 1,
    });

    var txtMater = new THREE.MeshBasicMaterial({ color: 0xffffff });
    var txtMesh = new THREE.Mesh(txtGeo, txtMater);
    txtMesh.position.set(x, y, z);

    scene.add(txtMesh);
  }

  var material = new THREE.MeshBasicMaterial({ color: 0xafafaf });
  var points = [];
  points.push(new THREE.Vector3(-1000, 0, 0));
  points.push(new THREE.Vector3(1000, 0, 0));

  var geometry = new THREE.BufferGeometry().setFromPoints(points);

  function createLabel(tex, line, dir) {
    var scale = 12;
    var w = tex.image.width / scale;
    var h = tex.image.height / scale;
    var geometry = new THREE.PlaneGeometry(w, h, 1);
    var material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      map: tex,
      transparent: true,
      side: THREE.FrontSide,
      alphaTest: 0.5,
    });
    material.map.anisotropy = renderer.capabilities.getMaxAnisotropy();
    var plane = new THREE.Mesh(geometry, material);
    var plane_back = plane.clone();
    var offset = 120 * dir;
    plane.position.set(offset, h / 2, 0);
    plane.rotation.set(0, Math.PI, 0);
    plane_back.position.set(offset, h / 2, 0);
    line.add(plane);
    line.add(plane_back);
  }

  animate();

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.update();

  window.addEventListener("resize", onResize, false);
  stats = new Stats();
  // document.body.appendChild( stats.dom );

  if (touch) {
    $("canvas")[0].addEventListener(
      "touchstart",
      function (e) {
        var touch = e.touches[0];
        mouse.x = (touch.pageX / window.innerWidth) * 2 - 1;
        mouse.y = -(touch.pageY / window.innerHeight) * 2 + 1;
        raycast();
      },
      false
    );
  } else {
    $("body").mousemove(function (e) {
      mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

      if (!mobile && hovered != "") {
        var gap_x = padding * 2;
        var gap_y = padding * 2;
        var x = e.clientX + gap_x;
        if (
          x + $(".research--detail").outerWidth() + padding * 2 >
          window.innerWidth
        ) {
          x -= $(".research--detail").outerWidth() + gap_x * 2;
        }
        var y = e.clientY - gap_y;
        if (
          y + $(".research--detail").outerHeight() + padding * 2 >
          window.innerHeight
        ) {
          y -=
            y +
            $(".research--detail").outerHeight() -
            window.innerHeight +
            padding * 1;
        }
        $(".research--detail").css({
          transform: "translate3d(" + x + "px, " + y + "px, 0)",
        });
      }
    });
    setInterval(raycast, 50);
  }
  var holding_timeout;
  $("canvas").mousedown(function () {
    clearTimeout(holding_timeout);
    holding = true;
  });
  $(document).mouseup(function () {
    holding_timeout = setTimeout(function () {
      holding = false;
    }, 5000);
  });
  $("canvas").click(function () {
    if (hovered != "" && !focused && !autoplay_open) {
      // loadProject(hovered);
    }
    // focus(objects[getRandomProject()])
  });
  $(window).keydown(function (e) {
    if (e.keyCode == 37) {
      keyHoriz = 1;
    }
    if (e.keyCode == 39) {
      keyHoriz = -1;
    }
    if (e.keyCode == 38) {
      keyVert = 1;
    }
    if (e.keyCode == 40) {
      keyVert = -1;
    }
  });
  $(window).keyup(function (e) {
    if (e.keyCode == 37 || e.keyCode == 39) {
      keyHoriz = 0;
    }
    if (e.keyCode == 38 || e.keyCode == 40) {
      keyVert = 0;
    }
  });

  raycaster = new THREE.Raycaster();
  if (
    current_space == "curation-theory-and-writing" ||
    current_space == "fashion-communication"
  ) {
    loadHandlerCTW();
  }
}

function focus(target) {
  var size = new THREE.Vector3(3, 3, 3);
  var dur = 2000;
  if (autoplay_open) {
    size = new THREE.Vector3(6, 6, 6);
    if (mobile) {
      size = new THREE.Vector3(4, 4, 4);
    }
    dur = 3000;
  }
  animateVector3(target.scale, size, {
    duration: dur,
    easing: TWEEN.Easing.Quadratic.InOut,
  });

  if (tour_live) {
    focused = true;
    speed = 0;
    var rem = t % (Math.PI * 2);
    t -= rem;

    var from = {
      x: camera.position.x,
      y: camera.position.y,
      z: camera.position.z,
    };

    var to = {
      x: target.position.x * 2,
      y: target.position.y * 2,
      z: target.position.z * 2,
    };

    tween = new TWEEN.Tween(from)
      .to(to, dur)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(function () {
        camera.position.set(from.x, from.y, from.z);
        camera.lookAt(new THREE.Vector3(0, 0, 0));
      })
      .start();

    var from2 = {
      x: scene.rotation.x,
      y: scene.rotation.y,
      z: scene.rotation.z,
    };
    var to2 = {
      x: 0,
      y: t,
      z: 0,
    };
    tween2 = new TWEEN.Tween(from2)
      .to(to2, dur)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(function () {
        scene.rotation.set(from2.x, from2.y, from2.z);
      })
      .start();

    var dist = 50;
    if (target.position.z > 0) {
      dist *= -1;
    }
    var from3 = {
      x: scene.position.x,
      y: scene.position.y,
      z: scene.position.z,
    };
    var to3 = {
      x: dist,
      y: 0,
      z: 0,
    };
    tween3 = new TWEEN.Tween(from3)
      .to(to3, dur)
      .easing(TWEEN.Easing.Quadratic.InOut)
      .onUpdate(function () {
        scene.position.set(from3.x, from3.y, from3.z);
      })
      .start();
  } else {
    focused = false;
  }
}

function raycast() {
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(objects);
  if (intersects.length > 0 && !autoplay_open) {
    if (intersects[0].object != INTERSECTED) {
      if (INTERSECTED) {
        closePoint(INTERSECTED);
      }

      INTERSECTED = intersects[0].object;

      changePoint(INTERSECTED);
    }
  } else {
    hover = false;
    if (INTERSECTED) {
      closePoint(INTERSECTED);
    }
    INTERSECTED = null;
  }
}
function changePoint(el) {
  console.log(el);

  $("body").addClass("detail--open detail--change");
  $(".tour--view").attr("role", "").attr("aria-hidden", "true");

  clearTimeout(back_timeout);
  var new_map = el.userData.map;
  if (
    el.userData.map != outerSphere.material.map.image.currentSrc &&
    el.userData.map != ""
  ) {
    var map = textureLoader.load(el.userData.map, function (tex) {
      tex.mapping = THREE.EquirectangularReflectionMapping;
      tex.wrapS = THREE.MirroredRepeatWrapping;
      tex.wrapT = THREE.MirroredRepeatWrapping;
      fadeMesh(outerSphere, "in", {
        duration: 1000,
        easing: TWEEN.Easing.Quintic.InOut,
      });
      back_timeout = setTimeout(function () {
        outerSphere.material.map = tex;
        outerSphere.material.map.needsUpdate = true;
        outerSphere.material.needsUpdate = true;
        fadeMesh(outerSphere, "out", {
          duration: 1000,
          easing: TWEEN.Easing.Quintic.InOut,
        });
      }, 1000);
    });
  } else if (el.userData.map == "" && outerSphere.material.map != hdri_def) {
    fadeMesh(outerSphere, "in", {
      duration: 1000,
      easing: TWEEN.Easing.Quintic.InOut,
    });
    back_timeout = setTimeout(function () {
      outerSphere.material.map = hdri_def;
      outerSphere.material.map.needsUpdate = true;
      outerSphere.material.needsUpdate = true;
      fadeMesh(outerSphere, "out", {
        duration: 1000,
        easing: TWEEN.Easing.Quintic.InOut,
      });
    }, 1000);
  }
  hovered = el.userData.dest;
  if (current_page != "") {
    speed = 0;
  }

  var target = new THREE.Vector3(3, 3, 3); // create on init
  animateVector3(el.scale, target, {
    duration: 1000,
    easing: TWEEN.Easing.Quadratic.InOut,
  });

  if (mobile) {
    focus(el);
  }

  setTimeout(function () {
    if (el) {
      $(".research--title").text(el.userData.title);
      $(".research--author").text(el.userData.author);

      const capitalize = (str, lower = false) =>
        (lower ? str.toLowerCase() : str).replace(
          /(?:^|\s|["'([{])+\S/g,
          (match) => match.toUpperCase()
        );
      var course = el.userData.course.replaceAll("-", " ");
      course = capitalize(course);
      course = course.replace("Ma", "MA");
      course = course.replace("Ba", "BA");
      course = course.replace("And", "and");
      $(".research--course").text(course);

      if (el.userData.preview != "") {
        $(".detail--preview img").on("load", function () {
          $(".detail--preview img").off();
          $("body").removeClass("detail--change");
        });
        $(".detail--preview img").attr("src", el.userData.preview);
        $(".research--detail").removeClass("noimg");
      } else {
        $(".research--detail").addClass("noimg");
        $("body").removeClass("detail--change");
      }

      $(".research--tags").text(el.userData.tags);
      if (el.userData.tags != "") {
        $(".research--detail").removeClass("notag");
      } else {
        $(".research--detail").addClass("notag");
      }

      if (autoplay_open) {
        $(".tour--view")
          .attr("role", "alert")
          .attr("aria-hidden", "false")
          .attr(
            "aria-label",
            "View project" +
              el.userData.title +
              " by " +
              el.userData.author +
              "."
          );
      }
    }
  }, 250);
}
function closePoint(el) {
  hovered = "";
  $("body").removeClass("detail--open");
  var target = new THREE.Vector3(1, 1, 1); // create on init
  animateVector3(el.scale, target, {
    duration: 1000,
    easing: TWEEN.Easing.Quadratic.InOut,
  });
  if (filter != "") {
    setFilter(filter);
  }
}

function showTag(tag) {
  var lineMaterial = new THREE.LineBasicMaterial({ color: 0x555555 });
  var lineGeo = new THREE.Geometry();
  for (var i = 0; i < objects.length; i++) {
    if (objects[i].userData.tags.includes(tag)) {
      lineGeo.vertices.push(
        new THREE.Vector3(
          objects[i].position.x,
          objects[i].position.y,
          objects[i].position.z
        )
      );

      var target = new THREE.Vector3(3, 3, 3); // create on init
      animateVector3(objects[i].scale, target, {
        duration: 1000,
        easing: TWEEN.Easing.Quadratic.InOut,
      });
    }
  }

  highlight_line = new THREE.Line(lineGeo, lineMaterial);
  scene.add(highlight_line);
}
function hideTag() {
  scene.remove(highlight_line);
  setFilter(filter);
}

function setFilter(course) {
  if (course != "remove" && course != "") {
    filter = course;
    window.location.hash = course;
    $(".space--course--mobile").addClass("filtered");
    for (var i = 0; i < objects.length; i++) {
      if (objects[i].userData.course == course) {
        var target = new THREE.Vector3(2, 2, 2);
        animateVector3(objects[i].scale, target, {
          duration: 1000,
          easing: TWEEN.Easing.Quadratic.InOut,
        });
      } else {
        if (objects[i].scale.x != 0.5) {
          var target = new THREE.Vector3(0.5, 0.5, 0.5);
          animateVector3(objects[i].scale, target, {
            duration: 1000,
            easing: TWEEN.Easing.Quadratic.InOut,
          });
        }
      }
    }
  } else {
    filter = "";
    window.location.hash = "";
    $(".space--course--mobile").removeClass("filtered");
    for (var i = 0; i < objects.length; i++) {
      if (objects[i].scale.x != 1) {
        var target = new THREE.Vector3(1, 1, 1);
        animateVector3(objects[i].scale, target, {
          duration: 1000,
          easing: TWEEN.Easing.Quadratic.InOut,
        });
      }
    }
    $(".space--course--list li").removeClass("selected");
    $(".space--course--list").removeClass("filter");
    $(".curr--filter").text("");
  }
}

function animateVector3(vectorToAnimate, target, options) {
  options = options || {};
  // get targets from options or set to defaults
  var to = target || THREE.Vector3(),
    easing = options.easing || TWEEN.Easing.Quadratic.In,
    duration = options.duration || 2000;
  // create the tween
  var tweenVector3 = new TWEEN.Tween(vectorToAnimate)
    .to({ x: to.x, y: to.y, z: to.z }, duration)
    .easing(easing)
    .onUpdate(function (d) {
      if (options.update) {
        options.update(d);
      }
    })
    .onComplete(function () {
      if (options.callback) options.callback();
    });
  // start the tween
  tweenVector3.start();
  // return the tween in case we want to manipulate it later on
  return tweenVector3;
}

function fadeMesh(mesh, direction, options) {
  options = options || {};
  // set and check
  var current = { percentage: direction == "in" ? 1 : 0 },
    // this check is used to work with normal and multi materials.
    mats = mesh.material.materials ? mesh.material.materials : [mesh.material],
    // originals = mesh.userData.originalOpacities,
    easing = options.easing || TWEEN.Easing.Linear.None,
    duration = options.duration || 2000;
  // check to make sure originals exist
  // if( !originals ) {
  //      console.error("Fade error: originalOpacities not defined, use trackOriginalOpacities");
  //       return;
  // }
  // tween opacity back to originals
  var tweenOpacity = new TWEEN.Tween(current)
    .to({ percentage: direction == "in" ? 0 : 1 }, duration)
    .easing(easing)
    .onUpdate(function () {
      for (var i = 0; i < mats.length; i++) {
        mats[i].opacity =
          (1 - fade_opacity) * current.percentage + fade_opacity;
      }
    })
    .onComplete(function () {
      if (options.callback) {
        options.callback();
      }
    });
  tweenOpacity.start();
  return tweenOpacity;
}

function getRandomProject() {
  var found = false;
  var rand = 0;
  while (!found) {
    rand = Math.round(Math.random() * (projects.length - 1));
    if (projects[rand].map != "") {
      break;
    }
  }
  return rand;
}

function onResize() {
  var w = $(window).outerWidth();
  var h = $(window).outerHeight();

  factor = h / 140;
  if (window.innerWidth < 500) {
    factor = h / 200;
  }
  camera.left = -w / factor;
  camera.right = w / factor;
  camera.top = h / factor;
  camera.bottom = -h / factor;

  renderer.setSize(w, h);
  renderer.setPixelRatio(window.devicePixelRatio);

  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

function animate(time) {
  requestAnimationFrame(animate);
  TWEEN.update(time);

  if (hovered == "") {
    speed += 0.01;
  }
  if (outerSphere) {
    outerSphere.material.map.offset.x = time / 50000;
  }

  t += keyHoriz * 0.02;

  if (!focused) {
    scene.rotation.set(0, t, 0);

    if (current_page == "" || !holding) {
      camera.position.y +=
        (Math.sin(t * 1) * 200 - camera.position.y) / 500 + keyVert * 1;
      if (controls) {
        controls.update();
      }
    }

    t += 0.001 * speedLerp;
  }
  speedLerp += (speed - speedLerp) / 50;
  if (speed > 1) {
    speed = 1;
  }

  render();
  // stats.update();
}

function render() {
  // console.log(renderer)
  renderer.render(scene, camera);
}
