export interface Season {
  season: number;
  episodes: number;
  air_date: string | null;
}

export interface CastMember {
  name: string;
  character: string;
}

export interface SimilarSeries {
  title: string;
  reason: string;
}

export interface ActorInfo {
  photo_url: string | null;
  other_series: string[] | null;
}

export interface SeriesInfo {
  title_en: string | null;
  title_es: string | null;
  title_mx: string | null;
  description: string | null;
  seasons: Season[];
  original_air_date: string | null;
  original_platform: string | null;
  current_platform: string | null;
  is_airing: boolean | null;
  poster_url: string | null;
  imdb_rating: string | null;
  cast: CastMember[] | null;
  similar_series: SimilarSeries[] | null;
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}