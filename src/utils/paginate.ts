export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface PaginationResult<T> {
  data: T[];
  meta: {
    total_pages: number;
    total_items: number;
    current_page: number;
    per_page: number;
  };
}

/**
 * Pagination helper for Prisma models
 * @param model Prisma model delegate (e.g., prisma.user)
 * @param params Prisma query params (e.g., { where, include, orderBy })
 * @param pagination Pagination options { page, limit }
 */
export async function paginate<T>(
  model: {
    findMany: (args: any) => Promise<T[]>;
    count: (args?: any) => Promise<number>;
  },
  params: {
    where?: any;
    orderBy?: any;
    include?: any;
    select?: any;
    [key: string]: any;
  } = {},
  pagination: PaginationParams = {},
): Promise<PaginationResult<T>> {
  const page = pagination.page && pagination.page > 0 ? pagination.page : 1;
  const per_page =
    pagination.per_page && pagination.per_page > 0 ? pagination.per_page : 10;

  const skip = (page - 1) * per_page;

  const { where, ...restParams } = params;
  const [total_items, data] = await Promise.all([
    model.count({ where }),
    model.findMany({
      where,
      skip,
      take: per_page,
      ...restParams,
    } as any),
  ]);

  const total_pages = Math.ceil(total_items / per_page);

  return {
    data,
    meta: {
      total_pages,
      total_items,
      current_page: page,
      per_page,
    },
  };
}
