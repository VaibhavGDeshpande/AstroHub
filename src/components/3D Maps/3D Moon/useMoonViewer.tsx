'use client';

import { useState, useCallback, useRef } from 'react';
import * as Cesium from 'cesium';
import { ViewerWithControls } from '@/types/moonviewer';
import { pointsOfInterest, locationConfigs } from '@/app/3d-moon/config/moonConfig';

export const useMoonViewer = () => {
  const [isLoading, setIsLoading] = useState(true);
  // Add ref to store boundary data source
  const boundarySourceRef = useRef<Cesium.GeoJsonDataSource | null>(null);

  const initializeMoonViewer = useCallback(
    (
      container: HTMLDivElement,
      viewerRef: React.MutableRefObject<ViewerWithControls | null>
    ) => {
      // Set Cesium Ion access token BEFORE creating viewer
      Cesium.Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_TOKEN || 'YOUR_ACCESS_TOKEN';
      
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

          // Load boundary resource once
          const boundariesResource = await Cesium.IonResource.fromAssetId(2683531);
          
          // Create first data source (mare boundaries)
          const boundarySource = await Cesium.GeoJsonDataSource.load(boundariesResource, {
            clampToGround: true,
            fill: Cesium.Color.fromBytes(26, 108, 113, 102),
            stroke: Cesium.Color.CYAN.withAlpha(0.8),
            strokeWidth: 2,
          });

          // Ensure boundaries render over both terrain and 3D tiles
          boundarySource.entities.values.forEach((entity) => {
            if (entity.polygon) {
              // Classify against both terrain and 3D Tiles so the overlay is visible
              entity.polygon.classificationType = new Cesium.ConstantProperty(Cesium.ClassificationType.BOTH);
            }
            if (entity.polyline) {
              // Keep lines draped on the surface for visibility
              entity.polyline.clampToGround = new Cesium.ConstantProperty(true);
              if (!entity.polyline.width) {
                entity.polyline.width = new Cesium.ConstantProperty(2);
              }
            }
          });

          // Clone the resource URL for second data source (Artemis 3)
          const artemis3Resource = boundariesResource.clone();
          const artemis3Source = await Cesium.GeoJsonDataSource.load(artemis3Resource, {
            clampToGround: true,
            fill: Cesium.Color.fromBytes(243, 242, 99, 102),
          });

          // Hide both by default
          boundarySource.show = false;
          artemis3Source.show = false;
          
          // Add to viewer
          viewer.dataSources.add(boundarySource);
          viewer.dataSources.add(artemis3Source);

          // Store reference to boundary source for toggle function
          boundarySourceRef.current = boundarySource;

          // Cache camera position for reuse
          const cameraPositionCallback = new Cesium.CallbackProperty(() => 
            Cesium.Cartesian3.magnitude(scene.camera.positionWC), false
          );

          // Add points of interest with optimized properties
          pointsOfInterest.forEach((poi) => {
            viewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(poi.longitude, poi.latitude),
              label: {
                text: poi.text,
                font: "14pt Verdana",
                outlineColor: Cesium.Color.DARKSLATEGRAY,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -22),
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
                translucencyByDistance: new Cesium.NearFarScalar(2.5e7, 1.0, 4.0e7, 0.0),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                disableDepthTestDistance: cameraPositionCallback,
              },
              point: {
                pixelSize: 10,
                color: Cesium.Color.fromBytes(243, 242, 99),
                outlineColor: Cesium.Color.fromBytes(219, 218, 111),
                outlineWidth: 2,
                scaleByDistance: new Cesium.NearFarScalar(1.5e3, 1.0, 4.0e7, 0.1),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                disableDepthTestDistance: cameraPositionCallback,
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
          ].forEach(eventType => handler.setInputAction(stopRotation, eventType));

          // Setup fly-to locations with shared logic
          type CameraFlyToOptions = {
            destination: Cesium.Cartesian3 | Cesium.Rectangle;
            orientation?: {
              heading?: number;
              pitch?: number;
              roll?: number;
              direction?: Cesium.Cartesian3;
              up?: Cesium.Cartesian3;
            };
            duration?: number;
            complete?: () => void;
            cancel?: () => void;
            endTransform?: Cesium.Matrix4;
            maximumHeight?: number;
            easingFunction?: (time: number) => number;
          };

          const createFlyToFunction = (config: CameraFlyToOptions, showArtemis: boolean) => () => {
            removeRotation();
            scene.camera.flyTo(config);
            artemis3Source.show = showArtemis;
          };

          viewer.flyToLocations = {
            seaOfTranquility: createFlyToFunction(locationConfigs.seaOfTranquility, false),
            apollo11: createFlyToFunction(locationConfigs.apollo11, false),
            copernicus: createFlyToFunction(locationConfigs.copernicus, false),
            tycho: createFlyToFunction(locationConfigs.tycho, false),
            shackleton: createFlyToFunction(locationConfigs.shackleton, true),
          };

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
        // Clear the ref
        boundarySourceRef.current = null;
      };
    },
    []
  );

  return {
    isLoading,
    initializeMoonViewer,
  };
};
