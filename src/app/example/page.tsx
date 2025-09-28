import SimpleBlackHole from '@/components/example/example';

export default function Page() {
  return (
    <div className="min-h-screen bg-black">
      {/* Hero section with black hole */}
      <section className="h-screen">
        <SimpleBlackHole 
          size={0.6}
          diskRadius={3.0}
          rotationSpeed={0.8}
          showStars={true}
          className="w-full h-full"
        />
      </section>
      
      {/* Other content */}
      <section className="min-h-screen bg-gray-900 p-8">
        <h2 className="text-4xl text-white text-center">
          Explore the Universe
        </h2>
      </section>
    </div>
  );
}
