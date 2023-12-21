import React from "react";
import { useForm, Controller } from "react-hook-form";

const App: React.FC = () => {
  const { control } = useForm<{ json: string }>({});

  return (
    <>
      <div />
    </>
  );
};

export default App;
