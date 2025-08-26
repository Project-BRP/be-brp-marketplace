import { ReportValidation } from '../validations';
import type {
  IGetRevenueRequest,
  IGetRevenueResponse,
  IGetTotalTransactionsRequest,
  IGetTotalTransactionsResponse,
  IGetTodayTotalTransactionsResponse,
  IGetCurrentMonthRevenueResponse,
  IGetTotalProductsResponse,
  IGetTotalProductsSoldRequest,
  IGetTotalProductsSoldResponse,
  IGetTotalActiveUsersRequest,
  IGetTotalActiveUsersResponse,
  IGetMonthlyRevenueRequest,
  IGetMonthlyRevenueResponse,
  IGetMostSoldProductsDistributionRequest,
  IGetMostSoldProductsDistributionResponse,
} from '../dtos';
import {
  TransactionRepository,
  UserRepository,
  ProductRepository,
} from '../repositories';
import { TimeUtils, Validator } from '../utils';

export class ReportService {
  static async getRevenue(
    request: IGetRevenueRequest,
  ): Promise<IGetRevenueResponse> {
    const validData = Validator.validate(ReportValidation.GET_REVENUE, request);

    const now = TimeUtils.now();

    const firstTransactionDate =
      await TransactionRepository.findFirstTransactionDate();
    const cumulativeStartDate =
      validData.startYear && validData.startMonth
        ? TimeUtils.getStartOfMonth(validData.startYear, validData.startMonth)
        : firstTransactionDate ||
          TimeUtils.getStartOfMonth(now.getFullYear(), now.getMonth() + 1);

    const cumulativeEndDate =
      validData.endYear && validData.endMonth
        ? TimeUtils.getEndOfMonth(validData.endYear, validData.endMonth)
        : now;

    const totalRevenue =
      await TransactionRepository.aggregateRevenueByDateRange(
        cumulativeStartDate,
        cumulativeEndDate,
      );

    let gainPercentage = 0;

    const isSameMonthFilter =
      validData.startYear &&
      validData.startYear === validData.endYear &&
      validData.startMonth === validData.endMonth;

    if (isSameMonthFilter) {
      gainPercentage = 0;
    } else {
      const currentMonthStartDate =
        validData.endYear && validData.endMonth
          ? TimeUtils.getStartOfMonth(validData.endYear, validData.endMonth)
          : TimeUtils.getStartOfMonth(now.getFullYear(), now.getMonth() + 1);
      const currentMonthEndDate =
        validData.endYear && validData.endMonth
          ? TimeUtils.getEndOfMonth(validData.endYear, validData.endMonth)
          : TimeUtils.getEndOfMonth(now.getFullYear(), now.getMonth() + 1);

      const prevMonth =
        validData.endYear && validData.endMonth
          ? new Date(validData.endYear, validData.endMonth - 1)
          : new Date(now.getFullYear(), now.getMonth());
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      const prevMonthStartDate = TimeUtils.getStartOfMonth(
        prevMonth.getFullYear(),
        prevMonth.getMonth() + 1,
      );
      const prevMonthEndDate = TimeUtils.getEndOfMonth(
        prevMonth.getFullYear(),
        prevMonth.getMonth() + 1,
      );

      const currentMonthRevenue =
        await TransactionRepository.aggregateRevenueByDateRange(
          currentMonthStartDate,
          currentMonthEndDate,
        );
      const previousMonthRevenue =
        await TransactionRepository.aggregateRevenueByDateRange(
          prevMonthStartDate,
          prevMonthEndDate,
        );

      gainPercentage =
        previousMonthRevenue > 0
          ? ((currentMonthRevenue - previousMonthRevenue) /
              previousMonthRevenue) *
            100
          : currentMonthRevenue > 0
            ? 100
            : 0;
    }

    return {
      totalRevenue,
      gainPercentage: parseFloat(gainPercentage.toFixed(2)),
    };
  }

