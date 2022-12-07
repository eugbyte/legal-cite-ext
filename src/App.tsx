function App() {
  return (
    <div className="bg-slate-800 flex flex-col justify-center items-center px-5 py-1 text-white">
      <p className="text-sm decoration-solid underline ">How to use</p>
      <div>
        <ol className="text-xs list-decimal">
          <li>
            Navigate to a whitelisted website, e.g.{" "}
            <code>https://sso.agc.gov.sg/Act/**</code>
          </li>
          <li>Select the text</li>
          <li>Right click, select "Copy with Source" from the context menu</li>
        </ol>
      </div>
    </div>
  );
}

export default App;
