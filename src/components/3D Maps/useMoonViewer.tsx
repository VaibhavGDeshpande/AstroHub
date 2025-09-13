'use client';

import { useState, useCallback } from 'react';
import * as Cesium from 'cesium';
import { ViewerWithControls } from '@/types/moonviewer';
import { pointsOfInterest, locationConfigs } from '../../app/3d-moon/config/moonConfig';

export const useMoonViewer = () => {
  const [isLoading, setIsLoading] = useState(true);

  const initializeMoonViewer = useCallback(
    (
      container: HTMLDivElement,
      viewerRef: React.RefObject<ViewerWithControls | null>
    ) => {
      // Set Moon ellipsoid
      Cesium.Ellipsoid.default = Cesium.Ellipsoid.MOON;

      const viewer = new Cesium.Viewer(container, {
        terrainProvider: new Cesium.EllipsoidTerrainProvider(),
        timeline: false,
        animation: false,
        baseLayerPicker: false,
        geocoder: false,
        shadows: true,
      }) as ViewerWithControls;

      viewerRef.current = viewer;
      const scene = viewer.scene;

      const initializeCesium = async () => {
        try {
          // Add Moon Terrain 3D Tiles
          const tileset1 = await Cesium.Cesium3DTileset.fromIonAssetId(2684829, {
            enableCollision: true,
          });
          viewer.scene.primitives.add(tileset1);

          // Add boundary data sources
          const boundariesResource = await Cesium.IonResource.fromAssetId(2683530);
          const boundarySource = await Cesium.GeoJsonDataSource.load(boundariesResource, {
            clampToGround: true,
            fill: Cesium.Color.fromBytes(26, 106, 113).withAlpha(0.6),
          });
          boundarySource.show = false;
          viewer.dataSources.add(boundarySource);

          const artemis3resource = await Cesium.IonResource.fromAssetId(2683531);
          const artemis3Source = await Cesium.GeoJsonDataSource.load(artemis3resource, {
            clampToGround: true,
            fill: Cesium.Color.fromBytes(243, 242, 99).withAlpha(0.6),
          });
          artemis3Source.show = false;
          viewer.dataSources.add(artemis3Source);

          // Add points of interest
          for (const poi of pointsOfInterest) {
            viewer.entities.add({
              position: Cesium.Cartesian3.fromDegrees(poi.longitude, poi.latitude),
              label: {
                text: poi.text,
                font: "14pt Verdana",
                outlineColor: Cesium.Color.DARKSLATEGREY,
                outlineWidth: 2,
                style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                pixelOffset: new Cesium.Cartesian2(0, -22),
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.0, 1.5e7, 0.5),
                translucencyByDistance: new Cesium.NearFarScalar(2.5e7, 1.0, 4.0e7, 0.0),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                disableDepthTestDistance: new Cesium.CallbackProperty(() => {
                  return Cesium.Cartesian3.magnitude(scene.camera.positionWC);
                }, false),
              },
              point: {
                pixelSize: 10,
                color: Cesium.Color.fromBytes(243, 242, 99),
                outlineColor: Cesium.Color.fromBytes(219, 218, 111),
                outlineWidth: 2,
                scaleByDistance: new Cesium.NearFarScalar(1.5e3, 1.0, 4.0e7, 0.1),
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                disableDepthTestDistance: new Cesium.CallbackProperty(() => {
                  return Cesium.Cartesian3.magnitude(scene.camera.positionWC);
                }, false),
              },
            });
          }

          // Setup rotation and interaction handlers
          const rotationSpeed = Cesium.Math.toRadians(0.1);
          const removeRotation = viewer.scene.postRender.addEventListener(
            function () {
              viewer.scene.camera.rotateRight(rotationSpeed);
            }
          );

          const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
          handler.setInputAction(() => removeRotation(), Cesium.ScreenSpaceEventType.LEFT_DOWN);
          handler.setInputAction(() => removeRotation(), Cesium.ScreenSpaceEventType.RIGHT_DOWN);
          handler.setInputAction(() => removeRotation(), Cesium.ScreenSpaceEventType.MIDDLE_DOWN);
          handler.setInputAction(() => removeRotation(), Cesium.ScreenSpaceEventType.WHEEL);

          // Setup fly-to locations
          viewer.flyToLocations = {
            seaOfTranquility: () => {
              removeRotation();
              scene.camera.flyTo(locationConfigs.seaOfTranquility);
              artemis3Source.show = false;
            },
            apollo11: () => {
              removeRotation();
              scene.camera.flyTo(locationConfigs.apollo11);
              artemis3Source.show = false;
            },
            copernicus: () => {
              removeRotation();
              scene.camera.flyTo(locationConfigs.copernicus);
              artemis3Source.show = false;
            },
            tycho: () => {
              removeRotation();
              scene.camera.flyTo(locationConfigs.tycho);
              artemis3Source.show = false;
            },
            shackleton: () => {
              removeRotation();
              scene.camera.flyTo(locationConfigs.shackleton);
              artemis3Source.show = true;
            },
            toggleBoundaries: (show: boolean) => {
              boundarySource.show = show;
            }
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
      };
    },
    []
  );

  return {
    isLoading,
    initializeMoonViewer,
  };
};
