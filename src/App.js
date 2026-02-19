import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://192.168.227.134:30001/api';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API_URL}/todos`);
      const data = await res.json();
      setTodos(data);
    } catch (err) {
      console.error('Error fetching todos:', err);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo })
      });
      const todo = await res.json();
      setTodos([todo, ...todos]);
      setNewTodo('');
    } catch (err) {
      console.error('Error adding todo:', err);
    }
    setLoading(false);
  };

  const toggleTodo = async (id) => {
    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: 'PUT'
      });
      const updated = await res.json();
      setTodos(todos.map(t => t.id === id ? updated : t));
    } catch (err) {
      console.error('Error toggling todo:', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await fetch(`${API_URL}/todos/${id}`, { method: 'DELETE' });
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting todo:', err);
    }
  };

  return (
    <div className="App">
      <div className="container">
        <h1>📝 My Todo App</h1>
        <p className="subtitle">Built with React + Node.js + PostgreSQL</p>
        
        <form onSubmit={addTodo} className="add-form">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? '...' : 'Add'}
          </button>
        </form>

        <div className="todos">
          {todos.length === 0 ? (
            <p className="empty">No todos yet! Add one above.</p>
          ) : (
            todos.map(todo => (
              <div key={todo.id} className={`todo ${todo.completed ? 'completed' : ''}`}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span>{todo.title}</span>
                <button onClick={() => deleteTodo(todo.id)} className="delete">
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
