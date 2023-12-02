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
