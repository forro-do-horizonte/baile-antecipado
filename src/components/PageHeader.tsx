import { useNavigate } from 'react-router-dom'
import { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: ReactNode
  actionButton?: ReactNode
}

const PageHeader = ({ title, subtitle, actionButton }: PageHeaderProps) => {
  const navigate = useNavigate()

  const handleGoBack = () => {
    navigate(-1)
  }

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-brown mb-2">
            {title}
          </h1>
          {subtitle && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleGoBack}
                className="hidden md:inline-flex items-center gap-2 text-brown hover:text-primary transition-colors text-sm font-medium flex-shrink-0"
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
              <div>{subtitle}</div>
            </div>
          )}
        </div>
        {actionButton && <div className="flex-shrink-0">{actionButton}</div>}
      </div>
    </div>
  )
}

export default PageHeader

