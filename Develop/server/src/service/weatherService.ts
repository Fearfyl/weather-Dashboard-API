import dotenv from 'dotenv';
dotenv.config();

// TODO: Define an interface for the Coordinates object
interface Coordinates {
  latitude: number;
  longitude: number;
}
// TODO: Define a class for the Weather object
class Weather {
  constructor(
    public city: string,
    public date: string,
    public temperature: number,
    public humidity: number,
    public windSpeed: number,
    public uvIndex: number,
    public weatherIcon: string
  ) {}
}
// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL = 'https://api.openweathermap.org/data/2.5/';
  private apiKey = process.env.WEATHER_API_KEY;
  private cityName!: string;

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const response = await fetch(`${this.baseURL}geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`);
    const data = await response.json();
    if (!data.length) {
      throw new Error('Location not found');
    }
    const { lat, lon } = data[0];
    return { latitude: lat, longitude: lon };
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData;
    return { latitude: lat, longitude: lon };
  }
  
  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return `q=${this.cityName}`;
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `lat=${coordinates.latitude}&lon=${coordinates.longitude}`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const query = this.buildGeocodeQuery();
    const locationData = await this.fetchLocationData(query);
    return this.destructureLocationData(locationData);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const query = this.buildWeatherQuery(coordinates);
    const response = await fetch(`${this.baseURL}onecall?${query}&exclude=minutely,hourly&appid=${this.apiKey}`);
    return await response.json();
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    const { current } = response;
    const { temp, humidity, wind_speed, uvi, weather } = current;
    const { icon } = weather[0];
    return new Weather(this.cityName, new Date().toLocaleDateString(), temp, humidity, wind_speed, uvi, icon);
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecastArray: Weather[] = [currentWeather];
    for (const day of weatherData) {
      const { temp, humidity, wind_speed, uvi, weather, dt } = day;
      const { icon } = weather[0];
      const date = new Date(dt * 1000).toLocaleDateString();
      forecastArray.push(new Weather(this.cityName, date, temp.day, humidity, wind_speed, uvi, icon));
    }
    return forecastArray;
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather[]> {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    const currentWeather = this.parseCurrentWeather(weatherData);
    const forecastArray = this.buildForecastArray(currentWeather, weatherData.daily);
    return forecastArray;
  }

}

export default new WeatherService();
