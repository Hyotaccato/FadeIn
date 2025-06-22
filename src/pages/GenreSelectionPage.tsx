import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getGenres, getPosterUrl } from '../services/tmdbService';
import LoadingSpinner from './LoadingSpinner';

interface Genre {
  id: number;
  name: string;
}

interface RatedMovie {
  id: number;
  title: string;
  poster_path: string | null;
  rating: number;
}

interface GenreSelectionPageProps {
  onSelectGenres: (genreIds: number[]) => void;
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 40px 20px;
  box-sizing: border-box;
  min-height: 100vh;
`;

const Heading = styled.h2`
  font-size: 2rem;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  font-weight: 700;
  letter-spacing: -0.5px;
`;

const GenreGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 800px;
  margin-bottom: 50px;
`;

const GenreItem = styled.label<{ selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border-radius: 12px;
  background-color: ${({ selected, theme }) =>
    selected ? theme.colors.primary : theme.colors.darkGray};
  color: ${({ selected }) => (selected ? 'white' : '#E0E0E0')};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
  border: 1px solid ${({ selected, theme }) => (selected ? theme.colors.primary : '#555')};

  &:hover {
    background-color: ${({ selected, theme }) =>
      selected ? theme.colors.primary : '#555'};
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.35);
  }

  input[type='checkbox'] {
    display: none;
  }
`;

const SelectButton = styled.button`
  padding: 15px 35px;
  font-size: 1.3rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
  font-weight: 700;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);

  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #555;
    cursor: not-allowed;
    opacity: 0.7;
    transform: none;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 25px;
  margin-bottom: 50px;
  border-bottom: 1px solid #444;
  padding-bottom: 10px;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 12px 30px;
  font-size: 1.2rem;
  border: none;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  background-color: ${({ active, theme }) =>
    active ? theme.colors.primary : theme.colors.darkGray};
  color: ${({ active }) => (active ? 'white' : '#bbb')};
  transition: background-color 0.3s ease, color 0.3s ease;
  font-weight: 600;
  box-shadow: ${({ active }) => (active ? '0 -4px 10px rgba(0,0,0,0.2)' : 'none')};
  transform: ${({ active }) => (active ? 'translateY(-5px)' : 'none')};
  border-bottom: ${({ active, theme }) => (active ? `3px solid ${theme.colors.secondary}` : 'none')};


  &:hover {
    background-color: ${({ active, theme }) =>
      active ? theme.colors.primary : '#444'};
    color: white;
  }
`;

const RatedMoviesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 30px;
  width: 100%;
  max-width: 900px;
  margin-top: 20px;
`;

const RatedMovieCard = styled.div`
  background-color: ${({ theme }) => theme.colors.darkGray};
  border-radius: 12px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.4);
  }
`;

const RatedMoviePoster = styled.img`
  width: 100%;
  height: 270px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 15px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.2);
`;

const RatedMovieTitle = styled.h4`
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.15rem;
  margin-bottom: 8px;
  text-align: center;
  font-weight: 600;
  line-height: 1.4;
`;

const RatingText = styled.p`
  color: #FFD700;
  font-weight: bold;
  font-size: 1.3rem;
  text-align: center;
  display: flex;
  align-items: center;
  gap: 5px;

  &::before {
    content: '⭐';
    font-size: 1.2em;
  }
`;

const GenreSelectionPage: React.FC<GenreSelectionPageProps> = ({ onSelectGenres }) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'genres' | 'rated'>('genres');
  const [ratedMovies, setRatedMovies] = useState<RatedMovie[]>([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const fetchedGenres = await getGenres();
        setGenres(fetchedGenres);
      } catch (err) {
        setError('장르를 불러오는 데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchGenres();
  }, []);

  useEffect(() => {
    const storedRatings = localStorage.getItem('ratedMovies');
    if (storedRatings) {
      const parsed: Record<string, RatedMovie> = JSON.parse(storedRatings);
      setRatedMovies(Object.values(parsed));
    } else {
      setRatedMovies([]);
    }
  }, [activeTab]);

  const handleCheckboxChange = (genreId: number) => {
    setSelectedGenreIds((prevSelected) =>
      prevSelected.includes(genreId)
        ? prevSelected.filter((id) => id !== genreId)
        : [...prevSelected, genreId]
    );
  };

  const handleSubmit = () => {
    if (selectedGenreIds.length > 0) {
      onSelectGenres(selectedGenreIds);
    } else {
      alert('하나 이상의 장르를 선택해주세요.');
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <PageContainer>
        <p style={{ color: 'red' }}>{error}</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <TabsContainer>
        <TabButton
          active={activeTab === 'genres'}
          onClick={() => setActiveTab('genres')}
        >
          장르 선택
        </TabButton>
        <TabButton
          active={activeTab === 'rated'}
          onClick={() => setActiveTab('rated')}
        >
          내 별점 목록
        </TabButton>
      </TabsContainer>

      {activeTab === 'genres' && (
        <>
          <Heading>좋아하는 영화 장르를 선택하세요</Heading>
          <GenreGrid>
            {genres.map((genre) => (
              <GenreItem
                key={genre.id}
                selected={selectedGenreIds.includes(genre.id)}
              >
                <input
                  type="checkbox"
                  id={`genre-${genre.id}`}
                  checked={selectedGenreIds.includes(genre.id)}
                  onChange={() => handleCheckboxChange(genre.id)}
                />
                {genre.name}
              </GenreItem>
            ))}
          </GenreGrid>
          <SelectButton onClick={handleSubmit} disabled={selectedGenreIds.length === 0}>
            다음
          </SelectButton>
        </>
      )}

      {activeTab === 'rated' && (
        <>
          <Heading>내가 별점 준 영화들</Heading>
          {ratedMovies.length === 0 ? (
            <p style={{ color: '#bbb', fontSize: '1.1rem' }}>아직 별점을 준 영화가 없습니다. 영화를 감상하고 별점을 남겨보세요!</p>
          ) : (
            <RatedMoviesGrid>
              {ratedMovies.map(movie => (
                <RatedMovieCard key={movie.id}>
                  {movie.poster_path ? (
                    <RatedMoviePoster
                      src={getPosterUrl(movie.poster_path)}
                      alt={movie.title}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: 270,
                        backgroundColor: '#444',
                        borderRadius: '8px',
                        marginBottom: '15px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#999',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                      }}
                    >
                      No Image
                    </div>
                  )}
                  <RatedMovieTitle>{movie.title}</RatedMovieTitle>
                  <RatingText>{movie.rating}</RatingText>
                </RatedMovieCard>
              ))}
            </RatedMoviesGrid>
          )}
        </>
      )}
    </PageContainer>
  );
};

export default GenreSelectionPage;