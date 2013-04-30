.. index::
    single: Introduction

.. highlight:: javascript

.. _protolib_introduction:

-------------------
The Protolib Object
-------------------

Dependencies
============

Protolib requires::

    /*{{ javascript('jslib/camera.js') }}*/
    /*{{ javascript('jslib/requesthandler.js') }}*/
    /*{{ javascript('jslib/texturemanager.js') }}*/
    /*{{ javascript('jslib/shadermanager.js') }}*/
    /*{{ javascript('jslib/soundmanager.js') }}*/
    /*{{ javascript('jslib/effectmanager.js') }}*/
    /*{{ javascript('jslib/fontmanager.js') }}*/
    /*{{ javascript('jslib/observer.js') }}*/
    /*{{ javascript('jslib/utilities.js') }}*/
    /*{{ javascript('jslib/services/turbulenzbridge.js') }}*/
    /*{{ javascript('jslib/services/turbulenzservices.js') }}*/
    /*{{ javascript('jslib/services/gamesession.js') }}*/
    /*{{ javascript('jslib/services/mappingtable.js') }}*/
    /*{{ javascript('jslib/scene.js') }}*/
    /*{{ javascript('jslib/light.js') }}*/
    /*{{ javascript('jslib/material.js') }}*/
    /*{{ javascript('jslib/geometry.js') }}*/
    /*{{ javascript('jslib/aabbtree.js') }}*/
    /*{{ javascript('jslib/scenenode.js') }}*/
    /*{{ javascript('jslib/vertexbuffermanager.js') }}*/
    /*{{ javascript('jslib/indexbuffermanager.js') }}*/
    /*{{ javascript('jslib/resourceloader.js') }}*/
    /*{{ javascript('jslib/vmath.js') }}*/
    /*{{ javascript('jslib/renderingcommon.js') }}*/
    /*{{ javascript('jslib/forwardrendering.js') }}*/
    /*{{ javascript('jslib/shadowmapping.js') }}*/
    /*{{ javascript('jslib/draw2d.js') }}*/

    /*{{ javascript('scripts/globals.js') }}*/
    /*{{ javascript('scripts/simplesprite.js') }}*/
    /*{{ javascript('scripts/simplefonts.js') }}*/
    /*{{ javascript('scripts/simplesceneloader.js') }}*/
    /*{{ javascript('scripts/debugdraw.js') }}*/
    /*{{ javascript('scripts/sceneloader.js') }}*/
    /*{{ javascript('scripts/soundsourcemanager.js') }}*/
    /*{{ javascript('scripts/protolib.js') }}*/

Constructor
===========

`create`
--------

**Summary**

Creates a protolib object.

**Syntax** ::

    var that = this;

    var onInitializedFn = function()
    {
        that.initGame();
        TurbulenzEngine.setInterval(function()
        {
            that.gameLoop();
        },
        1000/60);
    };

    var config =
    {
        onInitialized: onInitializedFn,
        useShadows : true,
        maxSoundSources : 50,
        fontPath : "fonts/opensans.fnt"
    };

    var protolib = Protolib.create(config);


``onInitialized``
    A callback function that is run when Protolib has finished initializing.

``useShadows`` (Optional)
    Determines whether the renderer should calculate shadows. Defaults to ``true``.

``maxSoundSources`` (Optional)
    The number of sound sources to create. Determines the maximum number of sounds that can play simultaneously. Defaults to ``50``.

``fontPath`` (Optional)
    The font the :ref:`drawFont <protolib-drawfont>` function should use. Defaults to ``"fonts/opensans.fnt"``.

Game Loop
=========

.. _protolib-beginframe:

`beginFrame`
------------

**Summary**

Signals the beginning of a new render frame.

This can fail if the host window is not visible, e.g. the browser is minimized or the window is not on the active tab.

**Syntax** ::

    if(protolib.beginFrame())
    {
        drawScene();

        protolib.endFrame();
    }


.. _protolib-endframe:

`endFrame`
----------

**Summary**

