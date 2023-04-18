const Empty = () => {
  return (
    <div className="bg-washed-dark mx-auto w-1/2 translate-y-1/4 space-y-8 rounded-2xl p-8 shadow-2xl">
      <h1>
        👋 welcome to <span className="text-yellow-400">the transl8tor</span>
      </h1>
      <p>
        This site is specifically built to manage i18n translations for{" "}
        <a className="text-primary-dark" target="_blank" href="https://datagovmy-front.vercel.app">
          datagovmy
        </a>
        .
      </p>
      <h3>Quickstart</h3>
      <p>Open the file directory on the left and click on any of the files to begin</p>
      <small className="text-dim block">© All rights reserved</small>
    </div>
  );
};

export default Empty;