  static async getCurrentMonthRevenue(): Promise<IGetCurrentMonthRevenueResponse> {
    const now = TimeUtils.now();

    const currentMonthStartDate = TimeUtils.getStartOfMonth(
      now.getFullYear(),
      now.getMonth() + 1,
    );
    const currentMonthEndDate = TimeUtils.getEndOfMonth(
      now.getFullYear(),
      now.getMonth() + 1,
    );

    const totalRevenue =
      await TransactionRepository.aggregateRevenueByDateRange(
        currentMonthStartDate,
        currentMonthEndDate,
      );

    let gainPercentage = 0;

    const previousMonth = new Date(now);
    previousMonth.setMonth(previousMonth.getMonth() - 1);
    const prevMonthStartDate = TimeUtils.getStartOfMonth(
      previousMonth.getFullYear(),
      previousMonth.getMonth() + 1,
    );
    const prevMonthEndDate = TimeUtils.getEndOfMonth(
      previousMonth.getFullYear(),
      previousMonth.getMonth() + 1,
    );

    const previousMonthRevenue =
      await TransactionRepository.aggregateRevenueByDateRange(
        prevMonthStartDate,
        prevMonthEndDate,
      );

    gainPercentage =
      previousMonthRevenue > 0
        ? ((totalRevenue - previousMonthRevenue) / previousMonthRevenue) * 100
        : totalRevenue > 0
          ? 100
          : 0;

    return {
      totalRevenue,
      gainPercentage: parseFloat(gainPercentage.toFixed(2)),
    };
  }

  static async getTotalTransactions(
    request: IGetTotalTransactionsRequest,
  ): Promise<IGetTotalTransactionsResponse> {
    const validData = Validator.validate(
      ReportValidation.GET_TOTAL_TRANSACTIONS,
      request,
    );

    const now = TimeUtils.now();

    const firstTransactionDate =
      await TransactionRepository.findFirstTransactionDate();
    const cumulativeStartDate =
      validData.startYear && validData.startMonth
        ? TimeUtils.getStartOfMonth(validData.startYear, validData.startMonth)
        : firstTransactionDate ||
          TimeUtils.getStartOfMonth(now.getFullYear(), now.getMonth() + 1);
    const cumulativeEndDate =
      validData.endYear && validData.endMonth
        ? TimeUtils.getEndOfMonth(validData.endYear, validData.endMonth)
        : now;

    const totalTransactions =
      await TransactionRepository.countCompletedTransactions(
        cumulativeStartDate,
        cumulativeEndDate,
      );

    let gainPercentage = 0;

    const isSameMonthFilter =
      validData.startYear &&
      validData.startYear === validData.endYear &&
      validData.startMonth === validData.endMonth;

    if (isSameMonthFilter) {
      gainPercentage = 0;
    } else {
      const currentMonthStartDate =
        validData.endYear && validData.endMonth
          ? TimeUtils.getStartOfMonth(validData.endYear, validData.endMonth)
          : TimeUtils.getStartOfMonth(now.getFullYear(), now.getMonth() + 1);
      const currentMonthEndDate =
        validData.endYear && validData.endMonth
          ? TimeUtils.getEndOfMonth(validData.endYear, validData.endMonth)
          : TimeUtils.getEndOfMonth(now.getFullYear(), now.getMonth() + 1);

      const prevMonth =
        validData.endYear && validData.endMonth
          ? new Date(validData.endYear, validData.endMonth - 1)
          : new Date(now.getFullYear(), now.getMonth());
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      const prevMonthStartDate = TimeUtils.getStartOfMonth(
        prevMonth.getFullYear(),
        prevMonth.getMonth() + 1,
      );
      const prevMonthEndDate = TimeUtils.getEndOfMonth(
        prevMonth.getFullYear(),
        prevMonth.getMonth() + 1,
      );

      const currentMonthTransactions =
        await TransactionRepository.countCompletedTransactions(
          currentMonthStartDate,
          currentMonthEndDate,
        );
      const previousMonthTransactions =
        await TransactionRepository.countCompletedTransactions(
          prevMonthStartDate,
          prevMonthEndDate,
        );

      gainPercentage =
        previousMonthTransactions > 0
          ? ((currentMonthTransactions - previousMonthTransactions) /
              previousMonthTransactions) *
            100
          : currentMonthTransactions > 0
            ? 100
            : 0;
    }

    return {
      totalTransactions,
      gainPercentage: parseFloat(gainPercentage.toFixed(2)),
    };
  }

