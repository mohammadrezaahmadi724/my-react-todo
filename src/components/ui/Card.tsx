import { clsx } from 'clsx'
import { HTMLAttributes, forwardRef } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'filled'
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', ...props }, ref) => {
    return (
      <div
        className={clsx(
          'rounded-lg shadow-sm transition-all duration-200',
          {
            'bg-white border border-gray-200': variant === 'default',
            'border border-gray-300': variant === 'outlined',
            'bg-gray-50 border border-gray-200': variant === 'filled',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Card.displayName = 'Card'
export default Card