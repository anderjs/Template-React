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
import { ICoupon, DiscountType, Status } from "@learlifyweb/providers.schema";

// - Styles
import { Container, MarginY, RadioButtonContainer, styles } from "./styles";
import { TextTitle } from "@views/Admin/styles";

// - Request
import { request } from "@views/Coupon/api/requests";

// - Rules

import { codeAsRules, discountAsRules, usageAsRules } from "./rules";

// - Utils
import { path } from "@utils";

// - Query
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
      discount_type: DiscountType.FIXED,
    },
  });

  const [enabled, discount] = useWatch({
    name: ["enabled", "discount_type"],
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
      coupon.refetch();

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
      const { code, id, updatedAt, createdAt, ...update } = data;

      return updateCouponService.mutate({
        ...update,
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
                name="discount_type"
                render={({ field }) => (
                  <RadioButton
                    id={DiscountType.FIXED}
                    value={DiscountType.FIXED}
                    checked={field.value === DiscountType.FIXED}
                    onChange={(e) => field.onChange(e.value)}
                  />
                )}
              />
              <label className="text-white" htmlFor={DiscountType.FIXED}>
                {capitalize(DiscountType.FIXED)}
              </label>
            </RadioButtonContainer>
            <RadioButtonContainer>
              <Controller
                control={control}
                name="discount_type"
                render={({ field }) => (
                  <RadioButton
                    id={DiscountType.PERCENTAGE}
                    value={DiscountType.PERCENTAGE}
                    checked={field.value === DiscountType.PERCENTAGE}
                    onChange={(e) => field.onChange(e.value)}
                  />
                )}
              />
              <label className="text-white" htmlFor={DiscountType.PERCENTAGE}>
                {capitalize(DiscountType.PERCENTAGE)}
              </label>
            </RadioButtonContainer>
          </Container>
          <MarginY />
          <TextTitle>Aplicar descuento</TextTitle>
          <Controller
            control={control}
            name="discount_value"
            rules={discountAsRules}
            render={({ field }) => (
              <div>
                <InputNumber
                  min={1}
                  max={100}
                  placeholder={
                    discount === DiscountType.FIXED
                      ? "Se aplica en EUR/USD"
                      : "Se aplica en %"
                  }
                  value={field.value}
                  className={classNames(
                    "p-inputtext-md",
                    formState.errors?.discount_value && "p-invalid"
                  )}
                  onChange={(e) => field.onChange(e.value)}
                />
                {formState.errors?.discount_value && (
                  <Message
                    severity="error"
                    text={formState.errors?.discount_value?.message}
                  />
                )}
              </div>
            )}
          />
          <TextTitle>Cantidad de usos</TextTitle>
          <Container>
            <Controller
              name="usage_limit"
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
                      formState.errors?.usage_limit && "p-invalid"
                    )}
                    onChange={(e) => field.onChange(e.value)}
                    placeholder="Ingresar cantidad máxima de usos"
                  />
                  {formState.errors?.usage_limit && (
                    <Message
                      severity="error"
                      text={formState.errors?.usage_limit?.message}
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
              name="purchase_amount"
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
                  name="start_date"
                  rules={{ required: "Se necesita una fecha de inicio" }}
                  control={control}
                  render={({ field }) => (
                    <div>
                      <Calendar
                        placeholder="Válido desde"
                        className={classNames(
                          "p-inputtext-md",
                          formState.errors.start_date && "p-invalid"
                        )}
                        value={new Date(field.value)}
                        onChange={(e: CalendarProps) => field.onChange(e.value)}
                      />
                      {formState.errors?.start_date && (
                        <Message
                          severity="error"
                          text={formState.errors.start_date.message}
                        />
                      )}
                    </div>
                  )}
                />
                <Controller
                  name="end_date"
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
                          formState.errors?.end_date && "p-invalid"
                        )}
                        value={new Date(field.value)}
                        onChange={(e: CalendarProps) => field.onChange(e.value)}
                      />
                      {formState.errors?.end_date && (
                        <Message
                          severity="error"
                          text={formState.errors.end_date.message}
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
