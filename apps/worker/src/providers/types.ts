/**
 * A single platform's official metrics API. Each `MediaAsset` row already
 * carries a `provider` name (set when it was first linked, currently via
 * the admin CSV import) plus the platform's own `externalId` for that
 * video/sound — a provider just needs to turn that id into fresh counts.
 */
export interface ProviderMetrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  soundUses: number;
}

export interface MetricsProvider {
  /** Must match the `provider` column on `MediaAsset` rows this fetches for. */
  readonly name: string;
  /** False when the required API credentials aren't set — polling skips it rather than failing. */
  isConfigured(): boolean;
  fetchMetrics(externalId: string): Promise<ProviderMetrics>;
}
