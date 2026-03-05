import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddToFavoritesModal } from './index';
import { TmdbMovie } from '../../features/movies/types/movie.types';
import { movieService } from '../../features/movies/services/movieService';
import { useFavoritesStore } from '../../features/favorites/store/useFavoritesStore';

jest.mock('../../features/movies/services/movieService');
jest.mock('../../features/favorites/store/useFavoritesStore');
jest.mock('../../lib/tmdb', () => ({
  TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500',
}));

const mockMovie: TmdbMovie = {
  id: 550,
  title: 'Fight Club',
  overview: 'An insomniac...',
  poster_path: '/poster.jpg',
  vote_average: 8.4,
  release_date: '1999-10-15',
  genre_ids: [18],
};

describe('AddToFavoritesModal', () => {
  const mockAddFavorite = jest.fn();
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    (useFavoritesStore as unknown as jest.Mock).mockReturnValue({
      addFavorite: mockAddFavorite,
    });
    (movieService.fetchCredits as jest.Mock).mockResolvedValue({
      id: 550,
      cast: [{ name: 'Brad Pitt', character: 'Tyler Durden', id: 1, profile_path: null, order: 0 }],
    });
    jest.clearAllMocks();
  });

  it('should render the movie title in the modal heading', () => {
    render(
      <AddToFavoritesModal movie={mockMovie} onClose={mockOnClose} onSuccess={mockOnSuccess} />,
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Fight Club')).toBeInTheDocument();
  });

  it('should call onClose when the cancel button is clicked', () => {
    render(
      <AddToFavoritesModal movie={mockMovie} onClose={mockOnClose} onSuccess={mockOnSuccess} />,
    );

    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should fetch credits, add favorite, and call onSuccess on confirm', async () => {
    mockAddFavorite.mockResolvedValueOnce(undefined);

    render(
      <AddToFavoritesModal movie={mockMovie} onClose={mockOnClose} onSuccess={mockOnSuccess} />,
    );

    fireEvent.click(screen.getByRole('button', { name: /salvar favorito/i }));

    await waitFor(() => {
      expect(movieService.fetchCredits).toHaveBeenCalledWith(550);
      expect(mockAddFavorite).toHaveBeenCalled();
      expect(mockOnSuccess).toHaveBeenCalledTimes(1);
    });
  });

  it('should show an error message if addFavorite fails', async () => {
    mockAddFavorite.mockRejectedValueOnce(new Error('Failed'));

    render(
      <AddToFavoritesModal movie={mockMovie} onClose={mockOnClose} onSuccess={mockOnSuccess} />,
    );

    fireEvent.click(screen.getByRole('button', { name: /salvar favorito/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
  });
});
