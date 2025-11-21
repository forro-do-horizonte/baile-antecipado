import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="w-full border-t border-brown/20 px-4 py-6 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Links */}
        <div className="flex items-center gap-4">
          <Link to="/privacidade" className="text-brown text-xs sm:text-sm cordel-text-small hover:text-primary transition-colors duration-300">
            Privacidade
          </Link>
          <Link to="/termos" className="text-brown text-xs sm:text-sm cordel-text-small hover:text-primary transition-colors duration-300">
            Termos de Uso
          </Link>
        </div>

        {/* Copyright */}
        <p className="text-brown text-xs sm:text-sm cordel-text-small">
          © 2024 Baile Antecipado. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}

export default Footer

