import React from "react";
import { Button } from "primereact/button";
import { styles } from "@views/Categories/Create/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface Props {
  disabled?: boolean;
  isLoading?: boolean;
  onEnrichment?: () => void;
}

const EnrichmentButton: React.FC<Props> = ({
  disabled,
  isLoading,
  onEnrichment,
}) => {
  const handleClickEnrichment = () => {
    onEnrichment();
  };

  return (
    <Button
      severity="help"
      className={styles.flex}
      onClick={handleClickEnrichment}
      disabled={isLoading || disabled}
      tooltip="¿No sabes qué colocar?, ¡la IA te ayudará!"
    >
      {isLoading ? "En proceso" : "Enriquecer Texto"}
      <FontAwesomeIcon
        icon={isLoading ? "wand-magic-sparkles" : "hand-sparkles"}
        beatFade={isLoading}
      />
    </Button>
  );
};

export default EnrichmentButton;
