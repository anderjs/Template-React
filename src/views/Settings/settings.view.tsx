import React from "react";
import { isEqual, update } from "lodash";
import { Fade } from "react-awesome-reveal";
import { useMutation } from "@tanstack/react-query";
import { useForm, Controller, useWatch } from "react-hook-form";

import { http } from "@learlifyweb/providers.https";
import { IUser } from "@learlifyweb/providers.schema";
import { useHost } from "@learlifyweb/providers.host";

import { Spacing } from "@components/Spacing";
import {
  Container,
  FormControl,
  StyledAvatar,
  ButtonContainer,
  AvatarContainer,
  DisplayContainer,
  StyledCameraIcon,
  CheckboxContainer,
} from "./settings.styles";

import { multipartFormData } from "@utils";
import { service } from "./settings.service";

import { Avatar } from "primereact/avatar";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TextLabel } from "@styles";

const Settings: React.FC = () => {
  const { user, token } = useHost();

  /**
   * @see https://react-hook-form.com/docs/useform
   */
  const { control, handleSubmit } = useForm<Profile>({
    defaultValues: {
      email: user.email,
      first_name: user.first_name,
    },
  });

  const message = React.useRef<Toast>(null);

  /**
   * @see https://react.dev/reference/react/useRef
   */
  const inputRef = React.useRef<HTMLInputElement>(null);

  /**
   * @see https://react.dev/reference/react/useRef
   */
  const avatarRef = React.useRef<Avatar>(null);

  /**
   * @description
   * Current user img.
   */
  const [image, setImage] = React.useState<string>(() => {
    return user.avatar;
  });

  /**
   * @see https://react-hook-form.com/docs/usewatch
   */
  const [email, first_name] = useWatch({
    name: ["email", "first_name"],
    control,
  });

  /**
   * @description
   * Deletes the current photo from the user.
   * @see https://tanstack.com/query/v4/docs/framework/react/reference/useMutation
   */
  const discardMutation = useMutation({
    mutationFn: () => {
      const request = http<boolean>({ token }, service.discard);

      return request();
    },
    mutationKey: ["discard_photo"],
  });

  /**
   * @description
   * Uploads the current new file to the cloud.
   * @see https://tanstack.com/query/v4/docs/framework/react/reference/useMutation
   */
  const uploadMutation = useMutation({
    mutationFn: (photo: FormData) => {
      const request = http<string>({ token }, service.photo, {
        body: photo,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return request();
    },
    onSuccess: (mutationContext) => {
      if (mutationContext.response) {
        const photo = mutationContext.response;

        setImage(photo);

        confirmDialog({
          icon: "pi pi-exclamation-triangle",
          message:
            "Your profile picture has been updated. You want to proceed?",
          accept: () => {
            updateMutation.mutate({
              avatar: photo,
            });
          },
          reject: () => {
            uploadMutation.reset();

            discardMutation.mutate();
          },
          closeOnEscape: true,
        });
      }
    },
    mutationKey: ["update_photo"],
  });

  /**
   * @see https://tanstack.com/query/v4/docs/framework/react/reference/useMutation
   */
  const updateMutation = useMutation({
    mutationFn: (profile: Partial<Profile & Pick<IUser, "avatar">>) => {
      const request = http({ token }, service.update, {
        body: profile,
      });

      return request();
    },
    mutationKey: ["update_profile"],
  });

  /**
   * @description
   * Once is clicked, we can upload a new file.
   */
  const handleClickAvatar = () => {
    inputRef.current.click();
  };

  /**
   * @description
   * Detect when an user is trying to upload a new file.
   */
  const handleChangeSaveImage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const photo = multipartFormData(event.target.files[0]);

    uploadMutation.mutate(photo);
  };

  /**
   * @description
   * Once profile is updated.
   */
  const handleSubmitProfile = (profile: Profile) => {};

  /**
   * @description
   * Check if can update.
   */
  const deepEqual = React.useMemo(() => {
    const profile: Profile = {
      email: user.email,
      first_name: user.first_name,
    };

    return isEqual(profile, {
      email,
      first_name,
    });
  }, [user, email, first_name]);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChangeSaveImage}
      />
      <ConfirmDialog />
      <Toast ref={message} position="center" />
      <Fade delay={0.3}>
        <Container onSubmit={handleSubmit(handleSubmitProfile)}>
          <p className="text-3xl text-[#ada8a8] font-medium">Profile</p>
          <p className="text-base text-[#ada8a8] font-light">
            Update your profile and preferences
          </p>
          <Spacing />
          <AvatarContainer>
            <StyledAvatar
              ref={avatarRef}
              size="xlarge"
              shape="circle"
              onClick={handleClickAvatar}
              className="hover:cursor-pointer"
              image={uploadMutation.isSuccess ? image : user.avatar}
            >
              <StyledCameraIcon size="sm" icon={"camera"} />
            </StyledAvatar>
            <DisplayContainer>
              <p className="text-sm text-[#ada8a8] font-medium tracking-wide">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-sm text-[#ada8a8] font-medium tracking-wide">
                Usuario
              </p>
              <p className="text-sm text-[#ada8a8] font-light tracking-wide">
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
                <TextLabel htmlFor="name">Name</TextLabel>
                <InputText
                  id="name"
                  name="name"
                  autoFocus
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
                <TextLabel>Email</TextLabel>
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
          <p className="text-[#ada8a8] font-medium text-base tracking-wider mb-2">
            Preferences
          </p>
          <CheckboxContainer>
            <Checkbox checked={false} />
            <div>
              <p className="text-[#ada8a8] text-medium text-base tracking-wide">
                I prefer to receive emails about events and promotions.
              </p>
            </div>
          </CheckboxContainer>
          <CheckboxContainer>
            <Checkbox checked={false} />
            <div>
              <p className="text-[#ada8a8] text-medium text-base tracking-wide">
                I prefer to receive emails about new courses and features.
              </p>
            </div>
          </CheckboxContainer>
        </Container>
        <ButtonContainer>
          <Button disabled={deepEqual} severity="info">
            Actualizar
          </Button>
        </ButtonContainer>
      </Fade>
    </>
  );
};

type Profile = Pick<IUser, "email" | "first_name">;

export default Settings;
