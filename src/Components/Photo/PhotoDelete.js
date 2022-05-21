import React from "react";
import styles from "./PhotoDelete.module.css";
import { PHOTO_DELETE } from "../../api";
import useFetch from "../../Hooks/useFetch";

const PhotoDelete = ({ id }) => {
  const { loading, request } = useFetch();

  async function handleCkick() {
    const confirm = window.confirm("Tem certeza que deseja deletar?");

    if (!confirm) return;

    const { url, options } = PHOTO_DELETE(id),
      { response } = await request(url, options);

    if (response.ok) window.location.reload();
  }

  return (
    <>
      {loading ? (
        <button className={styles.delete} disabled>
          Deletar
        </button>
      ) : (
        <button onCLick={handleCkick} className={styles.delete}>
          Deletar
        </button>
      )}
    </>
  );
};

export default PhotoDelete;
