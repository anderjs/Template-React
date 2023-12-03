import React from "react";
import { navigateToUrl } from "single-spa";
import { capitalize, filter } from "lodash";
import { classNames } from "primereact/utils";
import { AxiosError, HttpStatusCode } from "axios";
import {
  Controller,
  ControllerRenderProps,
  useForm,
  useWatch,
} from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import "./styles.css";

import { Fade } from "react-awesome-reveal";

// - Providers
import { useHost } from "@learlifyweb/providers.host";
import { httpsClient } from "@learlifyweb/providers.https";

// - Font Awesome
import { fas } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// - Schema
import { api } from "../categories.service";
import { Created } from "@components/Created";
import { ICategory } from "@learlifyweb/providers.schema";

// - React Prime
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { InputText } from "primereact/inputtext";
import { ColorPicker } from "primereact/colorpicker";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

// - Styled Components
import { Title } from "@views/Admin/admin.style";
import { MarginY } from "@views/Coupon/coupon.styles";

// - Styles
import { styles } from "./styles";

// - Rules
import { descriptionRules, iconRules, nameRules } from "../categories.rules";

// - Utils
import { randomColor } from "../categories.utils";

interface Props {
  id?: string;
  isEditMode?: boolean;
}

const CreateCategory: React.FC<Props> = ({ id, isEditMode }) => {
  const [icons, setIcons] = React.useState([]);

  const [fontAwesome, setFontAwesome] = React.useState([]);

  const {
    reset,
    control,
    formState,
    setError,
    setValue,
    getValues,
    clearErrors,
    handleSubmit,
  } = useForm<ICategory>({
    defaultValues: {
      first_color: randomColor(),
      second_color: randomColor(),
    },
  });

  const { token } = useHost();

  const { errors } = formState;

  const icon = useWatch({
    name: "icon",
    control,
  });

  const toast = React.useRef<Toast>();

  const enrichment = useMutation({
    mutationKey: ["enrichment"],
    mutationFn: (name: string) => {
      const request = httpsClient<string>({ token }, api.enrichment, null, {
        name,
        context: "categories",
      });

      return request();
    },
    onSuccess: ({ response }) => {
      if (response) {
        toast.current?.show({
          summary: "Actualización",
          detail: "¡Texto enriquecido!",
          severity: "success",
        });

        setValue("description", response);
      }
    },
    onError: (err: AxiosError) => {
      switch (err.response.status) {
        case HttpStatusCode.BadRequest:
          return setError("name", {
            type: "required",
            message: "Ingresa un nombre para enriquecer la descripción",
          });

        default:
          return;
      }
    },
  });

  const create = useMutation({
    mutationKey: ["CREATE_CATEGORY"],
    mutationFn: (
      data: Pick<
        ICategory,
        "name" | "description" | "first_color" | "second_color" | "icon"
      >
    ) => {
      const request = httpsClient({ token }, api.create, {}, data);

      return request();
    },
    onSuccess: (mutation) => {
      reset();

      return toast.current?.show({
        sticky: true,
        severity: "success",
        content: (
          <Created
            title="¡Categoría creada!"
            description="¿Deseas visualizar las categorías?"
            onClickCancel={toast.current?.clear}
            onClickAccept={() => navigateToUrl("/dashboard/categories")}
          />
        ),
      });
    },
  });

  const update = useMutation({
    mutationKey: ["UPDATE_CATEGORY"],
    mutationFn: (
      data: Pick<
        ICategory,
        "name" | "description" | "first_color" | "second_color" | "icon"
      >
    ) => {
      const request = httpsClient(
        { token },
        api.update,
        {
          params: [id],
        },
        data
      );

      return request();
    },
    onSuccess: (mutation) => {
      reset(mutation.response);

      return toast.current?.show({
        sticky: true,
        severity: "success",
        content: (
          <Created
            title="¡Categoría actualizada!"
            description="¿Deseas visualizar las categorías?"
            onClickCancel={toast.current?.clear}
            onClickAccept={() => navigateToUrl("/dashboard/categories")}
          />
        ),
      });
    },
  });

  const category = useQuery({
    enabled: isEditMode,
    queryKey: ["CATEGORY"],
    refetchOnWindowFocus: false,
    queryFn: httpsClient<ICategory>({ token }, api.categories, {
      params: [id],
    }),
    onSuccess: (query) => {
      if (isEditMode && query.status === HttpStatusCode.Ok) {
        toast.current?.show({
          severity: "success",
          summary: query.response?.name,
          detail: "Se ha cargado el detalle",
        });

        return reset(query.response);
      }
    },
    onError: (err: AxiosError) => {
      switch (err.response?.status) {
        case HttpStatusCode.NotFound:
          return navigateToUrl("/dashboard/categories");

        case HttpStatusCode.InternalServerError:
          return navigateToUrl("/dashboard/categories");
      }
    },
  });

  React.useEffect(() => {
    const items = Object.keys(fas).map((key) => ({
      icon: fas[key],
      label: key,
      value: key,
    }));

    setIcons(items);

    setFontAwesome(items);
  }, []);

  const handleClickEnrichmentText = () => {
    const name = getValues("name");

    clearErrors();

    enrichment.mutate(name);
  };

  const handleChangeCallback = React.useCallback(
    (
      e: DropdownChangeEvent,
      field: ControllerRenderProps<ICategory, "icon">
    ) => {
      if (e.originalEvent.type === "click") {
        const { icon } = icons.find((i) => i.label === e.target.value);

        return field.onChange(icon.iconName);
      }

      const filtered = filter(icons, (icon) => {
        return icon.label.toLowerCase().includes(e.target.value.toLowerCase());
      });

      setFontAwesome(filtered);
    },
    [icons]
  );

  /**
   * @description
   * Start creating a category service.
   */
  const handleCreate = ({
    name,
    icon,
    description,
    first_color,
    second_color,
  }: ICategory) => {
    clearErrors();

    if (isEditMode) {
      return update.mutate({
        name,
        icon,
        description,
        first_color,
        second_color,
      });
    }

    return create.mutate({
      name,
      icon,
      description,
      first_color,
      second_color,
    });
  };

  const IconTemplate = (option) => {
    return (
      <div className={styles.flex}>
        <FontAwesomeIcon icon={option?.icon} />
        <p>{capitalize(option?.icon?.iconName)}</p>
      </div>
    );
  };

  const ValueTemplate = (option) => {
    return (
      <div className={styles.flex}>
        <FontAwesomeIcon icon={option} />
        <p>{capitalize(option)}</p>
      </div>
    );
  };

  const handleRenderIcon = React.useMemo(() => {
    return icon ? ValueTemplate(icon) : undefined;
  }, [icon]);

  return (
    <>
      <Toast ref={toast} position="bottom-right" />
      <Fade delay={0.5}>
        <Title>Color</Title>
        <form onSubmit={handleSubmit(handleCreate)}>
          <div className={styles.flex}>
            <Controller
              name="first_color"
              control={control}
              render={({ field }) => (
                <div>
                  <ColorPicker
                    name="first_color"
                    value={field.value}
                    disabled={enrichment.isLoading}
                    onChange={(e) => field.onChange(e.value)}
                    className={classNames(errors.first_color && "p-invalid")}
                  />
                </div>
              )}
            />
            <Controller
              name="second_color"
              control={control}
              render={({ field }) => (
                <div>
                  <ColorPicker
                    name="second_color"
                    value={field.value}
                    disabled={enrichment.isLoading}
                    onChange={(e) => field.onChange(e.value)}
                    className={classNames(errors.second_color && "p-invalid")}
                  />
                </div>
              )}
            />
          </div>
          <MarginY />
          <Title>Icono</Title>
          <Controller
            name="icon"
            rules={iconRules}
            control={control}
            render={({ field }) => (
              <div className={styles.flex}>
                <Dropdown
                  filter
                  filterBy="label"
                  value={field.value}
                  options={fontAwesome}
                  itemTemplate={IconTemplate}
                  onChange={(e) => handleChangeCallback(e, field)}
                  disabled={enrichment.isLoading}
                  className={classNames(errors.icon && "p-invalid")}
                  placeholder="Selecciona un icono"
                  virtualScrollerOptions={{ itemSize: 30 }}
                  valueTemplate={handleRenderIcon}
                />
                {errors.icon && (
                  <Fade delay={0.5}>
                    <Message text={errors.icon?.message} severity="error" />
                  </Fade>
                )}
              </div>
            )}
          />
          <MarginY />
          <Title>Título</Title>
          <Controller
            name="name"
            rules={nameRules}
            control={control}
            render={({ field }) => (
              <div className={styles.flex}>
                <InputText
                  name="name"
                  className={classNames(
                    "p-inputtext-md",
                    errors?.name && "p-invalid"
                  )}
                  placeholder="Idiomas"
                  disabled={enrichment.isLoading}
                  value={capitalize(field?.value)}
                  onChange={(e) => field.onChange(e.target.value)}
                />
                {errors?.name && (
                  <Fade delay={0.5}>
                    <Message severity="error" text={errors?.name?.message} />
                  </Fade>
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
              <>
                <div className={styles.flex}>
                  <InputTextarea
                    rows={5}
                    cols={40}
                    name="description"
                    className={classNames(
                      "p-inputtext-md",
                      errors?.description && "p-invalid"
                    )}
                    value={field.value}
                    disabled={enrichment.isLoading}
                    placeholder="Descripción de la categoría"
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                  {errors.description && (
                    <Fade delay={0.5} cascade>
                      <Message
                        severity="error"
                        text={errors.description.message}
                      />
                    </Fade>
                  )}
                </div>
                <br />
                <p className="text-white">
                  {field.value?.length ?? 0}/{1000}
                </p>
              </>
            )}
          />
          <br />
          <Button
            className={styles.container}
            onClick={handleClickEnrichmentText}
            tooltip="¿No sabes qué colocar?, ¡la IA te ayudará!"
            disabled={enrichment.isLoading}
          >
            {enrichment.isLoading ? "En proceso" : "Enriquecer Texto"}
            <FontAwesomeIcon
              icon={
                enrichment.isLoading ? "hand-sparkles" : "wand-magic-sparkles"
              }
              beatFade={enrichment.isLoading}
            />
          </Button>
          <MarginY />
          <div className={styles.flex}>
            <Button
              type="submit"
              severity="info"
              className={styles.container}
              disabled={enrichment.isLoading}
            >
              {isEditMode ? "Actualizar" : "Crear"}{" "}
              <FontAwesomeIcon icon={isEditMode ? "pencil" : "plus"} />
            </Button>
            <Button
              type="reset"
              severity="danger"
              className={styles.container}
              disabled={enrichment.isLoading}
            >
              Cancel <FontAwesomeIcon icon="refresh" />
            </Button>
          </div>
        </form>
      </Fade>
    </>
  );
};

export default CreateCategory;
