import React from "react";
import { useForm, useWatch } from "react-hook-form";
import "./styles.css";

// - Prime API
import { Card } from "primereact/card";
import { Steps } from "primereact/steps";
import { Button } from "primereact/button";
import { MenuItem } from "primereact/menuitem";

import { Context } from "../styles";
import { Container } from "@views/Admin/admin.style";

// - State
import { initialState, reducer, Step } from "./state";
import {
  backStep,
  nextStep,
  removeTag,
  selectCategory,
  selectInstructor,
  selectTag,
} from "./state/action";

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
import { Fade, Slide } from "react-awesome-reveal";

const CreateCourse: React.FC = () => {
  const course = useForm<ICourse>();

  const [state, dispatch] = React.useReducer(reducer, initialState);

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

  const title = useWatch({
    control: course.control,
    name: "title",
  });

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

  const handleEnrichDescription = (value: string) => {
    course.setValue("description", value);
  };

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
                state.tags.length === 0 &&
                !course.getValues("title") &&
                !course.getValues("description")
              }
            />
          </>
        );
    }
  };

  return (
    <Fade delay={0.5}>
      <Card footer={FooterTemplate}>
        <Steps model={steps} activeIndex={state.active} />
        <Context>
          {state.active === Step.COURSES && (
            <Fade delay={0.1}>
              <Course
                title={title}
                tags={state.tags}
                control={course.control}
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
