import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Location from "expo-location";
import Skeleton from "react-native-reanimated-skeleton";
interface WeatherData {
  main?: { temp?: number };
  weather?: { main?: string; icon?: string }[];
  name?: string;
}

const getWeatherIcon = (main: string | undefined) => {
  // Map weather main status to gif
  switch ((main || "").toLowerCase()) {
    case "clear":
      return require("@/assets/images/gif/sun.gif");
    case "clouds":
      return require("@/assets/images/gif/cloudy.gif");
    case "rain":
    case "drizzle":
      return require("@/assets/images/gif/rain.gif");
    case "thunderstorm":
      return require("@/assets/images/gif/weather.gif");
    case "snow":
      return require("@/assets/images/gif/cloud.gif");
    case "mist":
    case "fog":
    case "haze":
    case "smoke":
      return require("@/assets/images/gif/wind.gif");
    case "night":
      return require("@/assets/images/gif/night.gif");
    default:
      return require("@/assets/images/gif/cloudy.gif");
  }
};

const getFormattedDate = () => {
  const now = new Date();
  const options = { day: "numeric", month: "long", weekday: "long" } as const;
  return now.toLocaleDateString(undefined, options);
};

const WeatherCard: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setError("Location permission denied");
          setLoading(false);
          Alert.alert(
            "Permission Denied",
            "Location permission is required to get weather data."
          );
          return;
        }
        let loc = await Location.getCurrentPositionAsync({});
        // Fetch weather
        const apiKey = process.env.EXPO_PUBLIC_WEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${loc.coords.latitude}&lon=${loc.coords.longitude}&appid=${apiKey}&units=metric`;
        const res = await fetch(url);
        const data = await res.json();
        setWeather(data);
      } catch (e) {
        setError("Failed to get weather");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <Skeleton isLoading={true} containerStyle={styles.container}>
        <Text>Your content</Text>
        <Text>Other content</Text>
      </Skeleton>
    );
  }
  if (error) {
    return <Text style={{ color: "red", textAlign: "center" }}>{error}</Text>;
  }
  if (!weather) return null;

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={getWeatherIcon(weather.weather?.[0]?.main)}
          style={styles.weatherIcon}
        />
        <View>
          <Text style={styles.weatherTemp}>
            {Math.round(weather.main?.temp ?? 0)}°{" "}
            <Text style={styles.weatherDesc}>
              {weather.weather?.[0]?.main || "Cloudly"}
            </Text>
          </Text>
          <Text style={styles.weatherLoc}>
            {weather.name || "Current Location"}
          </Text>
        </View>
      </View>
      <View style={styles.weatherDateWrap}>
        <Text style={styles.weatherDate}>{getFormattedDate()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 32,
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: "#fff",

    // // 🌗 Shadow for iOS
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.2,
    // shadowRadius: 6,

    // // 🌑 Elevation for Android
    // elevation: 6,
  },

  weatherIcon: {
    width: 64,
    height: 64,
    marginRight: 18,
    borderRadius: 20,
  },
  weatherTemp: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#231942",
  },
  weatherDesc: {
    fontSize: 20,
    fontWeight: "400",
    color: "#231942",
  },
  weatherLoc: {
    fontSize: 18,
    color: "#231942",
    marginTop: 2,
  },
  weatherDateWrap: {
    marginTop: 18,
    backgroundColor: "rgba(255,255,255,0.5)",
    borderRadius: 20,
    padding: 10,
  },
  weatherDate: {
    fontSize: 18,
    color: "#231942",
    fontWeight: "500",
  },
});

export default WeatherCard;
