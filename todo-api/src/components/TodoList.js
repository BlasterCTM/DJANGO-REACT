import React, { useState, useEffect } from 'react';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState({ titulo: '', descripcion: '' });
  const [editingTodo, setEditingTodo] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/todos/');
      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

  const handleAddTodo = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/todos/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });
      const data = await response.json();
      setTodos([...todos, data]);
      setNewTodo({ titulo: '', descripcion: '' });
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const handleEditTodo = (id) => {
    const todoToEdit = todos.find((todo) => todo.id === id);

    if (todoToEdit) {
      setEditingTodo(id);
      setNewTodo({
        titulo: todoToEdit.titulo,
        descripcion: todoToEdit.descripcion,
      });
    } else {
      console.error('Todo not found');
    }
  };

  const handleUpdateTodo = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/todos/${editingTodo}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTodo),
      });

      if (response.ok) {
        fetchTodos();
        setEditingTodo(null);
        setNewTodo({ titulo: '', descripcion: '' });
      } else {
        console.error('Error updating todo. Server response:', await response.json());
      }
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const handleToggleTodo = async (id, hecho) => {
    try {
      const todoToUpdate = todos.find((todo) => todo.id === id);
  
      if (!todoToUpdate) {
        console.error('Todo not found');
        return;
      }
  
      const response = await fetch(`http://localhost:8000/api/todos/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: todoToUpdate.titulo,
          hecho: !hecho,
          descripcion: todoToUpdate.descripcion, // Asegúrate de enviar la descripción actual
        }),
      });
  
      if (response.ok) {
        const updatedTodos = todos.map((todo) => (todo.id === id ? { ...todo, hecho: !hecho } : todo));
        setTodos(updatedTodos);
      } else {
        console.error('Error toggling todo. Server response:', await response.json());
      }
    } catch (error) {
      console.error('Error toggling todo:', error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:8000/api/todos/${id}/`, {
        method: 'DELETE',
      });
      if (response.status === 204) {
        const updatedTodos = todos.filter((todo) => todo.id !== id);
        setTodos(updatedTodos);
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Lista de Tareas</h1>
      <ul className="list-group">
        {todos.map((todo) => (
          <li key={todo.id} className={`list-group-item ${todo.hecho ? 'list-group-item-success' : ''}`}>
            <strong>{todo.titulo}</strong> - {todo.descripcion}{' '}
            <button
              onClick={() => handleEditTodo(todo.id)}
              className="btn btn-primary"
            >
              Editar
            </button>
            <button
              onClick={() => handleToggleTodo(todo.id, todo.hecho)}
              className={`btn ${todo.hecho ? 'btn-warning' : 'btn-success'}`}
            >
              {todo.hecho ? 'Marcar Pendiente' : 'Marcar Hecho'}
            </button>
            <button
              onClick={() => handleDeleteTodo(todo.id)}
              className="btn btn-danger"
            >
              Eliminar
            </button>
          </li>
        ))}
      </ul>

      {editingTodo !== null && (
        <div className="edit-todo-container mt-3">
          <input
            type="text"
            placeholder="Nuevo Título"
            value={newTodo.titulo}
            onChange={(e) => setNewTodo({ ...newTodo, titulo: e.target.value })}
            className="form-control"
          />
          <textarea
            placeholder="Nueva Descripción"
            value={newTodo.descripcion}
            onChange={(e) => setNewTodo({ ...newTodo, descripcion: e.target.value })}
            className="form-control mt-2"
          />
          <button onClick={handleUpdateTodo} className="btn btn-success mt-2">
            Actualizar Tarea
          </button>
        </div>
      )}

      <div className="add-todo-container mt-3">
        <input
          type="text"
          placeholder="Título"
          value={newTodo.titulo}
          onChange={(e) => setNewTodo({ ...newTodo, titulo: e.target.value })}
          className="form-control"
        />
        <textarea
          placeholder="Descripción"
          value={newTodo.descripcion}
          onChange={(e) => setNewTodo({ ...newTodo, descripcion: e.target.value })}
          className="form-control mt-2"
        />
        <button onClick={handleAddTodo} className="btn btn-success mt-2">
          Agregar Tarea
        </button>
      </div>
    </div>
  );
};

export default TodoList;
