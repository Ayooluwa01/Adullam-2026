import Countdown from "./countDown";

export default function Hero() {
  return (
    <section className="w-full text-center py-12 md:py-16 bg-[#F8F5F0]">
      {/* Container to give some breathing room */}
      <div className="max-w-4xl mx-auto px-6">
        {/* The Event Title - Inspired by the flyer's main typography */}
        <h1 className="font-serif text-5xl md:text-7xl font-bold mb-4 tracking-tighter leading-tight">
          {/* Main Title - Rich Brown */}
          <span className="block text-[#3D261C]">Adullam 2026</span>
          {/* Subtitle - Warm Gold Accent */}
          <span className="block text-[#B5915D]">Pillar of Our Faith</span>
        </h1>

        {/* Separator / Sub-header */}
        <p className="text-xl md:text-2xl font-semibold text-[#6E564B] tracking-tight mb-8">
          A Journey of Spiritual Renewal
        </p>

        {/* Informational Paragraph - Highlighting key details and action */}
        <p className="text-base md:text-lg text-[#3D261C] max-w-2xl mx-auto font-sans leading-relaxed mb-10">
          Be part of a transformative experience hosted by the Cherubim and
          Seraphim Movement Church. Personalize your sacred invitation and
          prepare for a weekend dedicated to strengthening our spiritual
          foundation.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center">
          {/* <button className="bg-[#3D261C] text-white px-8 py-3 rounded-full font-semibold text-lg hover:bg-[#B5915D] transition duration-300 shadow-md">
            Create Invitation
          </button> */}
          <Countdown />
          <button
            onClick={() => {
              document.getElementById("trend-section")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            className="bg-transparent border-2 border-[#3D261C] text-[#3D261C] px-8 py-3 rounded-xl font-semibold text-lg hover:bg-[#3D261C] hover:text-white transition duration-300"
          >
            Join the trend
          </button>
        </div>
      </div>
    </section>
  );
}
