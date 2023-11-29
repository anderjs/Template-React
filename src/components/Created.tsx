import React from "react";

import { Button } from "primereact/button";
import { MarginY, styles } from "@views/Create-Coupon/styles";

type Props = {
  title: string;
  description: string;
  onClickAccept: () => void;
  onClickCancel: () => void;
};

export const Created: React.FC<Props> = React.memo((props) => (
  <div className={styles.content}>
    <div className="text-center">
      <div className="text-base">{props.title}</div>
    </div>
    <MarginY />
    <div className="text-center">
      <div className="text-base">{props.description}</div>
    </div>
    <MarginY />
    <div className={styles.controls}>
      <Button severity="info" onClick={props.onClickAccept}>
        Aceptar
      </Button>
      <Button severity="secondary" onClick={props.onClickCancel}>
        Cancelar
      </Button>
    </div>
  </div>
));
