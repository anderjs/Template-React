import React from "react";
import { navigateToUrl } from "single-spa";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import "./styles.css";

import { http } from "@learlifyweb/providers.https";
import { useHost } from "@learlifyweb/providers.host";

// - Prime API
import { Card } from "primereact/card";
import { Steps } from "primereact/steps";
import { MenuItem } from "primereact/menuitem";

import { Context } from "../styles";

// - State
import { initialState, reducer, Step } from "./state";
import {
  backStep,
  nextStep,
  removeTag,
  selectTag,
  setDraftState,
  selectCategory,
  setInteractive,
  selectInstructor,
} from "./state/action";

// - API
import { api } from "../courses.service";
import { IDraft } from "../courses.interface";

// - Stepper
import Course from "./components/Course";
import Categories from "./components/Categories";
import Instructor from "./components/Instructor";
import { Controllers } from "./components/Controllers";

// - Schema
import {
  ICategory,
  ICourse,
  ITags,
  IUser,
} from "@learlifyweb/providers.schema";

// - Animation
import { Fade } from "react-awesome-reveal";

const CreateCourse: React.FC = () => {
  const { token } = useHost();

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const { control, getValues, setValue } = useForm<ICourse>();

  const { _id } = useParams();

  const title = useWatch({
    control,
    name: "title",
  });

  const draft = useQuery({
    queryKey: ["draft"],
    refetchOnWindowFocus: false,
    queryFn: http<IDraft>({ token }, api.findDraft, {
      params: [_id],
    }),
    onSuccess: () => {
      dispatch(setDraftState(draft.data?.response));
    },
    onError: () => {
      navigateToUrl("/dashboard/courses");
    },
  });

  React.useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [state.active]);

  /**
   * @description
   * Handle click back.
   */
  const handleBackStep = () => {
    return dispatch(backStep());
  };

  /**
   * @description
   * Handle click next.
   */
  const handleNextStep = () => {
    return dispatch(nextStep());
  };

  /**
   * @description
   * Handle click next.
   */
  const handleInteract = () => {
    return dispatch(setInteractive());
  };

  /**
   * @description
   * Select the current category.
   */
  const handleSelectCategory = (category: ICategory) => {
    return dispatch(selectCategory(category));
  };

  /**
   * @description
   * Select the current instructor.
   */
  const handleSelectInstructor = (instructor: IUser) => {
    return dispatch(selectInstructor(instructor));
  };

  /**
   * @description
   * Select the current tags for the course.
   */
  const handleSelectTag = (tag: Pick<ITags, "name" | "color">) => {
    return dispatch(selectTag(tag));
  };

  /**
   * @description
   * Select the current tags for the course.
   */
  const handleRemoveTag = (tag: Pick<ITags, "name" | "color">) => {
    return dispatch(removeTag(tag));
  };

  /**
   * @description
   * Uses AI under the hood.
   */
  const handleEnrichDescription = (value: string) => {
    setValue("description", value);
  };

  const steps = React.useMemo<MenuItem[]>(
    () => [
      {
        label: "Categoría",
      },
      {
        label: "Instructor",
      },
      {
        label: "Información",
      },
    ],
    []
  );

  /**
   * @description
   * Footer template.
   */
  const FooterTemplate = () => {
    switch (state.active) {
      case Step.CATEGORIES:
        return (
          <>
            <Controllers
              onNext={handleNextStep}
              disabledNext={!state?.category}
            />
          </>
        );

      case Step.INSTRUCTOR:
        return (
          <>
            <Controllers
              onBack={handleBackStep}
              onNext={handleNextStep}
              disabledNext={!state?.instructor}
            />
          </>
        );

      case Step.COURSES:
        return (
          <>
            <Controllers
              onBack={handleBackStep}
              onNext={handleNextStep}
              disabledNext={
                state.tags.length === 0 ||
                !getValues("title") ||
                !getValues("description")
              }
            />
          </>
        );
    }
  };

  return (
    <Fade delay={0.5}>
      <Card footer={FooterTemplate} className="mb-5">
        <Steps model={steps} activeIndex={state.active} />
        <Context>
          {state.active === Step.COURSES && (
            <Fade delay={0.1}>
              <Course
                title={title}
                tags={state.tags}
                control={control}
                onTag={handleSelectTag}
                onRemoveTag={handleRemoveTag}
                category={state?.category?.name}
                onEnrichDescription={handleEnrichDescription}
              />
            </Fade>
          )}
          {state.active === Step.CATEGORIES && (
            <Fade delay={0.1}>
              <Categories
                value={state?.category}
                onSelect={handleSelectCategory}
              />
            </Fade>
          )}
          {state.active === Step.INSTRUCTOR && (
            <Fade delay={0.1}>
              <Instructor
                value={state?.instructor}
                onInteract={handleInteract}
                interactive={state.interactive}
                onSelect={handleSelectInstructor}
              />
            </Fade>
          )}
        </Context>
      </Card>
    </Fade>
  );
};

export default CreateCourse;
