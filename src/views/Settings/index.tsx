import React from "react";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";

// - Hooks
import {
  ICountry,
  countryOptionTemplate,
  selectedCountryTemplate,
} from "@b1b2/components.ui.country";

const Settings: React.FC = () => {
  const [country, setCountry] = React.useState<ICountry>();

  const countries = React.useRef<ICountry[]>([
    {
      code: "ES",
      name: "España",
    },
    {
      code: "FR",
      name: "France",
    },
  ]);

  const handleChangeCountry = (option: DropdownChangeEvent) => {
    setCountry(option.value);
  };

  return (
    <React.Fragment>
      <br />
      <Dropdown
        value={country}
        options={countries.current}
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
