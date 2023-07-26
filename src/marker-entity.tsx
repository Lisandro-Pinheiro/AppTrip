export interface MarkerEntity {
    id: string;
    coords: {latitude: number, longitude: number};
    imagePath: string;
    title: string;
    description: string;
    photoDate: string;
  }