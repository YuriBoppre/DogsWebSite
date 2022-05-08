import React from "react";
import { Link } from "react-router-dom";
import styles from "./PhotoContent.module.css";
import PhotoContents from "./PhotoContents";

const PhotoContent = ({ data }) => {
  const { photo, commments } = data;

  return (
    <div className={styles.photo}>
      <div className={styles.img}>
        <img src={photo.src} alt={photo.title} />
      </div>
      <div className={styles.details}></div>
      <div>
        <p>
          <Link to={`/perfil/${photo.author}`}>@{photo.author}</Link>
          <span className={styles.visualizacoes}>{photo.acessos}</span>
        </p>
        <h1 className="title">
          <Link to={`/foto/${photo.id}`}>{photo.title}</Link>
        </h1>
        <ul className={styles.attibutes}>
          <li>{photo.peso} Kg</li>
          <li>{photo.idade} anos</li>
        </ul>
      </div>
      <PhotoContents id={photo.id} comments={comments} />
    </div>
  );
};

export default PhotoContent;
