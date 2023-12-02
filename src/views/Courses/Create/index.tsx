import React from "react";
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
import { nextStep, selectCategory } from "./state/action";

// - Stepper
import Categories from "./components/Categories";

// - Schema
import { ICategory } from "@learlifyweb/providers.schema";

// - Animation
import { Fade, Zoom } from "react-awesome-reveal";

const CreateCourse: React.FC = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  const steps = React.useMemo<MenuItem[]>(
    () => [
      {
        label: "Categoría",
      },
      {
        label: "Instructor",
      },
    ],
    []
  );

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

  const FooterTemplate = () => {
    switch (state.active) {
      case Step.CATEGORIES:
        return (
          <Container>
            <Button disabled severity="help">
              Back
            </Button>
            <Button
              onClick={handleNextStep}
              tooltip="Continuarás con la siguiente etapa"
              disabled={!state.category}
              severity="info"
            >
              Next
            </Button>
          </Container>
        );
    }
  };

  return (
    <Fade delay={0.5}>
      <Card footer={FooterTemplate}>
        <Steps model={steps} activeIndex={state.active} />
        <Context>
          {state.active === Step.CATEGORIES && (
            <Zoom delay={0.5}>
              <Categories
                value={state?.category}
                onSelect={handleSelectCategory}
              />
            </Zoom>
          )}
        </Context>
      </Card>
    </Fade>
  );
};

export default CreateCourse;
