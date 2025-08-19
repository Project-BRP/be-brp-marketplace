export interface IRajaOngkirResponse<T> {
  meta: {
    message: string;
    code: number;
    status: string;
  };
  data: T;
}

export interface IProvince {
  id: number;
  name: string;
}

export interface ICity {
  id: number;
  name: string;
  zip_code: string;
}

export interface IDistrict {
  id: number;
  name: string;
  zip_code: string;
}

export interface ISubDistrict {
  id: number;
  name: string;
  zip_code: string;
}

export interface ICostCheckPayload {
  origin: string;
  destination: string;
  weight: number;
  courier: string;
}

export interface IShippingOption {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

export interface IGetCitiesRequest {
  provinceId: number;
}

export interface IGetDistrictsRequest {
  provinceId: number;
  cityId: number;
}

export interface IGetSubDistrictsRequest {
  provinceId: number;
  cityId: number;
  districtId: number;
}

export interface ICheckCostRequest {
  destinationProvince: number;
  destinationCity: number;
  destinationDistrict: number;
  destinationSubDistrict: number;
  weight_in_kg: number;
}

export interface ICheckCostResponse {
  shippingOptions: IShippingOption[];
}