Signals the end of the current render frame.

**Syntax** ::

    if(protolib.beginFrame())
    {
        drawScene();

        protolib.endFrame();
    }

Configuration
=============

.. _protolib-setclearcolor:

`setClearColor`
---------------
Sets the buffer clear color.

**Syntax** ::

    protolib.setClearColor(v3Color);

``color``
    A :ref:`Vector3 <v3object>` object specifying the r, g, b color components. The components are in the range [0, 1].

.. _protolib-getclearcolor:

`getClearColor`
----------------
Gets the current buffer clear color.

**Syntax** ::

    protolib.getClearColor(v3Color);

``v3Color``
    A :ref:`Vector3 <v3object>` object the r, g, b color components will be written into.

Devices
=======

Protolib creates several device objects on creation. These getter methods provide access to them.

`getMathDevice`
---------------

**Syntax** ::

    var md = protolib.getMathDevice();

`getInputDevice`
----------------

**Syntax** ::

    var id = protolib.getInputDevice();

`getGraphicsDevice`
-------------------

**Syntax** ::

    var gd = protolib.getGraphicsDevice();

`getSoundDevice`
----------------

**Syntax** ::

    var sd = protolib.getSoundDevice();


Camera
======

.. _protolib-setcameraposition:

`setCameraPosition`
-------------------

**Syntax** ::

    var cameraPosition = md.v3Build(5, 10, 15);
    protolib.setCameraPosition(cameraPosition);

``cameraPosition``
    A :ref:`Vector3 <v3object>` object representing the 3d position of the camera.

.. _protolib-getcameraposition:

`getCameraPosition`
-------------------

**Syntax** ::

    var cameraPosition = md.v3Build(0, 0, 0);
    protolib.getCameraPosition(v3Position);


``cameraPosition``
    A :ref:`Vector3 <v3object>` object the x, y, z position components will be written into.


.. _protolib-setcameradirection:

`setCameraDirection`
--------------------

**Syntax** ::

    var cameraDirection = md.v3Build(0, 0, -1);
    protolib.setCameraDirection(cameraDirection);


``cameraDirection``
    A :ref:`Vector3 <v3object>` object representing the direction the camera should face.


.. _protolib-getcameradirection:

`getCameraDirection`
--------------------

**Syntax** ::

    var cameraDirection = md.v3Build(0, 0, -1);
    protolib.setCameraDirection(cameraDirection);


``cameraDirection``
    A :ref:`Vector3 <v3object>` object the x, y, z direction components will be written into.


.. _protolib-getcameraup:

`getCameraUp`
-------------

**Summary**

Gives the current up vector of the camera.

**Syntax** ::

    var cameraUp = md.v3Build(0, 0, 0);
    protolib.getCameraUp(cameraUp);

``cameraUp``
    A :ref:`Vector3 <v3object>` object the x, y, z direction components will be written into.


.. _protolib-getcameraright:

`getCameraRight`
----------------

**Summary**

Gives the current right vector of the camera.

**Syntax** ::

    var cameraRight = md.v3Build(0, 0, 0);
    protolib.getCameraRight(cameraRight);

``cameraRight``
    A :ref:`Vector3 <v3object>` object the x, y, z direction components will be written into.


.. _protolib-movecamera:

`moveCamera`
------------

**Summary**

Moves the camera relative to its current position.

**Syntax** ::

    var translateVec = md.v3Build(5, 5, 5);
    protolib.moveCamera(translateVec);

``translateVec``
    A :ref:`Vector3 <v3object>` object specifying the position translation to apply.


.. _protolib-rotatecamera:

`rotateCamera`
--------------

**Summary**

Rotates the camera relative to its current orientation.

**Syntax** ::

    protolib.rotateCamera(yawDelta, pitchDelta);

``yawDelta``
    The angle in radians to rotate the camera around the unit y vector.

``pitchDelta``
    The angle in radians to rotate the camera up and down.


.. _protolib-setcamerafov:

`setCameraFOV`
--------------

