import React from 'react';
import PropTypes from 'prop-types';
import styles from './Error.module.css';

const Error = ({ error }) => {
  if (!error) return null;

  return <p className={styles.error}>{error}</p>;
};

Error.propTypes = {
  error: PropTypes.string,
};

Error.defaultProps = {
  error: null,
};

export default Error;