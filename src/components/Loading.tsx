import { Loader2 } from "lucide-react"
import stylex from '@stylexjs/stylex';

interface LoadingProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
}

const spin = stylex.keyframes({
  '0%': { transform: 'rotate(0deg)' },
  '100%': { transform: 'rotate(360deg)' },
});


const styles = stylex.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    padding: '1rem',
  },
  loader: {
    animation: `${spin} 1s linear infinite`,
  },
  small: { width: '1rem', height: '1rem' },
  medium: { width: '2rem', height: '2rem' },
  large: { width: '3rem', height: '3rem' },
  text: {
    fontSize: '1rem',
    fontWeight: '500',
  },
});

export const Loading = ({ size = 'medium', text = 'Loading...' }: LoadingProps) => {
  return (
    <div {...stylex.props(styles.container)}>
      <Loader2
        {...stylex.props(styles.loader, styles[size])}
      />
      <p {...stylex.props(styles.text)}>{text}</p>
    </div>
  )
}
