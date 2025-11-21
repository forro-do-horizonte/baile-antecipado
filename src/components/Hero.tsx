const Hero = () => {
  return (
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-gray-800"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&q=80")',
          filter: 'grayscale(100%) brightness(0.7)'
        }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-brown mb-4 max-w-3xl">
          A Tradição do Forró
        </h1>
        <p className="text-lg md:text-xl text-brown max-w-2xl">
          Viva a cultura nordestina nos melhores shows de forró pé de serra. Garanta seu ingresso!
        </p>
      </div>
    </section>
  )
}

export default Hero

