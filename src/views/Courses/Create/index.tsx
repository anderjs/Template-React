import React from "react";
import { navigateToUrl } from "single-spa";
import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { AxiosError, HttpStatusCode } from "axios";
import { useDocumentTitle } from "usehooks-ts";
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
  setNewModule,
  setDraftState,
  selectCategory,
  setInteractive,
  setUpdateDraft,
  setDeleteModule,
  setLessonModule,
  selectInstructor,
  setPushNewElement,
  setAnswerElement,
  setDeleteAnswer,
  setDeleteElement,
  setCorrectAnswer,
  setUpdateAnswer,
  setCompileEditor,
  setDragAndDropAnswers,
} from "./state/action";

// - API
import { api } from "../courses.service";
import { IDraft } from "../courses.interface";

// - Stepper
import Course from "./components/Course";
import Modules from "./components/Modules";
import Categories from "./components/Categories";
import Instructor from "./components/Instructor";
import { Controllers } from "./components/Controllers";

// - Schema
import {
  ITags,
  IUser,
  ICourse,
  ICategory,
} from "@learlifyweb/providers.schema";

// - Animation
import { Fade } from "react-awesome-reveal";
import { MarginY } from "@views/Coupon/coupon.styles";
import { Loading } from "@learlifyweb/providers.loading";
import { EditorContext, EditorContextProps } from "./context/EditorContext";
// - @styles
import { TextLabel } from "@styles";

const CreateCourse: React.FC = () => {
  const { token } = useHost();

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const { control, getValues, setValue } = useForm<ICourse>();

  const { id } = useParams();

  const title = useWatch({
    control,
    name: "title",
  });

  useDocumentTitle("Learlify - Courses");

  const draft = useQuery({
    queryKey: ["draft"],
    refetchOnWindowFocus: false,
    queryFn: http<IDraft>({ token }, api.findDraft, {
      params: [id],
    }),
    onSuccess: ({ response }) => {
      dispatch(setDraftState(response));
    },
    onError: (err: AxiosError) => {
      switch (err.response.status) {
        case HttpStatusCode.NotFound:
          return navigateToUrl("/dashboard/courses");

        case HttpStatusCode.InternalServerError:
          return navigateToUrl("/dashboard/courses");
      }
    },
  });

  /**
   * @description
   * Update the current draft information.
   */
  const updateDraft = useMutation({
    mutationKey: ["draft"],
    mutationFn: (data: Partial<IDraft>) => {
      const request = http<IDraft>({ token }, api.updateDraft, {
        body: data,
        params: [id],
      });

      return request();
    },
    onSuccess: () => {
      /**
       * @description
       * Mark the state as readed and settled.
       */
      dispatch(setUpdateDraft());
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
   * Search for every instance of draft to update.
   * If one entity contain "update", it will be updated.
   */
  const update = () => {
    /**
     * @description
     * Omitting unnecesary keys.
     */
    const args: Partial<IDraft> = {
      status: draft.data?.response?.status,
      category: draft.data?.response?.category,
      instructor: draft.data?.response?.instructor,
    };

    /**
     * @description
     * Check if can be updated.
     */
    if (state.category?.update) {
      args.category = {
        id: state.category.id,
        name: state.category.name,
      };
    }

    /**
     * @description
     * Check if can be updated.
     */
    if (state.instructor?.update) {
      args.instructor = {
        id: state.instructor.id,
        first_name: state.instructor.first_name,
      };
    }

    /**
     * @description
     * Avoiding unnecesary update call.
     */
    if (state.category?.update || state.instructor?.update) {
      updateDraft.mutate({
        ...args,
        active: state.active + 1,
      });
    }
  };

  /**
   * @description
   * Handle click next.
   */
  const handleNextStep = () => {
    update();

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

  /**
   * @description
   * Adds a module.
   */
  const handleAddModule = (title: string) => {
    dispatch(setNewModule(title));
  };

  /**
   * @description
   * Adds a module's lesson.
   */
  const handleAddLesson = (view: number, title: string) => {
    dispatch(setLessonModule(view, title));
  };

  /**
   * @description
   * Adds a module.
   */
  const handleDeleteModule = (id: number) => {
    dispatch(setDeleteModule(id));
  };

  /**
   * @description
   * Steps for the process.
   */
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
      {
        label: "Modulo",
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
              disabledNext={
                state.interactive ? !state.interactive : !state?.instructor
              }
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

      case Step.MODULES:
        return (
          <>
            <Controllers
              onBack={handleBackStep}
              onNext={handleNextStep}
              disabledNext={state.modules.length === 0}
            />
          </>
        );
    }
  };

  /**
   * @description
   * API That manages the editor context.
   * We dont allow dispatch directly from any child component.
   */
  const EditorContextValue = React.useMemo<EditorContextProps>(() => {
    return {
      editor: state.editor,
      /**
       * @description
       * Add answer method.
       */
      onAddNewAnswer: (element) => {
        dispatch(setAnswerElement(element));
      },
      /**
       *
       * @description
       * Update current answer.
       */
      onUpdateAnswer: (element) => {
        dispatch(setUpdateAnswer(element));
      },
      /**
       * @description
       * Deletes a existing element.
       */
      onDeleteElement: (element) => {
        dispatch(setDeleteElement(element));
      },
      /**
       * Delete answer method.
       */
      onDeleteAnswer: (element) => {
        /**
         * @description
         * Deleting the current element from the editor.
         */
        dispatch(setDeleteAnswer(element));
      },
      /**
       * @description
       * Assign the correct answer value.
       */
      onSelectCorrect: (element) => {
        dispatch(setCorrectAnswer(element));
      },
      /**
       * Add new element method.
       */
      onSetNewElement: (element) => {
        /**
         * @description
         * Creating a new element based on the editor selection.
         */
        dispatch(setPushNewElement(element));
      },
      /**
       * @description
       * Re order drag and drop elements.
       */
      onDragAndDropAnswer: (element) => {
        dispatch(setDragAndDropAnswers(element));
      },
      /**
       * @description
       * Compile all context into new property.
       */
      onChangeEditorProperty: (element) => {
        dispatch(setCompileEditor(element));
      },
    };
  }, [state.editor]);

  return (
    <Loading status={draft.isLoading || draft.isRefetching}>
      <Fade delay={0.5}>
        <div className="flex justify-start gap-x-2 items-center">
          <TextLabel>Development Stage</TextLabel>
          <img
            alt="modules"
            src="https://learlify.nyc3.cdn.digitaloceanspaces.com/static/pre-built-module.png"
          />
        </div>
        <MarginY />
        <Card footer={FooterTemplate} className="mb-5">
          <Steps model={steps} activeIndex={state.active} />
          <Context>
            {state.active === Step.MODULES && (
              <Fade delay={0.1}>
                <EditorContext.Provider value={EditorContextValue}>
                  <Modules
                    data={state.modules}
                    onAddModule={handleAddModule}
                    onAddLesson={handleAddLesson}
                    interactive={state.interactive}
                    onDeleteModule={handleDeleteModule}
                  />
                </EditorContext.Provider>
              </Fade>
            )}
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
    </Loading>
  );
};

export default CreateCourse;
