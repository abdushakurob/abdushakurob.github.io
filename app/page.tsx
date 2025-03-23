import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-base-100 text-base-content p-4 sm:p-8 md:p-16 max-w-7xl mx-auto">
      {/* Header Section */}
      <header className="text-center space-y-6 mb-16">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Welcome to My Corner
        </h1>
        <p className="text-xl max-w-2xl mx-auto">
          This is my little corner on the internet. A place where I document what I&apos;m learning, 
          building, and figuring out. Some things will be polished, most won&apos;t. That&apos;s the point.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Latest Logs */}
        <section className="card bg-base-200 shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-4">Latest Logs</h2>
          <p className="mb-4">This is where I log everything. The problems, the fixes, and everything around it.</p>
          <ul className="space-y-2 list-disc list-inside mb-4">
            <li>My logo lost its life after vectorizing it</li>
            <li>What&apos;s more important when designing logos?</li>
            <li>Why most designers struggle with having a logo for their personal brand</li>
          </ul>
          <a href="#" className="btn btn-primary">Read My Logs</a>
        </section>

        {/* Now Section */}
        <section className="card bg-base-200 shadow-xl p-6">
          <h2 className="text-2xl font-bold mb-4">What I&apos;m Working on Now</h2>
          <div className="space-y-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="badge badge-primary">Exploring</div>
              <p>Sketching and vectorizing 20 logos daily</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="badge badge-secondary">Learning</div>
              <p>Sui Move and Blockchain Generally</p>
            </div>
          </div>
          <a href="#" className="btn btn-secondary">See What I&apos;m Working On</a>
        </section>
      </div>

      {/* Featured Projects */}
      <section className="mt-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Featured Projects</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Freshbite Identity</h3>
              <p>Branding, Logo, Design</p>
            </div>
          </div>
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">SwiftPay</h3>
              <p>Web dev, web3, Payment</p>
            </div>
          </div>
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Campus Navigator</h3>
              <p>Offline map Web App</p>
            </div>
          </div>
        </div>
        <div className="text-center mt-8">
          <a href="#" className="btn btn-outline btn-lg">View All Projects</a>
        </div>
      </section>
    </div>
  );
}
