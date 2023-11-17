import styled from "styled-components";
import tw from "tailwind-styled-components";
import { Divider } from "primereact/divider";

export const styles = {
  title: "text-2xl uppercase font-bold my-1",
  sub: "text-2xl ml-2 capitalize",
  divider: "mb-10",
  feature: "mb-5",
  price: "text-4xl uppercase font-bold",
  subtitle: "text-base text-bold",
  container: "w-[20rem] px-10 py-5",
  space: "my-2",
};

export const Container = tw.div`
  text-4xl
  text-center
  text-white
`;

export const Color = styled.span`
  color: var(--elements);
  font-weight: 400;
`;

export const StyledDivider = styled(Divider)`
  .p-divider-horizontal {
    margin: 1.25rem 0;
    background-color: #333;
    padding: 0.25px 1.25rem;
  }
`;

export const Feature = tw.div`
  flex 
  justify-start 
  items-center 
  px-2
  mt-2
  mb-4
  gap-4
`;

export const AlignCenter = tw.div`
  flex
  items-center
  justify-center
`;

export const StyledSection = styled.section`
  width: 100%;
  height: 100vh;
  box-sizing: border-box;
  padding: 40px 0;
`;

export const StyledCard = styled.div`
  position: relative;
  max-width: 300px;
  height: auto;
  background: #0f0c29; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #24243e,
    #302b63,
    #0f0c29
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #24243e,
    #302b63,
    #0f0c29
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

  border-radius: 15px;
  margin: 0 auto;
  padding: 40px 20px;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  transition: 0.5s;

  &:hover {
    transform: scale(1.1);
  }

  &::before {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40%;
    background: rgba(255, 255, 255, 0.1);
    z-index: 1;
    transform: skewY(-5deg) scale(1); /* Adjust scale to ensure it fits within the card */
    transform-origin: bottom left; /* This ensures the transformation pivots from the bottom left corner */
    border-bottom-left-radius: 7.5%;
  }
`;

export const StyledIcon = styled.div`
  color: #fff;
  font-size: 60px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  text-align: center;
  line-height: 100px;
  box-shadow: 0 10px 10px rgba(0, 0, 0, 0.1);
`;

export const StyledTitle = styled.h2`
  position: relative;
  margin: 20px 0 0;
  padding: 0;
  color: #fff;
  font-size: 28px;
  z-index: 2;
`;

export const StyledPrice = styled.div`
  position: relative;
  z-index: 2;

  h4 {
    margin: 0;
    padding: 20px 0;
    color: #fff;
    font-size: 60px;
  }
`;

export const StyledOptions = styled.div`
  position: relative;
  z-index: 2;

  ul {
    margin: 0;
    padding: 0;
  }

  li {
    margin: 0 0 10px;
    padding: 0;
    list-style: none;
    color: #fff;
    font-size: 16px;
  }

  span {
    margin-left: 10px;
  }
`;

export const StyledButton = styled.a`
  position: relative;
  z-index: 2;
  background: #fff;
  color: black;
  width: 150px;
  height: 40px;
  line-height: 40px;
  border-radius: 40px;
  display: block;
  text-align: center;
  margin: 20px auto 0;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    text-decoration: none;
  }
`;