**Syntax** ::

    protolib.setCameraFOV(fovX, fovY);

``fovX``
    The horizontal field of view in radians.

``fovY``
    The vertical field of view in radians.


.. _protolib-getcamerafov:

`getCameraFOV`
--------------

**Syntax** ::

    var cameraFov = protolib.getCameraFOV();
    var fovX = cameraFov[0];
    var fovY = cameraFov[1];

Returns a JavaScript array of length 2, containing the horizontal and vertical field of view angle in radians.

.. _protolib-setnearfarplanes:

`setNearFarPlanes`
------------------

**Summary**

Sets the near and far plane distances.

**Syntax** ::

    var nearPlane = 5;
    var farPlane = 1000;
    protolib.setNearFarPlanes(nearPlane, farPlane);


``nearPlane``, ``farPlane``
    JavaScript numbers representing the distance in front of the camera where the near and far clipping planes are located.


.. _protolib-getnearfarplanes:

`getNearFarPlanes`
------------------

**Summary**

Gets the near and far plane distances.

**Syntax** ::

    var nearFarPlanes = protolib.getNearFarPlanes();
    var nearPlane = nearFarPlanes[0];
    var farPlane = nearFarPlanes[1];

Returns a JavaScript array of length 2 with the near and far plane distances respectively.

2D
==

.. _protolib-draw2dsprite:

`draw2DSprite`
--------------

**Summary**

Draws the given texture to screen space.

.. note:: Only **power-of-two** textures are supported.

**Syntax** ::

    protolib.draw2DSprite({
        texture: "path/to/texture.png",
        position: [x, y],
        width: w,
        heigth: h,
        v3Color: color,
        alpha: a,
        rotation: angle
    });

``texture``
    The path to the texture to be loaded.

``position``
    A JavaScript array of length 2 representing the coordinates of the top-left pixel of the texture.

``width``, ``height``
    A JavaScript number.

``v3Color`` (Optional)
    A :ref:`Vector3 <v3object>` object specifying the r, g, b color components. The components are in the range [0, 1]. Defaults to white.

``alpha`` (Optional)
    A JavaScript number in the range [0, 1] specifying the alpha of the texture. Defaults to 1.

``rotation`` (Optional)
    The clockwise angle in radians to rotate the texture around its centre. Defaults to 0.

``blendStyle`` (Optional)
    A value in :ref:`protolib.blendStyles <protolib-blendstyles>`. Defaults to ``protolib.blendStyles.ALPHA``.

.. _protolib-drawtext:

`drawText`
----------

**Summary**

Draws the given text to screen space.

**Syntax** ::

    protolib.drawText({
        text: "Hello World!",
        position: [x, y],
        v3Color: color,
        scale: 2,
        spacing: 1,
        alignment: protolib.textAlignment.LEFT
    });

``text``
    The text to draw to the screen.

``position``
    A JavaScript array of length 2 representing the position to draw the text to, relative to the alignment option chosen.

``v3Color`` (Optional)
    A :ref:`Vector3 <v3object>` object specifying the r, g, b color components. The components are in the range [0, 1]. Defaults to red.

``scale`` (Optional)
    A JavaScript number specifying the amount to scale the text by. Defaults to 1.

``alignment`` (Optional)
    A value in ``protolib.textAlignment``. Defines whether the position given refers to the top-left, top-middle or top-right of the text box. Defaults to ``protolib.textAlignment.LEFT``.


3D
==

.. _protolib-draw3dsprite:

`draw3DSprite`
--------------

**Summary**

Draws a 3D Sprite.

.. note:: Only **power-of-two** textures are supported.

**Syntax** ::

    protolib.draw3DSprite({
        texture: "path/to/texture.png",
        v3Position  : spritePos,
        size : params.size,
        alpha : 0.5,
        v3Color : color,
        v3Out : params.v3Out,
        rotation: Math.PI/4,
        blendStyle : params.blendStyle
    });

``texture``
    The path to the texture to be loaded.

