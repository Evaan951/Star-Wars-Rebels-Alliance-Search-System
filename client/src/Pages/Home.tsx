import React from "react";
import { useLoaderData } from "react-router-dom";

const Home: React.FC<{}> = () => {

  let data = useLoaderData() as { message: string };
  console.log(data)
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
};

export default Home