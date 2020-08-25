import React from "react";
import Test from "./components/Test";

const App: React.FC = () => {
  return (
    <div>
      <header>This is the client!</header>
      <Test text={"these are props"} />
    </div>
  );
};

export default App;
