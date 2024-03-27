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
import { ChipRemoveEvent } from "primereact/chip";

// - Componets
import EnrichmentButton from "@components/EnrichmentButton";
import { StepperTitle, Tag, Tags, size } from "@views/Courses/styles";

// - Styled Components
import { MarginY } from "@views/Coupon/coupon.styles";

// - Utils
import { generateFreshColor } from "@views/Categories/categories.utils";

// - Schemas
import { Cols, TextLabel } from "@styles";
import { ICategory, ICourse, ITags } from "@learlifyweb/providers.schema";

// - Service
import { api } from "@views/Categories/categories.service";
import { FormElement } from "@views/Settings/settings.styles";

interface Props {
  title: string;
  tags: Pick<ITags, "name" | "color">[];
  control: Control<ICourse>;
  category: ICategory["name"];
  onTag: (tag: Pick<ITags, "name" | "color">) => void;
  onRemoveTag: (tag: Pick<ITags, "name" | "color">) => void;
  onEnrichDescription: (enrichment: string) => void;
}

const Information: React.FC<Props> = (props) => {
  const { control, reset } = useForm<ITags>();

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
      <Cols>
        <div>
          <StepperTitle>Información del Curso</StepperTitle>
          <MarginY />
          <Controller
            name="title"
            control={props?.control}
            render={({ field }) => (
              <FormElement>
                <TextLabel htmlFor="title">Title</TextLabel>
                <InputText
                  id="title"
                  className={size}
                  value={field.value}
                  placeholder="IELTS - English"
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormElement>
            )}
          />
          <MarginY />
          <Controller
            name="description"
            control={props?.control}
            render={({ field }) => (
              <FormElement>
                <TextLabel htmlFor="description">Description</TextLabel>
                <Editor
                  id="description"
                  value={field.value}
                  className="h-[280px]"
                  placeholder="Descripción del curso de IELTS"
                  onTextChange={(e) => field.onChange(e.htmlValue)}
                />
              </FormElement>
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
          <StepperTitle>Marketing & Strategies</StepperTitle>
          <MarginY />
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <FormElement>
                <TextLabel htmlFor="tags">Tags</TextLabel>
                <InputText
                  id="tags"
                  name="tags"
                  className={size}
                  onKeyDown={(e) => handleKeyDown(e, field)}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder="Marketing"
                  value={field.value}
                />
                <div className="flex justify-start items-center gap-2">
                  <FontAwesomeIcon
                    className="text-ember-500"
                    icon="circle-exclamation"
                  />
                  <small className="font-light text-sm">Máximo 10 tags</small>
                </div>
              </FormElement>
            )}
          />
          <MarginY />
          <Tags>
            {props?.tags?.map((tag, index) => (
              <Tag
                removable
                key={tag.name}
                label={tag.name}
                color={tag.color}
                onRemove={(e) => handleRemoveTag(e, index)}
              />
            ))}
          </Tags>
        </div>
      </Cols>
    </>
  );
};

export default React.memo(Information);
