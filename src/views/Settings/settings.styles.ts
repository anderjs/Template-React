import tw from "tailwind-styled-components";
import styled from "styled-components";
import { Avatar } from "primereact/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Container = tw.form`
  flex
  flex-col
  gap-y-2
`;

export const FormControl = tw.form`
  flex
  flex-col
  gap-y-2
`;

export const CheckboxContainer = tw.div`
  flex
  justify-start
  items-center
  gap-x-4
  my-2
`;

export const AvatarContainer = tw.div`
  flex
  justify-start
  gap-x-4
`;

export const DisplayContainer = tw.div`
  flex
  flex-col
  gap-y-1
`;

export const ButtonContainer = tw.div`
  my-10
`;

export const StyledAvatar = styled(Avatar)`
  position: relative;
  transition: opacity 0.2s ease-in-out; /* Smooth opacity transition */
  width: "50px";
  height: "50px";
  object-fit: "cover";
  border-radius: "50%";
  &:hover {
    opacity: 0.7; /* Set desired hover opacity */

    &::after {
      content: ""; /* Add pseudo-element for icon */
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      font-size: 16px;
      opacity: 0; /* Initially hidden icon */
      transition: opacity 0.2s ease-in-out;
      pointer-events: none;

      &.show {
        opacity: 1; /* Show icon on hover */
      }
    }
  }
`;

export const StyledCameraIcon = styled(FontAwesomeIcon)`
  position: absolute;
  left: 65%;
  top: 75%;
  opacity: 0.7;
  color: #073e91; /* Inherit color from parent */
  font-size: 16px;
  transition: 1s ease-in-out;
`;
