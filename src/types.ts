export interface CompressionRequest {
  prompt: string;
  compression_ratio?: number;
}

export interface CompressionResponse {
  original_prompt: string;
  compressed_prompt: string;
  original_tokens: number;
  compressed_tokens: number;
  compression_ratio: number;
  tokens_saved: number;
  energy_saved_kwh: number;
  co2_saved_kg: number;
}

export interface HealthResponse {
  status: string;
  llmlingua_available: boolean;
  compression_methods: string[];
}
