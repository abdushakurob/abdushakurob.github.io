import Head from "next/head";

export default function Hero() {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <header className="pb-20 pt-20 px-6 text-left">
        <div className="max-w-2xl md:mx-0 mx-auto space-y-5 font-sans">
          <p className="text-lg font-medium text-green-500 dark:text-green-400">
            Hey there! I&apos;m
          </p>
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
            Abdushakur
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
          Welcome to my little corner on the internet. This is where I figure things out—web, design, ideas, and whatever else catches my interest. Some things will make sense, some won&apos;t. Either way, you&apos;re free to look around.
          </p>
        </div>
      </header>
    </>
  );
}
