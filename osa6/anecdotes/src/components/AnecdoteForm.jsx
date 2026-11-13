import { useAnecdoteActions } from "../store";

const AnecdoteForm = () => {
  const { addAnecdote } = useAnecdoteActions(); // Destructuring the addAnecdote function from the actions object
  const add = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("new"); // Accessing the input element by its name attribute
    const content = input.value;
    console.log("new anecdote", content);
    addAnecdote(content);
    input.value = "";
  };

  return (
    <div>
      <form onSubmit={add}>
        <div>
          <input name="new" data-testid="new" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default AnecdoteForm;
