import React from "react";
import { PHOTO_GET } from "../../api";
import useFetch from "../../Hooks/useFetch";
import Error from "../Helper/Error";
import Loading from "../Helper/Loading";
import styles from "./FeedModal.module.css";
import PhotoContent from "../Photo/PhotoContent";

const FeedModal = ({ photo }) => {
  const { data, loading, error, request } = useFetch();
  
  React.useEffect(() => {
    const { url, options } = PHOTO_GET(photo.id),
    { json } = await request(url, options);
  }, [photo, request]);

  return <div className={styles.modal}>
    {error && <Error error={error} />}
    {loading && <Loading />}
    {data && <PhotoContent data={data}/>}
  </div>;
};

export default FeedModal;
