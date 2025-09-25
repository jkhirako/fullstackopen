import { useState, useEffect } from "react";
import countriesService from "./services/countries";

const ShowCountry = ({ country }) => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    countriesService
      .getWeather(country.capitalInfo.latlng[0], country.capitalInfo.latlng[1])
      .then((data) => {
        setWeather(data);
      });
  }, [country]);

  if (!weather) {
    return null;
  }

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital {country.capital}</p>
      <p>Area {country.area}</p>
      <div>
        <h2>Languages</h2>
        <ul>
          {Object.values(country.languages).map((lang) => (
            <li key={lang}>{lang}</li>
          ))}
        </ul>
      </div>
      <div className="flag">{country.flag}</div>
      <h2>Weather in {country.capital}</h2>
      <p>Temperature {weather.main.temp} Celsius</p>
      <img
        src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
        alt={weather.weather[0].description}
      />
      <p>Wind {weather.wind.speed} m/s</p>
    </div>
  );
};

const Countries = ({ countries, newCountry }) => {
  const [showCountry, setShowCountry] = useState(null);

  useEffect(() => {
    setShowCountry(null);
  }, [newCountry]);

  const countryFilter = countries.filter((country) =>
    country.name.common.toLowerCase().includes(newCountry.toLowerCase())
  );

  if (countryFilter.length > 10) {
    return <div>Too many matches, specify another filter</div>;
  } else if (countryFilter.length === 1) {
    return <ShowCountry country={countryFilter[0]} />;
  } else {
    return (
      <div>
        {countryFilter.map((country) => (
          <div key={country.name.common}>
            {country.name.common}
            <button onClick={() => setShowCountry(country)}>Show</button>
          </div>
        ))}
        {showCountry ? <ShowCountry country={showCountry} /> : null}
      </div>
    );
  }
};

const App = () => {
  const [countries, setCountries] = useState([]);
  const [newCountry, setNewCountry] = useState("");

  useEffect(() => {
    countriesService.getAll().then((data) => {
      setCountries(data);
    });
  }, []);

  const handleCountryChange = (event) => {
    setNewCountry(event.target.value);
  };

  return (
    <div>
      <p>
        find countries{" "}
        <input value={newCountry} onChange={handleCountryChange} />
      </p>
      <Countries countries={countries} newCountry={newCountry} />
    </div>
  );
};

export default App;
