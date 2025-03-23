export default function FeaturedProject() {
    const projects = [
      {
        title: "Freshbite Identity",
        category: "Branding, Logo, Design",
        description: "Helping Freshbite establish a bold and modern visual identity.",
      },
      {
        title: "SwiftPay",
        category: "Web Dev, Web3, Payment",
        description: "A decentralized payment system built with Web3 principles.",
      },
      {
        title: "Campus Navigator",
        category: "Offline Map Web App",
        description: "A GPS-based PWA that works even without internet access.",
      },
    ];
  
    return (
      <section className="w-full py-16 border-b border-gray-300 dark:border-gray-700">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Featured Projects</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            A few projects that survived my attention span.
          </p>
  
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <div key={index} className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{project.category}</p>
                <p className="mt-2 text-gray-700 dark:text-gray-300">{project.description}</p>
              </div>
            ))}
          </div>
  
          <div className="text-center mt-12">
            <a href="#" className="inline-block px-6 py-3 text-lg font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              View All Projects →
            </a>
          </div>
        </div>
      </section>
    );
  }
  