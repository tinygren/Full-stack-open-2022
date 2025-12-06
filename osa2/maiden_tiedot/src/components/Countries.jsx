import React from 'react'

const Countries = ({ countriesToShow, getCountry, temperature, windspeed }) => {
  const countriesStyle = {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    textAlign: 'center',
    color: '#3011b9ff',
    fontSize: '0.9em'
  }
  const label = 'Show'
  const buttonStyle = (showBorder) => ({
    marginLeft: '5px',
    padding: '5px 5px',
    backgroundColor: '#7c778bff',
    color: 'white',
    border: showBorder ? '1px solid #656d69ff' : 'none',
    borderRadius: '4px',
    cursor: 'pointer'
  })
 
  return (
   
    <div>
    <ul style={countriesStyle}>
      {countriesToShow.length > 1 ? countriesToShow.map((c) => (
        <li key={c.cca3}>
          {c.name.common} 
          <button style={buttonStyle(true)} onClick={() => getCountry(c)}>{label}</button>          
        </li>         
      )): ''}
       
    </ul>
    <h2>{countriesToShow.length === 1 ? countriesToShow[0].name.common : ''}</h2>
        {countriesToShow.length === 1 ? 'Capital ' + countriesToShow[0].capital : ''} 
    <br />
       {countriesToShow.length === 1 ? 'Area ' + countriesToShow[0].area + ' km²' : ''}
    <br />  
    
    <h3>Languages</h3>
    {countriesToShow.length === 1 ? Object.values(countriesToShow[0].languages).map((lang) => (
      <li key={lang}>{lang}</li>
    )) : ''}
    <br />
    <img src={countriesToShow.length === 1 ? countriesToShow[0].flags.png : 'null'} alt="Country flag" />
    <h3>Weather in {countriesToShow.length === 1 ? countriesToShow[0].capital : ''}</h3>
    <p>Temperature: {temperature}  Celsius </p>
    <img src="https://openweathermap.org/img/wn/04d@2x.png" alt="Weather icon" />
    <p>Wind {windspeed ?? ''} m/s</p>
    </div>
  )
}



export default Countries

// // 2ba1aba223ce5d15be807875984ee393