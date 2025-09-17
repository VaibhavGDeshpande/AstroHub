'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import "cesium/Build/Cesium/Widgets/widgets.css";

if (typeof window !== 'undefined') {
  (window as Window & { CESIUM_BASE_URL?: string }).CESIUM_BASE_URL = "/cesium";
}

// Set the Cesium Ion access token
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI3ZmUyMDU3NS0wYTk5LTQ0ZjQtYmEzNi04NjllYTU3ZmE4ZTkiLCJpZCI6MzQwOTc4LCJpYXQiOjE3NTc3NzE3MDh9.p9lg0P5Rb9zgLUib_NE5qEYNCWwt_FyDFW5Ok2EQgUw"

// Add the CSS styles
const styles = `
  @import url(https://cesium.com/downloads/cesiumjs/releases/1.107/Build/Cesium/Widgets/widgets.css);
  
  .fullSize {
    position: absolute;
    top: 0;
    left: 0;
    border: none;
    height: 100%;
    width: 100%;
  }
  
  #loadingOverlay {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-family: sans-serif;
    z-index: 1000;
    backdrop-filter: blur(5px);
  }

  .loading-container {
    text-align: center;
    background: rgba(42, 42, 42, 0.95);
    padding: 40px;
    border-radius: 12px;
    border: 1px solid #555;
    min-width: 320px;
  }

  .progress-bar {
    width: 280px;
    height: 8px;
    background: #333;
    border-radius: 4px;
    overflow: hidden;
    margin: 20px auto;
    position: relative;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #ff4444, #ff6666);
    border-radius: 4px;
    transition: width 0.3s ease;
    position: relative;
  }

  .progress-fill::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  #toolbar {
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(42, 42, 42, 0.9);
    padding: 10px;
    border-radius: 8px;
    z-index: 100;
    display: flex;
    flex-direction: column;
    gap: 8px;
    min-width: 200px;
  }
  
  .stratakit-mimic-select-root {
    position: relative;
    display: inline-block;
    width: 100%;
  }
  
  .stratakit-mimic-select {
    appearance: none;
    background: #2a2a2a;
    border: 1px solid #555;
    border-radius: 4px;
    color: white;
    padding: 8px 32px 8px 12px;
    width: 100%;
    font-size: 14px;
    cursor: pointer;
    outline: none;
  }
  
  .stratakit-mimic-select:hover {
    background: #333;
    border-color: #666;
  }
  
  .stratakit-mimic-select:focus {
    border-color: #4CAF50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
  
  .stratakit-mimic-select-arrow {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #ccc;
  }
  
  /* Styles for indicating to the user to press the play button */
  .cesium-animation-rectButton.highlight-animation .cesium-animation-buttonGlow {
    display: block;
    fill: #fff;
    filter: url(#animation_blurred) drop-shadow(0 0 3px #aef) drop-shadow(0 0 3px #fff);
    animation: highlight-animation-button 1.2s ease-in-out infinite;
  }
  
  .cesium-animation-rectButton.highlight-animation .cesium-animation-buttonMain {
    stroke: #fff;
    stroke-width: 3;
  }
  
  .cesium-animation-rectButton.highlight-animation .cesium-animation-buttonPath {
    fill: #fff;
  }
  
  .cesium-animation-shuttleRingG.highlight-animation .cesium-animation-shuttleRingBack {
    stroke: #fff;
    stroke-width: 6;
    filter: drop-shadow(0 0 3px #aef) drop-shadow(0 0 3px rgba(174, 238, 255, 0.95));
    animation: highlight-animation-ring 1.2s ease-in-out infinite;
  }
  
  .cesium-animation-shuttleRingG.highlight-animation .cesium-animation-shuttleRingSwoosh line {
    stroke: #fff;
    stroke-opacity: 0.8;
  }
  
  @keyframes highlight-animation-button {
    0% {
      opacity: 0.3;
      stroke-width: 0;
    }
    50% {
      opacity: 1;
      stroke-width: 4;
    }
    100% {
      opacity: 0.3;
      stroke-width: 0;
    }
  }
  
  @keyframes highlight-animation-ring {
    0% {
      stroke-opacity: 0.25;
      stroke: #333;
    }
    50% {
      stroke-opacity: 1;
      stroke: #fff;
    }
    100% {
      stroke-opacity: 0.25;
      stroke: #333;
    }
  }
`;

