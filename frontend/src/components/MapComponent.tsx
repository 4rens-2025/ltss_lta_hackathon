import React, { useState, useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import singaporeBoundary from "../data/singapore_boundary.json";

const MapComponent = () => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const prevSelectedRef = useRef(null);

    useEffect(() => {
        // Set your Mapbox access token
        mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

        const bounds = [
            [103.5, 1.18], // Southwest coordinates (lower-left)
            [104.091, 1.485], // Northeast coordinates (upper-right)
        ];

        // Initialize the map
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            center: [103.8198, 1.3521], // Center over Singapore
            zoom: 11,
            style: "mapbox://styles/mapbox/navigation-night-v1",
            maxBounds: bounds,
        });
        mapRef.current = map;

        map.on("load", () => {
            // Add the Singapore boundary as a GeoJSON source
            map.addSource("singapore", {
                type: "geojson",
                data: singaporeBoundary,
                generateId: true,
            });

            // Add an invisible fill layer (to capture click events)
            map.addLayer({
                id: "singapore-fill",
                type: "fill",
                source: "singapore",
                paint: {
                    "fill-color": "#000000",
                    "fill-opacity": [
                        "case",
                        ["boolean", ["feature-state", "selected"], false],
                        0.4,
                        ["boolean", ["feature-state", "highlight"], false],
                        0.2,
                        0.1,
                    ],
                },
            });

            // Add a visible line layer to outline the boundary
            map.addLayer({
                id: "singapore-line",
                type: "line",
                source: "singapore",
                paint: {
                    "line-color": "#000000",
                    "line-width": 1,
                },
            });

            // When clicking on the fill layer, update feature state for the clicked feature
            map.on("click", "singapore-fill", (e) => {
                if (!e.features || e.features.length === 0) return;
                const feature = e.features[0];
                // Clear previous selection if different
                if (prevSelectedRef.current) {
                    map.setFeatureState(prevSelectedRef.current, {
                        selected: false,
                    });
                }
                map.setFeatureState(feature, { selected: true });
                prevSelectedRef.current = feature;
                setSelectedFeature(feature);
            });

            // Clicking outside deselects the feature
            map.on("click", (e) => {
                const features = map.queryRenderedFeatures(e.point, {
                    layers: ["singapore-fill"],
                });
                if (!features.length && prevSelectedRef.current) {
                    map.setFeatureState(prevSelectedRef.current, {
                        selected: false,
                    });
                    prevSelectedRef.current = null;
                    setSelectedFeature(null);
                }
            });

            // Hovering over a feature will highlight it
            map.addInteraction("mouseenter", {
                type: "mouseenter",
                target: { layerId: "singapore-fill" },
                handler: ({ feature }) => {
                    map.setFeatureState(feature, { highlight: true });
                    map.getCanvas().style.cursor = "pointer";
                },
            });

            // Moving the mouse away from a feature will remove the highlight
            map.addInteraction("mouseleave", {
                type: "mouseleave",
                target: { layerId: "singapore-fill" },
                handler: ({ feature }) => {
                    map.setFeatureState(feature, { highlight: false });
                    map.getCanvas().style.cursor = "";
                    return false;
                },
            });
        });

        // Cleanup on unmount
        return () => map.remove();
    }, []);

    return (
        <div style={{ position: "relative", width: "100%", height: "100vh" }}>
            <div
                ref={mapContainerRef}
                style={{ width: "100%", height: "100%" }}
            />
            {selectedFeature && (
                <div
                    style={{
                        position: "absolute",
                        right: 10,
                        top: 10,
                        width: "230px",
                        padding: "10px",
                        background: "#fff",
                        borderRadius: "3px",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                        fontFamily: "sans-serif",
                        fontSize: "12px",
                        lineHeight: "20px",
                    }}
                >
                    <h3>{selectedFeature.properties.Name}</h3>
                    <hr />
                    <ul style={{ padding: 0, listStyle: "none" }}>
                        {Object.entries(selectedFeature.properties).map(
                            ([key, value]) => (
                                <li key={key}>
                                    <strong>{key}</strong>: {value.toString()}
                                </li>
                            )
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MapComponent;
