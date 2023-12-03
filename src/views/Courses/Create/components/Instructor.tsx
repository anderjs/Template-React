import React from "react";
import { isUndefined } from "lodash";
import { useQuery } from "@tanstack/react-query";

import { useHost } from "@learlifyweb/providers.host";
import { Loading } from "@learlifyweb/providers.loading";
import { httpsClient } from "@learlifyweb/providers.https";

// - Prime API
import { Toast } from "primereact/toast";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

// - Styled
import { StepperTitle } from "@views/Courses/styles";

// - Schema
import { IUser, Role } from "@learlifyweb/providers.schema";

// - Service
import { request } from "@views/Admin/api/requests";

interface Props {
  value?: IUser;
  onSelect?: (instructor: IUser) => void;
}

const Instructor: React.FC<Props> = ({ value, onSelect }) => {
  const { token } = useHost();

  const message = React.useRef<Toast>();

  const instructors = useQuery({
    enabled: false,
    queryKey: ["instructor"],
    queryFn: httpsClient<IUser[]>({ token }, request.users, {
      query: {
        role: Role.INSTRUCTOR,
      },
    }),
    onSuccess: () => {
      if (isUndefined(value)) {
        return message?.current?.show({
          sticky: true,
          severity: "info",
          detail: "Selecciona un instructor disponible",
        });
      }
    },
  });

  React.useEffect(() => {
    instructors.refetch();
  }, []);

  const handleSelectInstructor = (e: DropdownChangeEvent) => {
    onSelect?.(e.value);
  };

  const ValueTemplate = (instructor: IUser) => {
    return <>Instructor {instructor?.first_name}</>;
  };

  return (
    <>
      <Toast ref={message} />
      <Loading status={instructors.isLoading || instructors.isRefetching}>
        <StepperTitle>Instructor:</StepperTitle>
        <br />
        <Dropdown
          clearIcon
          value={value}
          optionValue="first_name"
          optionLabel="first_name"
          options={instructors?.data?.response}
          placeholder="Selecciona un instructor"
          onChange={handleSelectInstructor}
          valueTemplate={value ? ValueTemplate : undefined}
        />
      </Loading>
    </>
  );
};

export default Instructor;
