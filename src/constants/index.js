export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ACCOUNT: '/conta',
  PHOTO: (id) => `/foto/${id}`,
  PROFILE: (user) => `/perfil/${user}`,
};

export const PAGINATION = {
  PHOTOS_PER_PAGE: 6,
  SCROLL_THRESHOLD: 0.75,
  INFINITE_SCROLL_DELAY: 500,
  MAX_PHOTOS_PER_PAGE: 50,
};

export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MIN_USERNAME_LENGTH: 3,
};

export const STORAGE_KEYS = {
  TOKEN: 'token',
};

export const ERROR_MESSAGES = {
  INVALID_TOKEN: 'Token inválido',
  NETWORK_ERROR: 'Erro de conexão com o servidor',
  UNAUTHORIZED: 'Não autorizado',
  NOT_FOUND: 'Recurso não encontrado',
  SERVER_ERROR: 'Erro interno do servidor',
};

