const Filter = ({ filterName, handleFilterChange }) => {

    return (
  <div>
     <p>Find countries:</p> 
     <input 
      value={filterName}
      onChange={handleFilterChange}
    />
  </div>
    )
}

export default Filter