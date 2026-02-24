export const CAR_MAKES = [
  "Toyota",
  "Hyundai",
  "Ford",
  "Mercedes-Benz",
  "BMW",
  "Nissan",
  "Kia",
];

export const CAR_MODELS: { [key: string]: string[] } = {
  Toyota: ["Camry", "Corolla", "Land Cruiser", "Hilux", "RAV4"],
  Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Accent"],
  Ford: ["Explorer", "Taurus", "Expedition", "F-150"],
  "Mercedes-Benz": ["C-Class", "E-Class", "S-Class", "G-Class"],
  BMW: ["3 Series", "5 Series", "7 Series", "X5", "X7"],
  Nissan: ["Sunny", "Patrol", "Altima", "Maxima"],
  Kia: ["Cerato", "Optima", "Sportage", "Sorento"],
};

export const CAR_YEARS = Array.from(
  { length: new Date().getFullYear() - 1989 },
  (_, i) => new Date().getFullYear() - i
);

export const CAR_FEATURES = [
    "Sunroof",
    "Leather Seats",
    "Navigation System",
    "Backup Camera",
    "Bluetooth",
    "Alloy Wheels",
    "4x4",
    "Cruise Control"
];
