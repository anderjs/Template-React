import { capitalize } from "lodash";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import styled from "styled-components";

const StyledIcon = styled.i`
  font-size: 5em;
  border-radius: 50%;
  color: var(--surface-d);
  background-color: var(--surface-b);
`;

const StyledSpan = styled.span`
  font-size: 1.2em;
  color: var(--text-color-secondary);
`;

export function getName(first: string, last: string) {
  return `${capitalize(first)} ${capitalize(last)}`;
}

export const paginatorTemplate =
  "RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink";

export const pageReportTemplate = "{first} to {last} of {totalRecords}";

export const path = (route: string, id: number | string) => {
  return `${route}/${id}`;
};

export const paginatorLeft = <Button type="button" icon="pi pi-refresh" text />;

export const paginatorRight = (
  <Button type="button" icon="pi pi-download" text />
);

export const emptyTemplate = () => {
  return (
    <div className="flex items-center flex-column">
      <StyledIcon className="pi pi-image mt-3 p-5" />
      <StyledSpan>Drag and Drop Files Here</StyledSpan>
    </div>
  );
};

export const itemTemplate = (file, props) => {
  return (
    <div className="flex align-items-center flex-wrap">
      <div className="flex align-items-center" style={{ width: "40%" }}>
        {/* <img
          alt={file.name}
          role="presentation"
          src={file.objectURL}
          width={100}
        /> */}
        <span className="flex gap-3 text-left ml-3">{file.name}</span>
      </div>
      <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
      <Button
        type="button"
        icon="pi pi-times"
        className="p-button-outlined p-button-rounded p-button-danger ml-auto"
        onClick={props.onClick}
      />
    </div>
  );
};

export const chooseOptions = {
  icon: "pi pi-fw pi-images",
  iconOnly: true,
  className: "custom-choose-btn p-button-rounded p-button-outlined",
};

export const uploadOptions = {
  icon: "pi pi-fw pi-cloud-upload",
  iconOnly: true,
  className:
    "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
};

export const cancelOptions = {
  icon: "pi pi-fw pi-times",
  iconOnly: true,
  className:
    "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
};

export const beautify = (value: any) => {
  return JSON.stringify(value, null, 2);
};

export function dragElements<T>(
  elements: Array<T>,
  source: number,
  destination: number
) {
  const newItems = Array.from(elements);

  const [reorderedItem] = newItems.splice(source, 1);

  newItems.splice(destination, 0, reorderedItem);

  return newItems;
}
