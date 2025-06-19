import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
export const IMAGE_BASE_URL = process.env.REACT_APP_TMDB_IMAGE_BASE_URL;

interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  overview: string;
  genre_ids: number[];
  vote_average: number;
}

export const getGenres = async (): Promise<Genre[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
      params: { api_key: API_KEY, language: 'ko-KR' },
    });
    return response.data.genres;
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};

export const getPosterUrl = (path: string | null): string => {
  return path ? `${IMAGE_BASE_URL}w500${path}` : 'https://via.placeholder.com/500x750?text=No+Poster';
}

// 한국 시청등급 필터용 함수
const isAllowedCertification = (cert: string | null): boolean => {
  if (!cert || cert.trim() === '') return true;
  const allowedCerts = ['ALL', '12', '15'];
  const bannedCerts = ['19', '19+', 'RESTRICTED SCREENING', 'null', '21+', 'NR', 'R-18', 'X'];

  const upperCert = cert.toUpperCase();

  if (allowedCerts.includes(upperCert)) return true;
  if (bannedCerts.includes(upperCert)) return false;

  return false;
};

// 영화별 한국 시청등급 조회
const getMovieCertificationKR = async (movieId: number): Promise<string | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/movie/${movieId}/release_dates`, {
      params: { api_key: API_KEY },
    });
    const results = response.data.results;
    const krRelease = results.find((r: any) => r.iso_3166_1 === 'KR');
    if (!krRelease) return null;

    // 보통 certification은 release_dates 배열 내 첫 번째 항목에 있음
    const cert = krRelease.release_dates[0]?.certification ?? null;
    return cert;
  } catch (error) {
    console.error(`Error fetching certification for movie ID ${movieId}:`, error);
    return null;
  }
};

// 장르로 영화 검색 + 한국 시청등급 필터링
export const getMoviesByGenre = async (
  genreIds: number[],
  page: number = 1
): Promise<Movie[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        language: 'ko-KR',
        sort_by: 'popularity.desc',
        with_genres: genreIds.join(','),
        page,
        include_adult: false,
      },
    });

    const movies: Movie[] = response.data.results;

    // 병렬로 한국 시청등급 조회 후 필터링
    const certificationPromises = movies.map(async (movie) => {
      const cert = await getMovieCertificationKR(movie.id);
      return { movie, cert };
    });

    const moviesWithCert = await Promise.all(certificationPromises);

    const filteredMovies = moviesWithCert
      .filter(({ cert }) => isAllowedCertification(cert))
      .map(({ movie }) => movie);

    return filteredMovies;

  } catch (error) {
    console.error("Error fetching movies:", error);
    return [];
  }
};
