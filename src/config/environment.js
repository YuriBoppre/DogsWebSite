/**
 * Configurações de ambiente da aplicação
 */

const config = {
  apiUrl: process.env.REACT_APP_API_URL || 'https://dogsapi.origamid.dev/json',
  environment: process.env.REACT_APP_ENVIRONMENT || 'development',
};

export default config;