``v3Position``
    A :ref:`Vector3 <v3object>` object specifying the position of the sprite.

``size``
    A JavaScript number specifying the size of the sprite.

``alpha`` (Optional)
    A JavaScript number in the range [0, 1] specifying the transparency of the sprite. Used when the ``blendStyle`` is set to ``protolib.blendStyles.ALPHA``. Defaults to 1.

``v3Color`` (Optional)
    A :ref:`Vector3 <v3object>` object specifying the r, g, b of the color to apply to the sprite. The components are in the range [0, 1]. Defaults to white.

``v3Out`` (Optional)
    A :ref:`Vector3 <v3object>` object specifying the normal of the surface of the sprite. If no vector is provided, the sprite is drawn with the normal always facing towards the camera.

``rotation`` (Optional)
    The clockwise angle in radians to rotate the sprite around the normal vector. Defaults to 0.

``blendStyle`` (Optional)
    A value in :ref:`protolib.blendStyles <protolib-blendstyles>`. Defaults to ``protolib.blendStyles.ALPHA``.

.. _protolib-loadmesh:

`loadMesh`
----------

**Summary**

Loads a 3d mesh and adds it to the scene. Returns a :ref:`MeshWrapper <meshwrapper>` object to control the loaded mesh.

**Syntax** ::

    var treeMesh = protolib.loadMesh({
        mesh: "path/to/mesh.dae",
        v3Position: treePos,
        v3Size: treeSize
    });

``mesh``
    The path to the mesh file.

``v3Position``
    A :ref:`Vector3 <v3object>` object specifying the position of the mesh.

``v3Size``
    A :ref:`Vector3 <v3object>` object specifying the amount to scale the mesh by in the x, y, and z directions.

Returns a :ref:`MeshWrapper <meshwrapper>` object to control the loaded mesh.

.. _protolib-draw3dline:

`draw3DLine`
------------

**Summary**

Draws a line between two end-points in 3d space.

**Syntax** ::

    protolib.draw3DLine({
        pos1: p1,
        pos2: p2,
        v3Color : color
    });

``pos1``, ``pos2``
    A :ref:`Vector3 <v3object>` object specifying the start and end points of the line.

``v3Color`` (Optional)
    A :ref:`Vector3 <v3object>` object specifying the r, g, b color components of the line. The components are in the range [0, 1]. Defaults to red.

.. _protolib-drawdebugsphere:

`drawDebugSphere`
-----------------

**Summary**

Draws 3 circles in world space representing a sphere.

**Syntax** ::

    protolib.drawDebugSphere({
        v3Position: spherePos,
        radius: 10,
        v3Color: color
    });

``v3Position``
    A :ref:`Vector3 <v3object>` object specifying the centre of the sphere.

``radius``
    A JavaScript number defining the radius of the sphere.

``v3Color``
    A :ref:`Vector3 <v3object>` object specifying the r, g, b color components of the circles making up the sphere. The components are in the range [0, 1]. Defaults to red.

.. _protolib-drawdebugcube:

`drawDebugCube`
-----------------

**Summary**

Draws a wireframe cube.

**Syntax** ::

    protolib.drawDebugCube({
        v3Position: cubePos,
        length: 10,
        v3Color: color
    });


``v3Position``
    A :ref:`Vector3 <v3object>` object specifying the centre of the cube.

``length``
    A JavaScript number defining the length of an edge on the cube.

``v3Color``
    A :ref:`Vector3 <v3object>` object specifying the r, g, b color components of the lines making up the cube. The components are in the range [0, 1]. Defaults to red.

Lights
======

.. _protolib-setambientlightcolor:

`setAmbientLightColor`
----------------------

**Summary**

Sets the ambient light color.

**Syntax** ::

    protolib.setAmbientLightColor(ambientColor);

``ambientColor``
    A :ref:`Vector3 <v3object>` object specifying the r, g, b color components to set the ambient light. The components are in the range [0, 1].


.. _protolib-getambientlightcolor:

`getAmbientLightColor`
----------------------

**Summary**

