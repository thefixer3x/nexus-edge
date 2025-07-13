export interface ShutterstockImage {
  id: string;
  description: string;
  aspect: number;
  assets: {
    preview: {
      url: string;
    };
    large_thumb: {
      url: string;
    };
  };
}

export interface SearchResponse {
  page: number;
  per_page: number;
  total_count: number;
  search_id: string;
  data: ShutterstockImage[];
}

export interface DownloadResponse {
  download: {
    url: string;
  };
}
