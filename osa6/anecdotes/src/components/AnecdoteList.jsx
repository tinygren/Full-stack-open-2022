import { useAnecdotes, useAnecdoteActions, useFilter } from "../store";

const AnecdoteList = () => {
  const anecdotes = useAnecdotes();
  const filter = useFilter();
  const { vote } = useAnecdoteActions(); // Destructuring the vote function from the actions object
  const sortedAnecdotes = [...anecdotes].sort((a, b) => b.votes - a.votes); // Sorting anecdotes by votes in descending order
  return (
    <div>
      {sortedAnecdotes
        .filter((anecdote) => anecdote.content.includes(filter))
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AnecdoteList;
