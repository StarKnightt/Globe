import { MarkerData } from '@/components/globe/createMarkers';

export interface CityLocation {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  population?: number;
  isCapital?: boolean;
}

export const worldCities: CityLocation[] = [
  // North America
  {
    id: '1',
    name: 'New York',
    country: 'United States',
    latitude: 40.7128,
    longitude: -74.0060,
    population: 8336817,
    isCapital: false
  },
  {
    id: '2',
    name: 'Los Angeles',
    country: 'United States',
    latitude: 34.0522,
    longitude: -118.2437,
    population: 3898747,
    isCapital: false
  },
  {
    id: '3',
    name: 'Toronto',
    country: 'Canada',
    latitude: 43.6532,
    longitude: -79.3832,
    population: 2731571,
    isCapital: false
  },
  {
    id: '4',
    name: 'Mexico City',
    country: 'Mexico',
    latitude: 19.4326,
    longitude: -99.1332,
    population: 9209944,
    isCapital: true
  },
  
  // South America
  {
    id: '5',
    name: 'São Paulo',
    country: 'Brazil',
    latitude: -23.5505,
    longitude: -46.6333,
    population: 12325232,
    isCapital: false
  },
  {
    id: '6',
    name: 'Buenos Aires',
    country: 'Argentina',
    latitude: -34.6118,
    longitude: -58.3960,
    population: 2890151,
    isCapital: true
  },
  {
    id: '7',
    name: 'Lima',
    country: 'Peru',
    latitude: -12.0464,
    longitude: -77.0428,
    population: 10092000,
    isCapital: true
  },
  
  // Europe
  {
    id: '8',
    name: 'London',
    country: 'United Kingdom',
    latitude: 51.5074,
    longitude: -0.1278,
    population: 8982000,
    isCapital: true
  },
  {
    id: '9',
    name: 'Paris',
    country: 'France',
    latitude: 48.8566,
    longitude: 2.3522,
    population: 2165423,
    isCapital: true
  },
  {
    id: '10',
    name: 'Berlin',
    country: 'Germany',
    latitude: 52.5200,
    longitude: 13.4050,
    population: 3669491,
    isCapital: true
  },
  {
    id: '11',
    name: 'Rome',
    country: 'Italy',
    latitude: 41.9028,
    longitude: 12.4964,
    population: 2872800,
    isCapital: true
  },
  {
    id: '12',
    name: 'Madrid',
    country: 'Spain',
    latitude: 40.4168,
    longitude: -3.7038,
    population: 3223334,
    isCapital: true
  },
  {
    id: '13',
    name: 'Amsterdam',
    country: 'Netherlands',
    latitude: 52.3676,
    longitude: 4.9041,
    population: 873338,
    isCapital: true
  },
  {
    id: '14',
    name: 'Stockholm',
    country: 'Sweden',
    latitude: 59.3293,
    longitude: 18.0686,
    population: 975551,
    isCapital: true
  },
  {
    id: '15',
    name: 'Moscow',
    country: 'Russia',
    latitude: 55.7558,
    longitude: 37.6176,
    population: 12615279,
    isCapital: true
  },
  
  // Asia
  {
    id: '16',
    name: 'Tokyo',
    country: 'Japan',
    latitude: 35.6762,
    longitude: 139.6503,
    population: 37732000,
    isCapital: true
  },
  {
    id: '17',
    name: 'Beijing',
    country: 'China',
    latitude: 39.9042,
    longitude: 116.4074,
    population: 21542000,
    isCapital: true
  },
  {
    id: '18',
    name: 'Shanghai',
    country: 'China',
    latitude: 31.2304,
    longitude: 121.4737,
    population: 27058000,
    isCapital: false
  },
  {
    id: '19',
    name: 'Mumbai',
    country: 'India',
    latitude: 19.0760,
    longitude: 72.8777,
    population: 20411000,
    isCapital: false
  },
  {
    id: '20',
    name: 'Delhi',
    country: 'India',
    latitude: 28.7041,
    longitude: 77.1025,
    population: 32226000,
    isCapital: true
  },
  {
    id: '21',
    name: 'Seoul',
    country: 'South Korea',
    latitude: 37.5665,
    longitude: 126.9780,
    population: 9733509,
    isCapital: true
  },
  {
    id: '22',
    name: 'Bangkok',
    country: 'Thailand',
    latitude: 13.7563,
    longitude: 100.5018,
    population: 10539000,
    isCapital: true
  },
  {
    id: '23',
    name: 'Singapore',
    country: 'Singapore',
    latitude: 1.3521,
    longitude: 103.8198,
    population: 5685807,
    isCapital: true
  },
  {
    id: '24',
    name: 'Dubai',
    country: 'UAE',
    latitude: 25.2048,
    longitude: 55.2708,
    population: 3331420,
    isCapital: false
  },
  
  // Africa
  {
    id: '25',
    name: 'Cairo',
    country: 'Egypt',
    latitude: 30.0444,
    longitude: 31.2357,
    population: 20484965,
    isCapital: true
  },
  {
    id: '26',
    name: 'Lagos',
    country: 'Nigeria',
    latitude: 6.5244,
    longitude: 3.3792,
    population: 15387639,
    isCapital: false
  },
  {
    id: '27',
    name: 'Cape Town',
    country: 'South Africa',
    latitude: -33.9249,
    longitude: 18.4241,
    population: 4618000,
    isCapital: false
  },
  {
    id: '28',
    name: 'Nairobi',
    country: 'Kenya',
    latitude: -1.2921,
    longitude: 36.8219,
    population: 4922000,
    isCapital: true
  },
  
  // Oceania
  {
    id: '29',
    name: 'Sydney',
    country: 'Australia',
    latitude: -33.8688,
    longitude: 151.2093,
    population: 5312163,
    isCapital: false
  },
  {
    id: '30',
    name: 'Melbourne',
    country: 'Australia',
    latitude: -37.8136,
    longitude: 144.9631,
    population: 5159211,
    isCapital: false
  },
  {
    id: '31',
    name: 'Auckland',
    country: 'New Zealand',
    latitude: -36.8485,
    longitude: 174.7633,
    population: 1695200,
    isCapital: false
  }
];