Gets the current ambient light color.

**Syntax** ::

    protolib.getAmbientLightColor(ambientColor);

``ambientColor``
    A :ref:`Vector3 <v3object>` object the ambient color will be written into.

.. _protolib-addpointlight:

`addPointLight`
---------------

**Summary**

Adds a point light to the scene. Returns a :ref:`PointLightWrapper <pointlightwrapper>` to control the light.

**Syntax** ::

    var pointLight = protolib.addPointLight({
        v3Position: lightPos,
        radius: 300,
        v3Color: color
    });

``v3Position``
    A :ref:`Vector3 <v3object>` object specifying the position of light.

``radius``
    A JavaScript number specifying the range of the light.

``v3Color``
    A :ref:`Vector3 <v3object>` object specifying the r, g, b color components to set the light. The components are in the range [0, 1].

Returns a :ref:`PointLightWrapper <pointlightwrapper>` to control the light.

.. _protolib-addspotlight:

`addSpotLight`
---------------

**Summary**

Adds a spotlight to the scene. Returns a :ref:`SpotLightWrapper <spotlightwrapper>` to control the light.

**Syntax** ::

    var spotLight = protolib.addSpotLight({
        v3Position: lightPos,
        v3Direction: lightDir,
        range: 300,
        spreadAngle: Math.PI/2,
        v3Color: color
    });

``v3Position``
    A :ref:`Vector3 <v3object>` object specifying the position of light.

``range``
    The range of the light.

``spreadAngle``
    The spread angle in radians of the spot light.

``v3Color``
    A :ref:`Vector3 <v3object>` object specifying the r, g, b color components to set the light. The components are in the range [0, 1].

Returns a :ref:`SpotLightWrapper <spotlightwrapper>` to control the light.

Sounds
======

.. _protolib-playsound:

`playSound`
-----------

**Summary**

Plays the given sound. Returns a :ref:`SoundWrapper <soundwrapper>` object used to control playback of the sound.

.. note:: For the 3D positional audio to work, a mono sound must be used.

**Syntax** ::

    var sound = protolib.playSound({
         sound : "path/to/sound.mp3",
         volume : 2,
         pitch : 1,
         looping : true,
         v3Position : soundPos,
         minDistance : 10,
         maxDistance : 300,
         rollOff : 0.9
    });

``sound``
    The path to the sound to be loaded.

``volume`` (Optional)
    The volume amplification to be applied to the sound. Defaults to 1.

``pitch`` (Optional)
    The pitch to be applied to the sound. Defaults to 1.

``looping`` (Optional)
    A boolean specifying whether to loop the sound or not. Defaults to false.

``v3Position`` (Optional)
    A :ref:`Vector3 <v3object>` object specifying the position of sound. Defaults to (0, 0, 0).

``minDistance`` (Optional)
    If the distance between the camera and the sound position is less than this, the sound plays at full volume with no attenuation. Defaults to 1.

``maxDistance`` (Optional)
    The maximum distance to the listener after which the attenuation will set the volume to zero. Defaults to Infinity.

``rollOff`` (Optional)
    The ratio that the sound will drop off as by the inverse square law of the distance to the listener.

    A number in the range [0, 1].

    0 results in no attenuation. 1 results in the volume being determined fully by attenuation.

    Defaults to 1.

``background`` (Optional)
    A boolean indicating the sound to be played is a background sound. If set to true, the ``v3Position``, ``minDistance``, ``maxDistance`` and ``rollOff`` properties should not be set.

    Defaults to ``false`` ::

        var bgsound = protolib.playSound({
             sound : "path/to/sound.mp3",
             background : true,
             volume : 2,
             pitch : 1,
             looping : true
        });

Returns a :ref:`SoundWrapper <soundwrapper>` object used to control the playback of the sound.

Keyboard State
==============

.. _protolib-iskeydown:

`isKeyDown`
-----------

**Summary**

    Returns true if the given key is currently pressed.

**Syntax** ::

    protolib.isKeyDown(keyCode);

