import { capitalize } from "lodash";
import { Button } from "primereact/button";

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
