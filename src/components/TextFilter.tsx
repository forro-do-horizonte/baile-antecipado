interface TextFilterProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

const TextFilter = ({ value, onChange, placeholder = 'Pesquisar...' }: TextFilterProps) => {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="px-4 py-2 min-w-[250px] border border-gray-300 bg-white text-brown rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary font-serif text-sm placeholder:text-brown/50"
    />
  )
}

export default TextFilter

