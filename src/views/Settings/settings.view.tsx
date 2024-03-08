import React from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";

import { IUser } from "@learlifyweb/providers.schema";
import { useHost } from "@learlifyweb/providers.host";

import { Spacing } from "@components/Spacing";
import {
  Container,
  FormControl,
  AvatarContainer,
  DisplayContainer,
  CheckboxContainer,
  ButtonContainer,
} from "./settings.styles";

import { Avatar } from "primereact/avatar";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Settings: React.FC = () => {
  const { user } = useHost();

  const { control } = useForm<Pick<IUser, "email" | "first_name">>({
    defaultValues: {
      email: user.email,
      first_name: user.first_name,
    },
  });

  return (
    <React.Fragment>
      <Container>
        <p className="text-3xl text-white font-medium">Profile</p>
        <p className="text-base text-white font-light">
          Update your profile and preferences
        </p>
        <Spacing />
        <AvatarContainer>
          <Avatar
            size="xlarge"
            shape="circle"
            image="https://sm.ign.com/ign_nordic/cover/a/avatar-gen/avatar-generations_prsz.jpg"
          />
          <DisplayContainer>
            <p className="text-sm text-white font-medium tracking-wide">
              {user?.first_name} {user?.last_name}
            </p>
            <p className="text-sm text-white font-medium tracking-wide">
              Usuario
            </p>
            <p className="text-sm text-white font-light tracking-wide">
              <FontAwesomeIcon
                size="sm"
                icon={user?.verified ? "user-check" : "clock"}
              />
            </p>
          </DisplayContainer>
        </AvatarContainer>
        <Spacing />
        <Controller
          name="first_name"
          control={control}
          render={({ field }) => (
            <FormControl>
              <label
                className="text-white font-medium text-base tracking-wider"
                htmlFor="name"
              >
                Name
              </label>
              <InputText
                id="name"
                name="name"
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-1/4"
              />
            </FormControl>
          )}
        />
        <Spacing />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <FormControl>
              <label
                className="text-white font-medium text-base tracking-wider"
                htmlFor="email"
              >
                Email
              </label>
              <InputText
                id="email"
                name="email"
                disabled
                value={field.value}
                onChange={(e) => field.onChange(e.target.value)}
                className="w-1/4"
              />
            </FormControl>
          )}
        />
        <Spacing />
        <p className="text-white font-medium text-base tracking-wider mb-2">
          Preferences
        </p>
        <CheckboxContainer>
          <Checkbox checked={false} />
          <div>
            <p className="text-white text-medium text-base tracking-wide">
              I prefer to receive emails about events and promotions.
            </p>
          </div>
        </CheckboxContainer>
        <CheckboxContainer>
          <Checkbox checked={false} />
          <div>
            <p className="text-white text-medium text-base tracking-wide">
              I prefer to receive emails about new courses and features.
            </p>
          </div>
        </CheckboxContainer>
      </Container>
      <ButtonContainer>
        <Button severity="info">Actualizar</Button>
      </ButtonContainer>
    </React.Fragment>
  );
};

export default Settings;