``keyCode``
    A value from :ref:`protolib.keyCodes <protolib-keycodes>`.


.. _protolib-iskeyjustdown:

`isKeyJustDown`
---------------

**Summary**

    Returns true if the given key was pressed between the previous and the current frame.

**Syntax** ::

    protolib.isKeyJustDown(keyCode);

``keyCode``
    A value from :ref:`protolib.keyCodes <protolib-keycodes>`.


.. _protolib-iskeyjustup:

`isKeyJustUp`
-------------

**Summary**

    Returns true if the given key was released between the previous and the current frame.

**Syntax** ::

    protolib.isKeyJustUp(keyCode);

``keyCode``
    A value from :ref:`protolib.keyCodes <protolib-keycodes>`.


Mouse State
===========

.. _protolib-ismousedown:

`isMouseDown`
-------------

**Summary**

    Returns true if the given mouse button is currently pressed.

**Syntax** ::

    var isMouseDown = protolib.isMouseDown(mouseCode);

``mouseCode``
    A value from :ref:`protolib.mouseCodes <protolib-mousecodes>`.


.. _protolib-ismousejustdown:

`isMouseJustDown`
-----------------

**Summary**

    Returns true if the given mouse button was pressed between the previous and the current frame.

**Syntax** ::

    var isMouseJustDown = protolib.isMouseJustDown(mouseCode);

``mouseCode``
    A value from :ref:`protolib.mouseCodes <protolib-mousecodes>`.


.. _protolib-ismousejustup:

`isMouseJustUp`
---------------

**Summary**

    Returns true if the given mouse button was released between the previous and the current frame.

**Syntax** ::

    var isMouseJustUp = protolib.isMouseJustUp(mouseCode);

``mouseCode``
    A value from :ref:`protolib.mouseCodes <protolib-mousecodes>`.

.. _protolib-ismouseongame:

`isMouseOnGame`
---------------

**Syntax** ::

    var isMouseOnGame = protolib.isMouseOnGame();

Returns true iff the mouse is currently over the game canvas.

.. _protolib-getmouseposition:

`getMousePosition`
------------------

**Syntax** ::

    var mousePos = protolib.getMousePosition();
    var mouseX = mousePos[0];
    var mouseY = mousePos[1];

Returns an array of length 2 giving the coordinates of the mouse.

When the mouse is locked, the mouse position isn't well-defined. :ref:`getMouseDelta <protolib-getmousedelta>` should be used instead.

.. _protolib-getmousedelta:

`getMouseDelta`
---------------

**Syntax** ::

    var mouseDelta = protolib.getMouseDelta();
    var dx = mouseDelta[0];
    var dy = mouseDelta[1];

Returns an array of length 2 giving the difference in position between the previous and current frame.

.. _protolib-getmousewheeldelta:

`getMouseWheelDelta`
--------------------

**Syntax** ::

    var mouseWheelDelta = protolib.getMouseWheelDelta();

Returns a number representing the number of mouse wheel scrolls made between the previous and current frame.

Enums
=====

.. _protolib-keycodes:

`keyCodes`
----------

This is equal to :ref:`inputDevice.keyCodes <inputdevice-keycodes>`.

.. _protolib-mousecodes:

`mouseCodes`
------------

This is equal to :ref:`inputDevice.mouseCodes <inputdevice-mousecodes>`.

.. _protolib-textalignment:

`textAlignment`
---------------

A dictionary with values used to specify text alignment, for use with the :ref:`drawText <protolib-drawtext>` function.

Values are: ``LEFT``, ``CENTER``, ``RIGHT``.

.. _protolib-blendstyles:

`blendStyles`
-------------

A dictionary specifying the possible blend modes, used by :ref:`draw2DSprite <protolib-draw2dsprite>` and :ref:`draw3DSprite <protolib-draw3dsprite>`.

Values are: ``ALPHA``, ``ADDITIVE``.



.. _meshwrapper:

----------------------
The MeshWrapper Object
----------------------

