import { useState, useEffect } from 'react'
import axios from 'axios'
import Countries from './components/Countries'
import Notification from './components/Notification'
import Footer from './components/Footer'
import Filter from './components/Filter'
import './App.css'

const App = () => {
  const [countries, setCountries] = useState([])
  const [newcountries, setNewCountries] = useState([])
  const [filterName, setFilterName] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [successMessage, setSuccessMessage] = useState('') 
  const [location, setLocation] = useState(null) 
  const [temperature, setTemperature] = useState(null)
  const [windspeed, setWindspeed] = useState(null)

  useEffect(() => {
    console.log('fetching all countries...')
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
      .then(response => {
        console.log('data',response.data[0].name.common)
        console.log(response.data.length + ' countries fetched')
        setSuccessMessage(response.data.length + ' countries fetched')
        setCountries(response.data)
        setTimeout(() => {
          setSuccessMessage(null)
              
        }, 9000)  
                
      })
      console.log('countries state updated', countries.length + ' countries in state')   
  }, [])

  useEffect(() => {
        
    console.log('capital location set for weather ... new value :=> ', location)
    const lat = location ? location[0] : null
    const lon = location ? location[1] : null
    console.log('lat :=> ', lat, ' lon :=> ', lon)
    // skip if wheather is not defined
    if (location) {
      console.log('fetching weather dat.....')
      axios
        .get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
        .then(response => {
          console.log('weather data', response.data)
          const temperature = response.data.current_weather.temperature
          const windspeeds = response.data.current_weather.windspeed
          console.log('Current windspeed: ', windspeeds)
          console.log('Current temperature: ', temperature)
          setTemperature(temperature)
          setWindspeed(windspeeds)
          
        })
    }
  }, [location])


  const getCountry = (c) => {
    // testataan sään haku api ...
    setLocation(c.capitalInfo.latlng)
    console.log('Fetching weather for capital: ', c.capital, ' at coordinates: ', c.capitalInfo.latlng) 
    console.log('getCountry called with country object: ', c)    
    // Accessing properties with dot notation
    // console.log(c.name.common)           // "Finland"
    // console.log(c.capital)                // "Helsinki"
    // console.log(c.area)                   // 338424
    // console.log(c.cca2)                   // "FI" 
    // console.log(c.cca3)                   // "FIN"
    // console.log(c.population)             // 5541017
    
    // // Languages (object of key-value pairs)
    // console.log(c.languages)              // { fin: "Finnish", swe: "Swedish" }
    // console.log(Object.values(c.languages)) // ["Finnish", "Swedish"]
    
    // // Flags
    // console.log(c.flags.png)              // URL to PNG flag
    // console.log(c.flags.svg)              // URL to SVG flag
    
    // Using bracket notation (same as dot notation)
    // console.log(c['name']['common'])      // "Finland"
    // console.log(c['capital'])             // "Helsinki"
    // console.log(c['area'])                // 338424
    // console.log(c['cca2'])                // "FI"
    // console.log(c['cca3'])                // "FIN"
    // console.log(c['population'])          // 5541017
    
    // console.log(c['languages'])           // { fin: "Finnish", swe: "Swedish" }
    // console.log(Object.values(c['languages'])) // ["Finnish", "Swedish"]
    
    // console.log(c['flags']['png'])        // URL to PNG flag
    // console.log(c['flags']['svg'])        // URL to SVG flag  
    console.log('Setting newcountries state to selected country only',c)
    setNewCountries([c])
}
  
  const handleFilterChange = (event) => {
    
    console.log('handleFilterChange event.target.value :=> ', event.target.value)
    setFilterName(event.target.value)
    setWindspeed(null)
    setTemperature(null)
    setNewCountries([])
    console.log('filterName after set :=> ',filterName)
    console.log('showAll after set :=> ',showAll)
    setShowAll(false)
    console.log('showAll after set :=> ',showAll)
    console.log(countries.filter(country => country.name.common.toLowerCase().includes(event.target.value.toLowerCase())).length)
    const nbrOfCountriesToShow = countries.filter(country => country.name.common.toLowerCase().includes(event.target.value.toLowerCase())).length
    console.log('nbrOfCountriesToShow :=> ', nbrOfCountriesToShow)
    if (nbrOfCountriesToShow > 10) {
      setSuccessMessage('Too many matches, specify another filter !')
    }
    else if (nbrOfCountriesToShow > 1 && nbrOfCountriesToShow <= 10) {
      setSuccessMessage('Number of countries: ' + nbrOfCountriesToShow + ' found !')
      setNewCountries(countries.filter(country => country.name.common.toLowerCase().includes(event.target.value.toLowerCase())))
    } else if (nbrOfCountriesToShow === 1) {
      setSuccessMessage(nbrOfCountriesToShow + ' countries found')   //
      const country = countries.filter(country => country.name.common.toLowerCase().includes(event.target.value.toLowerCase()))      
      console.log('Only one country found: ', country)
      // haetaan pääkaupungin säätiedot
      setNewCountries(country)
      setLocation(country[0].capitalInfo.latlng)
      // näytetään lippu ja kielet ynnä mmuuta tietoa tästä maasta      
      
    } else {
      setSuccessMessage('No country found with this name !')
      setNewCountries([])
    }
    setTimeout(() => {
      setSuccessMessage(null)
    }, 9000)
  }
   
  const countriesToShow = showAll
    ? newcountries
    : newcountries.filter(country => country.name.common.toLowerCase().includes(filterName.toLowerCase()))

  return (
    <div>
      <div className="filter-container">
        <Filter filterName={filterName} handleFilterChange={handleFilterChange} />
      </div>
      <div className="countries-wrapper">
        <Countries countriesToShow={countriesToShow} getCountry={getCountry} temperature={temperature}  windspeed={windspeed}/>      
        <Notification message={successMessage} type="success" />
        <Footer />
      </div>
    </div>
  )
}

export default App
