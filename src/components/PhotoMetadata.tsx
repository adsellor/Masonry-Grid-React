import stylex from '@stylexjs/stylex';
import { Photo } from '../types/photo';

const styles = stylex.create({
  metadata: {
    display: 'grid',
    gap: '1.5rem',
  },
  metadataItem: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
});

interface PhotoMetadataProps {
  photo: Photo;
}

export const PhotoMetadata = ({ photo }: PhotoMetadataProps) => (
  <div {...stylex.props(styles.metadata)}>
    <h2>Image Details</h2>
    <div {...stylex.props(styles.metadataItem)}>
      <span>Photographer:</span>
      <span>{photo.photographer}</span>
    </div>
    <div {...stylex.props(styles.metadataItem)}>
      <span>Dimensions:</span>
      <span>{photo.width} x {photo.height}</span>
    </div>
  </div>
);
