export interface MaterialItem {
  name: string;
  price: number;
}

export interface FurnitureMaterials {
  materials: MaterialItem[];
  finishes: MaterialItem[];
  hardware: MaterialItem[];
}

export interface SignageMaterials {
  frames: MaterialItem[];
  faces: MaterialItem[];
}

export interface AllMaterials {
  furniture: FurnitureMaterials;
  signage: SignageMaterials;
}

export interface CostItem {
  name: string;
  value: number;
  details?: string;
}

export interface CostBreakdown {
  materialCost: CostItem;
  hardwareCost: CostItem;
  laborCost: CostItem;
  totalCost: number;
  profitMargin: number;
  finalPrice: number;
}

export interface FurnitureParams {
  name: string;
  length: number;
  width: number;
  height: number;
  material: string;
  materialPrice: number;
  finish: string;
  finishPrice: number;
  hardware: { name: string; quantity: number; price: number }[];
  laborHours: number;
  laborRate: number;
  profitMargin: number;
}

export interface SignageParams {
    name: string;
    width: number;
    height: number;
    signType: string;
    frameMaterial: string;
    framePrice: number; // per meter
    faceMaterial: string;
    facePrice: number; // per sq meter
    lighting: boolean;
    lightingCost: number; // total
    laborHours: number;
    laborRate: number;
    profitMargin: number;
}

export interface AiFurnitureSuggestion {
    productName: string;
    material: string;
    finish: string;
    dimensions: {
        length: number;
        width: number;
        height: number;
    };
    hardware: {
        name: string;
        quantity: number;
    }[];
}
