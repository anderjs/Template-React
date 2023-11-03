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
  const { t } = useTranslation();

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
        code: "CO",
        name: t(alias["dashboard.settings.country.co"]),
      },
      {
        code: "ES",
        name: t(alias["dashboard.settings.country.es"]),
      },
      {
        code: "FR",
        name: t(alias["dashboard.settings.country.fr"]),
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
