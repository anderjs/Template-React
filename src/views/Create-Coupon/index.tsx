import React from "react";
import { capitalize } from "lodash";
import { navigateToUrl } from "single-spa";
import { classNames } from "primereact/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, useWatch, Controller } from "react-hook-form";

import { useHost } from "@learlifyweb/providers.host";
import { Loading } from "@learlifyweb/providers.loading";
import { httpsClient } from "@learlifyweb/providers.https";

import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { InputNumber } from "primereact/inputnumber";
import { RadioButton } from "primereact/radiobutton";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar, CalendarProps } from "primereact/calendar";

// - Types
import { ICoupon, Status, Type } from "@views/Coupon/api/interface";

// - Styles
import { Container, MarginY, RadioButtonContainer, styles } from "./styles";
import { TextTitle } from "@views/Admin/styles";

// - Request
import { request } from "@views/Coupon/api/requests";

// - Rules
import { codeAsRules, discountAsRules, usageAsRules } from "./rules";
import { path } from "@utils";
import { CouponQuery } from "@query";

export interface State {
  enabled: boolean;
}

export interface Props {
  id?: string;
  isEditMode?: boolean;
}

const CreateCoupon: React.FC<Props> = ({ id, isEditMode }) => {
  const { token } = useHost();

  const { register, handleSubmit, reset, control, formState } = useForm<
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
   * This will fetch only if is edit mode.
   */
  const coupon = useQuery({
    enabled: isEditMode,
    refetchOnMount: isEditMode,
    queryKey: [CouponQuery.EDIT],
    queryFn: httpsClient<ICoupon>({ token }, request.coupons, {
      params: [id],
    }),
  });

  /**
   * @description
   * Creating coupon code.
   */
  const createCouponService = useMutation({
    mutationKey: ["coupon"],
    mutationFn: (coupon: Partial<ICoupon>) => {
      const query = httpsClient<ICoupon>({ token }, request.create, {}, coupon);

      return query();
    },
    onSuccess: (mutationContext) => {
      reset();

      toast.current?.clear();

      const route = path(
        "/dashboard/coupons/edit/",
        mutationContext?.response?.id
      );

      toast.current?.show({
        sticky: true,
        severity: "success",
        content: (
          <div className={styles.content}>
            <div className="text-center">
              <div className="text-base">¡Código creado!</div>
            </div>
            <MarginY />
            <div className="text-center">
              <div className="text-base">¿Deseas visualizar los códigos?</div>
            </div>
            <MarginY />
            <div className={styles.controls}>
              <Button
                severity="info"
                onClick={() => navigateToUrl("/dashboard/coupons")}
              >
                Aceptar
              </Button>
              <Button severity="secondary" onClick={() => navigateToUrl(route)}>
                Cancelar
              </Button>
            </div>
          </div>
        ),
      });
    },
  });

  /**
   * @description
   * Updating service.
   */
  const updateCouponService = useMutation({
    mutationKey: ["coupon"],
    mutationFn: (coupon: Partial<ICoupon>) => {
      const query = httpsClient<ICoupon>(
        { token },
        request.update,
        {
          params: [id],
        },
        coupon
      );

      return query();
    },
    onSuccess: () => {
      reset();

      toast.current?.clear();

      toast.current?.show({
        sticky: true,
        severity: "success",
        content: (
          <div className={styles.content}>
            <div className="text-center">
              <div className="text-base">¡Código actualizado!</div>
            </div>
            <MarginY />
            <div className="text-center">
              <div className="text-base">¿Deseas visualizar los códigos?</div>
            </div>
            <MarginY />
            <div className={styles.controls}>
              <Button
                severity="info"
                onClick={() => navigateToUrl("/dashboard/coupons")}
              >
                Aceptar
              </Button>
              <Button severity="secondary" onClick={toast.current?.clear}>
                Cancelar
              </Button>
            </div>
          </div>
        ),
      });
    },
  });

  /**
   * @description
   * This will only run whe isEditMode is true.
   */
  React.useEffect(() => {
    if (coupon.data) {
      reset(coupon.data.response);
    }
  }, [coupon.data, reset]);

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
  const onSubmitCoupon = ({ enabled, ...data }: ICoupon & State) => {
    /**
     * @description
     * Updating instead of creating.
     */
    if (isEditMode) {
      return updateCouponService.mutate({
        ...coupon.data.response,
        ...data,
      });
    }

    return createCouponService.mutate({
      ...data,
      status: Status.Active,
    });
  };

  return (
    <>
      <Toast position="bottom-right" ref={toast} />
      <Loading
        size={224}
        status={createCouponService.isLoading || updateCouponService.isLoading}
      >
        <form onSubmit={handleSubmit(onSubmitCoupon)}>
          <TextTitle>{isEditMode ? "Editar Cupón" : "Crear Cupón"}</TextTitle>
          <Controller
            name="code"
            control={control}
            rules={codeAsRules}
            disabled={isEditMode}
            render={({ field }) => (
              <div>
                <InputText
                  disabled={isEditMode}
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
                control={control}
                name="discountType"
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
                control={control}
                name="discountType"
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
            control={control}
            name="discountValue"
            rules={discountAsRules}
            render={({ field }) => (
              <div>
                <InputNumber
                  min={1}
                  max={100}
                  placeholder={
                    discount === Type.FIXED
                      ? "Se aplica en EUR/USD"
                      : "Se aplica en %"
                  }
                  value={field.value}
                  className={classNames(
                    "p-inputtext-md",
                    formState.errors?.discountValue && "p-invalid"
                  )}
                  onChange={(e) => field.onChange(e.value)}
                />
                {formState.errors?.discountValue && (
                  <Message
                    severity="error"
                    text={formState.errors?.discountValue?.message}
                  />
                )}
              </div>
            )}
          />
          <TextTitle>Cantidad de usos</TextTitle>
          <Container>
            <Controller
              name="usageLimit"
              control={control}
              rules={usageAsRules}
              render={({ field }) => (
                <div>
                  <InputNumber
                    min={1}
                    max={9999}
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
                <Controller
                  name="startDate"
                  rules={{ required: "Se necesita una fecha de inicio" }}
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Calendar
                        placeholder="Válido desde"
                        className={classNames(
                          "p-inputtext-md",
                          formState.errors.startDate && "p-invalid"
                        )}
                        value={new Date(field.value)}
                        onChange={(e: CalendarProps) => field.onChange(e.value)}
                      />
                      {formState.errors?.startDate && (
                        <Message
                          severity="error"
                          text={formState.errors.startDate.message}
                        />
                      )}
                    </div>
                  )}
                />
                <Controller
                  name="endDate"
                  rules={{
                    required: "Se requiere una fecha de cierre",
                  }}
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Calendar
                        placeholder="Válido hasta"
                        className={classNames(
                          "p-inputtext-md",
                          formState.errors?.endDate && "p-invalid"
                        )}
                        value={new Date(field.value)}
                        onChange={(e: CalendarProps) => field.onChange(e.value)}
                      />
                      {formState.errors?.endDate && (
                        <Message
                          severity="error"
                          text={formState.errors.endDate.message}
                        />
                      )}
                    </div>
                  )}
                />
              </Container>
            </>
          )}
          <MarginY />
          <Container>
            <Button
              type="submit"
              severity="success"
              loading={
                createCouponService.isLoading || updateCouponService.isLoading
              }
            >
              {isEditMode ? "Actualizar" : "Generar"}
            </Button>
            <Button
              severity="info"
              onClick={handleResetForm}
              loading={
                createCouponService.isLoading || updateCouponService.isLoading
              }
            >
              Restaurar
            </Button>
          </Container>
        </form>
      </Loading>
    </>
  );
};

export default CreateCoupon;
