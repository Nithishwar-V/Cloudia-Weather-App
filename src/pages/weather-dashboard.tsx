import CurrentWeather from "@/components/current-weather";
import HourlyTemperature from "@/components/hourly-temperature";
import WeatherSkeleton from "@/components/loading-skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import WeatherDetails from "@/components/weather-details";
import WeatherForecast from "@/components/weather-forecast";
import { useTheme } from "@/context/theme-provider";
import { useGeolocation } from "@/hooks/use-geolocation";
import {
  useForecastQuery,
  useReverseGeocodeQuery,
  useWeatherQuery,
} from "@/hooks/use-weather";
import { AlertTriangle, MapPin, RefreshCw } from "lucide-react";

const WeatherDashboard = () => {
  const {
    coordinates,
    error: locationError,
    getLocation,
    isLoading: locationLoading,
  } = useGeolocation();

  const weatherQuery = useWeatherQuery(coordinates);
  const forecastQuery = useForecastQuery(coordinates);
  const locationQuery = useReverseGeocodeQuery(coordinates);

  console.log(weatherQuery.data);

  const { theme } = useTheme();
  const isDark = theme === "dark";

  const handleRefresh = () => {
    getLocation();
    if (coordinates) {
      weatherQuery.refetch();
      forecastQuery.refetch();
      locationQuery.refetch();
    }
  };

  if (locationLoading) {
    return <WeatherSkeleton />;
  }

  if (locationError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Location Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>{locationError}</p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!coordinates) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Location Required</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Please enable your location to see your local weather.</p>
          <Button onClick={getLocation} variant={"outline"} className="w-fit">
            <MapPin className="mr-2 h-4 w-4" />
            Enable Location
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const locationName = locationQuery.data?.[0];

  if (weatherQuery.error || forecastQuery.error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="flex flex-col gap-4">
          <p>Failed to fetch weather data. Please try again.</p>
          <Button onClick={handleRefresh} variant={"outline"} className="w-fit">
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (!weatherQuery.data || !forecastQuery.data) {
    return <WeatherSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* FavCities */}
      <div className="flex items-center justify-between px-2 py-2 lg:px-16 lg:py-8">
        <h1 className="text-xl font-bold tracking-tight">My Location</h1>
        <Button
          variant={"outline"}
          size={"icon"}
          onClick={handleRefresh}
          disabled={weatherQuery.isFetching || forecastQuery.isFetching}
        >
          <RefreshCw
            className={`h-4 w-4 ${
              weatherQuery.isFetching ? "animate-spin" : " "
            }`}
          />
        </Button>
      </div>

      <div className="grid gap-8">
        {/* Current Weather Section */}
        <div className="grid lg:grid-cols-2 gap-8 items-center lg:min-h-[500px]">
          <div className="max-w-full  px-2 py-2 lg:px-16 lg:py-8">
            <CurrentWeather
              data={weatherQuery.data}
              locationName={locationName}
            />
          </div>
          <div className="hidden md:block max-w-full lg:px-32 lg:py-8">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center lg:text-left">
              Current Weather
            </h1>
            <p
              className={`text-base md:text-lg mt-2 text-center md:text-left max-w-prose mx-auto lg:mx-0 ${
                isDark ? "text-gray-400" : "text-gray-800"
              }`}
            >
              Stay informed with real-time updates on current weather
              conditions, including temperature, humidity, wind speed, and
              overall weather outlook. Perfect for planning your day based on
              accurate and up-to-date information.
            </p>
          </div>
        </div>

        {/* Hourly Temperature Section */}
        <div className="grid lg:grid-cols-2 gap-8 items-center lg:min-h-[500px]">
          <div className="hidden md:block max-w-full lg:px-32 lg:py-8">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center lg:text-left">
              Hourly Temperature
            </h1>
            <p
              className={`text-base md:text-lg mt-2 text-center md:text-left max-w-prose mx-auto lg:mx-0 ${
                isDark ? "text-gray-400" : "text-gray-800"
              }`}
            >
              Monitor the temperature changes hour by hour with detailed
              graphical insights. Stay prepared for any shifts in weather,
              ensuring that you can adapt your plans effectively and stay
              comfortable throughout the day.
            </p>
          </div>
          <div className="max-w-full px-2 py-2 lg:px-16 lg:py-8">
            <HourlyTemperature data={forecastQuery.data} />
          </div>
        </div>

        {/* Weather Details Section */}
        <div className="grid lg:grid-cols-2 gap-8 items-center lg:min-h-[500px]">
          <div className="max-w-full px-2 py-2 lg:px-16 lg:py-8">
            <WeatherDetails data={weatherQuery.data} />
          </div>
          <div className="hidden md:block max-w-full lg:px-32 lg:py-8">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center md:text-left">
              Weather Details
            </h1>
            <p
              className={`text-base md:text-lg mt-2 text-center md:text-left max-w-prose mx-auto lg:mx-0 ${
                isDark ? "text-gray-400" : "text-gray-800"
              }`}
            >
              Gain a deeper understanding of the weather with detailed metrics,
              including sunrise and sunset times, wind direction, pressure
              levels, and more. Dive into atmospheric conditions to better
              interpret the environment around you.
            </p>
          </div>
        </div>

        {/* Weather Forecast Section */}
        <div className="grid lg:grid-cols-2 gap-8 items-center lg:min-h-[500px]">
          <div className="hidden md:block max-w-full lg:px-32 lg:py-8">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-center md:text-left">
              Weather Forecast
            </h1>
            <p
              className={`text-base md:text-lg mt-2 text-center md:text-left max-w-prose mx-auto lg:mx-0 ${
                isDark ? "text-gray-400" : "text-gray-800"
              }`}
            >
              Plan your week with confidence using an extended 5-day forecast.
              Analyze upcoming temperature trends, weather patterns, and
              essential metrics, ensuring you stay prepared for both daily and
              long-term weather changes.
            </p>
          </div>
          <div className="max-w-full px-2 py-2 lg:px-16 lg:py-8">
            <WeatherForecast data={forecastQuery.data} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherDashboard;
