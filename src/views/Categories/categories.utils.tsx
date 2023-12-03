import { Node } from "@learlifyweb/providers.services";
import { ICategory } from "@learlifyweb/providers.schema";

import { Icon, IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styles } from "./Create/styles";
import { ColorPicker } from "primereact/colorpicker";

export function randomColor() {
  const red = Math.floor(Math.random() * 256);

  const blue = Math.floor(Math.random() * 256);

  const green = Math.floor(Math.random() * 256);

  const colorCode = `#${red.toString(16)}${green.toString(16)}${blue.toString(
    16
  )}`;

  return colorCode;
}

export function generateFreshColor() {
  // Lista de colores frescos en formato hexadecimal
  const freshColors = [
    "#ffe4e6",
    "#fbcfe8",
    "#f5d0fe",
    "#e9d5ff",
    "#ddd6fe",
    "#c7d2fe",
    "#bfdbfe",
    "#bae6fd",
    "#a5f3fc",
    "#99f6e4",
    "#a7f3d0",
    "#bbf7d0",
    "#d9f99d",
    "#fef9c3",
    "#fde68a",
    "#fed7aa",
    "#fecaca",
    "#e7e5e4",
    "#e4e4e7",
    "#e5e7eb",
    "#e2e8f0",
  ];

  // Seleccionar un color al azar de la lista
  const randomColor =
    freshColors[Math.floor(Math.random() * freshColors.length)];

  return randomColor;
}

// - Types

export const render: Node<ICategory>["data"] = {
  id: ({ id }) => id,
  name: ({ icon, name }) => (
    <div className={styles.palette}>
      <span className="text-right">{name}</span>
    </div>
  ),
  first_color: ({ icon, first_color, second_color }) => (
    <div className={styles.container}>
      <ColorPicker value={first_color} disabled />
      <ColorPicker value={second_color} disabled />
    </div>
  ),
  icon: ({ icon }) => <FontAwesomeIcon size="1x" icon={icon as IconProp} />,
};