An object returned from :ref:`protolib.loadMesh <protolib-loadmesh>`, for controlling the loaded mesh. ::

    var mesh = protolib.loadMesh({...});

Methods
=======

`setPosition`
-------------

**Syntax** ::

    mesh.setPosition(v3Position);

``v3Position``
    A :ref:`Vector3 <v3object>` object specifying the position of the mesh.


`getPosition`
-------------

**Syntax** ::

    mesh.getPosition(v3Position);

``v3Position``
    A :ref:`Vector3 <v3object>` object the position of the mesh will be written into.


`setSize`
---------

**Syntax** ::

    mesh.setSize(v3Size);

``v3Size``
    A :ref:`Vector3 <v3object>` object specifying the amount to scale the mesh by in the x, y, and z directions.

`getSize`
---------

**Syntax** ::

    mesh.getPosition(v3Size);

``v3Size``
    A :ref:`Vector3 <v3object>` object the size vector will be written into.


`setEnabled`
------------

**Syntax** ::

    mesh.setEnabled(enabled);

``enabled``
    A boolean determining whether the mesh should be shown in the scene.

`getEnabled`
------------

**Syntax** ::

    var isMeshEnabled = mesh.getEnabled();

Returns a boolean representing whether the mesh is enabled in the scene.

`setRotationMatrix`
-------------------

**Summary**

    Sets the rotation matrix used to orient the mesh.

**Syntax** ::

    //unitY === md.v3BuildYAxis();

    mathDevice.m43SetAxisRotation(rotationMatrix, unitY, Math.PI/4);
    mesh.setRotationMatrix(rotationMatrix);

``rotationMatrix``
    A :ref:`Matrix43 <m43object>` object specifying the rotation matrix to use.


`getRotationMatrix`
-------------------

**Summary**

    Returns the rotation matrix used to orient the mesh.

**Syntax** ::

    mesh.getRotationMatrix(rotationMatrix);

``rotationMatrix``
    A :ref:`Matrix43 <m43object>` object the rotation matrix will be written into.


.. _soundwrapper:

-----------------------
The SoundWrapper Object
-----------------------

An object returned from :ref:`protolib.playSound <protolib-playsound>`, used to control the playback of the played sound. ::

    var sound = protolib.playSound({...});

Methods
=======

`pause`
-------

**Summary**

    Pauses the sound.

**Syntax** ::

    sound.pause();

`resume`
--------

**Summary**

    Resumes playing from where it was paused.

**Syntax** ::

    sound.resume();

`stop`
------

**Summary**

    Stops playing the current sound. After this is called, this wrapper object becomes invalid, and should not be used.

**Syntax** ::

    sound.stop();

`getStatus`
-----------

**Summary**

Returns the current status of the sound playback.

**Syntax** ::

    var soundstatus = sound.getStatus();

Returns a value in ``protolib.soundStatus``.


`setVolume`
-----------

**Syntax** ::

    sound.setVolume(volume);

``volume``
    The volume amplification to be applied to the sound.


`getVolume`
-----------

**Syntax** ::

    sound.getVolume(volume);

Returns the volume amplification applied to the sound.


`setPosition`
-------------

**Syntax** ::

    sound.setPosition(v3Position);


``v3Position``
    A :ref:`Vector3 <v3object>` object specifying the position of the sound.

`getPosition`
-------------

**Syntax** ::

    sound.getPosition(v3Position);

``v3Position``
    A :ref:`Vector3 <v3object>` object the position of the sound will be written into.


`setPitch`
----------

**Syntax** ::

    sound.setPitch(pitch);


``pitch``
    The pitch to be applied to the sound.


`getPitch`
----------

**Syntax** ::

    var pitch = sound.getPitch();

Returns the pitch applied to the sound.

`setMinDistance`
----------------

**Syntax** ::

    sound.setMinDistance(minDistance);

``minDistance``
    If the distance between the camera and the sound position is less than this, the sound plays at full volume with no attenuation.


`getMinDistance`
----------------

