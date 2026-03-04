import { MongoUserRepository } from '../infrastructure/database/repositories/MongoUserRepository';
import { MongoFavoriteRepository } from '../infrastructure/database/repositories/MongoFavoriteRepository';
import { BcryptPasswordHasher } from '../infrastructure/services/BcryptPasswordHasher';
import { JwtTokenService } from '../infrastructure/services/JwtTokenService';
import { RegisterUser } from '../application/use-cases/auth/RegisterUser';
import { LoginUser } from '../application/use-cases/auth/LoginUser';
import { AddFavorite } from '../application/use-cases/favorites/AddFavorite';
import { ListFavorites } from '../application/use-cases/favorites/ListFavorites';
import { UpdateFavoriteTags } from '../application/use-cases/favorites/UpdateFavoriteTags';
import { RemoveFavorite } from '../application/use-cases/favorites/RemoveFavorite';
import { AuthController } from '../presentation/controllers/AuthController';
import { FavoriteController } from '../presentation/controllers/FavoriteController';
import { ITokenService } from '../application/services/ITokenService';

interface AppContainer {
  authController: AuthController;
  favoriteController: FavoriteController;
  tokenService: ITokenService;
}

export function buildContainer(jwtSecret: string, jwtExpiresIn: string): AppContainer {
  const passwordHasher = new BcryptPasswordHasher();
  const tokenService = new JwtTokenService(jwtSecret, jwtExpiresIn);

  const userRepository = new MongoUserRepository();
  const favoriteRepository = new MongoFavoriteRepository();

  const registerUser = new RegisterUser(userRepository, passwordHasher);
  const loginUser = new LoginUser(userRepository, passwordHasher, tokenService);
  const addFavorite = new AddFavorite(favoriteRepository);
  const listFavorites = new ListFavorites(favoriteRepository);
  const updateFavoriteTags = new UpdateFavoriteTags(favoriteRepository);
  const removeFavorite = new RemoveFavorite(favoriteRepository);

  const authController = new AuthController(registerUser, loginUser);
  const favoriteController = new FavoriteController(
    addFavorite,
    listFavorites,
    updateFavoriteTags,
    removeFavorite,
  );

  return { authController, favoriteController, tokenService };
}
