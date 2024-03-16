import tailwind from "tailwind-styled-components";

export const styles = {
  center: "text-center",
  content: "flex-column items-center flex-1",
  controls: "flex gap-2 justify-center",
  inputGroup: "p-input-group flex-1",
};

export const Container = tailwind.div`
  flex
  gap-10
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
