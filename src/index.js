import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';

const input = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const DEBOUNCE_DELAY = 300;

input.addEventListener(
  'input',
  debounce(evt => {
    const trimmedValue = input.value.trim();
    cleanHtml();
    if (trimmedValue !== '') {
      fetchCountries(trimmedValue).then(foundData => {
        if (foundData.length > 10) {
          Notiflix.Notify.info(
            'Too many matches found. Please enter a more specific name.'
          );
        } else if (foundData.length === 0) {
          Notiflix.Notify.failure('Oops, there is no country with that name');
        } else if (foundData.length > 2 && foundData.length <= 10) {
          makeCountryList(foundData);
        } else if (foundData.length === 1) {
            makeOneCountry(foundData)
        }
      });
    }
  }, DEBOUNCE_DELAY)
);

function makeCountryList(countries) {
  const markup = countries
    .map(country => {
      return `<li class="country-list__item"><img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="50"><b>${country.name.official}</b></li>`;
    })
    .join('');

  countryList.innerHTML = markup;
}

function makeOneCountry(countries) {
    const markup = countries
    .map(country => {
      return `<li ><img src="${country.flags.svg}" alt="Flag of ${country.name.official}" width="120"><p><b>${country.name.official}</b></p>
      <p><b>Capital:</b> ${country.capital}</p><p><b>Population:</b> ${country.population}</p><p><b>Langusges:</b> ${Object.values(country.languages)}</p></li>`;
    })
    .join('');

    countryList.innerHTML = markup;
}

function cleanHtml() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}
