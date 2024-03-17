import React from "react";
import {
  useForm,
  Control,
  Controller,
  ControllerRenderProps,
} from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { http } from "@learlifyweb/providers.https";
import { useHost } from "@learlifyweb/providers.host";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// - Prime API
import { Editor } from "primereact/editor";
import { InputText } from "primereact/inputtext";

// - Componets
import EnrichmentButton from "@components/EnrichmentButton";
import { StepperTitle, Tag, Tags, size } from "@views/Courses/styles";

// - Styled Components
import { MarginY } from "@views/Coupon/coupon.styles";

// - Utils
import { generateFreshColor } from "@views/Categories/categories.utils";

// - Schemas
import { ICategory, ICourse, ITags } from "@learlifyweb/providers.schema";
import { api } from "@views/Categories/categories.service";
import { ChipRemoveEvent } from "primereact/chip";

interface Props {
  title: string;
  tags: Pick<ITags, "name" | "color">[];
  control: Control<ICourse>;
  category: ICategory["name"];
  onTag: (tag: Pick<ITags, "name" | "color">) => void;
  onRemoveTag: (tag: Pick<ITags, "name" | "color">) => void;
  onEnrichDescription: (enrichment: string) => void;
}

const Course: React.FC<Props> = (props) => {
  const { control, reset, setValue } = useForm<ITags>();

  const { token } = useHost();

  const markdownEnrichment = useMutation({
    mutationKey: ["markdown"],
    mutationFn: () => {
      const request = http<string>({ token }, api.enrichment, {
        body: {
          name: props?.title,
          target: props?.category,
          context: "markdown",
        },
      });

      return request();
    },
    onSuccess: ({ response }) => {
      props.onEnrichDescription(response);
    },
  });

  const handleKeyDown = React.useCallback(
    (
      e: React.KeyboardEvent<HTMLInputElement>,
      field: ControllerRenderProps<ITags, "name">
    ) => {
      if (e.key === "Enter") {
        reset({ name: "" });

        const ref = field?.value?.trim();

        return props?.onTag({
          name: ref,
          color: generateFreshColor(),
        });
      }
    },
    [props.onTag, reset]
  );

  const handleRemoveTag = React.useCallback(
    (event: ChipRemoveEvent, index: number) => {
      const tag = props.tags[index];

      props.onRemoveTag(tag);
    },
    [props.tags, props.onRemoveTag]
  );

  return (
    <>
      <div className="flex justify-evenly p-1 m-2">
        <div>
          <StepperTitle>Información del Curso</StepperTitle>
          <MarginY />
          <StepperTitle>Título</StepperTitle>
          <Controller
            name="title"
            control={props?.control}
            render={({ field }) => (
              <div>
                <InputText
                  className={size}
                  value={field.value}
                  placeholder="IELTS - English"
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </div>
            )}
          />
          <EnrichmentButton />
          <MarginY />
          <div className={size}>
            <StepperTitle>Descripción</StepperTitle>
          </div>
          <Controller
            name="description"
            control={props?.control}
            render={({ field }) => (
              <div>
                <Editor
                  value={field.value}
                  className="h-[280px]"
                  placeholder="Descripción del curso de IELTS"
                  onTextChange={(e) => field.onChange(e.htmlValue)}
                />
              </div>
            )}
          />
          <MarginY />
          <br />
          <EnrichmentButton
            isLoading={markdownEnrichment.isLoading}
            onEnrichment={markdownEnrichment.mutate}
          />
        </div>
        <div>
          <StepperTitle>Marketing</StepperTitle>
          <MarginY />
          <StepperTitle>Tags</StepperTitle>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <div>
                <InputText
                  name="tags"
                  className={size}
                  onKeyDown={(e) => handleKeyDown(e, field)}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="Marketing"
                  value={field.value}
                />
                <br />
                <div className="flex justify-start items-center gap-2">
                  <FontAwesomeIcon icon="circle-exclamation" />
                  <small>Máximo 10 tags</small>
                </div>
              </div>
            )}
          />
          <MarginY />
          <Tags>
            {props?.tags?.map((tag, index) => (
              <Tag
                key={tag.name}
                label={tag.name}
                color={tag.color}
                removable
                onRemove={(e) => handleRemoveTag(e, index)}
              />
            ))}
          </Tags>
        </div>
      </div>
    </>
  );
};

export default React.memo(Course);
