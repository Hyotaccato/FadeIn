import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Movie, getPosterUrl } from '../services/tmdbService';
import LoadingSpinner from './LoadingSpinner';

interface WinnerPageProps {
  onRestart: () => void;
}

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const Heading = styled.h2`
  font-size: 2.2rem;
  margin-bottom: 20px;
  color: ${props => props.theme.colors.primary};
`;

const WinnerMovieCard = styled.div`
  background-color: ${({ theme }) => theme.colors.darkGray};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.5);
  margin-bottom: 30px;
  width: 90%;
  max-width: 400px;
`;

const WinnerPoster = styled.img`
  width: 80%;
  max-width: 300px;
  height: auto;
  border-radius: ${({ theme }) => theme.borderRadius};
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
`;

const WinnerTitle = styled.h3`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 10px;
  text-align: center;
`;

const WinnerOverview = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.lightGray};
  text-align: center;
  margin-bottom: 20px;
`;

const StarRatingContainer = styled.div`
  margin-bottom: 20px;
`;

const Star = styled.span<{ selected: boolean }>`
  font-size: 2.5rem;
  cursor: pointer;
  color: ${({ selected }) => (selected ? '#FFD700' : '#fff')};
  transition: color 0.2s ease;

  &:hover {
    color: #FFD700;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
`;

const RestartButton = styled.button`
  padding: 12px 25px;
  font-size: 1.1rem;
  background-color: ${({ theme }) => theme.colors.secondary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
  }
`;

const WinnerPage: React.FC<WinnerPageProps> = ({ onRestart }) => {
  const { movieId } = useParams<{ movieId: string }>();
  const [winnerMovie, setWinnerMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userRating, setUserRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);

  useEffect(() => {
    const fetchWinnerMovie = async () => {
      if (!movieId) {
        setError('우승 영화 ID가 없습니다.');
        setIsLoading(false);
        return;
      }
      try {
        const response = await axios.get(`${BASE_URL}/movie/${movieId}`, {
          params: { api_key: API_KEY, language: 'ko-KR' },
        });
        setWinnerMovie(response.data);
      } catch (err) {
        console.error("Error fetching winner movie:", err);
        setError('우승 영화 정보를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchWinnerMovie();
  }, [movieId]);

  // 별점 클릭 시 로컬스토리지 저장
  const handleRating = (rating: number) => {
    setUserRating(rating);
    if (!winnerMovie) return;

    const storedRatings = localStorage.getItem('ratedMovies');
    const ratedMovies = storedRatings ? JSON.parse(storedRatings) : {};

    ratedMovies[winnerMovie.id] = {
      id: winnerMovie.id,
      title: winnerMovie.title,
      poster_path: winnerMovie.poster_path,
      rating,
    };

    localStorage.setItem('ratedMovies', JSON.stringify(ratedMovies));
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <PageContainer>
        <p style={{ color: 'red' }}>{error}</p>
        <RestartButton onClick={onRestart}>다시 시작하기</RestartButton>
      </PageContainer>
    );
  }

  if (!winnerMovie) {
    return (
      <PageContainer>
        <p>우승 영화를 찾을 수 없습니다.</p>
        <RestartButton onClick={onRestart}>다시 시작하기</RestartButton>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Heading>최종 우승 영화</Heading>
      <WinnerMovieCard>
        <WinnerPoster src={getPosterUrl(winnerMovie.poster_path)} alt={winnerMovie.title} />
        <WinnerTitle>{winnerMovie.title}</WinnerTitle>
        <WinnerOverview>{winnerMovie.overview || '줄거리 정보 없음.'}</WinnerOverview>
        <p>TMDB 평점: {winnerMovie.vote_average.toFixed(1)} / 10</p>
      </WinnerMovieCard>

      <StarRatingContainer>
        <Heading style={{ fontSize: '1.5rem' }}>이 영화에 별점을 주세요!</Heading>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            selected={star <= (hoverRating || userRating)}
            onClick={() => handleRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
          >
            ★
          </Star>
        ))}
        {userRating > 0 && <p>내 평점: {userRating}점</p>}
      </StarRatingContainer>

      <ButtonGroup>
        <RestartButton onClick={onRestart}>다시 시작하기</RestartButton>
      </ButtonGroup>
    </PageContainer>
  );
};

export default WinnerPage;
