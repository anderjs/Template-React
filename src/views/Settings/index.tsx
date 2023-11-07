import React from "react";
import { useTranslation } from "react-i18next";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

// - Hooks
import {
  ICountry,
  countryOptionTemplate,
  selectedCountryTemplate,
} from "@b1b2/components.ui.country";

import { alias } from "@lang";

const Settings: React.FC = () => {
  /**
   * @description
   * Translator
   * @requires i18next
   */
  const { t } = useTranslation();

  /**
   * @description
   * Set the current country.
   */
  const [country, setCountry] = React.useState<ICountry>();

  /**
   * @description
   * Changes the current country.
   */
  const handleChangeCountry = (option: DropdownChangeEvent) => {
    setCountry(option.value);
  };

  /**
   * @description
   * Render countries translated.
   */
  const countries: ICountry[] = React.useMemo(() => {
    return [
      {
        code: "AR",
        name: t(alias["dashboard.settings.country.ar"]),
      },
      {
        code: "BR",
        name: t(alias["dashboard.settings.country.br"]),
      },
      {
        code: "CA",
        name: t(alias["dashboard.settings.country.ca"]),
      },
      {
        code: "CL",
        name: t(alias["dashboard.settings.country.cl"]),
      },
      {
        code: "CO",
        name: t(alias["dashboard.settings.country.co"]),
      },
      {
        code: "EC",
        name: t(alias["dashboard.settings.country.ec"]),
      },
      {
        code: "ES",
        name: t(alias["dashboard.settings.country.es"]),
      },
      {
        code: "FR",
        name: t(alias["dashboard.settings.country.fr"]),
      },
      {
        code: "MX",
        name: t(alias["dashboard.settings.country.mx"]),
      },
    ];
  }, [t]);

  /**
   * @description
   * @alias SelectText - as "Select a country".
   */
  const placeholder = t(alias["dashboard.settings.countries.placeholder"]);

  return (
    <React.Fragment>
      <br />
      <Dropdown
        value={country}
        options={countries}
        optionLabel="name"
        placeholder={placeholder}
        className="w-1/4 md:w-14rem"
        onChange={handleChangeCountry}
        itemTemplate={countryOptionTemplate}
        valueTemplate={selectedCountryTemplate}
      />
      <div />
    </React.Fragment>
  );
};

export default Settings;
