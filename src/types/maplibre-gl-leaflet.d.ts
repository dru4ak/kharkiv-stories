import type { Layer, Map } from "leaflet";
import type { Map as MaplibreMap, StyleSpecification } from "maplibre-gl";

declare module "leaflet" {
  function maplibreGL(options: {
    style: string | StyleSpecification;
    interactive?: boolean;
    attributionControl?: boolean | string;
  }): MaplibreGLLayer;

  interface MaplibreGLLayer extends Layer {
    getMaplibreMap(): MaplibreMap;
    _glMap?: MaplibreMap;
  }
}

declare module "@maplibre/maplibre-gl-leaflet";
