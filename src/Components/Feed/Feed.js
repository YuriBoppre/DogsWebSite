import React from 'react';
import FeedModal from './FeedModal';
import FeedPhotos from './FeedPhotos';
import PropTypes from 'prop-types';
import { PAGINATION } from '../../constants';
import styles from './Feed.module.css';

const Feed = ({ user }) => {
  const [modalPhoto, setModalPhoto] = React.useState(null),
    [pages, setPages] = React.useState([1]),
    [infinite, setInfinite] = React.useState(true);

  React.useEffect(() => {
    let isThrottling = false;

    function infiniteScroll() {
      if (infinite) {
        const scroll = window.scrollY,
          height = document.body.offsetHeight - window.innerHeight;

        if (
          scroll > height * PAGINATION.SCROLL_THRESHOLD &&
          !isThrottling
        ) {
          setPages((pages) => [...pages, pages.length + 1]);
          isThrottling = true;

          setTimeout(() => {
            isThrottling = false;
          }, PAGINATION.INFINITE_SCROLL_DELAY);
        }
      }
    }

    window.addEventListener('wheel', infiniteScroll);
    window.addEventListener('scroll', infiniteScroll);
    return () => {
      window.removeEventListener('wheel', infiniteScroll);
      window.removeEventListener('scroll', infiniteScroll);
    };
  }, [infinite]);

  return (
    <div>
      {modalPhoto && (
        <FeedModal photo={modalPhoto} setModalPhoto={setModalPhoto} />
      )}
      {pages.map((page) => (
        <FeedPhotos
          key={page}
          user={user}
          page={page}
          setModalPhoto={setModalPhoto}
          setInfinite={setInfinite}
        />
      ))}
      {!infinite && !user && (
        <p className={styles.endMessage}>
          Não existem mais postagens.
        </p>
      )}
    </div>
  );
};

Feed.defaultProps = {
  user: 0,
};

Feed.propTypes = {
  user: PropTypes.oneOfType([
    PropTypes.string.isRequired,
    PropTypes.number.isRequired,
  ]),
};

export default Feed;
