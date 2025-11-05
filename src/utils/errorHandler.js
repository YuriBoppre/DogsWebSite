import { ERROR_MESSAGES } from '../constants';

export const handleApiError = (error) => {
  if (error?.response) {
    return error.response.data?.message || ERROR_MESSAGES.SERVER_ERROR;
  }

  if (error?.request) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  if (error instanceof Error) {
    return error.message || ERROR_MESSAGES.SERVER_ERROR;
  }

  return ERROR_MESSAGES.SERVER_ERROR;
};

export const isResponseOk = (response) => {
  return response && response.ok;
};

export const extractErrorMessage = async (response) => {
  try {
    const json = await response.json();
    return json.message || ERROR_MESSAGES.SERVER_ERROR;
  } catch {
    return ERROR_MESSAGES.SERVER_ERROR;
  }
};

