export default function Now() {
    return (
      <section className="w-full py-16 border-b border-gray-300 dark:border-gray-700">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">What I&apos;m Working On</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            A snapshot of what I&apos;m currently building, learning, and experimenting with.
          </p>
  
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <p className="text-gray-900 dark:text-gray-100">
                Sketching and vectorizing 20 logos daily
              </p>
              <span className="text-xs text-green-500 font-jetbrains-mono">
                [Exploring]
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-4">
              <p className="text-gray-900 dark:text-gray-100">
                Sui Move and Blockchain Generally
              </p>
              <span className="text-xs text-blue-500 font-jetbrains-mono">
                [Learning]
              </span>
            </div>
          </div>
  
          <a href="#" className="inline-block mt-6 text-blue-600 dark:text-blue-400 font-medium">
            View More →
          </a>
  
          <p className="mt-8 text-sm text-gray-500 dark:text-gray-400 font-jetbrains-mono">
            Last updated: <span className="text-green-500">just now</span>
          </p>
        </div>
      </section>
    );
  }
  