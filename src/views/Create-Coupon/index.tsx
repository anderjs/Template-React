import React from "react";
import { capitalize } from "lodash";
import { HttpStatusCode } from "axios";
import { classNames } from "primereact/utils";
import { useMutation } from "@tanstack/react-query";
import { useForm, useWatch, Controller } from "react-hook-form";

import { useHost } from "@learlifyweb/providers.host";
import { httpsClient } from "@learlifyweb/providers.https";

import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { InputNumber } from "primereact/inputnumber";
import { RadioButton } from "primereact/radiobutton";
import { InputTextarea } from "primereact/inputtextarea";

// - Types
import { ICoupon, Type } from "@views/Coupon/api/interface";

// - Styles
import { Container, MarginY, RadioButtonContainer, styles } from "./styles";
import { TextTitle } from "@views/Admin/styles";

// - Constants
import { minLengthCode } from "./constants";

// - Request
import { request } from "@views/Coupon/api/requests";

interface State {
  enabled: boolean;
}

const CreateCoupon: React.FC = () => {
  const { token } = useHost();

  const { register, handleSubmit, formState, reset, control } = useForm<
    ICoupon & State
  >({
    defaultValues: {
      discountType: Type.FIXED,
    },
  });

  const [enabled, discount] = useWatch({
    name: ["enabled", "discountType"],
    control,
  });

  const toast = React.useRef<Toast>();

  /**
   * @description
   * Creating coupon code.
   */
  const createCouponService = useMutation({
    mutationKey: ["coupon"],
    mutationFn: (coupon: Partial<ICoupon>) => {
      const query = httpsClient({ token }, request.create, {}, coupon);

      return query();
    },
    onSuccess: (mutationContext) => {
      if (mutationContext?.status === HttpStatusCode.Ok) {
        toast.current?.clear();

        return toast.current?.show({
          severity: "success",
          content: (
            <div className={styles.content}>
              <div className="text-center">
                ¡Se ha generado el cupón, deseas visualizar los cupones?
              </div>
            </div>
          ),
        });
      }
    },
  });

  /**
   * @description
   * Handler to reset all fields.
   */
  const handleResetForm = () => {
    reset();
  };

  /**
   * @description
   * Submit coupon object.
   */
  const onSubmitCoupon = (data: ICoupon) => {
    createCouponService.mutate(data);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmitCoupon)}>
        <TextTitle>Crear Cupón</TextTitle>
        <Controller
          name="code"
          control={control}
          rules={{
            minLength: minLengthCode,
            required: "El nombre del cupón, es requerido",
          }}
          render={({ field }) => (
            <div>
              <InputText
                className={classNames(
                  "p-inputtext-md",
                  formState.errors.code && "p-invalid"
                )}
                value={field.value?.toUpperCase()}
                placeholder="Nombre del código"
                onChange={(e) => field.onChange(e.target.value)}
              />
              {formState.errors.code && (
                <Message
                  text={formState.errors.code.message}
                  severity="error"
                />
              )}
            </div>
          )}
        />
        <MarginY />
        <TextTitle>Tipo de descuento</TextTitle>
        <Container>
          <RadioButtonContainer>
            <Controller
              name="discountType"
              control={control}
              render={({ field }) => (
                <RadioButton
                  id={Type.FIXED}
                  value={Type.FIXED}
                  checked={field.value === Type.FIXED}
                  onChange={(e) => field.onChange(e.value)}
                />
              )}
            />
            <label className="text-white" htmlFor={Type.FIXED}>
              {capitalize(Type.FIXED)}
            </label>
          </RadioButtonContainer>
          <RadioButtonContainer>
            <Controller
              name="discountType"
              control={control}
              render={({ field }) => (
                <RadioButton
                  id={Type.PERCENTAGE}
                  value={Type.PERCENTAGE}
                  checked={field.value === Type.PERCENTAGE}
                  onChange={(e) => field.onChange(e.value)}
                />
              )}
            />
            <label className="text-white" htmlFor={Type.PERCENTAGE}>
              {capitalize(Type.PERCENTAGE)}
            </label>
          </RadioButtonContainer>
        </Container>
        <MarginY />
        <TextTitle>Aplicar descuento</TextTitle>
        <Controller
          name="discountValue"
          control={control}
          render={({ field }) => (
            <InputNumber
              placeholder={
                discount === Type.FIXED
                  ? "Se aplica en EUR/USD"
                  : "Se aplica en %"
              }
              value={field.value}
              onChange={(e) => field.onChange(e.value)}
            />
          )}
        />
        <TextTitle>Cantidad de usos</TextTitle>
        <Container>
          <Controller
            name="usageLimit"
            control={control}
            rules={{
              required: "Se requiere una cantidad máxima de usos",
            }}
            render={({ field }) => (
              <div>
                <InputNumber
                  min={1}
                  max={100}
                  value={field.value}
                  className={classNames(
                    "p-inputtext-md",
                    formState.errors?.usageLimit && "p-invalid"
                  )}
                  onChange={(e) => field.onChange(e.value)}
                  placeholder="Ingresar cantidad máxima de usos"
                />
                {formState.errors?.usageLimit && (
                  <Message
                    severity="error"
                    text={formState.errors?.usageLimit?.message}
                  />
                )}
              </div>
            )}
          />
        </Container>
        <MarginY />
        <TextTitle>Valor de compra mínimo</TextTitle>
        <Container>
          <Controller
            name="purchaseAmount"
            control={control}
            render={({ field }) => (
              <InputNumber
                placeholder="0-99"
                value={field.value}
                className="p-inputtext-md"
                onChange={(e) => field.onChange(e.value)}
              />
            )}
          />
        </Container>
        <MarginY />
        <TextTitle>
          {enabled ? "Deshabilitar Horario" : "Habilitar Horario"}
        </TextTitle>
        <Controller
          name="enabled"
          control={control}
          render={({ field }) => (
            <InputSwitch checked={field.value} onChange={field.onChange} />
          )}
        />
        <TextTitle>Descripción del cupón</TextTitle>
        <InputTextarea
          placeholder="Descripción del cupón"
          rows={4}
          cols={40}
          {...register("description", { required: false })}
        />
        {enabled && (
          <>
            <TextTitle>Fecha</TextTitle>
            <Container>
              <div>
                <Calendar
                  placeholder="Válido desde"
                  className={classNames(
                    "p-inputtext-md",
                    formState.errors.startDate && "p-invalid"
                  )}
                  {...register("startDate", {
                    required: "Se necesita una fecha de inicio",
                  })}
                />
                {formState.errors.startDate && (
                  <Message
                    severity="error"
                    text={formState.errors.startDate.message}
                  />
                )}
              </div>
              <div>
                <Calendar
                  placeholder="Válido hasta"
                  className={classNames(
                    "p-inputtext-md",
                    formState.errors.endDate && "p-invalid"
                  )}
                  {...register("endDate", {
                    required: "Se necesita una fecha de cierre",
                  })}
                />
                {formState.errors.endDate && (
                  <Message
                    severity="error"
                    text={formState.errors.endDate.message}
                  />
                )}
              </div>
            </Container>
          </>
        )}
        <MarginY />
        <Container>
          <Button
            type="submit"
            severity="success"
            loading={createCouponService.isLoading}
          >
            Generar
          </Button>
          <Button
            severity="info"
            onClick={handleResetForm}
            loading={createCouponService.isLoading}
          >
            Restaurar
          </Button>
        </Container>
      </form>
    </>
  );
};

export default CreateCoupon;