**Syntax** ::

    var minDistance = sound.getMinDistance();

Returns the distance after which sound attenuation will start to take place.

`setMaxDistance`
----------------

**Syntax** ::

    sound.setMaxDistance(maxDistance);


``maxDistance``
    The maximum distance to the listener after which attenuation will result in volume of zero.


`getMaxDistance`
----------------

**Syntax** ::

    var maxDistance = sound.getMaxDistance();

Returns the maxDistance for sound attenuation.


`setRollOff`
------------

**Syntax** ::

    sound.setRollOff(rollOff);

``rollOff``
    The ratio that the sound will drop off as by the inverse square law of the distance to the listener.

    A number in the range [0, 1].

    0 results in no attenuation. 1 results in the volume being determined fully by attenuation.


`getRollOff`
------------

**Syntax** ::

    var rollOff = sound.getRollOff();

Returns the value of the rollOff ratio.

.. _pointlightwrapper:

----------------------------
The PointLightWrapper Object
----------------------------

An object returned from :ref:`protolib.addPointLight <protolib-addpointlight>`, used to control the created point light. ::

    var pointLight = protolib.addPointLight({});

Methods
=======

`setPosition`
-------------

**Syntax** ::

    pointLight.setPosition(v3Position);

``v3Position``
    A :ref:`Vector3 <v3object>` object specifying the position of the light.


`getPosition`
-------------

**Syntax** ::

    pointLight.getPosition(v3Position);

``v3Position``
    A :ref:`Vector3 <v3object>` object the position of the light will be written into.

`setColor`
-----------

**Syntax** ::

    pointLight.setColor(v3Color);

``v3Color``
    A :ref:`Vector3 <v3object>` object specifying the r, g, b color components. The components are in the range [0, 1].


`getColor`
-----------

**Syntax** ::

    pointLight.getColor(v3Color);

``v3Color``
    A :ref:`Vector3 <v3object>` object the r, g, b color components will be written into.


`setEnabled`
------------

**Syntax** ::

    light.setEnabled(enabled);

``enabled``
    A boolean determining whether the light should be shown in the scene.

`getEnabled`
------------

**Syntax** ::

    var isMeshEnabled = light.getEnabled();

Returns a boolean representing whether the light is enabled in the scene.


.. _spotlightwrapper:

---------------------------
The SpotLightWrapper Object
---------------------------

An object returned from :ref:`protolib.addSpotLight <protolib-addspotlight>`, for controlling the created spot light. ::

    var spotLight = protolib.addSpotLight({});


Methods
=======

`setPosition`
-------------

**Syntax** ::

    spotLight.setPosition(v3Position);

``v3Position``
    A :ref:`Vector3 <v3object>` object specifying the position of the light.


`getPosition`
-------------

**Syntax** ::

    spotLight.getPosition(v3Position);

``v3Position``
    A :ref:`Vector3 <v3object>` object the position of the light will be written into.

`setColor`
-----------

**Syntax** ::

    spotLight.setColor(v3Color);

``v3Color``
    A :ref:`Vector3 <v3object>` object specifying the r, g, b color components. The components are in the range [0, 1].


`getColor`
-----------

**Syntax** ::

    spotLight.getColor(v3Color);

``v3Color``
    A :ref:`Vector3 <v3object>` object the r, g, b color components will be written into.


`setEnabled`
------------

**Syntax** ::

    light.setEnabled(enabled);

``enabled``
    A boolean determining whether the light should be shown in the scene.

`getEnabled`
------------

**Syntax** ::

    var isMeshEnabled = light.getEnabled();

Returns a boolean representing whether the light is enabled in the scene.

`setDirection`
--------------

**Syntax** ::

    spotLight.setDirection(v3Direction);

``v3Direction``
    A :ref:`Vector3 <v3object>` object representing the direction the spotlight should aim.

`getDirection`
--------------

**Syntax** ::

    protolib.setDirection(v3Direction);

``v3Direction``
    A :ref:`Vector3 <v3object>` object the x, y, z direction components will be written into.