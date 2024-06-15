import MiniSearch from 'minisearch'
import { useState, useEffect } from 'react'

const plantContainsMonth = (plantData, month, location) => {
    if (location === "indoors") return plantData && month && plantData.sowIndoors?.toLowerCase().includes(month)
    if (location === "outdoors") return plantData && month && plantData.sowOutdoors?.toLowerCase().includes(month)
    return plantData && month && (plantData.sowIndoors?.toLowerCase().includes(month) || plantData.sowOutdoors?.toLowerCase().includes(month))
}

export const SearchAndFilter = ({docs}) => {
    const [query, setQuery] = useState('')
    const [location, setLocation] = useState(undefined)
    const [month, setMonth] = useState(undefined)
    const [plants, setPlants] = useState([])

    const miniSearch = new MiniSearch({
        fields: ['slug', 'body', 'data.nameCommon', 'data.nameLatin'],
        extractField: (document, fieldName) => fieldName.split('.').reduce((doc, key) => doc && doc[key], document),
        searchOptions: {
            prefix: true,
            fuzzy: 0.25
        }
    })
    miniSearch.addAll(docs)

    let searchResults = miniSearch.search(query)

    useEffect(() => {
        let filteredPlants = query && query.length > 2 ? docs.filter(doc => searchResults.find(result => result.id === doc.id)) : docs
        if (location === "indoors") filteredPlants = filteredPlants.filter(plant => !!plant.data.sowIndoors)
        if (location === "outdoors") filteredPlants = filteredPlants.filter(plant => !!plant.data.sowOutdoors)
        if (month) filteredPlants = filteredPlants.filter(plant => plantContainsMonth(plant.data, month, location))
        setPlants(filteredPlants)
      }, [docs, query, month, location])
   

    const handleSearch = (event) => {
        let value = event.target?.value
        setQuery(value)
    }

    const handleSelectLocation = (newLocation) => {
      if (newLocation === "indoors" | newLocation === "outdoors") {
        if (location === newLocation) setLocation(undefined)
        else setLocation(newLocation)
      }
    }

    const handleSelectMonth = (event) => {
        let value = event.target.value
        setMonth(value)
    }

    const handleResetFilters = () => {
        setLocation("")
        setMonth("")
    }

    return (
        <>
            <label>
                Zoek op planten:
                <input type="search" placeholder="Zoek.." onChange={handleSearch} />
            </label>

            <div className="filters">
                <div className="filter-location">
                    <button onClick={() => handleSelectLocation("indoors")} className={location === "indoors" ? "location-active" : ""}
                      role="switch" aria-checked={location === "indoors"} aria-label={"Filter on location: indoors"}>
                      <img src="/astro_grow/home-outline.svg" alt="house icon" className="svg-icon" />
                    </button>
                    <button onClick={() => handleSelectLocation("outdoors")} className={location === "outdoors" ? "location-active" : ""}
                      role="switch" aria-checked={location === "outdoors"} aria-label={"Filter on location: outdoors"}>
                      <img src="/astro_grow/sun-outline.svg" alt="sun icon" className="svg-icon" />
                    </button>
                </div>

                <select name="month" id="month" value={month} onChange={handleSelectMonth} aria-label="Filter on month">
                    <option value="">Kies maand...</option>
                    {/* <option value="januari">Januari</option> */}
                    <option value="februari">Februari</option>
                    <option value="maart">Maart</option>
                    <option value="april">April</option>
                    <option value="mei">Mei</option>
                    {/* <option value="juni">Juni</option> */}
                </select>

                <button onClick={handleResetFilters}>Reset filters</button>
            </div>

            <ul className="search-results" id="plants" tabIndex="-1">
                { plants.map((plant) => (
                    <li className="search-result" key={plant.id}>
                        <a href={`/astro_grow/${plant.slug}/`}>{plant.data.nameCommon}</a>
                        { plant.data.nameLatin && <i> ({plant.data.nameLatin})</i> }
                        { plant.data.sowIndoors && 
                            <p>
                                <img src="/astro_grow/home-outline.svg" alt="house icon" className="svg-icon" />
                                <span>Binnen zaaien vanaf:</span> <strong>{plant.data.sowIndoors}</strong>
                            </p> 
                        }
                        { plant.data.sowOutdoors && 
                            <p>
                                <img src="/astro_grow/sun-outline.svg" alt="sun icon" className="svg-icon" />
                                <span>Buiten zaaien vanaf:</span> <strong>{plant.data.sowOutdoors}</strong>
                            </p> 
                        }
                    </li>
                )) }
            </ul>
        </>
    )
}