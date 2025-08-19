import { StatusCodes } from 'http-status-codes';

import { IProvince, ICity, IDistrict, ISubDistrict } from '../dtos';
import { ResponseError } from '../error/ResponseError';
import { CompanyInfoRepository, ShippingRepository } from '../repositories';
import { ShippingUtils, Validator } from '../utils';
import { ShippingValidation } from '../validations';
import {
  IGetCitiesRequest,
  IGetDistrictsRequest,
  IGetSubDistrictsRequest,
  IShippingOption,
  ICheckCostRequest,
  ICheckCostResponse,
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

  static async checkCost(
    request: ICheckCostRequest,
  ): Promise<ICheckCostResponse> {
    const validData = Validator.validate(
      ShippingValidation.CHECK_COST,
      request,
    );

    const companyInfo = await CompanyInfoRepository.findFirst();

    let existingOrigin;

    existingOrigin = await ShippingRepository.getSubDistrict(
      companyInfo.districtId,
      companyInfo.subDistrictId,
    );

    if (!existingOrigin) {
      existingOrigin = await ShippingRepository.getDistrict(
        companyInfo.cityId,
        companyInfo.districtId,
      );
      if (!existingOrigin) {
        throw new ResponseError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          'Terjadi kesalahan saat memeriksa biaya pengiriman',
        );
      }
    }

    let existingDestination;

    existingDestination = await ShippingRepository.getSubDistrict(
      validData.destinationDistrict,
      validData.destinationSubDistrict,
    );

    if (!existingDestination) {
      existingDestination = await ShippingRepository.getDistrict(
        validData.destinationCity,
        validData.destinationDistrict,
      );
      if (!existingDestination) {
        throw new ResponseError(
          StatusCodes.BAD_REQUEST,
          'Destinasi tidak valid',
        );
      }
    }

    const payload = {
      origin: existingOrigin.id.toString(),
      destination: existingDestination.id.toString(),
      weight: validData.weight_in_kg * 1000,
      courier: 'jne:sicepat:jnt:pos',
    };

    const shippingOptions = await ShippingUtils.fetchShippingOptions(payload);

    return {
      shippingOptions,
    };
  }
}
