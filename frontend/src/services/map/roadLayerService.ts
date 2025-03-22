import { Map } from "mapbox-gl";
import { RoadWorkEvent } from "../../types/backend";

/**
 * Highlight roads with road works by overlaying a new GeoJSON layer
 * @param map - Mapbox GL map instance
 * @param roadWorks - Array of road work events
 * @param singaporeRoadGeoJSON - The full base road geometry dataset
 */
export const highlightRoadWorks = (
    map: Map,
    roadWorks: RoadWorkEvent[],
    singaporeRoadGeoJSON: GeoJSON.FeatureCollection
) => {
    const roadNamesToHighlight = new Set(roadWorks.map((rw) => rw.road_name));

    const matchingFeatures = singaporeRoadGeoJSON.features.filter((feature) => {
        const finalName = feature.properties?.final_name;
        return finalName && roadNamesToHighlight.has(finalName);
    });

    const highlightGeoJSON: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: matchingFeatures,
    };

    // Clean up old layer/source if they exist
    if (map.getLayer("road-works-highlight")) {
        map.removeLayer("road-works-highlight");
    }
    if (map.getSource("road-works-highlight")) {
        map.removeSource("road-works-highlight");
    }

    map.addSource("road-works-highlight", {
        type: "geojson",
        data: highlightGeoJSON,
    });

    map.addLayer({
        id: "road-works-highlight",
        type: "line",
        source: "road-works-highlight",
        paint: {
            "line-color": "#FF5733",
            "line-width": 4,
        },
    });
};
