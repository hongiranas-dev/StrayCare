export interface Zone {
  id: string;
  name: string;
  population: number;
  density: number;
  neuteredPercentage: number;
}

export const zoneData: Zone[] = [
  { id: "yelahanka", name: "Yelahanka", population: 280000, density: 580, neuteredPercentage: 58 },
  { id: "whitefield", name: "Whitefield", population: 200000, density: 510, neuteredPercentage: 65 },
  { id: "koramangala", name: "Koramangala", population: 150000, density: 720, neuteredPercentage: 78 },
  { id: "indiranagar", name: "Indiranagar", population: 120000, density: 680, neuteredPercentage: 82 },
  { id: "hsr-layout", name: "HSR Layout", population: 180000, density: 540, neuteredPercentage: 71 },
  { id: "jayanagar", name: "Jayanagar", population: 220000, density: 460, neuteredPercentage: 75 },
  { id: "marathahalli", name: "Marathahalli", population: 160000, density: 850, neuteredPercentage: 62 },
  { id: "electronic-city", name: "Electronic City", population: 250000, density: 290, neuteredPercentage: 55 },
];
