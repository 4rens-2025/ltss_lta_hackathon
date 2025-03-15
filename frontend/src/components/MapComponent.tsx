// src/components/MapComponent.tsx
import React, { useState, useRef, useEffect } from "react";
import Map, { Source, Layer, Popup, MapRef } from "react-map-gl/mapbox";
import singaporeBoundary from "../data/singapore_boundary.json";
import MapboxTraffic from "@mapbox/mapbox-gl-traffic";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

// A visible layer to draw the boundary line
import type { LineLayerSpecification } from "react-map-gl/mapbox";

const boundaryLineLayer: LineLayerSpecification = {
    id: "singapore-boundary-line",
    type: "line",
    source: "boundary",
    paint: {
        "line-color": "#FF0000", // red color for the boundary outline
        "line-width": 3,
    },
};

// An invisible fill layer to capture click events on the boundary
import type { FillLayerSpecification } from "react-map-gl/mapbox";

const boundaryFillLayer: FillLayerSpecification = {
    id: "singapore-boundary-fill",
    type: "fill",
    source: "boundary",
    paint: {
        "fill-color": "#000000",
        "fill-opacity": 0, // fully transparent but still catches events
    },
};

interface PopupData {
    lngLat: { lng: number; lat: number };
    properties: { [key: string]: any };
}

const MapComponent = () => {
    const [viewState, setViewState] = useState({
        latitude: 1.3521,
        longitude: 103.8198,
        zoom: 10,
        width: "100%",
        height: "100%",
    });

    const mapRef = useRef<MapRef>(null);
    const [popupData, setPopupData] = useState<PopupData | null>(null);

    useEffect(() => {
        const map = mapRef.current?.getMap();
        if (!map) return;

        // When the user clicks on the invisible fill layer, display a popup.
        map.on("click", "singapore-boundary-fill", (e) => {
            if (!e.features || e.features.length === 0) return;
            const feature = e.features[0];
            setPopupData({
                lngLat: e.lngLat,
                properties: feature.properties || {},
            });
        });

        // Optional: If clicking anywhere else on the map, hide the popup.
        const handleMapClick = (e: any) => {
            // Query features under the click point from our fill layer.
            const features = map.queryRenderedFeatures(e.point, {
                layers: ["singapore-boundary-fill"],
            });
            if (!features.length) {
                setPopupData(null);
            }
        };

        map.on("click", handleMapClick);

        return () => {
            if (map) {
                map.off("click", "singapore-boundary-fill");
                map.off("click", handleMapClick);
            }
        };
    }, []);

    return (
        <Map
            {...viewState}
            ref={mapRef}
            onMove={(evt) => setViewState(evt.viewState)}
            mapStyle="mapbox://styles/mapbox/streets-v11"
            mapboxAccessToken={MAPBOX_TOKEN}
        >
            <Source id="boundary" type="geojson" data={singaporeBoundary}>
                <Layer {...boundaryFillLayer} />
                <Layer {...boundaryLineLayer} />
            </Source>

            {popupData && (
                <Popup
                    longitude={popupData.lngLat.lng}
                    latitude={popupData.lngLat.lat}
                    anchor="top"
                    closeButton={true}
                    closeOnClick={false}
                    onClose={() => setPopupData(null)}
                >
                    <div>
                        <h3>{popupData.properties.Name}</h3>
                        <p>{popupData.properties.ED_DESC}</p>
                        {/* You can display additional properties as needed */}
                    </div>
                </Popup>
            )}
        </Map>
    );
};

export default MapComponent;
