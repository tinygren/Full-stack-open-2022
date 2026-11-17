import { useAnecdoteActions } from "../store";

const Filter = () => {
  const { setFilter } = useAnecdoteActions();

  const handleChange = (event) => {
    event.preventDefault();
    const filterValue = event.target.value;
    console.log("filter", filterValue);
    setFilter(filterValue);
    //event.target.reset();
    //date the input field value with the filter value
    // the value of the input field is in event.target.value
  };
  const style = {
    marginBottom: 10,
  };

  return (
    <div style={style}>
      filter <input onChange={handleChange} data-testid="filter" />
    </div>
  );
};

export default Filter;
