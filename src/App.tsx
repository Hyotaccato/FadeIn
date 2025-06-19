import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import styled, { ThemeProvider } from 'styled-components'; // Import ThemeProvider
import { Movie, getGenres, getMoviesByGenre, IMAGE_BASE_URL } from './services/tmdbService';

import GenreSelectionPage from './pages/GenreSelectionPage';
import RoundSelectionPage from './pages/RoundSelectionPage';
import MovieBattlePage from './pages/MovieBattlePage';
import WinnerPage from './pages/WinnerPage';
import LoadingSpinner from './pages/LoadingSpinner';
import IntroScreen from './pages/IntroScreen'; // Ensure this import is correct
import { netflixTheme } from './styles/theme';

const AppContainer = styled.div`
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 4rem;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.primary};
  font-family: 'Monoton', cursive; /* Add cursive fallback */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  letter-spacing: 2px;
`;

const App: React.FC = () => {
  const navigate = useNavigate();
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [selectedRound, setSelectedRound] = useState<number>(0);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showIntro, setShowIntro] = useState<boolean>(true); // Initial state set to true

  // useEffect to control the duration of the IntroScreen
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false); // Hide IntroScreen after 3 seconds
    }, 5000); // 3000 milliseconds = 3 seconds

    return () => clearTimeout(timer); // Clean up the timer on unmount
  }, []); // Run only once on component mount

  // 장르 선택 핸들러
  const handleGenreSelect = (genres: number[]) => {
    setSelectedGenres(genres);
    navigate('/round-select');
  };

  // 강 선택 핸들러
  const handleRoundSelect = async (round: number) => {
    setSelectedRound(round);
    setIsLoading(true);
    setError(null);
    try {
      const requiredMovies = round;
      let fetchedMovies: Movie[] = [];
      let page = 1;
      const uniqueMovieIds = new Set<number>();

      while (fetchedMovies.length < requiredMovies && page < 10) {
        const newMovies = await getMoviesByGenre(selectedGenres, page);
        if (newMovies.length === 0) break;

        for (const movie of newMovies) {
          if (movie.poster_path && !uniqueMovieIds.has(movie.id)) {
            fetchedMovies.push(movie);
            uniqueMovieIds.add(movie.id);
            if (fetchedMovies.length === requiredMovies) break;
          }
        }
        page++;
      }

      if (fetchedMovies.length < requiredMovies) {
        throw new Error('선택한 장르에서 월드컵을 진행할 충분한 영화를 찾을 수 없습니다. 다른 장르나 낮은 강 수를 선택해주세요.');
      }

      const shuffledMovies = fetchedMovies.sort(() => 0.5 - Math.random());
      setMovies(shuffledMovies.slice(0, requiredMovies));
      navigate('/battle');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('영화를 가져오는 중 오류가 발생했습니다.');
      }
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  // 월드컵 재시작 핸들러
  const handleRestart = () => {
    setSelectedGenres([]);
    setSelectedRound(0);
    setMovies([]);
    setError(null);
    navigate('/');
  };

  return (
    <ThemeProvider theme={netflixTheme}>
      {/* Conditionally render IntroScreen or the main app content */}
      {showIntro ? (
        <IntroScreen />
      ) : (
        <AppContainer>
          <Title>FadeIn</Title> {/* Updated Title for actual app */}
          {isLoading && <LoadingSpinner />}
          {error && <p style={{ color: 'red', fontSize: '1.2rem', marginTop: '20px' }}>{error}</p>}
          <Routes>
            <Route path="/" element={<GenreSelectionPage onSelectGenres={handleGenreSelect} />} />
            <Route
              path="/round-select"
              element={
                <RoundSelectionPage
                  onSelectRound={handleRoundSelect}
                  availableMoviesCount={movies.length > 0 ? movies.length : 100}
                />
              }
            />
            <Route
              path="/battle"
              element={<MovieBattlePage movies={movies} onRestart={handleRestart} />}
            />
            <Route
              path="/winner/:movieId"
              element={<WinnerPage onRestart={handleRestart} />}
            />
          </Routes>
        </AppContainer>
      )}
    </ThemeProvider>
  );
};

export default App;