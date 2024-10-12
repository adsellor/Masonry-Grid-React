import stylex from '@stylexjs/stylex';
import { useRouteError } from 'react-router-dom';

const styles = stylex.create({
  errorContainer: {
    padding: '20px',
    backgroundColor: '#ffebee',
    border: '1px solid #f44336',
    borderRadius: '4px',
    margin: '20px 0',
  },
  heading: {
    color: '#d32f2f',
    marginTop: '0',
  },
  message: {
    color: '#333',
  },
});


export const ErrorBoundary = () => {
  const error = useRouteError();
  return (
    <div {...stylex.props(styles.errorContainer)}>
      <h2 {...stylex.props(styles.heading)}>Oops! Something went wrong.</h2>
      <p {...stylex.props(styles.message)}>
        {!!error && error.toString()}
      </p>
    </div>
  );
}