  static async getTodayTotalTransactions(): Promise<IGetTodayTotalTransactionsResponse> {
    const now = TimeUtils.now();

    const todayStartDate = TimeUtils.getStartOfDay(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate(),
    );
    const todayEndDate = TimeUtils.getEndOfDay(
      now.getFullYear(),
      now.getMonth() + 1,
      now.getDate(),
    );

    const totalTransactions =
      await TransactionRepository.countCompletedTransactions(
        todayStartDate,
        todayEndDate,
      );

    let gainPercentage = 0;

    const previousDay = new Date(now);
    previousDay.setDate(previousDay.getDate() - 1);
    const prevDayStartDate = TimeUtils.getStartOfDay(
      previousDay.getFullYear(),
      previousDay.getMonth() + 1,
      previousDay.getDate(),
    );
    const prevDayEndDate = TimeUtils.getEndOfDay(
      previousDay.getFullYear(),
      previousDay.getMonth() + 1,
      previousDay.getDate(),
    );

    const previousDayTransactions =
      await TransactionRepository.countCompletedTransactions(
        prevDayStartDate,
        prevDayEndDate,
      );

    gainPercentage =
      previousDayTransactions > 0
        ? ((totalTransactions - previousDayTransactions) /
            previousDayTransactions) *
          100
        : totalTransactions > 0
          ? 100
          : 0;

    return {
      totalTransactions,
      gainPercentage: parseFloat(gainPercentage.toFixed(2)),
    };
  }

  static async getTotalProductsSold(
    request: IGetTotalProductsSoldRequest,
  ): Promise<IGetTotalProductsSoldResponse> {
    const validData = Validator.validate(
      ReportValidation.GET_TOTAL_PRODUCTS_SOLD,
      request,
    );

    const now = TimeUtils.now();

    const firstTransactionDate =
      await TransactionRepository.findFirstTransactionDate();
    const cumulativeStartDate =
      validData.startYear && validData.startMonth
        ? TimeUtils.getStartOfMonth(validData.startYear, validData.startMonth)
        : firstTransactionDate ||
          TimeUtils.getStartOfMonth(now.getFullYear(), now.getMonth() + 1);

    const cumulativeEndDate =
      validData.endYear && validData.endMonth
        ? TimeUtils.getEndOfMonth(validData.endYear, validData.endMonth)
        : now;

    const totalProductsSold =
      await TransactionRepository.countTotalProductsSold(
        cumulativeStartDate,
        cumulativeEndDate,
      );

    let gainPercentage = 0;

    const isSameMonthFilter =
      validData.startYear &&
      validData.startYear === validData.endYear &&
      validData.startMonth === validData.endMonth;

    if (isSameMonthFilter) {
      gainPercentage = 0;
    } else {
      const currentMonthStartDate =
        validData.endYear && validData.endMonth
          ? TimeUtils.getStartOfMonth(validData.endYear, validData.endMonth)
          : TimeUtils.getStartOfMonth(now.getFullYear(), now.getMonth() + 1);
      const currentMonthEndDate =
        validData.endYear && validData.endMonth
          ? TimeUtils.getEndOfMonth(validData.endYear, validData.endMonth)
          : TimeUtils.getEndOfMonth(now.getFullYear(), now.getMonth() + 1);

      const prevMonth =
        validData.endYear && validData.endMonth
          ? new Date(validData.endYear, validData.endMonth - 1)
          : new Date(now.getFullYear(), now.getMonth());
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      const prevMonthStartDate = TimeUtils.getStartOfMonth(
        prevMonth.getFullYear(),
        prevMonth.getMonth() + 1,
      );
      const prevMonthEndDate = TimeUtils.getEndOfMonth(
        prevMonth.getFullYear(),
        prevMonth.getMonth() + 1,
      );

      const currentMonthProductsSold =
        await TransactionRepository.countTotalProductsSold(
          currentMonthStartDate,
          currentMonthEndDate,
        );
      const previousMonthProductsSold =
        await TransactionRepository.countTotalProductsSold(
          prevMonthStartDate,
          prevMonthEndDate,
        );

      gainPercentage =
        previousMonthProductsSold > 0
          ? ((currentMonthProductsSold - previousMonthProductsSold) /
              previousMonthProductsSold) *
            100
          : currentMonthProductsSold > 0
            ? 100
            : 0;
    }

    return {
      totalProductsSold,
      gainPercentage: parseFloat(gainPercentage.toFixed(2)),
    };
  }

