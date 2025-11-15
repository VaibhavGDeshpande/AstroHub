'use client';

import { useState, useCallback} from 'react';
import * as Cesium from 'cesium';
import {
  ViewerWithControls,
  MoonLocationId,
  LocationConfig,
  FlyToLocationOptions,
  FlyToLocationHandler,
} from '@/types/moonviewer';
import { pointsOfInterest, locationConfigs } from '@/app/3d-moon/config/moonConfig';

export const useMoonViewer = () => {
  const [isLoading, setIsLoading] = useState(true);

  const initializeMoonViewer = useCallback(
    (
      container: HTMLDivElement,
      viewerRef: React.MutableRefObject<ViewerWithControls | null>
    ) => {
      // Set Cesium Ion access token BEFORE creating viewer
      Cesium.Ion.defaultAccessToken =
        process.env.NEXT_PUBLIC_CESIUM_TOKEN || 'YOUR_ACCESS_TOKEN';

      // Set Moon ellipsoid
      Cesium.Ellipsoid.default = Cesium.Ellipsoid.MOON;

      const viewer = new Cesium.Viewer(container, {
        terrainProvider: new Cesium.EllipsoidTerrainProvider(),
        timeline: false,
        animation: false,
        baseLayerPicker: false,
        geocoder: false,
        sceneModePicker: false,
        shadows: true,
        requestRenderMode: true,
        maximumRenderTimeChange: Infinity,
      }) as ViewerWithControls;

      viewerRef.current = viewer;
      const scene = viewer.scene;

      const initializeCesium = async () => {
        try {
          // Add Moon Terrain 3D Tiles
          const tileset = await Cesium.Cesium3DTileset.fromIonAssetId(2684829, {
            enableCollision: true,
          });
          scene.primitives.add(tileset);

          // Cache camera position for reuse
          const cameraPositionCallback = new Cesium.CallbackProperty(
            () => Cesium.Cartesian3.magnitude(scene.camera.positionWC),
            false
          );

          // Add points of interest with optimized properties
          pointsOfInterest.forEach((poi) => {
            viewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(poi.longitude, poi.latitude),
              label: {
                text: poi.text,
                font: '14pt Verdana',
                outlineColor: Cesium.Color.DARKSLATEGRAY,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -22),
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
                translucencyByDistance: new Cesium.NearFarScalar(2.5e7, 1.0, 4.0e7, 0.0),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                // disableDepthTestDistance expects a number; using callback value pattern
                disableDepthTestDistance: cameraPositionCallback as unknown as number,
              },
              point: {
                pixelSize: 10,
                color: Cesium.Color.fromBytes(243, 242, 99),
                outlineColor: Cesium.Color.fromBytes(219, 218, 111),
                outlineWidth: 2,
                scaleByDistance: new Cesium.NearFarScalar(1.5e3, 1.0, 4.0e7, 0.1),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                disableDepthTestDistance: cameraPositionCallback as unknown as number,
              },
            });
          });

          // Setup rotation with cleanup reference
          const rotationSpeed = Cesium.Math.toRadians(0.1);
          const removeRotation = scene.postRender.addEventListener(() => {
            scene.camera.rotateRight(rotationSpeed);
          });

          // Single handler for all interaction events
          const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
          const stopRotation = () => removeRotation();

          [
            Cesium.ScreenSpaceEventType.LEFT_DOWN,
            Cesium.ScreenSpaceEventType.RIGHT_DOWN,
            Cesium.ScreenSpaceEventType.MIDDLE_DOWN,
            Cesium.ScreenSpaceEventType.WHEEL,
          ].forEach((eventType) => handler.setInputAction(stopRotation, eventType));

          const createFlyToFunction =
            (config: LocationConfig) => (options?: FlyToLocationOptions) => {
              removeRotation();
              const target = Cesium.Cartesian3.fromDegrees(
                config.target.longitude,
                config.target.latitude,
                config.target.height ?? 0,
              Cesium.Ellipsoid.MOON,
            );
            const boundingSphere = new Cesium.BoundingSphere(
              target,
              config.boundingRadius ?? 45_000,
            );
            const offset = new Cesium.HeadingPitchRange(
              Cesium.Math.toRadians(config.headingDeg ?? 0),
              Cesium.Math.toRadians(config.pitchDeg ?? -55),
              config.range ?? 180_000,
            );

              scene.camera.flyToBoundingSphere(boundingSphere, {
                duration: config.duration ?? 4,
                offset,
                easingFunction: config.easingFunction ?? Cesium.EasingFunction.LINEAR_NONE,
                complete: () => {
                  options?.onComplete?.();
                },
              });
            };

          const flyToEntries = Object.entries(locationConfigs) as [
            MoonLocationId,
            LocationConfig,
          ][];

          viewer.flyToLocations = flyToEntries.reduce(
            (acc, [locationId, config]) => {
              acc[locationId] = createFlyToFunction(config);
              return acc;
            },
            {} as Record<MoonLocationId, FlyToLocationHandler>,
          );

          setIsLoading(false);
        } catch (error) {
          console.error('Error initializing Cesium:', error);
          setIsLoading(false);
        }
      };

      initializeCesium();

      // Cleanup function
      return () => {
        if (viewerRef.current) {
          viewerRef.current.destroy();
          viewerRef.current = null;
        }
      };
    },
    []
  );

  return {
    isLoading,
    initializeMoonViewer,
  };
};
