import { ButtonHTMLAttributes } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quintary' | 'sextiary'
  children: React.ReactNode
}

const Button = ({ 
  variant = 'primary', 
  children, 
  className = '',
  ...props 
}: ButtonProps) => {
  const baseStyles = (variant === 'quintary' || variant === 'sextiary')
    ? 'font-medium transition-all inline-block' 
    : 'font-medium transition-all border-2 inline-block'
  
  const variants = {
    primary: 'bg-primary hover:bg-primary-dark text-white border-brown shadow-[4px_4px_0_0_#000] hover:shadow-[3px_3px_0_0_#000] hover:translate-x-[1px] hover:translate-y-[1px] active:shadow-[2px_2px_0_0_#000] active:translate-x-[2px] active:translate-y-[2px]',
    secondary: 'bg-white hover:bg-beige-light text-brown border-primary shadow-[2px_2px_0px_0px_rgba(255,107,53,1)] hover:shadow-[1px_1px_0px_0px_rgba(255,107,53,1)] hover:translate-x-[1px] hover:translate-y-[1px]',
    tertiary: 'bg-white hover:bg-beige-light text-brown border-brown shadow-[2px_2px_0px_0px_rgba(61,40,23,1)] hover:shadow-[1px_1px_0px_0px_rgba(61,40,23,1)] hover:translate-x-[1px] hover:translate-y-[1px]',
    quaternary: 'bg-gray-200 hover:bg-gray-300 text-brown border-brown shadow-[2px_2px_0px_0px_rgba(61,40,23,1)] hover:shadow-[1px_1px_0px_0px_rgba(61,40,23,1)] hover:translate-x-[1px] hover:translate-y-[1px]',
    quintary: 'bg-transparent hover:bg-transparent text-primary border-0 hover:text-primary-dark',
    sextiary: 'bg-transparent hover:bg-transparent text-black border-0 hover:text-black/80'
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

