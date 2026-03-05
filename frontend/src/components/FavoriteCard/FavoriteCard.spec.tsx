import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { FavoriteCard } from './index';
import { Favorite } from '../../features/favorites/types/favorite.types';
import { useFavoritesStore } from '../../features/favorites/store/useFavoritesStore';

jest.mock('../../features/favorites/store/useFavoritesStore');
jest.mock('../../lib/tmdb', () => ({
  TMDB_IMAGE_BASE_URL: 'https://image.tmdb.org/t/p/w500',
}));

const mockFavorite: Favorite = {
  id: 'fav-id-1',
  userId: 'user-id-1',
  tmdbId: 550,
  title: 'Fight Club',
  rating: 8.4,
  posterPath: '/poster.jpg',
  actors: [{ name: 'Brad Pitt', character: 'Tyler Durden' }],
  tags: ['ação clássica', 'cult'],
  addedAt: '2024-01-01T00:00:00.000Z',
};

describe('FavoriteCard', () => {
  const mockUpdateTags = jest.fn();
  const mockRemoveFavorite = jest.fn();

  beforeEach(() => {
    (useFavoritesStore as unknown as jest.Mock).mockReturnValue({
      updateTags: mockUpdateTags,
      removeFavorite: mockRemoveFavorite,
    });
    jest.clearAllMocks();
  });

  it('should render the title, rating, and tags', () => {
    render(<FavoriteCard favorite={mockFavorite} />);

    expect(screen.getByText('Fight Club')).toBeInTheDocument();
    expect(screen.getByText(/8\.4/)).toBeInTheDocument();
    expect(screen.getByText('ação clássica')).toBeInTheDocument();
    expect(screen.getByText('cult')).toBeInTheDocument();
  });

  it('should show the tag editor when "Editar tags" is clicked', () => {
    render(<FavoriteCard favorite={mockFavorite} />);

    fireEvent.click(screen.getByRole('button', { name: /editar tags/i }));

    expect(screen.getByRole('button', { name: /salvar/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument();
  });

  it('should call removeFavorite with the correct id when remove is clicked', () => {
    render(<FavoriteCard favorite={mockFavorite} />);

    fireEvent.click(screen.getByRole('button', { name: /remover fight club/i }));

    expect(mockRemoveFavorite).toHaveBeenCalledWith('fav-id-1');
  });

  it('should show top actors in the card', () => {
    render(<FavoriteCard favorite={mockFavorite} />);

    expect(screen.getByText(/brad pitt/i)).toBeInTheDocument();
  });
});
