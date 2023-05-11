import MiniSearch from 'minisearch'
import { useState } from 'react'

export const Search = ({docs}) => {
    const [query, setQuery] = useState('')

    // TODO: add sowing months to search
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
    let plants = query && query.length > 2 ? docs.filter(doc => searchResults.find(result => result.id === doc.id)) : docs

    const handleSearch = (event) => {
        let value = event.target.value
        setQuery(value)
    }

    return (
        <>
            <label>
                Zoek op planten:
                <input type="search" placeholder="Zoek.." onChange={handleSearch} />
            </label>

            <ul className="search-results">
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