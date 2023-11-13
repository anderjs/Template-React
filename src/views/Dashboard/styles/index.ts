import styled from "styled-components";
import tw from "tailwind-styled-components";

const WishTextContainer = styled.p`
  color: #ada8a8;
  float: right;
`;

export const Container = tw.div`
  grid
`;

export const Content = tw.div`
  mx-2
  my-4
  col-start-3
`;

export const GreetText = tw.p`
  text-white
  text-xl
`;

export const WishText = tw(WishTextContainer)`
  text-base
  font-normal
`;

export const smile = "fa-regular fa-face-smile-beam ml-1";