// Define interfaces for better type safety
interface RoverMenuEntry {
  text: string;
  onselect: () => void;
}

interface LandmarkMenuEntry {
  text: string;
  onselect: () => void;
}

interface RoverEntity {
  id?: string;
  name?: string;
  description?: string;
  position?: Cesium.PositionProperty;
  orientation?: Cesium.Property;
  availability?: Cesium.TimeInterval;
  properties?: {
    animationStartTime: Cesium.Property;
  };
  model?: Cesium.ModelGraphics & {
    lightColor: Cesium.Property;
  };
  label?: Cesium.LabelGraphics;
}

interface LandmarkFlyToOptions {
  destination: Cesium.Cartesian3;
  orientation: Cesium.HeadingPitchRoll;
  easingFunction: typeof Cesium.EasingFunction;
  maximumHeight: number;
  pitchAdjustHeight: number;
  duration: number;
  complete: () => void;
}

// Rover model configurations
const ROVER_MODELS: { [key: string]: { modelPath: string; scale: number; heading?: number } } = {
  'Curiosity': {
    modelPath: '../../SampleData/Models/Curiosity.glb',
    scale: 1.0,
    heading: 0
  },
  'Perseverance': {
    modelPath: '../../SampleData/Models/Perseverance.glb',
    scale: 1.0,
    heading: 0
  }
};

