import { HttpStatus } from '@nestjs/common';

interface PaginationMeta {
  total_pages: number;
  current_page: number;
  total_items: number;
  per_page: number;
}

interface PaginationLinks {
  next: boolean;
  prev: boolean;
}

export interface ResponseStructure<T = any> {
  status: boolean;
  message?: string;
  data?: T;
  meta?: PaginationMeta;
  link?: PaginationLinks;
  [key: string]: any; // for custom appends
}

export class ResponseBuilder<T = any> {
  private status: boolean;
  private message?: string;
  private httpCode: number;
  private data?: T;
  private meta?: PaginationMeta;
  private link?: PaginationLinks;
  private httpHeaders: Record<string, string> = {};
  private appends: Record<string, any> = {};

  constructor(status = true, httpCode = HttpStatus.OK) {
    this.status = status;
    this.httpCode = httpCode;
  }

  // ✅ Static factories
  static asSuccess(httpCode: number = HttpStatus.OK): ResponseBuilder {
    return new ResponseBuilder(true, httpCode);
  }

  static asError(
    httpCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  ): ResponseBuilder {
    return new ResponseBuilder(false, httpCode);
  }

  // ✅ Fluent methods
  withMessage(message?: string): this {
    this.message = message;
    return this;
  }

  withHttpHeaders(headers: Record<string, string>): this {
    this.httpHeaders = headers;
    return this;
  }

  with(key: string, value: any): this {
    this.appends[key] = value;
    return this;
  }

  withData(data: T): this {
    this.data = data;
    return this;
  }

  withPagination<TData = T>(
    items: TData[],
    meta: PaginationMeta,
    resourceName: string = 'items',
  ): this {
    this.meta = meta;

    this.link = {
      next: meta.current_page < meta.total_pages,
      prev: meta.current_page > 1,
    };

    if (!this.data) {
      this.data = {} as T;
    }
    this.data[resourceName] = items;
    return this;
  }

  when(condition: boolean, callback: (builder: this) => this): this {
    return condition ? callback(this) : this;
  }

  // ✅ Static shortcuts
  static success<T>(
    data: T | null,
    message?: string | null,
    httpCode = HttpStatus.OK,
    appends: Record<string, any> = {},
  ) {
    const builder = ResponseBuilder.asSuccess(httpCode);

    if (data) {
      builder.withData(data);
    }

    if (message) {
      builder.withMessage(message);
    }

    for (const [key, value] of Object.entries(appends)) {
      builder.with(key, value);
    }

    return builder.build();
  }

  static error(
    message: string = 'Internal Server Error',
    httpCode = HttpStatus.INTERNAL_SERVER_ERROR,
    appends: Record<string, any> = {},
  ) {
    const builder = ResponseBuilder.asError(httpCode);

    if (message) {
      builder.withMessage(message);
    }

    for (const [key, value] of Object.entries(appends)) {
      builder.with(key, value);
    }

    return builder.build();
  }

  static notFound(message = 'Resource not found') {
    return ResponseBuilder.error(message, HttpStatus.NOT_FOUND);
  }

  static unauthorized(message = 'Unauthorized access') {
    return ResponseBuilder.error(message, HttpStatus.UNAUTHORIZED);
  }

  static forbidden(message = 'Access forbidden') {
    return ResponseBuilder.error(message, HttpStatus.FORBIDDEN);
  }

  static validationError(
    message = 'Validation failed',
    errors: Record<string, any> = {},
  ) {
    return ResponseBuilder.error(message, HttpStatus.UNPROCESSABLE_ENTITY, {
      errors,
    });
  }

  // ✅ Final builder
  build() {
    const response: ResponseStructure<T> = { status: this.status };

    if (this.message) response.message = this.message;
    if (this.data && this.data !== undefined) response.data = this.data;
    if (this.meta) response.meta = this.meta;
    if (this.link) response.link = this.link;

    for (const [key, value] of Object.entries(this.appends)) {
      response[key] = value;
    }

    return {
      statusCode: this.httpCode,
      headers: this.httpHeaders,
      body: response,
    };
  }
}
