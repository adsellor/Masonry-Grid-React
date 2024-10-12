import stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

import { Photo } from '../types/photo';
import { getPhotoById } from '../utils/api';
import { PhotoCard } from '../components/PhotoCard';

const styles = stylex.create({
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '2rem',
  },
  title: {
    maxWidth: '50rem',
    textAlign: 'center',
    marginRight: 'auto',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
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
  button: {
    marginRight: 'auto',
    borderRadius: 15,
    backgroundColor: 'lightgray',
    border: '1px solid',
    padding: '0.25rem'
  }
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
      <header {...stylex.props(styles.header)}>
        <a onClick={goBack} {...stylex.props(styles.button)}> Go to Gallery </a>
        <h1 {...stylex.props(styles.title)}>{photoInfo.alt}</h1>
      </header>
      <div {...stylex.props(styles.imageContainer)}>
        <PhotoCard width={photoInfo.width / 6} height={photoInfo.height / 10} src={photoInfo.src.original} alt={photoInfo.alt} />
        <div>
        </div>
      </div>
      <div {...stylex.props(styles.infoContainer)}>
        {photoInfo.alt && <div>
          <h2>About this photo</h2>
          <p>{photoInfo.alt}</p>
        </div>}
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
  );
};
