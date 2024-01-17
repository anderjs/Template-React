import {
  ITags,
  IUser,
  ICourse,
  IModule,
  ICategory,
} from "@learlifyweb/providers.schema";
import { v4 } from "uuid";
import { createReducer } from "@reduxjs/toolkit";

import {
  backStep,
  nextStep,
  removeTag,
  selectTag,
  setNewModule,
  setDraftState,
  setUpdateDraft,
  selectCategory,
  setInteractive,
  selectInstructor,
  setDeleteModule,
  setLessonModule,
  setEditorProperty,
  setPushNewElement,
  setAnswerElement,
  setDeleteAnswer,
  setDragAndDropAnswers,
} from "./action";
import { defaultModule, defaultLesson } from "./default";
import { IEditorContext } from "./schema";
import { dragElements } from "@utils";

type DraftEntity<T> = T & {
  update?: boolean;
};

interface IState {
  active: Step;
  names: string[];
  tags: Pick<ITags, "name" | "color">[];
  instructor?: DraftEntity<IUser>;
  category?: DraftEntity<ICategory>;
  interactive?: boolean;
  course?: Pick<ICourse, "title" | "description">;
  modules: Pick<IModule, "title" | "description" | "lessons" | "id">[];
  editor?: IEditorContext[];
}

enum Step {
  CATEGORIES = 0,
  INSTRUCTOR = 1,
  COURSES = 2,
  MODULES = 3,
}

const initialState: IState = {
  active: Step.MODULES,
  tags: [],
  names: [],
  editor: [],
  modules: [],
};

const reducer = createReducer(initialState, (builder) => {
  /**
   * Handles selecting a category. Updates the state to reflect the selected category.
   * If the selected category is the same as the current one, it marks 'update' as false.
   * @param {Object} state - The current state of the reducer.
   * @param {Object} action - The action object, containing the payload with category information.
   */
  builder.addCase(selectCategory, (state, action) => {
    if (state.category?.id === action.payload?.id) {
      state.category.update = false;
    } else {
      state.category = action.payload;

      state.category.update = true;
    }
  });

  /**
   * Handles selecting an instructor. Updates the state to reflect the selected instructor.
   * If the selected instructor is the same as the current one, it marks 'update' as false.
   * @param {Object} state - The current state of the reducer.
   * @param {Object} action - The action object, containing the payload with instructor information.
   */
  builder.addCase(selectInstructor, (state, action) => {
    if (state.instructor?.id === action.payload?.id) {
      state.instructor.update = false;
    } else {
      state.instructor = action.payload;

      state.instructor.update = true;
    }
  });

  /**
   * Handles selecting a tag. Adds a new tag to the state if it doesn't already exist and if there are less than 10 tags.
   * Converts the tag name to uppercase before checking.
   * @param {Object} state - The current state of the reducer.
   * @param {Object} action - The action object, containing the payload with tag information.
   */
  builder.addCase(selectTag, (state, action) => {
    const value = action.payload.name.toUpperCase();

    if (state.tags.length < 10 && !state.names.includes(value)) {
      state.tags.push(action.payload);

      state.names.push(value);
    }
  });

  /**
   * Handles removing a tag from the state.
   * @param {Object} state - The current state of the reducer.
   * @param {Object} action - The action object, containing the payload with tag information.
   */
  builder.addCase(removeTag, (state, action) => {
    state.tags = state.tags.filter((tag) => tag.name !== action.payload.name);
  });

  /**
   * Advances to the next step in a multi-step process.
   * @param {Object} state - The current state of the reducer.
   */
  builder.addCase(nextStep, (state) => {
    state.active += 1;
  });

  /**
   * Goes back to the previous step in a multi-step process.
   * @param {Object} state - The current state of the reducer.
   */
  builder.addCase(backStep, (state) => {
    state.active -= 1;
  });

  /**
   * Resets the 'update' status for category and instructor.
   * @param {Object} state - The current state of the reducer.
   */
  builder.addCase(setUpdateDraft, (state) => {
    if (state.category?.update) {
      state.category.update = false;
    }

    if (state.instructor?.update) {
      state.instructor.update = false;
    }
  });

  /**
   * Sets the draft state for the active step, category, and instructor.
   * @param {Object} state - The current state of the reducer.
   * @param {Object} action - The action object, containing the payload with new state information.
   */
  builder.addCase(setDraftState, (state, action) => {
    if (action.payload?.active) {
      state.active = action.payload.active;

      if (action.payload?.category) {
        state.category = action.payload.category as DraftEntity<ICategory>;
      }
    }
  });

  /**
   * Handles adding a new module to the state. The new module is initialized with default values.
   * It adds an empty module object with default values for title, lessons, and description.
   * @param {Object} state - The current state of the reducer.
   * @param {Object} action - The action object, used to pass any additional data if needed.
   */
  builder.addCase(setNewModule, (state, action) => {
    state.modules.push({
      ...defaultModule,
      id: state.modules.length + 1,
      title: action.payload,
    });
  });

  /**
   * Handles deleting a module to the state. The deleted module is now gone.
   * @param {Object} state - The current state of the reducer.
   * @param {Object} action - The action object, used to pass any additional data if needed.
   */
  builder.addCase(setDeleteModule, (state, action) => {
    state.modules = state.modules.filter((m) => m.id !== action.payload);
  });

  /**
   * @description
   * Adds a new lesson's module with his title.
   */
  builder.addCase(setLessonModule, (state, action) => {
    state.modules[action.payload.id].lessons.push({
      ...defaultLesson,
      title: action.payload.title,
    });
  });

  /**
   * Toggles the 'interactive' state.
   * @param {Object} state - The current state of the reducer.
   */
  builder.addCase(setInteractive, (state) => {
    state.interactive = !state.interactive;
  });

  /**
   * Edits a current one exercise.
   * @param {Object} state - The current state of the reducer.
   */
  builder.addCase(setEditorProperty, (state, action) => {
    if (action.payload.kind.type === "SimpleSelection") {
      const edit = action.payload.data;

      const { index } = action.payload;

      if (action.payload.data.correct) {
        state.editor[index].correct = edit.correct;
      }

      if (action.payload.data.answers) {
        state.editor[index].answers = edit.answers;
      }
    }
  });

  /**
   * Set a new answer for the editor component.
   * @param {Object} state - The current state of the reducer.
   */
  builder.addCase(setAnswerElement, (state, action) => {
    if (action.payload.type === "SimpleSelection") {
      const { index, value } = action.payload;

      state.editor[index].answers.push({
        id: v4(),
        value,
      });
    }
  });

  /**
   * Deletes the current answer.
   * @param {Object} state - The current state of the reducer.
   */
  builder.addCase(setDeleteAnswer, (state, action) => {
    if (action.payload.type === "SimpleSelection") {
      const { index, value } = action.payload;

      state.editor[index].answers = state.editor[index].answers.filter(
        (answer) => answer.id !== value.id
      );
    }
  });

  /**
   * @description
   * Creating a new editor.
   */
  builder.addCase(setPushNewElement, (state, action) => {
    state.editor.push(action.payload);
  });

  /**
   * @description
   * Re order elements.
   */
  builder.addCase(setDragAndDropAnswers, (state, action) => {
    const { drop, index } = action.payload;

    state.editor[index].answers = dragElements(
      state.editor[index].answers,
      drop.source.index,
      drop.destination.index
    );
  });
});

export { Step, IState, reducer, initialState };
