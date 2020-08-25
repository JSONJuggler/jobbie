import React, { useState, useEffect } from "react";

interface Props {
  text: string;
}

const Test: React.FC<Props> = ({ text }) => {
  const [count, setCount] = useState<number | null>(1);

  useEffect((): void => {
    setCount(10);
  }, []);

  return <div>{text + count}</div>;
};

export default Test;
