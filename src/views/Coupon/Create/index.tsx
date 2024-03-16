import React from "react";
import { capitalize } from "lodash";
import { navigateToUrl } from "single-spa";
import { classNames } from "primereact/utils";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, useWatch, Controller } from "react-hook-form";

import { http } from "@learlifyweb/providers.https";
import { useHost } from "@learlifyweb/providers.host";
import { Loading } from "@learlifyweb/providers.loading";

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
import {
  Container,
  MarginY,
  RadioButtonContainer,
  styles,
} from "../coupon.styles";
import { Title } from "@views/Admin/admin.style";

// - Request
import { service } from "@views/Coupon/coupon.service";

// - Rules

import { codeAsRules, discountAsRules, usageAsRules } from "../coupon.rules";

// - Utils
import { path } from "@utils";

// - Query
import { CouponQuery } from "@query";

// - Components
import { Created } from "@components/Created";
import { Elements, TextLabel } from "@styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormControl } from "@views/Settings/settings.styles";
import { Fade } from "react-awesome-reveal";

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
    refetchOnWindowFocus: false,
    queryKey: [CouponQuery.EDIT],
    queryFn: http<ICoupon>({ token }, service.coupons, {
      params: [id],
    }),
  });

  /**
   * @description
   * Creating coupon code.
   */
  const createCouponService = useMutation({
    mutationKey: ["coupon"],
    mutationFn: (body: Partial<ICoupon>) => {
      const query = http<ICoupon>({ token }, service.create, {
        body,
      });

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
          <Created
            title="¡Código creado!"
            description="¿Deseas visualizar los códigos?"
            onClickCancel={() => navigateToUrl(route)}
            onClickAccept={() => navigateToUrl("/dashboard/coupons")}
          />
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
      const query = http<ICoupon>({ token }, service.update, {
        body: coupon,
        params: [id],
      });

      return query();
    },
    onSuccess: (update) => {
      if (update?.response) {
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
      }
    },
  });

  React.useEffect(() => {
    if (isEditMode && id && coupon.data) {
      reset(coupon?.data?.response);
    }
  }, [isEditMode, id, coupon.data]);

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
        {isEditMode || (
          <div>
            <MarginY />
            <img
              alt="hot-sale"
              src="https://learlify.nyc3.cdn.digitaloceanspaces.com/static/coupon.png"
            />
          </div>
        )}
        <Fade delay={0.3}>
          <MarginY />
          {isEditMode && (
            <Elements>
              <FontAwesomeIcon
                className="text-amber-500"
                icon="circle-exclamation"
              />
              <small className="font-light text-white text-sm">
                Estás actualizando la información de un cupón
              </small>
            </Elements>
          )}
          <MarginY />
          <form onSubmit={handleSubmit(onSubmitCoupon)}>
            <Controller
              name="code"
              control={control}
              rules={codeAsRules}
              disabled={isEditMode}
              render={({ field }) => (
                <FormControl>
                  <TextLabel htmlFor="name">Nombre</TextLabel>
                  <InputText
                    id="name"
                    disabled={isEditMode}
                    className={classNames(
                      "p-inputtext-md w-1/4",
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
                </FormControl>
              )}
            />
            <MarginY />
            <FormControl>
              <TextLabel>Tipo de descuento</TextLabel>
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
                  <label
                    className="text-white"
                    htmlFor={DiscountType.PERCENTAGE}
                  >
                    {capitalize(DiscountType.PERCENTAGE)}
                  </label>
                </RadioButtonContainer>
              </Container>
            </FormControl>
            <MarginY />
            <Controller
              control={control}
              name="discount_value"
              rules={discountAsRules}
              render={({ field }) => (
                <FormControl>
                  <TextLabel htmlFor="discount">Descuento</TextLabel>
                  <InputNumber
                    min={1}
                    max={100}
                    id="discount"
                    placeholder={
                      discount === DiscountType.FIXED
                        ? "Se aplica en EUR/USD"
                        : "Se aplica en %"
                    }
                    value={field.value}
                    className={classNames(
                      "p-inputtext-md w-1/4",
                      formState.errors?.discount_value && "p-invalid"
                    )}
                    mode="currency"
                    locale="de-DE"
                    currency="EUR"
                    minFractionDigits={2}
                    onChange={(e) => field.onChange(e.value)}
                  />
                  {formState.errors?.discount_value && (
                    <Message
                      severity="error"
                      text={formState.errors?.discount_value?.message}
                    />
                  )}
                </FormControl>
              )}
            />
            <MarginY />
            <Controller
              name="usage_limit"
              control={control}
              rules={usageAsRules}
              render={({ field }) => (
                <FormControl>
                  <TextLabel htmlFor="usage">Cantidad de usos</TextLabel>
                  <InputNumber
                    min={1}
                    max={9999}
                    id="usage"
                    value={field.value}
                    className={classNames(
                      "p-inputtext-md w-1/4",
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
                </FormControl>
              )}
            />
            <MarginY />
            <Controller
              name="purchase_amount"
              control={control}
              render={({ field }) => (
                <FormControl>
                  <TextLabel htmlFor="purchase">
                    Valor de compra mínimo
                  </TextLabel>
                  <InputNumber
                    id="purchase"
                    placeholder="0-99"
                    value={field.value}
                    maxLength={100}
                    mode="currency"
                    currency="EUR"
                    locale="de-DE"
                    className="p-inputtext-md w-1/4"
                    onChange={(e) => field.onChange(e.value)}
                  />
                </FormControl>
              )}
            />
            <MarginY />
            <Controller
              name="enabled"
              control={control}
              render={({ field }) => (
                <FormControl>
                  <TextLabel>
                    {field.value ? "Deshabilitar Horario" : "Habilitar Horario"}
                  </TextLabel>
                  <InputSwitch
                    checked={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
              )}
            />
            <MarginY />
            <FormControl>
              <TextLabel>Descripción</TextLabel>
              <InputTextarea
                placeholder="Descripción del cupón"
                rows={3}
                cols={30}
                className="w-1/4"
                {...register("description", { required: false })}
              />
            </FormControl>
            {enabled && (
              <>
                <Title>Fecha</Title>
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
                          onChange={(e: CalendarProps) =>
                            field.onChange(e.value)
                          }
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
                          onChange={(e: CalendarProps) =>
                            field.onChange(e.value)
                          }
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
        </Fade>
      </Loading>
    </>
  );
};

export default CreateCoupon;
