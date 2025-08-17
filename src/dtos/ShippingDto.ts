export interface IProvince {
  id: number;
  province: string;
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
