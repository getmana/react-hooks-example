// Core
import React, { useState, useEffect } from 'react';

// Instruments
import './styles.css';
import { api } from '../API';
import { delay } from '../instruments';
import Tilt from 'react-vanilla-tilt';

// Hooks
import { useDebounce } from './useDebounce';

export const Search = () => {
    const [ filter, setFilter ] = useState('');
    const [ countries, setCountries ] = useState([]);
    const [ isFetching, setIsFetching ] = useState(false);
    const [ isOpen, setIsOpen ] = useState(false);
    const [ currentCountry, setCurrentCountry ] = useState({});

    const getCountries = async () => {
        setIsFetching(true);
        const filteredCountries = await api.getCountries(filter.trim());
        await delay(200);
        setCountries(filteredCountries);
        setIsFetching(false);
    };

    const regexp = new RegExp(filter, 'g');
    const countriesJSX = countries.map((country) => {
        const name = country.name.replace(
            regexp,
            `<span class='highlight'>${filter}</span>`,
        );

        const continent = country.continent.replace(
            regexp,
            `<span class='highlight'>${filter}</span>`,
        );

        return (
            <li
                key = { country.emoji }
                onClick = { () => {
                    setFilter(country.name);
                    setIsOpen(true);
                    setCurrentCountry(country);
                } }>
                <span
                    className = 'country'
                    dangerouslySetInnerHTML = {{
                        __html: `${name}, ${continent}`,
                    }}
                />
                <span className = 'flag'>{country.emoji}</span>
            </li>
        );
    });

    const debouncedFilter = useDebounce(filter, 200);

    useEffect(() => {
        getCountries();
    }, [ debouncedFilter ]);

    const languages = currentCountry.languages
        ? currentCountry.languages.map((language) => language.name).join(', ')
        : '';

    const currencies = currentCountry.currencies
        ? currentCountry.currencies.join(', ')
        : '';

    return (
        <section className = 'strange-search'>
            <span className = 'strange'>Strange</span>
            <input
                placeholder = 'Country or continent'
                style = {{
                    '--inputBorderStyle': isFetching ? 'dashed' : 'solid',
                }}
                type = 'text'
                value = { filter }
                onChange = { (event) => setFilter(event.target.value) }
            />
            <span className = 'search'>search</span>
            <ul>
                {countriesJSX}
            </ul>
            { isOpen
                && <div className = 'modal'>
                    <Tilt
                        className = 'tilt'
                        options = {{ scale: 2, max: 25 }}>
                        <span
                            className = 'close'
                            onClick = { () => {
                                setIsOpen(false);
                                setFilter('');
                            } }
                        />
                        <div className = 'content'>
                            <h1>{filter}<span>{currentCountry.emoji}</span></h1>
                            <ul>
                                <li>Capital: {currentCountry.capital}</li>
                                <li>Continent: {currentCountry.continent}</li>
                                <li>Native name: {currentCountry.native}</li>
                                <li>Languages: {languages}</li>
                                <li>Currencies: {currencies}</li>
                            </ul>
                        </div>
                    </Tilt>
                   </div>
            }

            <b />
        </section>
    );
};

