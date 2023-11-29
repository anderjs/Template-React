import { styles } from "@views/Coupon/coupon.styles";
import { Button } from "primereact/button";
import React from "react";

interface Props {
  title: React.ReactNode;
  onCancel: () => void;
  onDelete: () => void;
}

export const Deleted: React.FC<Props> = React.memo(
  ({ onDelete, onCancel, title }) => {
    return (
      <div className={styles.content}>
        <div className={styles.center}>{title}</div>
        <br />
        <div className={styles.controls}>
          <Button size="small" severity="danger" onClick={onDelete}>
            Eliminar
          </Button>
          <Button size="small" severity="secondary" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    );
  }
);
