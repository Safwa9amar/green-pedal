const ORS_API_KEY =
  "eyJvcmciOiI1YjNjZTM1OTc4NTExMTAwMDFjZjYyNDgiLCJpZCI6IjE4ZWFkYTgwZTk3YzRjY2Y4YzE4NTk2MGQzNGU0YTM2IiwiaCI6Im11cm11cjY0In0=";

export async function fetchRouteORS(
  start: { latitude: number; longitude: number },
  end: { latitude: number; longitude: number },
  profile: string
) {
  try {
    // Use GET method and build the URL with start and end
    const url =
      `https://api.openrouteservice.org/v2/directions/${profile}?api_key=${process.env.EXPO_PUBLIC_ORS_API_KEY}` +
      `&start=${start.longitude},${start.latitude}` +
      `&end=${end.longitude},${end.latitude}`;

    const response = await fetch(url, {
      method: "GET",
    });
    if (!response.ok) throw new Error("Failed to fetch route");
    const data: OrsResponse = await response.json();
    // GeoJSON LineString coordinates: [lng, lat]
    const coords = data.features[0].geometry.coordinates.map(
      ([lng, lat]: [number, number]) => ({ latitude: lat, longitude: lng })
    );
    console.log(data.features[0].properties);

    return coords;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export enum RouteProfile {
  "driving-car",
  "driving-hgv",
  "cycling-regular",
  "cycling-road",
  "cycling-mountain",
  "cycling-electric",
}
// OpenRouteService API response type for directions
export interface OrsResponse {
  type: "FeatureCollection";
  bbox: number[];
  features: Array<{
    bbox: number[];
    type: "Feature";
    properties: {
      segments: Array<{
        distance: number;
        duration: number;
        steps: any[];
      }>;
      summary: {
        distance: number;
        duration: number;
      };
      way_points: number[];
    };
    geometry: {
      coordinates: [number, number][];
      type: "LineString";
    };
  }>;
  metadata: {
    attribution: string;
    service: string;
    timestamp: number;
    query: {
      coordinates: [number, number][];
      profile: string;
      profileName: string;
      format: string;
    };
    engine: {
      version: string;
      build_date: string;
      graph_date: string;
      osm_date: string;
    };
  };
}
