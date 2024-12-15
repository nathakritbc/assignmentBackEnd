interface Meta {
  page: number;
  page_size: number;
  total_records: number;
}

export interface ApiResponse<T> {
  status: number;
  result: T;
  message: string;
  error: boolean;
  meta?: Meta; // `meta` เป็น optional เพราะบาง response อาจจะไม่มี
}
