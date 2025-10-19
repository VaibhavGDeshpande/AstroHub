'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as Cesium from 'cesium';
import "./styles.css";

// Import types and utilities
import { RoverMenuEntry, LandmarkMenuEntry, RoverEntity, CameraFlyToOptions } from './types';
import { CESIUM_BASE_URL, CESIUM_ION_TOKEN, ROVER_MODELS, DATA_URLS, CACHE_KEYS, TILESET_ION_ASSET_ID } from './constants';
import { getPerformanceConfig } from './performanceConfig';
import {
  createWidthCallbackProperty,
  createJulianDateToSolConverter,
  createRoverModel,
  updateRoverModelPosition,
  getCachedCanvasTexture
} from './utils';

// Initialize Cesium configuration
if (typeof window !== 'undefined') {
  (window as Window & { CESIUM_BASE_URL?: string }).CESIUM_BASE_URL = CESIUM_BASE_URL;
}
Cesium.Ion.defaultAccessToken = CESIUM_ION_TOKEN;

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

  // Store references to GLB model entities - using Map for better memory management
  const roverModelsRef = useRef<Map<string, Cesium.Entity>>(new Map());

  // Performance config ref - memoized
  const perfConfigRef = useRef(getPerformanceConfig());

  // State for menu entries and loading
  const [roverMenuEntries, setRoverMenuEntries] = useState<RoverMenuEntry[]>([]);
  const [landmarkMenuEntries, setLandmarkMenuEntries] = useState<LandmarkMenuEntry[]>([]);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingMessage, setLoadingMessage] = useState('Initializing Mars Explorer...');

  // ... [All your existing functions remain the same - preloadAssets, cacheAssets, etc.]
  // I'm keeping them as is to save space
  const preloadAssets = useCallback(async (): Promise<void> => {
    if (!viewerRef.current || !perfConfigRef.current.preloading.enableModelPreloading) {
      console.log('Skipping model preloading for mobile');
      return;
    }

    setLoadingMessage('Preloading rover models...');

    const roverPromises = Object.keys(ROVER_MODELS).map(async (roverName) => {
      try {
        const modelConfig = ROVER_MODELS[roverName];
        const preloadEntity = viewerRef.current!.entities.add({
          name: `${roverName}_preload`,
          position: Cesium.Cartesian3.fromDegrees(0, 0, -10000),
          show: false,
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
      const czmlResponse = await fetch(DATA_URLS.CZML);
      const czmlData = await czmlResponse.json();
      sessionStorage.setItem(CACHE_KEYS.CZML, JSON.stringify(czmlData));
      console.log('CZML data preloaded and cached');
    } catch (error) {
      console.error('Failed to preload CZML:', error);
    }

    // Preload GeoJSON data
    setLoadingMessage('Preloading landmark data...');
    try {
      const geoJsonResponse = await fetch(DATA_URLS.GEOJSON);
      const geoJsonData = await geoJsonResponse.json();
      sessionStorage.setItem(CACHE_KEYS.GEOJSON, JSON.stringify(geoJsonData));
      console.log('GeoJSON data preloaded and cached');
    } catch (error) {
      console.error('Failed to preload GeoJSON:', error);
    }
  }, []);

  const cacheAssets = useCallback(async (): Promise<void> => {
    if (!perfConfigRef.current.preloading.enableAssetCaching) {
      console.log('Skipping asset caching for mobile');
      return;
    }

    setLoadingMessage('Caching assets for faster loading...');
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
  }, []);

  const highlightAnimationViewModel = useCallback((): void => {
    const clock = clockRef.current;
    if (!clock || clock.shouldAnimate) return;

    const playPath = viewerRef.current?.animation.container.querySelector("#animation_pathPlay");
    if (!playPath) return;

    const playButton = playPath.closest("g.cesium-animation-rectButton");
    const ringG = viewerRef.current?.animation.container.querySelector(".cesium-animation-shuttleRingG");

    if (playButton && ringG) {
      playButton.classList.add("highlight-animation");
      ringG.classList.add("highlight-animation");

      const removeHighlight = () => {
        playButton.classList.remove("highlight-animation");
        ringG.classList.remove("highlight-animation");
      };

      playButton.addEventListener("click", removeHighlight, { once: true });
      setTimeout(removeHighlight, 30000);
    }
  }, []);

  const reset = useCallback((): void => {
    if (!viewerRef.current || !clockRef.current) return;

    clockRef.current.multiplier = 1;
    viewerRef.current.selectedEntity = undefined;
    viewerRef.current.trackedEntity = undefined;
    viewerRef.current.timeline.zoomTo(clockRef.current.startTime, clockRef.current.stopTime);
    if (removeRotationRef.current) {
      removeRotationRef.current();
    }
    roverModelsRef.current.forEach(entity => { entity.show = false; });
  }, []);

  const setupRotation = useCallback((): void => {
    if (!viewerRef.current) return;

    const rotationSpeed = Cesium.Math.toRadians(0.1);
    removeRotationRef.current = viewerRef.current.scene.postRender.addEventListener(() => {
      viewerRef.current!.scene.camera.rotateRight(rotationSpeed);
    });

    const handler = new Cesium.ScreenSpaceEventHandler(viewerRef.current.scene.canvas);
    const removeRotation = () => removeRotationRef.current?.();

    handler.setInputAction(removeRotation, Cesium.ScreenSpaceEventType.LEFT_DOWN);
    handler.setInputAction(removeRotation, Cesium.ScreenSpaceEventType.RIGHT_DOWN);
    handler.setInputAction(removeRotation, Cesium.ScreenSpaceEventType.MIDDLE_DOWN);
    handler.setInputAction(removeRotation, Cesium.ScreenSpaceEventType.WHEEL);
  }, []);

  const addRoverInstructionsToNavMenu = useCallback((): void => {
    const div = document.querySelector(".cesium-click-navigation-help.cesium-navigation-help-instructions");
    if (!div) return;

    const table = div.querySelector("table");
    if (!table) return;

    if (table.tBodies.length === 0) {
      table.createTBody();
    }
    const targetTbody = table.tBodies[0];

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
      targetTbody.appendChild(roverHelpRowTemplate1.content.cloneNode(true));
    }
    if (roverHelpRowTemplate2.content) {
      targetTbody.appendChild(roverHelpRowTemplate2.content.cloneNode(true));
    }
  }, []);

  const loadTileset = useCallback(async (): Promise<void> => {
    if (!viewerRef.current) return;

    const perfConfig = perfConfigRef.current;

    try {
      const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(TILESET_ION_ASSET_ID, {
        enableCollision: true,
        maximumScreenSpaceError: perfConfig.tileset.maximumScreenSpaceError,
        cullRequestsWhileMoving: perfConfig.tileset.cullRequestsWhileMoving,
        cullRequestsWhileMovingMultiplier: perfConfig.tileset.cullRequestsWhileMovingMultiplier,
        skipLevelOfDetail: perfConfig.tileset.skipLevelOfDetail,
        baseScreenSpaceError: perfConfig.tileset.baseScreenSpaceError,
        skipScreenSpaceErrorFactor: perfConfig.tileset.skipScreenSpaceErrorFactor,
        skipLevels: perfConfig.tileset.skipLevels,
        immediatelyLoadDesiredLevelOfDetail: perfConfig.tileset.immediatelyLoadDesiredLevelOfDetail,
        loadSiblings: perfConfig.tileset.loadSiblings,
        preloadWhenHidden: perfConfig.tileset.preloadWhenHidden,
        preloadFlightDestinations: perfConfig.tileset.preloadFlightDestinations,
        preferLeaves: perfConfig.tileset.preferLeaves,
        progressiveResolutionHeightFraction: perfConfig.tileset.progressiveResolutionHeightFraction,
        foveatedScreenSpaceError: perfConfig.tileset.foveatedScreenSpaceError,
        foveatedConeSize: perfConfig.tileset.foveatedConeSize,
        foveatedMinimumScreenSpaceErrorRelaxation: perfConfig.tileset.foveatedMinimumScreenSpaceErrorRelaxation,
      });

      viewerRef.current.scene.primitives.add(tileset);

      tileset.allTilesLoaded.addEventListener(() => {
        console.log('All visible tiles loaded');
      });

    } catch (error) {
      console.log('Tileset loading error:', error);
    }
  }, []);

  const loadRovers = useCallback(async (): Promise<void> => {
    if (!viewerRef.current) return;

    try {
      let czmlData;
      const cachedData = sessionStorage.getItem(CACHE_KEYS.CZML);

      if (cachedData) {
        czmlData = JSON.parse(cachedData);
        console.log('Loading CZML from cache');
      } else {
        const response = await fetch(DATA_URLS.CZML);
        czmlData = await response.json();
      }

      const dataSource = await Cesium.CzmlDataSource.load(czmlData);
      viewerRef.current.dataSources.add(dataSource);

      const roverMenuTemp: RoverMenuEntry[] = [];

      const onSelectRover = (rover: RoverEntity, roverName: string): void => {
        reset();
        const roverAnimStartIso = rover.properties?.animationStartTime.getValue(Cesium.JulianDate.now()) as string;
        clockRef.current!.multiplier = 604800;
        clockRef.current!.currentTime = Cesium.JulianDate.fromIso8601(roverAnimStartIso);
        if (rover.availability) {
          viewerRef.current!.timeline.zoomTo(rover.availability.start, rover.availability.stop);
        }

        const roverPosition = rover.position?.getValue(clockRef.current!.currentTime);
        if (roverPosition) {
          let modelEntity = roverModelsRef.current.get(roverName);
          if (!modelEntity) {
            modelEntity = createRoverModel(roverName, roverPosition, viewerRef.current!) || undefined;
            if (modelEntity) roverModelsRef.current.set(roverName, modelEntity);
          }

          if (modelEntity) {
            updateRoverModelPosition(roverName, rover, modelEntity, clockRef.current!);
            modelEntity.show = true;
          }
        }

        if (!roverPosition) return;

        const boundingSphere = new Cesium.BoundingSphere(roverPosition as Cesium.Cartesian3, 5000.0);
        sceneRef.current!.camera.flyToBoundingSphere(boundingSphere, {
          offset: new Cesium.HeadingPitchRange(4.9791, -0.5294, 0.0),
          easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
          maximumHeight: 5e6,
          pitchAdjustHeight: 2.5e6,
          duration: 3.0,
          complete: () => {
            highlightAnimationViewModel();
            navHelpRef.current!.viewModel.showInstructions = true;
          },
        });
      };

      const setupRover = function (entityId: string, startSol: number, outRover: RoverEntity | null): RoverEntity {
        outRover = dataSource.entities.getById(entityId) as unknown as RoverEntity;

        if (outRover.availability) {
          const julianDateToSol = createJulianDateToSolConverter(outRover.availability.start, startSol);
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
            viewerRef.current!
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
          viewerRef.current!
        );
      }

      if (theMartianJourneyRef.current && theMartianJourneyRef.current.rectangle) {
        theMartianJourneyRef.current.rectangle.material = new Cesium.ImageMaterialProperty({
          image: getCachedCanvasTexture('Mark Watney\'s Journey in "The Martian"'),
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
  }, [reset, highlightAnimationViewModel]);

  const loadLandmarks = useCallback(async (): Promise<void> => {
    if (!viewerRef.current) return;

    try {
      let geoJsonData;
      const cachedData = sessionStorage.getItem(CACHE_KEYS.GEOJSON);

      if (cachedData) {
        geoJsonData = JSON.parse(cachedData);
        console.log('Loading GeoJSON from cache');
      } else {
        const response = await fetch(DATA_URLS.GEOJSON);
        geoJsonData = await response.json();
      }

      const dataSource = await Cesium.GeoJsonDataSource.load(geoJsonData);
      viewerRef.current.dataSources.add(dataSource);

      const onSelectLandmark = (landmark: CameraFlyToOptions): void => {
        reset();
        sceneRef.current!.camera.flyTo(landmark);
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

        const flyToDestination = Cesium.Cartesian3.fromArray(entity.properties.destination.getValue() as number[]);
        const orientationArray = entity.properties.orientation.getValue() as number[];
        const [heading = 0, pitch = 0, roll = 0] = orientationArray;
        const flyToOrientation = new Cesium.HeadingPitchRoll(heading, pitch, roll);

        landmarkMenuTemp.push({
          text: entity.properties.text.getValue() as string,
          onselect: () =>
            onSelectLandmark({
              destination: flyToDestination,
              orientation: flyToOrientation,
              easingFunction: Cesium.EasingFunction.CUBIC_IN_OUT,
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
  }, [reset]);

  // Handle selections
  const handleRoverSelection = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = parseInt(e.target.value);
    if (selectedIndex >= 0 && selectedIndex < roverMenuEntries.length) {
      roverMenuEntries[selectedIndex].onselect();
    }
    e.target.value = "";
  }, [roverMenuEntries]);

  const handleLandmarkSelection = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = parseInt(e.target.value);
    if (selectedIndex >= 0 && selectedIndex < landmarkMenuEntries.length) {
      landmarkMenuEntries[selectedIndex].onselect();
    }
    e.target.value = "";
  }, [landmarkMenuEntries]);

  // Main useEffect
  useEffect(() => {
    if (!cesiumContainer.current) return;

    const perfConfig = perfConfigRef.current;

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
      requestRenderMode: perfConfig.viewer.requestRenderMode,
      maximumRenderTimeChange: perfConfig.viewer.maximumRenderTimeChange,
    });

    if (!viewer || !viewer.scene) {
      console.error('Failed to create Cesium viewer or scene');
      return;
    }

    // Apply performance settings
    viewer.resolutionScale = perfConfig.viewer.resolutionScale;
    viewer.scene.fog.enabled = false;
    viewer.targetFrameRate = perfConfig.viewer.targetFrameRate;
    viewer.scene.globe.show = false;

    viewerRef.current = viewer;
    sceneRef.current = viewer.scene;
    clockRef.current = viewer.clock;
    navHelpRef.current = viewer.navigationHelpButton;

    // Capture the current rover models map so the cleanup uses the same object
    const roverModels = roverModelsRef.current;

    // Adjust atmosphere
    if (viewer.scene.skyAtmosphere) {
      viewer.scene.skyAtmosphere.atmosphereMieCoefficient = new Cesium.Cartesian3(9.0e-5, 2.0e-5, 1.0e-5);
      viewer.scene.skyAtmosphere.atmosphereRayleighCoefficient = new Cesium.Cartesian3(9.0e-6, 2.0e-6, 1.0e-6);
      viewer.scene.skyAtmosphere.atmosphereRayleighScaleHeight = 9000;
      viewer.scene.skyAtmosphere.atmosphereMieScaleHeight = 2700.0;
      viewer.scene.skyAtmosphere.saturationShift = -0.1;
      viewer.scene.skyAtmosphere.perFragmentAtmosphere = perfConfig.atmosphere.perFragmentAtmosphere;
    }

    // Adjust post-processing
    const bloom = viewer.scene.postProcessStages.bloom;
    bloom.enabled = perfConfig.postProcessing.bloom;
    if (perfConfig.postProcessing.bloom) {
      bloom.uniforms.brightness = perfConfig.postProcessing.bloomBrightness;
      bloom.uniforms.stepSize = 1.0;
      bloom.uniforms.sigma = 3.0;
      bloom.uniforms.delta = 1.5;
    }
    viewer.scene.highDynamicRange = perfConfig.postProcessing.hdr;
    viewer.scene.postProcessStages.exposure = perfConfig.postProcessing.exposure;

    // Main initialization
    const initializeWithPreloading = async (viewer: Cesium.Viewer): Promise<void> => {
      setIsLoading(true);
      setLoadingProgress(0);

      await cacheAssets();
      setLoadingProgress(10);

      await preloadAssets();
      setLoadingProgress(30);

      setLoadingMessage('Loading Mars terrain...');
      await loadTileset();
      setLoadingProgress(70);

      setLoadingMessage('Loading rover data...');
      await loadRovers();
      setLoadingProgress(85);

      setLoadingMessage('Loading landmarks...');
      await loadLandmarks();
      setLoadingProgress(95);

      setLoadingMessage('Finalizing setup...');
      setupRotation();
      addRoverInstructionsToNavMenu();
      setLoadingProgress(100);

      // Add home button listener
      if (viewer.homeButton) {
        viewer.homeButton.viewModel.command.beforeExecute.addEventListener(() => {
          reset();
        });
      }

      // Add pre-update event listener for rover positions
      viewer.scene.preUpdate.addEventListener(() => {
        if (viewer.clock.shouldAnimate) {
          if (curiosityRef.current && roverModelsRef.current.has('Curiosity')) {
            const modelEntity = roverModelsRef.current.get('Curiosity')!;
            updateRoverModelPosition('Curiosity', curiosityRef.current, modelEntity, clockRef.current!);
          }

          if (perseveranceRef.current && roverModelsRef.current.has('Perseverance')) {
            const modelEntity = roverModelsRef.current.get('Perseverance')!;
            updateRoverModelPosition('Perseverance', perseveranceRef.current, modelEntity, clockRef.current!);
          }
        }
      });

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    initializeWithPreloading(viewer).catch(console.error);

    // Cleanup
    return () => {
      if (viewer && !viewer.isDestroyed()) {
        viewer.destroy();
      }
      // Clear caches using the captured map reference
      roverModels.clear();
    };
  }, [cacheAssets, preloadAssets, loadTileset, loadRovers, loadLandmarks, setupRotation, addRoverInstructionsToNavMenu, reset]);

  return (
    <div 
      className="relative w-full h-screen pb-16 md:pb-20 lg:pb-0" 
      style={{ paddingBottom: 'calc(4rem + env(safe-area-inset-bottom, 0px))' }}
    >
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
                {getPerformanceConfig().viewer.resolutionScale < 1 ? 'Optimizing for mobile...' : 'Preloading assets for optimal performance...'}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div id="toolbar" style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s' }}>
        <div className="stratakit-mimic-select-root max-w-[120px] sm:max-w-none">
          <select
            className="stratakit-mimic-button stratakit-mimic-select w-full text-xs sm:text-sm px-2 sm:px-3"
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
        <div className="stratakit-mimic-select-root max-w-[120px] sm:max-w-none">
          <select
            className="stratakit-mimic-button stratakit-mimic-select w-full text-xs sm:text-sm px-2 sm:px-3"
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
