import React from "react";
import { isUndefined } from "lodash";
import { useQuery } from "@tanstack/react-query";

import { http } from "@learlifyweb/providers.https";
import { useHost } from "@learlifyweb/providers.host";

import { Loading } from "@learlifyweb/providers.loading";
import { ICategory } from "@learlifyweb/providers.schema";

import { api } from "@views/Categories/categories.service";

import { Toast } from "primereact/toast";
import { RadioButton } from "primereact/radiobutton";

import { CategoryContainer, Label, StepperTitle } from "@views/Courses/styles";

interface Props {
  value?: ICategory;
  onSelect?: (category: ICategory) => void;
}

const Categories: React.FC<Props> = ({ value, onSelect }) => {
  const { token } = useHost();

  const message = React.useRef<Toast>();

  const categories = useQuery({
    queryKey: ["categories"],
    refetchOnWindowFocus: false,
    queryFn: http<ICategory[]>({ token }, api.categories),
    onSuccess: () => {
      if (isUndefined(value)) {
        message?.current?.show({
          sticky: true,
          severity: "info",
          detail: "Selecciona una categoría disponible",
        });
      }
    },
  });

  const handleSelect = React.useCallback((data: ICategory) => {
    message?.current?.clear();

    onSelect?.(data);
  }, []);

  return (
    <>
      <Toast position="bottom-right" ref={message} />
      <Loading status={categories.isLoading || categories.isFetching}>
        <StepperTitle>Escoge una categoría para el curso:</StepperTitle>
        {categories?.data?.response?.map((category) => (
          <CategoryContainer key={category.name}>
            <RadioButton
              name="category"
              value={category}
              inputId={category.name}
              checked={category.name === value?.name}
              onChange={() => handleSelect(category)}
            />
            <Label htmlFor={category.name}>{category.name}</Label>
          </CategoryContainer>
        ))}
      </Loading>
    </>
  );
};

export default Categories;
