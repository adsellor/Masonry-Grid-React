import { Loader2 } from "lucide-react"

interface LoadingProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
}

export default function Loading({ size = 'medium', text = 'Loading...' }: LoadingProps = {}) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-2 p-4">
      <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
      <p className="text-sm font-medium text-muted-foreground">{text}</p>
    </div>
  )
}
