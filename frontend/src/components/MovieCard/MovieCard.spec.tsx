import { render, screen, fireEvent } from '@testing-library/react';
import { MovieCard } from './index';
import { TmdbMovie } from '../../features/movies/types/movie.types';

const mockMovie: TmdbMovie = {
  id: 550,
  title: 'Fight Club',
  overview: 'An insomniac office worker...',
  poster_path: '/poster.jpg',
  vote_average: 8.4,
  release_date: '1999-10-15',
  genre_ids: [18],
};

describe('MovieCard', () => {
  it('should render the movie title and release year', () => {
    render(
      <MovieCard movie={mockMovie} isAlreadyFavorited={false} onAddToFavorites={jest.fn()} />,
    );

    expect(screen.getByText('Fight Club')).toBeInTheDocument();
    expect(screen.getByText('1999')).toBeInTheDocument();
  });

  it('should render the movie rating', () => {
    render(
      <MovieCard movie={mockMovie} isAlreadyFavorited={false} onAddToFavorites={jest.fn()} />,
    );

    expect(screen.getByText(/8\.4/)).toBeInTheDocument();
  });

  it('should call onAddToFavorites with the movie when the favorite button is clicked', () => {
    const onAddToFavorites = jest.fn();

    render(
      <MovieCard movie={mockMovie} isAlreadyFavorited={false} onAddToFavorites={onAddToFavorites} />,
    );

    fireEvent.click(screen.getByRole('button', { name: /favoritar fight club/i }));

    expect(onAddToFavorites).toHaveBeenCalledWith(mockMovie);
  });

  it('should disable the favorite button and show "Favoritado" when already favorited', () => {
    render(
      <MovieCard movie={mockMovie} isAlreadyFavorited={true} onAddToFavorites={jest.fn()} />,
    );

    const button = screen.getByRole('button', { name: /já favoritado/i });
    expect(button).toBeDisabled();
    expect(screen.getByText(/Favoritado/)).toBeInTheDocument();
  });
});
