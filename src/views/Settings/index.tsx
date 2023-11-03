import React from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

// - Hooks
import {
  ICountry,
  countryOptionTemplate,
  selectedCountryTemplate,
} from "@b1b2/components.ui.country";

import { alias } from "@/lang";

const Settings: React.FC = () => {
  const { t } = useTranslation();

  const [country, setCountry] = React.useState<ICountry>();

  const countries: ICountry[] = [
    {
      code: "ES",
      name: t(alias["dashboard.settings.country.es"]),
    },
    {
      code: "FR",
      name: t(alias["dashboard.settings.country.fr"]),
    },
  ];

  const handleChangeCountry = (option: DropdownChangeEvent) => {
    setCountry(option.value);
  };

  return (
    <React.Fragment>
      <br />
      <Dropdown
        value={country}
        options={countries}
        optionLabel="name"
        placeholder="Selecciona un País"
        onChange={handleChangeCountry}
        itemTemplate={countryOptionTemplate}
        valueTemplate={selectedCountryTemplate}
        className="w-1/4 md:w-14rem"
      />
      <div />
    </React.Fragment>
  );
};

export default Settings;
