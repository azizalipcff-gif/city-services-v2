export interface City {
  id: string;
  name: string;
  nameAr: string;
  region: string;
  regionAr: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  neighborhoods?: string[];
  businessCount?: number;
}

export const moroccanCities: City[] = [
  {
    id: 'oujda',
    name: 'Oujda',
    nameAr: 'وجدة',
    region: 'Oriental',
    regionAr: 'الشرق',
    coordinates: { lat: 34.6867, lng: -1.9086 },
    neighborhoods: ['Centre Ville', 'Hay Al Qods', 'Hay Al Mohammadi', 'Lahdara', 'Sidi Yahya', 'Al Qods', 'Nouvelle Ville', 'Bni Drar', 'Sidi Bouabid'],
    businessCount: 0
  },
  {
    id: 'casablanca',
    name: 'Casablanca',
    nameAr: 'الدار البيضاء',
    region: 'Grand Casablanca',
    regionAr: 'الدار البيضاء الكبرى',
    coordinates: { lat: 33.5731, lng: -7.5898 },
    neighborhoods: ['Centre Ville', 'Maarif', 'Habbous', 'Ain Sebaa', 'Sidi Maârouf', 'Mohammedia', 'Roches Noires', 'Anfa', 'Derb Sultan', 'Hay Hassani'],
    businessCount: 0
  },
  {
    id: 'rabat',
    name: 'Rabat',
    nameAr: 'الرباط',
    region: 'Rabat-Salé-Kénitra',
    regionAr: 'الرباط-سلا-القنيطرة',
    coordinates: { lat: 34.0209, lng: -6.8416 },
    neighborhoods: ['Centre Ville', 'Agdal', 'Hay Riad', 'Souissi', 'Hassan', 'Yacoub Al Mansour', 'Takadoum', 'Youssoufia'],
    businessCount: 0
  },
  {
    id: 'fes',
    name: 'Fes',
    nameAr: 'فاس',
    region: 'Fès-Meknès',
    regionAr: 'فاس-مكناس',
    coordinates: { lat: 34.0181, lng: -5.0078 },
    neighborhoods: ['Fes El Bali', 'Ville Nouvelle', 'Agdal', 'Jnan Sbil', 'Ziat', 'Sidi Brahim', 'Merhras'],
    businessCount: 0
  },
  {
    id: 'marrakech',
    name: 'Marrakech',
    nameAr: 'مراكش',
    region: 'Marrakech-Safi',
    regionAr: 'مراكش-آسفي',
    coordinates: { lat: 31.6295, lng: -7.9811 },
    neighborhoods: ['Medina', 'Gueliz', 'Hivernage', 'Menara', 'Agdal', 'Sidi Youssef', 'Mhamid'],
    businessCount: 0
  },
  {
    id: 'tangier',
    name: 'Tangier',
    nameAr: 'طنجة',
    region: 'Tanger-Tétouan-Al Hoceima',
    regionAr: 'طنجة-تطوان-الحسيمة',
    coordinates: { lat: 35.7595, lng: -5.8340 },
    neighborhoods: ['Centre Ville', 'Malabata', 'Bni Makada', 'Sidi Kacem', 'Sidi Bouabid', 'Moghogha'],
    businessCount: 0
  },
  {
    id: 'agadir',
    name: 'Agadir',
    nameAr: 'أكادير',
    region: 'Souss-Massa',
    regionAr: 'سوس ماسة',
    coordinates: { lat: 30.4278, lng: -9.5981 },
    neighborhoods: ['Centre Ville', 'Talborjt', 'Al Houara', 'Secteur 1', 'Secteur 2', 'Secteur 3', 'Secteur 4'],
    businessCount: 0
  },
  {
    id: 'meknes',
    name: 'Meknes',
    nameAr: 'مكناس',
    region: 'Fès-Meknès',
    regionAr: 'فاس-مكناس',
    coordinates: { lat: 33.8815, lng: -5.5355 },
    neighborhoods: ['Centre Ville', 'Hamria', 'El Menzeh', 'Boufekrane', 'Sidi Baba'],
    businessCount: 0
  },
  {
    id: 'nador',
    name: 'Nador',
    nameAr: 'الناظور',
    region: 'Oriental',
    regionAr: 'الشرق',
    coordinates: { lat: 35.1679, lng: -2.9347 },
    neighborhoods: ['Centre Ville', 'Ari', 'Selouane', 'Kariat Arekmane', 'Beni Ansar'],
    businessCount: 0
  },
  {
    id: 'berkane',
    name: 'Berkane',
    nameAr: 'بركان',
    region: 'Oriental',
    regionAr: 'الشرق',
    coordinates: { lat: 34.9199, lng: -2.3167 },
    neighborhoods: ['Centre Ville', 'Sidi Slimane', 'Ain Reggada', 'Ahfir'],
    businessCount: 0
  },
  {
    id: 'tetouan',
    name: 'Tetouan',
    nameAr: 'تطوان',
    region: 'Tanger-Tétouan-Al Hoceima',
    regionAr: 'طنجة-تطوان-الحسيمة',
    coordinates: { lat: 35.5889, lng: -5.3324 },
    neighborhoods: ['Centre Ville', 'Martil', 'Mdiq', 'Fnideq', 'Bni Ider'],
    businessCount: 0
  },
  {
    id: 'el_jadida',
    name: 'El Jadida',
    nameAr: 'الجديدة',
    region: 'Casablanca-Settat',
    regionAr: 'الدار البيضاء-سطات',
    coordinates: { lat: 33.2316, lng: -8.4373 },
    neighborhoods: ['Centre Ville', 'Sidi Boulfdayl', 'El Haouzia', 'Mazagan'],
    businessCount: 0
  },
  {
    id: 'kenitra',
    name: 'Kenitra',
    nameAr: 'القنيطرة',
    region: 'Rabat-Salé-Kénitra',
    regionAr: 'الرباط-سلا-القنيطرة',
    coordinates: { lat: 34.2610, lng: -6.5802 },
    neighborhoods: ['Centre Ville', 'Mnasra', 'Sidi Yahya', 'Chmaou'],
    businessCount: 0
  },
  {
    id: 'sale',
    name: 'Salé',
    nameAr: 'سلا',
    region: 'Rabat-Salé-Kénitra',
    regionAr: 'الرباط-سلا-القنيطرة',
    coordinates: { lat: 34.0531, lng: -6.7959 },
    neighborhoods: ['Centre Ville', 'Tabriquet', 'Hassan', 'Sidi Bouknadel', 'Sidi Moussa'],
    businessCount: 0
  },
  {
    id: 'temara',
    name: 'Temara',
    nameAr: 'تمارة',
    region: 'Rabat-Salé-Kénitra',
    regionAr: 'الرباط-سلا-القنيطرة',
    coordinates: { lat: 33.9255, lng: -6.9118 },
    neighborhoods: ['Centre Ville', 'Skhirat', 'Harhoura'],
    businessCount: 0
  },
  {
    id: 'safi',
    name: 'Safi',
    nameAr: 'آسفي',
    region: 'Marrakech-Safi',
    regionAr: 'مراكش-آسفي',
    coordinates: { lat: 32.2994, lng: -9.2372 },
    neighborhoods: ['Centre Ville', 'Jawhara', 'Sidi Bouzekri', 'Massa'],
    businessCount: 0
  },
  {
    id: 'mohammedia',
    name: 'Mohammedia',
    nameAr: 'المحمدية',
    region: 'Grand Casablanca',
    regionAr: 'الدار البيضاء الكبرى',
    coordinates: { lat: 33.3008, lng: -7.3567 },
    neighborhoods: ['Centre Ville', 'El Mansouria', 'Sidi Moussa', 'Bni Yakhlef'],
    businessCount: 0
  },
  {
    id: 'khouribga',
    name: 'Khouribga',
    nameAr: 'خريبكة',
    region: 'Doukkala-Abda',
    regionAr: 'دكالة-عبدة',
    coordinates: { lat: 32.8831, lng: -8.8661 },
    neighborhoods: ['Centre Ville', 'Oued Zem', 'Boulanouare'],
    businessCount: 0
  },
  {
    id: 'beni_mellal',
    name: 'Beni Mellal',
    nameAr: 'بني ملال',
    region: 'Béni Mellal-Khénifra',
    regionAr: 'بني ملال-خنيفرة',
    coordinates: { lat: 32.3373, lng: -6.3498 },
    neighborhoods: ['Centre Ville', 'Kasba Tadla', 'Fquih Ben Salah'],
    businessCount: 0
  },
  {
    id: 'khemisset',
    name: 'Khemisset',
    nameAr: 'الخميسات',
    region: 'Béni Mellal-Khénifra',
    regionAr: 'بني ملال-خنيفرة',
    coordinates: { lat: 33.6881, lng: -7.3975 },
    neighborhoods: ['Centre Ville', 'Tiflet', 'Rommani'],
    businessCount: 0
  },
  {
    id: 'el_kelaa_des_sraghna',
    name: 'El Kelaa des Sraghna',
    nameAr: 'القلعة السراغنة',
    region: 'Marrakech-Safi',
    regionAr: 'مراكش-آسفي',
    coordinates: { lat: 32.0694, lng: -8.7528 },
    businessCount: 0
  },
  {
    id: 'errachidia',
    name: 'Errachidia',
    nameAr: 'الرشيدية',
    region: 'Marrakech-Safi',
    regionAr: 'مراكش-آسفي',
    coordinates: { lat: 31.9314, lng: -8.7675 },
    businessCount: 0
  },
  {
    id: 'ben_guerir',
    name: 'Ben Guerir',
    nameAr: 'بن قير',
    region: 'Béni Mellal-Khénifra',
    regionAr: 'بني ملال-خنيفرة',
    coordinates: { lat: 32.5703, lng: -7.3531 },
    businessCount: 0
  },
  {
    id: 'ouarzazate',
    name: 'Ouarzazate',
    nameAr: 'ورزازات',
    region: 'Souss-Massa',
    regionAr: 'سوس ماسة',
    coordinates: { lat: 30.9386, lng: -6.8986 },
    businessCount: 0
  },
  {
    id: 'tafraout',
    name: 'Tafraout',
    nameAr: 'تافراوت',
    region: 'Souss-Massa',
    regionAr: 'سوس ماسة',
    coordinates: { lat: 30.4233, lng: -9.1598 },
    businessCount: 0
  },
  {
    id: 'taroudant',
    name: 'Taroudant',
    nameAr: 'ترودانت',
    region: 'Souss-Massa',
    regionAr: 'سوس ماسة',
    coordinates: { lat: 30.4684, lng: -9.2003 },
    businessCount: 0
  },
  {
    id: 'youssoufia',
    name: 'Youssoufia',
    nameAr: 'يوسفية',
    region: 'Marrakech-Safi',
    regionAr: 'مراكش-آسفي',
    coordinates: { lat: 31.4614, lng: -9.2369 },
    businessCount: 0
  }
];

export const getCityById = (id: string): City | undefined => {
  return moroccanCities.find(city => city.id === id);
};

export const getCityByName = (name: string): City | undefined => {
  return moroccanCities.find(city => 
    city.name.toLowerCase() === name.toLowerCase() ||
    city.nameAr.toLowerCase() === name.toLowerCase()
  );
};

export const getCitiesByRegion = (region: string): City[] => {
  return moroccanCities.filter(city => 
    city.region.toLowerCase() === region.toLowerCase() ||
    city.regionAr.toLowerCase() === region.toLowerCase()
  );
};

export const getPopularCities = (): City[] => {
  return moroccanCities.slice(0, 12);
};