const MarsRoverExplorer: React.FC = () => {
  const cesiumContainer = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<Cesium.Viewer | null>(null);
  const sceneRef = useRef<Cesium.Scene | null>(null);
  const clockRef = useRef<Cesium.Clock | null>(null);
  const navHelpRef = useRef<Cesium.NavigationHelpButton | null>(null);
  
  const curiosityRef = useRef<RoverEntity | null>(null);
  const perseveranceRef = useRef<RoverEntity | null>(null);
  const theMartianJourneyRef = useRef<Cesium.Entity | null>(null);
  const removeRotationRef = useRef<Cesium.Event.RemoveCallback | null>(null);

  // Store references to GLB model entities
  const roverModelsRef = useRef<Map<string, Cesium.Entity>>(new Map());

  // State for menu entries and loading
  const [roverMenuEntries, setRoverMenuEntries] = useState<RoverMenuEntry[]>([]);
  const [landmarkMenuEntries, setLandmarkMenuEntries] = useState<LandmarkMenuEntry[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Initializing Mars Explorer...');

  // Preload assets function
  const preloadAssets = async (): Promise<void> => {
    if (!viewerRef.current) return;
    
    setLoadingMessage('Preloading rover models...');
    
    // Preload rover models
    const roverPromises = Object.keys(ROVER_MODELS).map(async (roverName) => {
      try {
        const modelConfig = ROVER_MODELS[roverName];
        
        // Create a hidden entity to preload the model
        const preloadEntity = viewerRef.current!.entities.add({
          name: `${roverName}_preload`,
          position: Cesium.Cartesian3.fromDegrees(0, 0, -10000), // Hidden underground
          show: false, // Hide while preloading
          model: {
            uri: modelConfig.modelPath,
            scale: modelConfig.scale,
            minimumPixelSize: 1,
          }
        });
        
        return preloadEntity;
      } catch (error) {
        console.error(`Failed to preload ${roverName} model:`, error);
        return null;
      }
    });
    
    await Promise.all(roverPromises);
    console.log('All rover models preloaded');
    
    // Preload CZML data
    setLoadingMessage('Preloading rover data...');
    try {
      const czmlResponse = await fetch("../../SampleData/Mars.czml");
      const czmlData = await czmlResponse.json();
      // Cache in sessionStorage
      sessionStorage.setItem('Mars.czml', JSON.stringify(czmlData));
      console.log('CZML data preloaded and cached');
    } catch (error) {
      console.error('Failed to preload CZML:', error);
    }
    
    // Preload GeoJSON data
    setLoadingMessage('Preloading landmark data...');
    try {
      const geoJsonResponse = await fetch("../../SampleData/MarsPointsofInterest.geojson");
      const geoJsonData = await geoJsonResponse.json();
      // Cache in sessionStorage
      sessionStorage.setItem('MarsPointsofInterest.geojson', JSON.stringify(geoJsonData));
      console.log('GeoJSON data preloaded and cached');
    } catch (error) {
      console.error('Failed to preload GeoJSON:', error);
    }
  };

  // Cache assets function
  const cacheAssets = async (): Promise<void> => {
    setLoadingMessage('Caching assets for faster loading...');
    
    // Cache rover models
    const modelUrls = Object.values(ROVER_MODELS).map(model => model.modelPath);
    
    const cachePromises = modelUrls.map(async (url) => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          console.log(`Cached model: ${url}`);
        }
      } catch (error) {
        console.error(`Failed to cache ${url}:`, error);
      }
    });
    
    await Promise.all(cachePromises);
  };

  useEffect(() => {
    if (!cesiumContainer.current) return;

    // Initialize Cesium
    Cesium.Ellipsoid.default = Cesium.Ellipsoid.MARS;
    const viewer = new Cesium.Viewer(cesiumContainer.current, {
      terrainProvider: false as unknown as Cesium.TerrainProvider,
      baseLayer: false as unknown as Cesium.ImageryLayer,
      baseLayerPicker: false,
      geocoder: false,
      shadows: false,
      globe: new Cesium.Globe(Cesium.Ellipsoid.MARS),
      skyBox: Cesium.SkyBox.createEarthSkyBox(),
      skyAtmosphere: new Cesium.SkyAtmosphere(Cesium.Ellipsoid.MARS),
      // Performance optimizations
      requestRenderMode: true,
      maximumRenderTimeChange: Infinity,
    });

    // Performance settings
    viewer.resolutionScale = 1;
    viewer.scene.fog.enabled = false;
    viewer.targetFrameRate = 60;

    viewer.scene.globe.show = false;
    viewerRef.current = viewer;
    sceneRef.current = viewer.scene;
    clockRef.current = viewer.clock;
    navHelpRef.current = viewer.navigationHelpButton;

    // Adjust the default atmosphere coefficients to be more Mars-like
    const scene = viewer.scene;
    if (scene.skyAtmosphere) {
      scene.skyAtmosphere.atmosphereMieCoefficient = new Cesium.Cartesian3(
        9.0e-5,
        2.0e-5,
        1.0e-5,
      );
      scene.skyAtmosphere.atmosphereRayleighCoefficient = new Cesium.Cartesian3(
        9.0e-6,
        2.0e-6,
        1.0e-6,
      );
      scene.skyAtmosphere.atmosphereRayleighScaleHeight = 9000;
      scene.skyAtmosphere.atmosphereMieScaleHeight = 2700.0;
      scene.skyAtmosphere.saturationShift = -0.1;
      scene.skyAtmosphere.perFragmentAtmosphere = true;
    }

    // Adjust postprocess settings for brighter and richer features
    const bloom = viewer.scene.postProcessStages.bloom;
    bloom.enabled = true;
    bloom.uniforms.brightness = -0.5;
    bloom.uniforms.stepSize = 1.0;
    bloom.uniforms.sigma = 3.0;
    bloom.uniforms.delta = 1.5;
    scene.highDynamicRange = true;
    viewer.scene.postProcessStages.exposure = 1.5;

    // Main initialization function with preloading
    const initializeWithPreloading = async (viewer: Cesium.Viewer): Promise<void> => {
      setIsLoading(true);
      setLoadingProgress(0);
      
      // Step 1: Cache assets (10% of progress)
      await cacheAssets();
      setLoadingProgress(10);
      
      // Step 2: Preload assets (20% of progress)  
      await preloadAssets();
      setLoadingProgress(30);
      
      // Step 3: Load tileset (40% of progress)
      setLoadingMessage('Loading Mars terrain...');
      await loadTileset();
      setLoadingProgress(70);
      
      // Step 4: Load rovers (20% of progress)
      setLoadingMessage('Loading rover data...');
      await loadRovers();
      setLoadingProgress(85);
      
      // Step 5: Load landmarks (10% of progress)
      setLoadingMessage('Loading landmarks...');
      await loadLandmarks();
      setLoadingProgress(95);
      
      // Step 6: Complete setup
      setLoadingMessage('Finalizing setup...');
      setupRotation();
      addRoverInstructionsToNavMenu();
      setLoadingProgress(100);
      
      // Add a listener for when the home button is clicked.
      viewer.homeButton.viewModel.command.beforeExecute.addEventListener(
        function () {
          reset();
        },
      );

      // Add event listener to update model positions during animation
      viewer.scene.preUpdate.addEventListener(() => {
        if (viewer.clock.shouldAnimate) {
          // Update Curiosity model position
          if (curiosityRef.current && roverModelsRef.current.has('Curiosity')) {
            updateRoverModelPosition('Curiosity', curiosityRef.current);
          }
          
          // Update Perseverance model position
          if (perseveranceRef.current && roverModelsRef.current.has('Perseverance')) {
            updateRoverModelPosition('Perseverance', perseveranceRef.current);
          }
        }
      });

      // Complete loading
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    // Initialize the application
    initializeWithPreloading(viewer).catch(console.error);

    // Cleanup function
    return () => {
      if (viewer && !viewer.isDestroyed()) {
        viewer.destroy();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // For changing the width of polylines based on distance from the camera
  const createWidthCallbackProperty = (nearFarScalar: Cesium.NearFarScalar): Cesium.CallbackProperty => {
    return new Cesium.CallbackProperty(function () {
      const distance = viewerRef.current!.camera.positionCartographic.height;
      let t =
        (distance - nearFarScalar.near) /
        (nearFarScalar.far - nearFarScalar.near);
      t = Cesium.Math.clamp(t, 0.0, 1.0);
      return Cesium.Math.lerp(nearFarScalar.nearValue, nearFarScalar.farValue, t);
    }, false);
  };

  // Converts a Julian date to a Mars Sol number, given a start date / sol number
  const createJulianDateToSolConverter = (
    startJulianDate: Cesium.JulianDate,
    startSol: number
  ): ((julianDate: Cesium.JulianDate) => string) => {
    return function (julianDate: Cesium.JulianDate): string {
      const secondsPerSol = 24 * 60 * 60 + 39 * 60 + 35;
      const differenceInSeconds = Cesium.JulianDate.secondsDifference(
        julianDate,
        startJulianDate,
      );
      const solNumber =
        Math.floor(differenceInSeconds / secondsPerSol) + startSol;
      return `Sol ${solNumber}`;
    };
  };

  // Create GLB model for rover
  const createRoverModel = (name: string, position: Cesium.Cartesian3): Cesium.Entity | null => {
    if (!viewerRef.current || !ROVER_MODELS[name]) return null;

    const modelConfig = ROVER_MODELS[name];
    
    try {
      const entity = viewerRef.current.entities.add({
        name: `${name} Model`,
        position: position,
        orientation: Cesium.Transforms.headingPitchRollQuaternion(
          position,
          new Cesium.HeadingPitchRoll(
            Cesium.Math.toRadians(modelConfig.heading || 0),
            0,
            0
          )
        ),
        model: {
          uri: modelConfig.modelPath,
          minimumPixelSize: 64,
          maximumScale: 20000,
          scale: modelConfig.scale,
          lightColor: Cesium.Color.WHITE,
          shadows: Cesium.ShadowMode.ENABLED,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        }
      });

      roverModelsRef.current.set(name, entity);
      return entity;
    } catch (error) {
      console.error(`Error creating model for ${name}:`, error);
      return null;
    }
  };

  // Update rover model position to follow the rover entity
  const updateRoverModelPosition = (roverName: string, roverEntity: RoverEntity): void => {
    const modelEntity = roverModelsRef.current.get(roverName);
    if (!modelEntity || !roverEntity || !clockRef.current) return;

    const currentTime = clockRef.current.currentTime;
    const position = roverEntity.position?.getValue(currentTime);
    
    if (position) {
      modelEntity.position = new Cesium.CallbackProperty(() => {
        const time = clockRef.current?.currentTime;
        if (time && roverEntity.position) {
          return roverEntity.position.getValue(time);
        }
        return position;
      }, false) as unknown as Cesium.PositionProperty;

      // Also update orientation if the rover has orientation data
      if (roverEntity.orientation) {
        modelEntity.orientation = new Cesium.CallbackProperty(() => {
          const time = clockRef.current?.currentTime;
          if (time && roverEntity.orientation) {
            return roverEntity.orientation.getValue(time);
          }
          return Cesium.Transforms.headingPitchRollQuaternion(
            position,
            new Cesium.HeadingPitchRoll(0, 0, 0)
          );
        }, false);
      }
    }
  };

  // Show/hide rover models
  const showRoverModel = (roverName: string, show: boolean = true): void => {
    const modelEntity = roverModelsRef.current.get(roverName);
    if (modelEntity && modelEntity.model) {
      modelEntity.show = show;
    }
  };

  // Hide all rover models
  const hideAllRoverModels = (): void => {
    roverModelsRef.current.forEach((entity) => {
      entity.show = false;
    });
  };

  // To create a rectangle with text that conforms to the terrain
  const createCanvasAsTexture = (text: string): HTMLCanvasElement => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 256;

    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;

    // Background
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Text
    ctx.font = "36px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.strokeStyle = "rgba(0,0,0,0.1)";
    ctx.lineWidth = 1;
    ctx.fillStyle = "#ffffff";

    ctx.strokeText(text, canvas.width / 2, canvas.height / 2);
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    return canvas;
  };

  // For drawing attention to the play button in the animation view model
  const highlightAnimationViewModel = (): void => {
    const clock = clockRef.current;
    if (!clock || clock.shouldAnimate) return;

    const playPath = viewerRef.current?.animation.container.querySelector(
      "#animation_pathPlay",
    );
    if (!playPath) return;
    
    const playButton = playPath.closest("g.cesium-animation-rectButton");
    const ringG = viewerRef.current?.animation.container.querySelector(
      ".cesium-animation-shuttleRingG",
    );
    
    if (playButton && ringG) {
      playButton.classList.add("highlight-animation");
      ringG.classList.add("highlight-animation");

      playButton.addEventListener("click", removeHighlight, { once: true });
      setTimeout(removeHighlight, 30000); // Remove after 30 seconds if not clicked
    }
  };

  const removeHighlight = (): void => {
    const playPath = viewerRef.current?.animation.container.querySelector(
      "#animation_pathPlay",
    );
    if (!playPath) return;
    
    const playButton = playPath.closest("g.cesium-animation-rectButton");
    const ringG = viewerRef.current?.animation.container.querySelector(
      ".cesium-animation-shuttleRingG",
    );
    
    if (playButton && ringG) {
      playButton.classList.remove("highlight-animation");
      ringG.classList.remove("highlight-animation");
    }
  };

  const reset = (): void => {
    if (!viewerRef.current || !clockRef.current) return;
    
    clockRef.current.multiplier = 1;
    viewerRef.current.selectedEntity = undefined;
    viewerRef.current.trackedEntity = undefined;
    viewerRef.current.timeline.zoomTo(clockRef.current.startTime, clockRef.current.stopTime);
    if (removeRotationRef.current) {
      removeRotationRef.current();
    }
    hideAllRoverModels(); // Hide all models when resetting
    removeHighlight();
  };

  // Spin Mars on first load but disable the spinning upon any input
  const setupRotation = (): void => {
    if (!viewerRef.current) return;
    
    const rotationSpeed = Cesium.Math.toRadians(0.1);
    removeRotationRef.current = viewerRef.current.scene.postRender.addEventListener(
      function () {
        viewerRef.current!.scene.camera.rotateRight(rotationSpeed);
      },
    );

    const handler = new Cesium.ScreenSpaceEventHandler(viewerRef.current.scene.canvas);
    handler.setInputAction(
      () => removeRotationRef.current?.(),
      Cesium.ScreenSpaceEventType.LEFT_DOWN,
    );
    handler.setInputAction(
      () => removeRotationRef.current?.(),
      Cesium.ScreenSpaceEventType.RIGHT_DOWN,
    );
    handler.setInputAction(
      () => removeRotationRef.current?.(),
      Cesium.ScreenSpaceEventType.MIDDLE_DOWN,
    );
    handler.setInputAction(
      () => removeRotationRef.current?.(),
      Cesium.ScreenSpaceEventType.WHEEL,
    );
  };

  // Inject instructions for interacting with the rovers into the navigation help menu
  const addRoverInstructionsToNavMenu = (): void => {
    const div = document.querySelector(
      ".cesium-click-navigation-help.cesium-navigation-help-instructions",
    );
    if (!div) return;

    const table = div.querySelector("table");
    if (!table) return;

    // Create templates for rover help instructions
    const roverHelpRowTemplate1 = document.createElement('template');
    roverHelpRowTemplate1.innerHTML = `
      <tr>
        <td>
          <img
            src="https://cesium.com/downloads/cesiumjs/releases/1.107/Build/Cesium/Widgets/Images/NavigationHelp/MouseLeft.svg"
            style="height: 48px; width: 48px"
            alt="Left mouse button"
          />
        </td>
        <td>
          <div class="cesium-navigation-help-pan">Track Rover</div>
          <div class="cesium-navigation-help-detail">
            Double click on a rover to track it
          </div>
        </td>
      </tr>
    `;

    const roverHelpRowTemplate2 = document.createElement('template');
    roverHelpRowTemplate2.innerHTML = `
      <tr>
        <td>
          <svg
            width="48"
            height="48"
            viewBox="0 0 32 32"
            aria-label="Play"
            role="img"
          >
            <path
              transform="translate(32,32) scale(0.85) translate(-32,-32)"
              d="M6.684,25.682L24.316,15.5L6.684,5.318V25.682z"
              fill="#ffffff"
            ></path>
          </svg>
        </td>
        <td>
          <div class="cesium-navigation-help-zoom">Play Animation</div>
          <div class="cesium-navigation-help-detail">
            Press play on the timeline to watch the rover move
          </div>
        </td>
      </tr>
    `;

    if (roverHelpRowTemplate1.content) {
      const instructions1Clone = roverHelpRowTemplate1.content.cloneNode(true);
      table.tBodies[0].appendChild(instructions1Clone);
    }

    if (roverHelpRowTemplate2.content) {
      const instructions2Clone = roverHelpRowTemplate2.content.cloneNode(true);
      table.tBodies[0].appendChild(instructions2Clone);
    }
  };

  // Load Mars tileset with preloading optimizations
  const loadTileset = async (): Promise<void> => {
    if (!viewerRef.current) return;
    
    try {
      const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(3644333, {
        enableCollision: true,
        // Performance and preloading optimizations
        maximumScreenSpaceError: 24,
        cullRequestsWhileMoving: true,
        preloadWhenHidden: true,
        preloadFlightDestinations: true,
        preferLeaves: true,
        immediatelyLoadDesiredLevelOfDetail: true,
        // maximumMemoryUsage: 1024,
        progressiveResolutionHeightFraction: 0.5,
        foveatedScreenSpaceError: true,
        foveatedConeSize: 0.3,
        foveatedMinimumScreenSpaceErrorRelaxation: 0.0,
      });
      
      viewerRef.current.scene.primitives.add(tileset);
      
      // Wait for initial tiles to load
      // await tileset.readyPromise;
      
      // Set up tile loading event listener
      tileset.allTilesLoaded.addEventListener(() => {
        console.log('All visible tiles loaded');
      });
      
    } catch (error) {
      console.log(error);
    }
  };

  // Load the rovers and path from The Martian
  const loadRovers = async (): Promise<void> => {
    if (!viewerRef.current) return;
    
    try {
      // Try to load from cache first
      let czmlData;
      const cachedData = sessionStorage.getItem('Mars.czml');
      
      if (cachedData) {
        czmlData = JSON.parse(cachedData);
        console.log('Loading CZML from cache');
      } else {
        const response = await fetch("../../SampleData/Mars.czml");
        czmlData = await response.json();
      }
      
      const dataSource = await Cesium.CzmlDataSource.load(czmlData);
      viewerRef.current.dataSources.add(dataSource);

      const roverMenuTemp: RoverMenuEntry[] = [];

      const onSelectRover = (rover: RoverEntity, roverName: string): void => {
        reset();
        const roverAnimStartIso = rover.properties?.animationStartTime.getValue(
          Cesium.JulianDate.now(),
        ) as string;
        clockRef.current!.multiplier = 604800;
        clockRef.current!.currentTime = Cesium.JulianDate.fromIso8601(roverAnimStartIso);
        if (rover.availability) {
          viewerRef.current!.timeline.zoomTo(rover.availability.start, rover.availability.stop);
        }

        // Create or show the GLB model for this rover
        const roverPosition = rover.position?.getValue(clockRef.current!.currentTime);
        if (roverPosition) {
          let modelEntity = roverModelsRef.current.get(roverName);
          if (!modelEntity) {
            modelEntity = createRoverModel(roverName, roverPosition) || undefined;
          }
          
          if (modelEntity) {
            updateRoverModelPosition(roverName, rover);
            showRoverModel(roverName, true);
          }
        }

        if (!roverPosition) return;
        
        const boundingSphere = new Cesium.BoundingSphere(
          roverPosition as Cesium.Cartesian3,
          5000.0,
        );

        sceneRef.current!.camera.flyToBoundingSphere(boundingSphere, {
          offset: new Cesium.HeadingPitchRange(4.9791, -0.5294, 0.0),
          easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
          maximumHeight: 5e6,
          pitchAdjustHeight: 2.5e6,
          duration: 3.0,
          complete: function () {
            highlightAnimationViewModel(); // Draw attention to the play button
            navHelpRef.current!.viewModel.showInstructions = true;
          },
        });
      };

      const setupRover = function (
        entityId: string,
        startSol: number,
        outRover: RoverEntity | null
      ): RoverEntity {
        outRover = dataSource.entities.getById(entityId) as unknown as RoverEntity;

        if (outRover.availability) {
          const julianDateToSol = createJulianDateToSolConverter(
            outRover.availability.start,
            startSol,
          );
          if (outRover.label) {
            outRover.label.text = new Cesium.CallbackProperty(function (time: Cesium.JulianDate | undefined) {
              if (time) {
                return julianDateToSol(time);
              }
              return "";
            }, false);
          }
        }

        const roverPath = dataSource.entities.getById(`${entityId}Path`);
        if (roverPath && roverPath.polyline) {
          roverPath.polyline.width = createWidthCallbackProperty(
            new Cesium.NearFarScalar(0.0, 15.0, 1.0e5, 0.0),
          );
        }

        roverMenuTemp.push({
          text: entityId,
          onselect: () => onSelectRover(outRover, entityId),
        });

        return outRover;
      };

      curiosityRef.current = setupRover("Curiosity", 3, curiosityRef.current);
      perseveranceRef.current = setupRover("Perseverance", 13, perseveranceRef.current);
      theMartianJourneyRef.current = dataSource.entities.getById("TheMartianJourney") || null;
      
      if (theMartianJourneyRef.current && theMartianJourneyRef.current.polyline) {
        theMartianJourneyRef.current.polyline.width = createWidthCallbackProperty(
          new Cesium.NearFarScalar(0.0, 10.0, 1.0e7, 0.0),
        );
      }
      
      if (theMartianJourneyRef.current && theMartianJourneyRef.current.rectangle) {
        theMartianJourneyRef.current.rectangle.material = new Cesium.ImageMaterialProperty({
          image: createCanvasAsTexture('Mark Watney\'s Journey in "The Martian"'),
          transparent: true,
        });
      }

      roverMenuTemp.push({
        text: '"The Martian" Journey',
        onselect: () => {
          reset();
          viewerRef.current!.zoomTo(theMartianJourneyRef.current!);
        },
      });

      setRoverMenuEntries(roverMenuTemp);
    } catch (error) {
      console.log(`Error loading CZML: ${error}`);
    }
  };

  // Load points of interest from GeoJSON data source
  const loadLandmarks = async (): Promise<void> => {
    if (!viewerRef.current) return;
    
    try {
      // Try to load from cache first
      let geoJsonData;
      const cachedData = sessionStorage.getItem('MarsPointsofInterest.geojson');
      
      if (cachedData) {
        geoJsonData = JSON.parse(cachedData);
        console.log('Loading GeoJSON from cache');
      } else {
        const response = await fetch("../../SampleData/MarsPointsofInterest.geojson");
        geoJsonData = await response.json();
      }
      
      const dataSource = await Cesium.GeoJsonDataSource.load(geoJsonData);
      viewerRef.current.dataSources.add(dataSource);

      const onSelectLandmark = (landmark: LandmarkFlyToOptions): void => {
        reset();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sceneRef.current!.camera.flyTo(landmark as any);
      };

      const landmarkMenuTemp: LandmarkMenuEntry[] = [];

      const entities = dataSource.entities.values;
      entities.forEach((entity: Cesium.Entity) => {
        if (!entity.properties) return;

        entity.label = new Cesium.LabelGraphics({
          text: entity.properties.text as unknown as Cesium.Property,
          font: "18pt Verdana",
          outlineColor: Cesium.Color.DARKSLATEGREY,
          outlineWidth: 2,
          style: Cesium.LabelStyle.FILL_AND_OUTLINE,
          pixelOffset: new Cesium.Cartesian2(0, -22),
          scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
          translucencyByDistance: new Cesium.NearFarScalar(2.5e7, 1.0, 4.0e7, 0.0),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: new Cesium.CallbackProperty(() => {
            return Cesium.Cartesian3.magnitude(sceneRef.current!.camera.positionWC);
          }, false),
        });

        entity.point = new Cesium.PointGraphics({
          pixelSize: 10,
          color: Cesium.Color.fromBytes(243, 242, 99),
          outlineColor: Cesium.Color.fromBytes(219, 218, 111),
          outlineWidth: 2,
          scaleByDistance: new Cesium.NearFarScalar(1.5e3, 1.0, 4.0e7, 0.1),
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
          disableDepthTestDistance: new Cesium.CallbackProperty(() => {
            return Cesium.Cartesian3.magnitude(sceneRef.current!.camera.positionWC);
          }, false),
        });

        entity.name = entity.properties.text.getValue() as string;

        const flyToDestination = Cesium.Cartesian3.fromArray(
          entity.properties.destination.getValue() as number[]
        );
        const orientationArray = entity.properties.orientation.getValue() as number[];
        const flyToOrientation = new Cesium.HeadingPitchRoll(
          orientationArray[0],
          orientationArray[1],
          orientationArray[2],
        );

        landmarkMenuTemp.push({
          text: entity.properties.text.getValue() as string,
          onselect: () =>
            onSelectLandmark({
              destination: flyToDestination,
              orientation: flyToOrientation,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT as any,
              maximumHeight: 5e6,
              pitchAdjustHeight: 2.5e6,
              duration: 3.0,
              complete: function () {
                viewerRef.current!.selectedEntity = entity;
                viewerRef.current!.infoBox.viewModel.showInfo = true;
              },
            }),
        });
      });

      setLandmarkMenuEntries(landmarkMenuTemp);
    } catch (error) {
      console.log(`Error loading GeoJSON: ${error}`);
    }
  };

  // Handle rover selection
  const handleRoverSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = parseInt(e.target.value);
    if (selectedIndex >= 0 && selectedIndex < roverMenuEntries.length) {
      roverMenuEntries[selectedIndex].onselect();
    }
    // Reset select to default
    e.target.value = "";
  };

  // Handle landmark selection
  const handleLandmarkSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = parseInt(e.target.value);
    if (selectedIndex >= 0 && selectedIndex < landmarkMenuEntries.length) {
      landmarkMenuEntries[selectedIndex].onselect();
    }
    // Reset select to default
    e.target.value = "";
  };

  return (
    <div className="relative w-full h-screen">
      <style>{styles}</style>
      <div ref={cesiumContainer} className="fullSize" />
      
      {/* Loading Overlay */}
      {isLoading && (
        <div id="loadingOverlay">
          <div className="loading-container">
            <div className="text-2xl mb-4 font-bold">🚀 Mars Explorer</div>
            <div className="text-lg mb-2">{loadingMessage}</div>
            <div className="progress-bar">
              <div 
                className="progress-fill"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
            <div className="text-sm mt-2 opacity-75">{loadingProgress}% Complete</div>
            {loadingProgress < 100 && (
              <div className="text-xs mt-3 opacity-60">
                Preloading assets for optimal performance...
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Toolbar */}
      <div id="toolbar" style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s' }}>
        <div className="stratakit-mimic-select-root">
          <select 
            className="stratakit-mimic-button stratakit-mimic-select" 
            data-kiwi-variant="solid" 
            data-kiwi-tone="neutral"
            onChange={handleRoverSelection}
            value=""
            disabled={isLoading}
          >
            <option value="">Fly to rover...</option>
            {roverMenuEntries.map((entry, index) => (
              <option key={index} value={index.toString()}>
                {entry.text}
              </option>
            ))}
          </select>
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16" className="stratakit-mimic-icon stratakit-mimic-disclosure-arrow stratakit-mimic-select-arrow" aria-hidden="true">
            <path fill="currentColor" fillRule="evenodd" d="M8 10 5 7h6l-3 3Z" clipRule="evenodd"></path>
          </svg>
        </div>
        <div className="stratakit-mimic-select-root">
          <select 
            className="stratakit-mimic-button stratakit-mimic-select" 
            data-kiwi-variant="solid" 
            data-kiwi-tone="neutral"
            onChange={handleLandmarkSelection}
            value=""
            disabled={isLoading}
          >
            <option value="">Fly to landmark...</option>
            {landmarkMenuEntries.map((entry, index) => (
              <option key={index} value={index.toString()}>
                {entry.text}
              </option>
            ))}
          </select>
          <svg width="16" height="16" fill="none" viewBox="0 0 16 16" className="stratakit-mimic-icon stratakit-mimic-disclosure-arrow stratakit-mimic-select-arrow" aria-hidden="true">
            <path fill="currentColor" fillRule="evenodd" d="M8 10 5 7h6l-3 3Z" clipRule="evenodd"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MarsRoverExplorer;
