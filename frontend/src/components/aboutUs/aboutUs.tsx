const AboutUs = () => {
  return (
    <section
      id="aboutUs"
      className="py-16 lg:py-20 bg-gray-950 relative overflow-hidden"
    >

      <div className="relative px-4 sm:px-6 lg:px-8 mx-auto max-w-7xl">
        
        {/* HEADER */}
        <div className="mx-auto max-w-4xl text-center mb-14">
          <h2 className="mb-6 text-4xl md:text-5xl tracking-tight font-bold leading-tight gold-text">
            About{" "}
            <span className="bg-gradient-to-r from-red-700 via-red-600 to-yellow-500 bg-clip-text text-transparent ">
              Us
            </span>
          </h2>

          <p className="mb-8 font-light text-gray-300 text-lg md:text-xl">
            Don't let lost items remain lost. PUPQuestC bridges the gap between lost and found,
            reuniting the PUPQC community with what matters most.
          </p>
        </div>

        {/* CONTENT BOX */}
        <div className="mx-auto max-w-5xl">
          <div className="glass-card rounded-2xl p-8 md:p-12">
            
            <p className="font-light text-gray-300 text-lg md:text-xl leading-relaxed text-center">
              A unified asset recovery system serving the entire PUPQC community — bridging the gap
              between students and faculty for a more connected campus experience. We believe that losing
              something important should not be a hopeless experience. With honesty, transparency, and
              empathy, every lost item has a chance to be found, and every finder has a chance to make a
              difference in someone's day.
            </p>

            {/* FEATURES */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
              
              {/* CARD 1 */}
              <div className="text-center p-6 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-gray-700/60 transition-colors duration-200">
                <div className="text-blue-400 text-4xl mb-4 ">
                  🔍
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Search & Find
                </h3>
                <p className="text-gray-400 text-sm">
                  AI-powered search using Google Gemini to intelligently match lost and found items
                  even with different descriptions.
                </p>
              </div>

              {/* CARD 2 */}
              <div className="text-center p-6 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-gray-700/60 transition-colors duration-200">
                <div className="text-green-400 text-4xl mb-4 ">
                  🤝
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Community
                </h3>
                <p className="text-gray-400 text-sm">
                  Connecting students, faculty, and staff of PUPQC through a trusted and secure
                  community platform.
                </p>
              </div>

              {/* CARD 3 */}
              <div className="text-center p-6 rounded-xl bg-gray-800/50 border border-gray-700/50 hover:border-gray-700/60 transition-colors duration-200">
                <div className="text-yellow-400 text-4xl mb-4 ">
                  🛡️
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Secure
                </h3>
                <p className="text-gray-400 text-sm">
                  Encrypted passwords, secure login, and a strict claim verification process to
                  prevent fraud and protect users.
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default AboutUs;