import React from "react";
import { isUndefined } from "lodash";
import { useQuery } from "@tanstack/react-query";

import { useHost } from "@learlifyweb/providers.host";
import { Loading } from "@learlifyweb/providers.loading";
import { http } from "@learlifyweb/providers.https";

// - Prime API
import { Toast } from "primereact/toast";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

// - Styled
import { StepperTitle } from "@views/Courses/styles";

// - Schema
import { IUser, Role } from "@learlifyweb/providers.schema";

// - Service
import { request } from "@views/Admin/api/requests";
import { InputSwitch } from "primereact/inputswitch";
import { Fade } from "react-awesome-reveal";
import { StyledDropdown } from "@styles";

interface Props {
  value?: IUser;
  onInteract?: () => void;
  interactive?: boolean;
  onSelect?: (instructor: IUser) => void;
}

const Instructor: React.FC<Props> = ({
  value,
  onSelect,
  onInteract,
  interactive,
}) => {
  const { token } = useHost();

  const message = React.useRef<Toast>();

  const instructors = useQuery({
    queryKey: ["instructor"],
    queryFn: http<IUser[]>({ token }, request.users, {
      query: {
        role: Role.INSTRUCTOR,
      },
    }),
    refetchOnWindowFocus: false,
  });

  React.useEffect(() => {
    if (interactive) {
      message?.current?.clear();
    }
  }, [interactive]);

  const handleSelectInstructor = (e: DropdownChangeEvent) => {
    onSelect?.(e.target.value);
  };

  const ValueTemplate = (instructor: IUser) => {
    return <span>Instructor {instructor?.first_name}</span>;
  };

  return (
    <>
      <Loading status={instructors.isLoading || instructors.isRefetching}>
        <StepperTitle>Instructor:</StepperTitle>
        <br />
        <div className="flex justify-start gap-1 items-center">
          <InputSwitch
            checked={interactive}
            onChange={onInteract}
            tooltip={
              interactive
                ? "Al no ser interactivo estará asignado a un instructor"
                : "Al ser interactivo, no requerirá instructor"
            }
          />
          {interactive ? (
            <span>¿Requieres de un instructor?</span>
          ) : (
            <span>¿Es interactivo?</span>
          )}
        </div>
        <br />
        {interactive ? (
          <Fade delay={0.5} cascade>
            <p className="text-base">
              En este momento el curso está en modo interactivo. No requiere
              instructor, de tal manera que será asistido por IA.
            </p>
          </Fade>
        ) : (
          <Fade delay={0.5}>
            <StyledDropdown
              clearIcon
              value={value}
              panelClassName="p-0"
              optionLabel="first_name"
              options={instructors?.data?.response}
              placeholder="Selecciona un instructor"
              onChange={handleSelectInstructor}
              valueTemplate={value ? ValueTemplate(value) : undefined}
            />
          </Fade>
        )}
      </Loading>
    </>
  );
};

export default React.memo(Instructor);
