const fs = require('fs').promises;

// TODO: Define a City class with name and id properties
class City {
  constructor(public id: string, public name: string) {}
}

// TODO: Complete the HistoryService class
class HistoryService {
  // TODO: Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile('/Users/wadebuchanan/bootcamp/weather-Dashboard-API/Develop/server/src/service/searchHistory.json', 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading search history:', error);
      return [];
    }
  }

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    try {
      await fs.writeFile('/Users/wadebuchanan/bootcamp/weather-Dashboard-API/Develop/server/src/service/searchHistory.json', JSON.stringify(cities));
    } catch (error) {
      console.error('Error writing search history:', error);
    }
  }

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return this.read();
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const cities = await this.read();
    const id = cities.length.toString();
    cities.push(new City(id, city));
    await this.write(cities);
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const cities = await this.read();
    const updatedCities = cities.filter(city => city.id !== id);
    await this.write(updatedCities);
  }

}

export default new HistoryService();
