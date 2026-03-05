import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Film, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import { useFavorites } from '../../features/favorites/hooks/useFavorites';
import { useFavoritesStore } from '../../features/favorites/store/useFavoritesStore';
import { FavoriteCard } from '../../components/FavoriteCard';
import { FavoriteFilters } from '../../components/FavoriteFilters';
import { Spinner } from '../../components/ui/Spinner';
import { useAuth } from '../../features/auth/hooks/useAuth';

export function MyListPage() {
  const { user, logout } = useAuth();
  const { favorites, isLoading, error, filters, fetchFavorites } = useFavorites();
  const { total, totalPages, setFilters } = useFavoritesStore();

  const currentPage = filters.page ?? 1;

  useEffect(() => {
    fetchFavorites();
  }, [filters]);

  const handlePageChange = (page: number) => {
    setFilters({ page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-surface-primary"
    >
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="sticky top-0 z-40 border-b border-white/5 bg-surface-secondary/80 backdrop-blur-md shadow-glass"
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-white transition-opacity hover:opacity-80">
            <Film className="h-6 w-6 text-accent" />
            Cine<span className="text-accent">Tag</span>
          </Link>

          <div className="flex items-center gap-4">
            <span className="hidden sm:inline-block text-sm font-medium text-text-primary px-3 py-1 bg-surface-card rounded-full border border-white/5">
              Minha Lista
            </span>
            <span className="text-sm font-medium text-text-secondary">{user?.name}</span>
            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-full p-2 text-text-muted hover:text-accent hover:bg-surface-card transition-all"
              title="Sair"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.header>

      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mx-auto max-w-4xl px-4 py-8"
      >
        <div className="mb-6">
          <h2 className="mb-4 text-xl font-bold text-text-primary">
            Minha Lista{' '}
            {!isLoading ? (
              <span className="text-base font-normal text-text-muted">
                ({total} {total === 1 ? 'filme' : 'filmes'})
              </span>
            ) : null}
          </h2>

          <FavoriteFilters />
        </div>

        {error ? (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} role="alert" className="rounded-lg bg-red-900/30 border border-red-500/20 px-4 py-3 text-sm text-red-400">
            {error}
          </motion.p>
        ) : isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner size="lg" />
          </div>
        ) : favorites.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-4 py-20 text-text-secondary glass-panel rounded-xl mt-8">
            <p className="text-xl font-medium text-white">Sua lista está vazia.</p>
            <p className="text-sm text-text-muted">
              Tente remover os filtros ou{' '}
              <Link to="/" className="text-accent hover:text-white transition-colors underline-offset-4 hover:underline">
                adicionar novos filmes
              </Link>
              .
            </p>
          </motion.div>
        ) : (
          <>
            <motion.div
              className="flex flex-col gap-4 mt-8"
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { staggerChildren: 0.08 } }
              }}
              initial="hidden"
              animate="show"
            >
              {favorites.map((favorite) => (
                <FavoriteCard key={favorite.id} favorite={favorite} />
              ))}
            </motion.div>

            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed border border-surface-hover bg-surface-card text-text-secondary hover:border-accent hover:text-accent"
                  aria-label="Página anterior"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                  .reduce<(number | '...')[]>((acc, p, i, arr) => {
                    if (i > 0 && p - (arr[i - 1] as number) > 1) acc.push('...');
                    acc.push(p);
                    return acc;
                  }, [])
                  .map((item, i) =>
                    item === '...' ? (
                      <span key={`ellipsis-${i}`} className="px-2 text-text-muted text-sm">…</span>
                    ) : (
                      <button
                        key={item}
                        onClick={() => handlePageChange(item as number)}
                        aria-current={currentPage === item ? 'page' : undefined}
                        className={`min-w-[36px] rounded-lg px-3 py-2 text-sm font-medium transition-all border ${
                          currentPage === item
                            ? 'bg-accent border-accent text-white shadow-neon'
                            : 'border-surface-hover bg-surface-card text-text-secondary hover:border-accent hover:text-accent'
                        }`}
                      >
                        {item}
                      </button>
                    )
                  )}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed border border-surface-hover bg-surface-card text-text-secondary hover:border-accent hover:text-accent"
                  aria-label="Próxima página"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </motion.main>
    </motion.div>
  );
}
