export default function LatestLog() {
    const logs = [
      {
        title: "My logo lost its life after vectorizing it",
        category: "Brand",
        date: "March 22, 2025",
      },
      {
        title: "What's more important when designing logos?",
        category: "Design",
        date: "March 19, 2025",
      },
      {
        title: "Why most designers struggle with having a logo for their personal brand",
        category: "Thoughts",
        date: "March 17, 2025",
      },
    ];
  
    return (
      <section className="w-full py-16 border-b border-gray-300 dark:border-gray-700">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Log Updates</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Thoughts, mistakesm and occational realizations. No grand lessons—just things I&apos;ve noticed
          </p>
  
          <div className="space-y-6">
            {logs.map((log, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-4">
                <div>
                  <p className="text-lg font-medium">{log.title}</p>
                  <p className="text-sm text-gray-500">{log.category}</p>
                </div>
                <p className="text-sm text-gray-400 font-jetbrains-mono">{log.date}</p>
              </div>
            ))}
          </div>
  
          <a href="#" className="inline-block mt-6 text-blue-600 dark:text-blue-400 font-medium">
            View More Logs →
          </a>
        </div>
      </section>
    );
  }
  