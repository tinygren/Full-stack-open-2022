import { useAnecdotes, useAnecdoteActions } from "./store";

const App = () => {
  const anecdotes = useAnecdotes();
  const { vote } = useAnecdoteActions(); // Destructuring the vote function from the actions object

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
      <form>
        <div>
          <input data-testid="new" />
        </div>
        <button>create</button>
      </form>
    </div>
  );
};

export default App;
