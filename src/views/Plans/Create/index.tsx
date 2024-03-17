import React from "react";
import lodash from "lodash";
import { navigateToUrl } from "single-spa";
import { classNames } from "primereact/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useHost } from "@learlifyweb/providers.host";
import { Controller, useForm, useWatch } from "react-hook-form";
import { AxiosError, HttpStatusCode } from "axios";

import { http } from "@learlifyweb/providers.https";

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
import { FormControl } from "@views/Settings/settings.styles";
import { Elements, TextLabel } from "@styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { disabledForm } from "@utils";
import { Fade } from "react-awesome-reveal";

export interface Props {
  id?: string;
  isEditMode?: boolean;
}

const CreatePlan: React.FC<Props> = ({ id, isEditMode }) => {
  const { token } = useHost();

  const { control, reset, formState, handleSubmit } = useForm<IPlan>();

  const { errors } = formState;

  const toast = React.useRef<Toast>();

  /**
   * @description
   * Create mode.
   */
  const create = useMutation({
    mutationKey: [PlanMutation.CREATE],
    mutationFn: (body: Partial<IPlan>) => {
      const request = http<IPlan>({ token }, api.create, {
        body,
      });

      return request();
    },
    onSuccess: () => {
      reset({
        name: null,
        price: null,
        description: null,
      });

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
   * Update mode.
   */
  const update = useMutation({
    mutationKey: [PlanMutation.UPDATE],
    mutationFn: (body: Partial<IPlan>) => {
      const request = http<IPlan>({ token }, api.update, {
        body,
        params: [id],
      });

      return request();
    },
    onSuccess: (mutation) => {
      if (mutation.status === HttpStatusCode.Ok) {
        reset(mutation?.response);

        toast.current?.clear();

        toast.current?.show({
          sticky: true,
          severity: "info",
          content: (
            <Created
              title="¡Plan Actualizado!"
              description="¿Deseas visualizar los planes?"
              onClickCancel={toast.current?.clear}
              onClickAccept={() => navigateToUrl("/dashboard/plans")}
            />
          ),
        });
      }
    },
  });

  /**
   * @description
   * Getting plan only if is edit mode.
   */
  const plan = useQuery({
    enabled: isEditMode,
    queryKey: [PlanQuery.GET],
    refetchOnMount: isEditMode,
    refetchOnWindowFocus: false,
    queryFn: http<IPlan>({ token }, api.plans, {
      params: [id],
    }),
    onSuccess: (query) => {
      if (query?.status === HttpStatusCode.Ok) {
        if (isEditMode) {
          reset(query.response);
        }
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

  const [name, price, description] = useWatch({
    control,
    name: ["name", "price", "description"],
  });

  /**
   * @description
   * On submit plan updated/created.
   */
  const onSubmitPlan = (ref: IPlan) => {
    const { name, price, description } = ref;

    if (isEditMode) {
      /**
       * @description
       * Client side validation to avoid unnecessary updates.
       */
      if (lodash.isEqual(ref, plan.data?.response)) {
        return toast.current.show({
          summary: name,
          detail: "Sin cambios disponibles",
          severity: "info",
        });
      }

      return update.mutate({
        name,
        price,
        description,
      });
    }

    return create.mutate({
      name,
      price,
      description,
    });
  };

  const handleReset = () => {
    if (isEditMode) {
      return reset(plan?.data?.response);
    }

    return reset();
  };

  /**
   * @description
   * Disabled everything is nothing is touched.
   */
  const handleDisabled = React.useMemo(() => {
    if (isEditMode) {
      return disabledForm(
        plan?.data?.response,
        {
          name,
          price,
          description,
        },
        ["name", "price", "description"]
      );
    }
  }, [isEditMode, name, price, description, plan?.data]);

  return (
    <>
      <Toast position="bottom-right" ref={toast} />
      <>
        {isEditMode || (
          <div>
            <img
              alt="plans"
              src="https://learlify.nyc3.cdn.digitaloceanspaces.com/static/dollars.png"
            />
          </div>
        )}
        <MarginY />
        {isEditMode && (
          <Elements>
            <FontAwesomeIcon
              className="text-amber-500"
              icon="circle-exclamation"
            />
            <small className="font-light text-white text-sm">
              Estás actualizando la información de un paquete
            </small>
          </Elements>
        )}
        <form onSubmit={handleSubmit(onSubmitPlan)}>
          <MarginY />
          <Controller
            name="name"
            rules={nameRules}
            control={control}
            render={({ field }) => (
              <FormControl>
                <TextLabel htmlFor="name">Name</TextLabel>
                <InputText
                  id="name"
                  className={classNames(
                    "p-inputtext-md w-1/4",
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
              </FormControl>
            )}
          />
          <MarginY />
          <Controller
            name="price"
            control={control}
            rules={priceRules}
            render={({ field }) => (
              <FormControl>
                <TextLabel htmlFor="price">Price</TextLabel>
                <InputNumber
                  min={1}
                  max={1000}
                  className={classNames(
                    "p-inputtext-md w-1/4",
                    errors.price && "p-invalid"
                  )}
                  id="price"
                  locale="de-DE"
                  value={field.value}
                  mode="currency"
                  currency="EUR"
                  minFractionDigits={2}
                  placeholder="Valor en EUR"
                  disabled={create.isLoading}
                  onChange={(e) => field.onChange(e.value)}
                />
                {errors.price && (
                  <Message text={errors.price.message} severity="error" />
                )}
              </FormControl>
            )}
          />
          <MarginY />
          <Controller
            name="description"
            control={control}
            rules={descriptionRules}
            render={({ field }) => (
              <FormControl>
                <TextLabel htmlFor="description">Description</TextLabel>
                <InputTextarea
                  rows={2}
                  cols={25}
                  maxLength={255}
                  className={classNames(
                    "p-inputtext-md w-1/4",
                    errors.description && "p-invalid"
                  )}
                  id="description"
                  value={field.value}
                  placeholder="Descripción"
                  disabled={create.isLoading}
                  onChange={(e) => field.onChange(e.target.value)}
                />
                {errors.description && (
                  <Message text={errors.description.message} severity="error" />
                )}
              </FormControl>
            )}
          />
          <MarginY />
          <Container>
            <Button
              size="large"
              type="submit"
              severity="info"
              disabled={handleDisabled}
            >
              {isEditMode ? (
                <i className="fa fa-circle-check fa-solid fa-md" />
              ) : (
                <i className="fa fa-plus fa-solid fa-md" />
              )}
            </Button>
            <Button
              size="large"
              type="reset"
              severity="danger"
              onClick={handleReset}
              disabled={handleDisabled}
            >
              <i className="fa fa-refresh fa-solid fa-md" />
            </Button>
          </Container>
        </form>
      </>
    </>
  );
};

export default CreatePlan;
