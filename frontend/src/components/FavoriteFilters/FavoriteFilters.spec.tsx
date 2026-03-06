import { render, screen, fireEvent, act } from '@testing-library/react';
import { FavoriteFilters } from './index';
import { useFavoritesStore } from '../../features/favorites/store/useFavoritesStore';

jest.mock('../../features/favorites/store/useFavoritesStore');
jest.useFakeTimers();

describe('FavoriteFilters', () => {
  const mockSetFilters = jest.fn();

  beforeEach(() => {
    (useFavoritesStore as unknown as jest.Mock).mockReturnValue({
      filters: {},
      setFilters: mockSetFilters,
    });
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
  });

  it('should render the actor and tag filter inputs and the sort select', () => {
    render(<FavoriteFilters />);

    expect(screen.getByPlaceholderText('Filtrar por ator...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Filtrar por tag...')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /ordenar favoritos/i })).toBeInTheDocument();
  });

  it('should debounce the actor filter and call setFilters after the delay', async () => {
    render(<FavoriteFilters />);

    fireEvent.change(screen.getByPlaceholderText('Filtrar por ator...'), {
      target: { value: 'Brad Pitt' },
    });

    expect(mockSetFilters).not.toHaveBeenCalled();

    act(() => jest.runAllTimers());

    expect(mockSetFilters).toHaveBeenCalledWith({ actor: 'Brad Pitt' });
  });

  it('should update sort order when the select changes', () => {
    render(<FavoriteFilters />);

    fireEvent.change(screen.getByRole('combobox', { name: /ordenar favoritos/i }), {
      target: { value: 'rating-desc' },
    });

    expect(mockSetFilters).toHaveBeenCalledWith({ sortBy: 'rating', order: 'desc' });
  });
});
