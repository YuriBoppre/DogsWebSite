import React from 'react';
import PropTypes from 'prop-types';
import FeedPhotosItem from './FeedPhotosItem';
import useFetch from '../../Hooks/useFetch';
import { PHOTOS_GET } from '../../api';
import Error from '../Helper/Error';
import Loading from '../Helper/Loading';
import { PAGINATION } from '../../constants';
import styles from './FeedPhotos.module.css';

const FeedPhotos = ({ page, user, setModalPhoto, setInfinite }) => {
  const { data, loading, error, request } = useFetch();

  React.useEffect(() => {
    async function fetchPhotos() {
      const total = PAGINATION.PHOTOS_PER_PAGE,
        { url, options } = PHOTOS_GET({ page, total, user }),
        { response, json } = await request(url, options);

      if (response && response.ok && json.length < total) {
        setInfinite(false);
      }
    }
    fetchPhotos();
  }, [request, user, page, setInfinite]);

  if (error) return <Error error={error} />;
  if (loading) return <Loading />;
  if (data && data.length > 0) {
    return (
      <ul className={`${styles.feed} animeLeft`}>
        {data.map((photo) => (
          <FeedPhotosItem
            key={photo.id}
            photo={photo}
            setModalPhoto={setModalPhoto}
          />
        ))}
      </ul>
    );
  } else return null;
};

FeedPhotos.propTypes = {
  page: PropTypes.number.isRequired,
  user: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setModalPhoto: PropTypes.func.isRequired,
  setInfinite: PropTypes.func.isRequired,
};

FeedPhotos.defaultProps = {
  user: 0,
};

export default FeedPhotos;
