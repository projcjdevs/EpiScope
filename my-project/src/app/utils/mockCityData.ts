// Create: src/app/utils/mockCityData.ts

export interface CityData {
  cityName: string;
  population: string;
  coordinates: [number, number];
  diseases: {
    [key: string]: {
      totalCases: number;
      deaths: number;
      recovered: number;
      active: number;
      monthlyData: {
        month: string;
        cases: number;
        deaths: number;
        recovered: number;
      }[];
    };
  };
}

const generateMonthlyData = (baseValue: number) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map(month => {
    const cases = Math.floor(baseValue * (0.5 + Math.random()));
    const deaths = Math.floor(cases * (0.02 + Math.random() * 0.05));
    const recovered = Math.floor(cases * (0.7 + Math.random() * 0.2));
    
    return {
      month,
      cases,
      deaths,
      recovered
    };
  });
};

export const generateCityData = (cityName: string, population: string, coordinates: [number, number]): CityData => {
  const diseases = ['Dengue', 'COVID-19', 'Tuberculosis', 'Malaria', 'Typhoid'];
  
  const diseaseData: { [key: string]: any } = {};
  
  diseases.forEach(disease => {
    const totalCases = Math.floor(1000 + Math.random() * 5000);
    const deaths = Math.floor(totalCases * (0.02 + Math.random() * 0.05));
    const recovered = Math.floor(totalCases * (0.7 + Math.random() * 0.2));
    const active = totalCases - deaths - recovered;
    
    diseaseData[disease] = {
      totalCases,
      deaths,
      recovered,
      active: Math.max(0, active),
      monthlyData: generateMonthlyData(totalCases / 12)
    };
  });

  return {
    cityName,
    population,
    coordinates,
    diseases: diseaseData
  };
};