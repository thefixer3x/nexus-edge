import { SHUTTERSTOCK_CONFIG } from './config';
import { SearchResponse, DownloadResponse } from './types';

export class ShutterstockClient {
  private baseUrl: string;
  private headers: Headers;

  constructor() {
    this.baseUrl = SHUTTERSTOCK_CONFIG.API_ENDPOINT;
    this.headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${SHUTTERSTOCK_CONFIG.API_KEY}`
    });
  }

  async searchImages(query: string, page: number = 1, perPage: number = 20): Promise<SearchResponse> {
    const response = await fetch(
      `${this.baseUrl}/images/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`,
      { headers: this.headers }
    );

    if (!response.ok) {
      throw new Error(`Shutterstock API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getDownloadUrl(imageId: string, size: string = 'huge'): Promise<string> {
    const response = await fetch(
      `${this.baseUrl}/images/${imageId}/downloads`,
      {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ size })
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get download URL: ${response.statusText}`);
    }

    const data: DownloadResponse = await response.json();
    return data.download.url;
  }
}
