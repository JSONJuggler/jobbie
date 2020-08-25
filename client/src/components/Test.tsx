import React from "react";

interface Props {
  text: string;
}

const Test: React.FC<Props> = ({ text }) => {
  return <div>{text}</div>;
};

export default Test;