  static async getTotalActiveUsers(
    request: IGetTotalActiveUsersRequest,
  ): Promise<IGetTotalActiveUsersResponse> {
    const validData = Validator.validate(
      ReportValidation.GET_TOTAL_ACTIVE_USERS,
      request,
    );

    const now = TimeUtils.now();

    const firstTransactionDate =
      await TransactionRepository.findFirstTransactionDate();
    const cumulativeStartDate =
      validData.startYear && validData.startMonth
        ? TimeUtils.getStartOfMonth(validData.startYear, validData.startMonth)
        : firstTransactionDate ||
          TimeUtils.getStartOfMonth(now.getFullYear(), now.getMonth() + 1);

    const cumulativeEndDate =
      validData.endYear && validData.endMonth
        ? TimeUtils.getEndOfMonth(validData.endYear, validData.endMonth)
        : now;

    const totalActiveUsers = await UserRepository.countActiveUsers(
      cumulativeStartDate,
      cumulativeEndDate,
    );

    let gainPercentage = 0;

    const isSameMonthFilter =
      validData.startYear &&
      validData.startYear === validData.endYear &&
      validData.startMonth === validData.endMonth;

    if (isSameMonthFilter) {
      gainPercentage = 0;
    } else {
      const currentMonthStartDate =
        validData.endYear && validData.endMonth
          ? TimeUtils.getStartOfMonth(validData.endYear, validData.endMonth)
          : TimeUtils.getStartOfMonth(now.getFullYear(), now.getMonth() + 1);
      const currentMonthEndDate =
        validData.endYear && validData.endMonth
          ? TimeUtils.getEndOfMonth(validData.endYear, validData.endMonth)
          : TimeUtils.getEndOfMonth(now.getFullYear(), now.getMonth() + 1);

      const prevMonth =
        validData.endYear && validData.endMonth
          ? new Date(validData.endYear, validData.endMonth - 1)
          : new Date(now.getFullYear(), now.getMonth());
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      const prevMonthStartDate = TimeUtils.getStartOfMonth(
        prevMonth.getFullYear(),
        prevMonth.getMonth() + 1,
      );
      const prevMonthEndDate = TimeUtils.getEndOfMonth(
        prevMonth.getFullYear(),
        prevMonth.getMonth() + 1,
      );

      const currentMonthActiveUsers = await UserRepository.countActiveUsers(
        currentMonthStartDate,
        currentMonthEndDate,
      );
      const previousMonthActiveUsers = await UserRepository.countActiveUsers(
        prevMonthStartDate,
        prevMonthEndDate,
      );

      gainPercentage =
        previousMonthActiveUsers > 0
          ? ((currentMonthActiveUsers - previousMonthActiveUsers) /
              previousMonthActiveUsers) *
            100
          : currentMonthActiveUsers > 0
            ? 100
            : 0;
    }

    return {
      totalActiveUsers,
      gainPercentage: parseFloat(gainPercentage.toFixed(2)),
    };
  }

