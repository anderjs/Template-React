import React from "react";
import { Container } from "@views/Admin/admin.style";

import { Button } from "primereact/button";

interface Props {
  onNext?: () => void;
  onBack?: () => void;
  disabledBack?: boolean;
  disabledNext?: boolean;
}

export const Controllers: React.FC<Props> = (props) => {
  const handleClickBack = () => {
    props?.onBack();
  };

  const handleClickNext = () => {
    props?.onNext();
  };

  return (
    <Container>
      <Button
        severity="help"
        onClick={handleClickBack}
        disabled={props.disabledBack}
      >
        Back
      </Button>
      <Button
        severity="info"
        onClick={handleClickNext}
        disabled={props.disabledNext}
      >
        Next
      </Button>
    </Container>
  );
};
