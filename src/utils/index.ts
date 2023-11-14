import { capitalize } from "lodash";

export function getName(first: string, last: string) {
  return `${capitalize(first)} ${capitalize(last)}`;
}

export const paginatorTemplate =
  "RowsPerPageDropdown FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink";

export const pageReportTemplate = "{first} to {last} of {totalRecords}";

export const path = (route: string, id: number) => {
  return `${route}/${id}`;
};