  static async getMonthlyRevenue(
    request: IGetMonthlyRevenueRequest,
  ): Promise<IGetMonthlyRevenueResponse> {
    const validData = Validator.validate(
      ReportValidation.GET_MONTHLY_REVENUE,
      request,
    );

    let startDate: Date;
    let endDate: Date;

    // Logika utama tetap jelas terbaca di service
    if (
      validData.startYear &&
      validData.startMonth &&
      validData.endYear &&
      validData.endMonth
    ) {
      // Kasus 1: User memberikan filter rentang tanggal
      startDate = TimeUtils.getStartOfMonth(
        validData.startYear,
        validData.startMonth,
      );
      endDate = TimeUtils.getEndOfMonth(validData.endYear, validData.endMonth);
    } else {
      // Kasus 2: User tidak memberikan filter, gunakan default (12 bulan terakhir)
      const now = TimeUtils.now();
      endDate = TimeUtils.getEndOfMonth(now.getFullYear(), now.getMonth() + 1);

      const defaultStartDate = new Date(now);
      defaultStartDate.setFullYear(now.getFullYear() - 1);
      startDate = TimeUtils.getStartOfMonth(
        defaultStartDate.getFullYear(),
        defaultStartDate.getMonth() + 1,
      );
    }

    const monthlyData = await TransactionRepository.getMonthlyRevenue(
      startDate,
      endDate,
    );

    const revenues = monthlyData.map((currentMonth, index) => {
      const lastMonthRevenue =
        index > 0 ? monthlyData[index - 1].total_revenue : 0;
      let gainPercentage = 0;
      if (lastMonthRevenue > 0) {
        gainPercentage =
          ((currentMonth.total_revenue - lastMonthRevenue) / lastMonthRevenue) *
          100;
      } else if (currentMonth.total_revenue > 0) {
        gainPercentage = 100;
      }
      return {
        year: currentMonth.year,
        month: currentMonth.month,
        totalRevenue: currentMonth.total_revenue,
        gainPercentage: parseFloat(gainPercentage.toFixed(2)),
      };
    });

    return { revenues };
  }

  static async getMostSoldProductsDistribution(
    request: IGetMostSoldProductsDistributionRequest,
  ): Promise<IGetMostSoldProductsDistributionResponse> {
    const validData = Validator.validate(
      ReportValidation.GET_MOST_SOLD_PRODUCTS_DISTRIBUTION,
      request,
    );

    let startDate: Date;
    let endDate: Date;

    // Logika utama untuk menentukan rentang tanggal
    if (
      validData.startYear &&
      validData.startMonth &&
      validData.endYear &&
      validData.endMonth
    ) {
      // Kasus 1: User memberikan filter rentang tanggal
      startDate = TimeUtils.getStartOfMonth(
        validData.startYear,
        validData.startMonth,
      );
      endDate = TimeUtils.getEndOfMonth(validData.endYear, validData.endMonth);
    } else {
      // Kasus 2: User tidak memberikan filter, gunakan default baru
      endDate = TimeUtils.now(); // Default endDate adalah hari ini

      const firstTransactionDate =
        await TransactionRepository.findFirstTransactionDate();

      // Jika ada transaksi, startDate adalah tanggal transaksi pertama.
      // Jika tidak, startDate adalah awal bulan ini.
      startDate =
        firstTransactionDate ||
        TimeUtils.getStartOfMonth(
          endDate.getFullYear(),
          endDate.getMonth() + 1,
        );
    }

    const soldProducts = await TransactionRepository.getMostSoldProducts(
      startDate,
      endDate,
    );

    return {
      products: soldProducts.map(p => ({
        id: p.id,
        name: p.name,
        totalSold: p.total_sold,
      })),
    };
  }

  static async getTotalProducts(): Promise<IGetTotalProductsResponse> {
    const totalProducts = await ProductRepository.count();
    return { totalProducts };
  }
}
