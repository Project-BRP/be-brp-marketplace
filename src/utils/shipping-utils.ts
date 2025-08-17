import { StatusCodes } from 'http-status-codes';
import axios from 'axios';

import { IProvince, ICity, IDistrict, ISubDistrict } from '../dtos';
import { ResponseError } from '../error/ResponseError';
import { currentEnv, Env, RAJAONGKIR_CONSTANTS } from '../constants';
import { appLogger } from '../configs/logger';

interface RajaOngkirResponse<T> {
  meta: {
    message: string;
    code: number;
    status: string;
  };
  data: T;
}

export class ShippingUtils {
  static async fetchProvinces(): Promise<IProvince[]> {
    try {
      const response = await axios.get<RajaOngkirResponse<IProvince[]>>(
        `${RAJAONGKIR_CONSTANTS.API_URL}/destination/province`,
        {
          headers: {
            key: RAJAONGKIR_CONSTANTS.API_KEY,
          },
        },
      );

      if (currentEnv === Env.DEVELOPMENT || currentEnv === Env.TESTING) {
        appLogger.info('RajaOngkir API Response:', response.data);
      }

      const { meta, data } = response.data;

      if (meta.status !== 'success') {
        throw new ResponseError(
          meta.code,
          meta.message || 'Failed to fetch provinces',
        );
      }

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        appLogger.error('RajaOngkir API Error:', error.response?.data);
        const meta = (error.response?.data as RajaOngkirResponse<null>)?.meta;
        throw new ResponseError(
          meta?.code ||
            error.response?.status ||
            StatusCodes.INTERNAL_SERVER_ERROR,
          meta?.message || 'Failed to fetch provinces',
        );
      }

      appLogger.error('Unexpected error in fetchProvinces:', error);
      throw error;
    }
  }

  static async fetchCities(provinceId: number): Promise<ICity[]> {
    try {
      const response = await axios.get<RajaOngkirResponse<ICity[]>>(
        `${RAJAONGKIR_CONSTANTS.API_URL}/destination/city/${provinceId}`,
        {
          headers: {
            key: RAJAONGKIR_CONSTANTS.API_KEY,
          },
        },
      );

      if (currentEnv === Env.DEVELOPMENT || currentEnv === Env.TESTING) {
        appLogger.info('RajaOngkir API Response:', response.data);
      }

      const { meta, data } = response.data;

      if (meta.status !== 'success') {
        throw new ResponseError(
          meta.code,
          meta.message || 'Failed to fetch cities',
        );
      }

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        appLogger.error('RajaOngkir API Error:', error.response?.data);
        const meta = (error.response?.data as RajaOngkirResponse<null>)?.meta;
        throw new ResponseError(
          meta?.code ||
            error.response?.status ||
            StatusCodes.INTERNAL_SERVER_ERROR,
          meta?.message || 'Failed to fetch cities',
        );
      }

      appLogger.error('Unexpected error in fetchCities:', error);
      throw error;
    }
  }

  static async fetchDistricts(cityId: number): Promise<IDistrict[]> {
    try {
      const response = await axios.get<RajaOngkirResponse<IDistrict[]>>(
        `${RAJAONGKIR_CONSTANTS.API_URL}/destination/district/${cityId}`,
        {
          headers: {
            key: RAJAONGKIR_CONSTANTS.API_KEY,
          },
        },
      );

      if (currentEnv === Env.DEVELOPMENT || currentEnv === Env.TESTING) {
        appLogger.info('RajaOngkiri API Response:', response.data);
      }

      const { meta, data } = response.data;

      if (meta.status !== 'success') {
        throw new ResponseError(
          meta.code,
          meta.message || 'Failed to fetch districts',
        );
      }

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        appLogger.error('RajaOngkiri API Error:', error.response?.data);
        const meta = (error.response?.data as RajaOngkirResponse<null>)?.meta;
        throw new ResponseError(
          meta?.code ||
            error.response?.status ||
            StatusCodes.INTERNAL_SERVER_ERROR,
          meta?.message || 'Failed to fetch districts',
        );
      }

      appLogger.error('Unexpected error in fetchDistricts:', error);
      throw error;
    }
  }

  static async fetchSubDistricts(districtId: number): Promise<ISubDistrict[]> {
    try {
      const response = await axios.get<RajaOngkirResponse<ISubDistrict[]>>(
        `${RAJAONGKIR_CONSTANTS.API_URL}/destination/sub-district/${districtId}`,
        {
          headers: {
            key: RAJAONGKIR_CONSTANTS.API_KEY,
          },
        },
      );

      if (currentEnv === Env.DEVELOPMENT || currentEnv === Env.TESTING) {
        appLogger.info('RajaOngkiri API Response:', response.data);
      }

      const { meta, data } = response.data;

      if (meta.status !== 'success') {
        throw new ResponseError(
          meta.code,
          meta.message || 'Failed to fetch subdistricts',
        );
      }

      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        appLogger.error('RajaOngkiri API Error:', error.response?.data);
        const meta = (error.response?.data as RajaOngkirResponse<null>)?.meta;
        throw new ResponseError(
          meta?.code ||
            error.response?.status ||
            StatusCodes.INTERNAL_SERVER_ERROR,
          meta?.message || 'Failed to fetch subdistricts',
        );
      }

      appLogger.error('Unexpected error in fetchSubDistricts:', error);
      throw error;
    }
  }
}
