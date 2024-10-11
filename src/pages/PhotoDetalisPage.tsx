import stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Photo } from '../types/photo';
import { getPhotoById } from '../utils/api';

const styles = stylex.create({
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'row',
  },
  image: {
    borderRadius: '0.5rem',
  },
  infoContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '2rem',
  },
  metadata: {
    display: 'grid',
    gap: '1.5rem',
    marginLeft: '10rem'
  },
  metadataItem: {
    display: 'flex',
    justifyContent: 'space-between',
  },
});


export const PhotoDetailsPage = () => {
  const { state } = useLocation();
  const [photoInfo, setPhotoInfo] = useState<Photo>(state);
  const navigate = useNavigate();
  const params = useParams();


  const fetchInfo = useCallback(async () => {
    const res = await getPhotoById(params.id ?? "")
    if (res) setPhotoInfo(res)
  }, [params.id])

  useEffect(() => {
    if (!photoInfo)
      fetchInfo()
  }, [fetchInfo, photoInfo])

  const goBack = () => {
    if (state) {
      navigate(-1)
      return;
    }

    navigate('/')
  }

  if (!photoInfo) {
    return <div> Loading ... </div>
  }


  return (
    <div {...stylex.props(styles.container)}>
      <header onClick={goBack} {...stylex.props(styles.header)}>
        Go to Gallery
        <h1>{photoInfo.alt}</h1>
      </header>
      <div {...stylex.props(styles.imageContainer)}>
        <img src={photoInfo.src.large} alt={photoInfo.alt} {...stylex.props(styles.image)} />
        <div>
          <div {...stylex.props(styles.metadata)}>
            <h2>Image Details</h2>
            <div {...stylex.props(styles.metadataItem)}>
              <span>Photographer:</span>
              <span>{photoInfo.photographer}</span>
            </div>
            <div {...stylex.props(styles.metadataItem)}>
              <span>Dimensions:</span>
              <span>{photoInfo.width} x {photoInfo.height}</span>
            </div>
            <div {...stylex.props(styles.metadataItem)}>
              <span>Color:</span>
              <span style={{ backgroundColor: photoInfo.avg_color, width: '20px', height: '20px', display: 'inline-block', borderRadius: '50%' }}></span>
            </div>
          </div>
        </div>
      </div>
      <div {...stylex.props(styles.infoContainer)}>
        {photoInfo.alt && <div>
          <h2>About this photo</h2>
          <p>{photoInfo.alt}</p>
        </div>}
      </div>
    </div>
  );
};
