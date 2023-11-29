import React from "react";
import { navigateToUrl } from "single-spa";
import { classNames } from "primereact/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useHost } from "@learlifyweb/providers.host";
import { Controller, useForm } from "react-hook-form";
import { AxiosError, HttpStatusCode } from "axios";

import { httpsClient } from "@learlifyweb/providers.https";

import { Title } from "@views/Admin/admin.style";
import { MarginY, Container } from "@views/Coupon/coupon.styles";

import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputTextarea } from "primereact/inputtextarea";

import { IPlan } from "@learlifyweb/providers.schema";

// - Rules
import { nameRules, priceRules, descriptionRules } from "../plans.rules";

// - Service
import { api, PlanMutation, PlanQuery } from "../plans.service";

// - Components
import { Created } from "@components/Created";

export interface Props {
  id?: string;
  isEditMode?: boolean;
}

const CreatePlan: React.FC<Props> = ({ id, isEditMode }) => {
  const { token } = useHost();

  const { control, reset, formState, handleSubmit } = useForm<IPlan>({});

  const { errors } = formState;

  const toast = React.useRef<Toast>();

  const create = useMutation({
    mutationKey: [PlanMutation.CREATE],
    mutationFn: (data: Partial<IPlan>) => {
      const request = httpsClient<IPlan>({ token }, api.create, {}, data);

      return request();
    },
    onSuccess: () => {
      reset();

      toast.current?.clear();

      toast.current?.show({
        sticky: true,
        severity: "success",
        content: (
          <Created
            title="¡Plan Creado!"
            description="¿Deseas visualizar los planes?"
            onClickCancel={() => {}}
            onClickAccept={() => navigateToUrl("/dashboard/plans")}
          />
        ),
      });
    },
  });

  /**
   * @description
   * Getting plan only if is edit mode.
   */
  const plan = useQuery({
    enabled: isEditMode,
    queryKey: [PlanQuery.GET],
    refetchOnWindowFocus: false,
    queryFn: httpsClient<IPlan>({ token }, api.plans, {
      params: [id],
    }),
    onSuccess: (query) => {
      if (query?.status === HttpStatusCode.Ok) {
        reset(query.response);
      }
    },
    onError: (err: AxiosError) => {
      const main = "/dashboard/plans";

      switch (err.response?.status) {
        case HttpStatusCode.NotFound:
          return navigateToUrl(main);

        default:
          return navigateToUrl(main);
      }
    },
  });

  const onSubmitPlan = (plan: IPlan) => {
    create.mutate({
      name: plan.name,
      price: plan.price,
      description: plan.description,
    });
  };

  const handleReset = () => {
    if (isEditMode) {
      return reset(plan?.data?.response);
    }

    return reset();
  };

  return (
    <>
      <Toast position="bottom-right" ref={toast} />
      <form onSubmit={handleSubmit(onSubmitPlan)}>
        <MarginY />
        <Title>Nombre</Title>
        <Controller
          name="name"
          rules={nameRules}
          control={control}
          render={({ field }) => (
            <div>
              <InputText
                className={classNames(
                  "p-inputtext-md",
                  errors.name && "p-invalid"
                )}
                value={field.value}
                disabled={create.isLoading}
                placeholder="Ejemplo: PLATINUM"
                onChange={(e) => field.onChange(e.target.value)}
              />
              {errors.name && (
                <Message text={errors.name.message} severity="error" />
              )}
            </div>
          )}
        />
        <MarginY />
        <Title>Precio</Title>
        <Controller
          name="price"
          control={control}
          rules={priceRules}
          render={({ field }) => (
            <div>
              <InputNumber
                min={1}
                max={1000}
                className={classNames(
                  "p-inputtext-md",
                  errors.price && "p-invalid"
                )}
                value={field.value}
                placeholder="Valor en EUR"
                disabled={create.isLoading}
                onChange={(e) => field.onChange(e.value)}
              />
              {errors.price && (
                <Message text={errors.price.message} severity="error" />
              )}
            </div>
          )}
        />
        <MarginY />
        <Title>Descripción</Title>
        <Controller
          name="description"
          control={control}
          rules={descriptionRules}
          render={({ field }) => (
            <div>
              <InputTextarea
                rows={2}
                cols={25}
                maxLength={255}
                className={classNames(
                  "p-inputtext-md",
                  errors.description && "p-invalid"
                )}
                value={field.value}
                placeholder="Descripción"
                disabled={create.isLoading}
                onChange={(e) => field.onChange(e.target.value)}
              />
              {errors.description && (
                <Message text={errors.description.message} severity="error" />
              )}
            </div>
          )}
        />
        <MarginY />
        <Container>
          <Button type="submit" severity="success" size="large">
            <i className="fa fa-plus fa-solid fa-md" />
          </Button>
          <Button
            type="reset"
            size="large"
            severity="info"
            onClick={handleReset}
          >
            <i className="fa fa-refresh fa-solid fa-md" />
          </Button>
        </Container>
      </form>
    </>
  );
};

export default CreatePlan;
