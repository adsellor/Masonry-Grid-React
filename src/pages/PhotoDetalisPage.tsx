import stylex from '@stylexjs/stylex';
import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

import { Photo } from '../types/photo';
import { getPhotoById } from '../api';
import { PhotoCard } from '../components/PhotoCard';
import { PhotoMetadata } from '../components/PhotoMetadata';

const styles = stylex.create({
  wrapper: (backgroundColor: string) => ({
    backgroundColor,
    flex: 1,
    minHeight: '100vh'
  }),
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '1rem',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    textAlign: 'center',
    flex: 1,
    minWidth: '200px',
  },
  imageContainer: {
    marginBottom: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  infoContainer: {
    display: 'grid',
    gap: '2rem',
    '@media (min-width: 768px)': {
      gridTemplateColumns: '1fr 1fr',
    },
  },
  button: {
    display: 'flex',
    borderRadius: 15,
    backgroundColor: 'lightgray',
    border: '1px solid',
    padding: '0.5rem 1rem',
    cursor: 'pointer',
    justifyContent: 'center',
    alignItems: 'center',
    ':hover': {
      backgroundColor: 'gray',
      color: 'white',
    },
  },
});

export const PhotoDetailsPage = () => {
  const { state } = useLocation();
  const [photoInfo, setPhotoInfo] = useState<Photo | null>(state);
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
    return <div>Loading...</div>
  }

  return (
    <div {...stylex.props(styles.wrapper(photoInfo.avg_color))} >
      <div {...stylex.props(styles.container)}>
        <header {...stylex.props(styles.header)}>
          <button onClick={goBack} {...stylex.props(styles.button)}><ArrowLeft />Go to Gallery</button>
        </header>
        <div {...stylex.props(styles.header)}>
          <h1 {...stylex.props(styles.title)}>{photoInfo.alt}</h1>
        </div>
        <div {...stylex.props(styles.imageContainer)}>
          <PhotoCard
            aspectRatio={1.5}
            src={photoInfo.src.original}
            alt={photoInfo.alt}
          />
        </div>
        <div {...stylex.props(styles.infoContainer)}>
          {photoInfo.alt && (
            <div>
              <h2>About this photo</h2>
              <p>{photoInfo.alt}</p>
            </div>
          )}
          <PhotoMetadata photo={photoInfo} />
        </div>
      </div>
    </div >
  );
};
