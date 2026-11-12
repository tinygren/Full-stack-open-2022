import { useAnecdotes, useAnecdoteActions } from "./store";

const App = () => {
  const anecdotes = useAnecdotes();
  const { vote } = useAnecdoteActions(); // Destructuring the vote function from the actions object
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
      <h2>Anecdotes</h2>
      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
      <h2>create new</h2>
      <form onSubmit={add}>
        <div>
          <input name="new" data-testid="new" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  );
};

export default App;
