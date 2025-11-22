import { useNavigate } from 'react-router-dom'

interface BackButtonProps {
  className?: string
}

const BackButton = ({ className = '' }: BackButtonProps) => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <button
      onClick={handleGoBack}
      className={`inline-flex items-center gap-2 text-brown hover:text-primary transition-colors text-sm font-medium ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-4 h-4"
      >
        <path d="m12 19-7-7 7-7" />
        <path d="M19 12H5" />
      </svg>
      Voltar
    </button>
  )
}

export default BackButton

