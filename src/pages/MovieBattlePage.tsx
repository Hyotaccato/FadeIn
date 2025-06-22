import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Movie, getPosterUrl } from '../services/tmdbService';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

interface MovieBattlePageProps {
  movies: Movie[];
  onRestart: () => void;
}

const BattleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  margin-top: 20px;
`;

const BattleInfo = styled.h2`
  font-size: 1.8rem;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.lightGray};
`;

const MovieComparison = styled.div`
  display: flex;
  justify-content: space-around;
  width: 100%;
  gap: 20px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const MovieCard = styled.div`
  flex: 1;
  min-width: 280px;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: ${({ theme }) => theme.colors.darkGray};
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  transition: transform 0.3s ease;
  cursor: pointer;
  height: 600px;

  &:hover {
    transform: translateY(-5px);
  }
`;

const MoviePoster = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  display: block;
`;

const MovieContent = styled.div`
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
`;

const MovieTitle = styled.h3`
  font-size: 1.5rem;
  margin: 10px 0;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

const MovieOverview = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.lightGray};
  text-align: center;
  max-height: 80px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
`;

const SelectButton = styled.button`
  width: 90%;
  margin: 10px auto;
  padding: 10px;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius};
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
  }
`;

const MovieBattlePage: React.FC<MovieBattlePageProps> = ({ movies, onRestart }) => {
  const navigate = useNavigate();
  const [currentRoundMovies, setCurrentRoundMovies] = useState<Movie[]>([]);
  const [winners, setWinners] = useState<Movie[]>([]);
  const [currentMatchIndex, setCurrentMatchIndex] = useState<number>(0);
  const [roundNumber, setRoundNumber] = useState<number>(0);

  useEffect(() => {
    if (movies.length === 0) {
      navigate('/');
      return;
    }
    setCurrentRoundMovies(movies);
    setRoundNumber(movies.length);
  }, [movies, navigate]);

  const handleMovieSelect = useCallback((selectedMovie: Movie) => {
    setWinners((prevWinners) => [...prevWinners, selectedMovie]);
  }, []);

  useEffect(() => {
    if (currentRoundMovies.length === 0 || currentMatchIndex * 2 >= currentRoundMovies.length) {
      if (winners.length === 1) {
        navigate(`/winner/${winners[0].id}`);
      } else if (winners.length > 1) {
        setCurrentRoundMovies(winners);
        setWinners([]);
        setCurrentMatchIndex(0);
        setRoundNumber(winners.length);
      }
    }
  }, [currentMatchIndex, currentRoundMovies, winners, navigate]);

  if (currentRoundMovies.length === 0 || currentMatchIndex * 2 >= currentRoundMovies.length) {
    return <LoadingSpinner />;
  }

  const movie1 = currentRoundMovies[currentMatchIndex * 2];
  const movie2 = currentRoundMovies[currentMatchIndex * 2 + 1];

  if (!movie1 || !movie2) {
    return (
      <BattleContainer>
        <p style={{ color: 'red' }}>경기를 진행할 영화 데이터가 부족하거나 유효하지 않습니다.</p>
        <SelectButton onClick={onRestart}>다시 시작하기</SelectButton>
      </BattleContainer>
    );
  }

  const currentMatchCount = currentMatchIndex + 1;
  const totalMatchesInRound = currentRoundMovies.length / 2;

  return (
    <BattleContainer>
      <BattleInfo>{roundNumber}강 - {currentMatchCount}/{totalMatchesInRound} 경기</BattleInfo>
      <MovieComparison>
        {[movie1, movie2].map((movie) => (
          <MovieCard
            key={movie.id}
            onClick={() => {
              handleMovieSelect(movie);
              setCurrentMatchIndex((prev) => prev + 1);
            }}
          >
            <MoviePoster src={getPosterUrl(movie.poster_path)} alt={movie.title} />
            <MovieContent>
              <MovieTitle>{movie.title}</MovieTitle>
              <MovieOverview>{movie.overview || '줄거리 정보 없음.'}</MovieOverview>
            </MovieContent>
            <SelectButton>이 영화 선택</SelectButton>
          </MovieCard>
        ))}
      </MovieComparison>
    </BattleContainer>
  );
};

export default MovieBattlePage;
