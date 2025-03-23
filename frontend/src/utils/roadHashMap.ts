import { Feature, FeatureCollection } from "geojson";
import singaporeRoads from "../data/singapore-roads-classified-correct.json";

export function getRoadNameMap(): Map<string, Feature> {
    const map = new Map<string, Feature>();
    (singaporeRoads as FeatureCollection).features.forEach((feature) => {
        const roadName = feature.properties?.final_name;
        if (roadName) {
            map.set(roadName.toUpperCase(), feature);
        }
    });
    return map;
}
