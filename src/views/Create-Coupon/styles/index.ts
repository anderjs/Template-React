import tailwind from "tailwind-styled-components";

export const styles = {
  content: "flex flex-column align-items-center flex-1",
  inputGroup: "p-input-group flex-1",
};

export const Container = tailwind.div`
  flex
  gap-4
  justify-start
  items-center
`;

export const RadioButtonContainer = tailwind.div`
  flex
  gap-2
  justify-start
  items-center
`;

export const MarginY = tailwind.div`
  my-8
`;

export const ContentSuccessMesasge = tailwind.div`
  flex
  justify-center
  items-center
  gap-2
`;
