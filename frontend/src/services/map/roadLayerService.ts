import { Map } from "mapbox-gl";

/**
 * Updates the feature state for specific road names based on the `final_name` property.
 * @param map - The Mapbox map instance.
 * @param roadNames - An array of road names to highlight.
 */
export const updateRoadFeatureState = (map: Map, roadNames: string[]) => {
    // Reset all features to default state
    const allFeatures = map.querySourceFeatures("singapore-road");
    allFeatures.forEach((feature) => {
        map.setFeatureState(
            { source: "singapore-road", id: feature.id },
            { road_state: 0 } // Default state
        );
    });

    // Highlight the specified road names by matching `final_name`
    roadNames.forEach((roadName) => {
        const matchingFeatures = allFeatures.filter(
            (feature) => feature.properties?.final_name === roadName
        );

        matchingFeatures.forEach((feature) => {
            map.setFeatureState(
                { source: "singapore-road", id: feature.id },
                { road_state: 1 } // Highlighted state
            );
        });
    });
};
