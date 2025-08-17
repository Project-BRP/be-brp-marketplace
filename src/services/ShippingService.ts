import { StatusCodes } from 'http-status-codes';

import { IProvince, ICity, IDistrict, ISubDistrict } from '../dtos';
import { ResponseError } from '../error/ResponseError';
import { ShippingRepository } from '../repositories';
import { Validator } from '../utils';
import { ShippingValidation } from '../validations';
import {
  IGetCitiesRequest,
  IGetDistrictsRequest,
  IGetSubDistrictsRequest,
} from './../dtos/ShippingDto';

export class ShippingService {
  static async getProvinces(): Promise<IProvince[]> {
    const provinces = await ShippingRepository.getProvinces();

    return provinces;
  }

  static async getCities(request: IGetCitiesRequest): Promise<ICity[]> {
    const validData = Validator.validate(
      ShippingValidation.GET_CITIES,
      request,
    );

    const province = await ShippingRepository.getProvince(validData.provinceId);

    if (!province) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Provinsi tidak ditemukan',
      );
    }

    const cities = await ShippingRepository.getCities(province.id);

    return cities;
  }

  static async getDistricts(
    request: IGetDistrictsRequest,
  ): Promise<IDistrict[]> {
    const validData = Validator.validate(
      ShippingValidation.GET_DISTRICTS,
      request,
    );

    const province = await ShippingRepository.getProvince(validData.provinceId);

    if (!province) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Provinsi tidak ditemukan',
      );
    }

    const city = await ShippingRepository.getCity(
      province.id,
      validData.cityId,
    );

    if (!city) {
      throw new ResponseError(StatusCodes.NOT_FOUND, 'Kota tidak ditemukan');
    }

    const districts = await ShippingRepository.getDistricts(city.id);

    return districts;
  }

  static async getSubDistricts(
    request: IGetSubDistrictsRequest,
  ): Promise<ISubDistrict[]> {
    const validData = Validator.validate(
      ShippingValidation.GET_SUB_DISTRICTS,
      request,
    );

    const province = await ShippingRepository.getProvince(validData.provinceId);

    if (!province) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Provinsi tidak ditemukan',
      );
    }

    const city = await ShippingRepository.getCity(
      province.id,
      validData.cityId,
    );

    if (!city) {
      throw new ResponseError(StatusCodes.NOT_FOUND, 'Kota tidak ditemukan');
    }

    const district = await ShippingRepository.getDistrict(
      city.id,
      validData.districtId,
    );

    if (!district) {
      throw new ResponseError(
        StatusCodes.NOT_FOUND,
        'Kecamatan tidak ditemukan',
      );
    }

    const subDistricts = await ShippingRepository.getSubDistricts(district.id);

    return subDistricts;
  }
}
