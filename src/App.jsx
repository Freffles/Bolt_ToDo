import React, { useState } from 'react';

    /**
     * Main App component that manages the todo list and modal for adding/editing tasks.
     */
    function App() {
      // State to manage the list of todos
      const [todos, setTodos] = useState([]);
      // State to control the visibility of the modal
      const [showModal, setShowModal] = useState(false);
      // State to store the currently selected todo for editing
      const [selectedTodo, setSelectedTodo] = useState(null);

      /**
       * Toggles the completion status of a todo.
       * @param {number} id - The ID of the todo to toggle.
       */
      const toggleComplete = (id) => {
        setTodos(
          todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
          )
        );
      };

      /**
       * Deletes a todo from the list.
       * @param {number} id - The ID of the todo to delete.
       */
      const deleteTodo = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id));
      };

      /**
       * Opens the modal for adding or editing a todo.
       * @param {Object} todo - The todo to edit (null for adding a new todo).
       */
      const openModal = (todo = null) => {
        setSelectedTodo(todo);
        setShowModal(true);
      };

      /**
       * Closes the modal and resets the selected todo.
       */
      const closeModal = () => {
        setSelectedTodo(null);
        setShowModal(false);
      };

      /**
       * Saves the updated todo (adds a new todo or updates an existing one).
       * @param {Object} updatedTodo - The updated todo object.
       */
      const handleSave = (updatedTodo) => {
        if (selectedTodo) {
          // Update existing task
          setTodos(
            todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo))
          );
        } else {
          // Add new task
          setTodos([...todos, { id: Date.now(), ...updatedTodo, completed: false }]);
        }
        closeModal();
      };

      return (
        <div className="container mx-auto p-4 bg-gray-100 h-screen">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-purple-500">Todo App</h1>
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
              onClick={() => openModal()}
            >
              Add Task
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className={`bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 cursor-pointer ${
                  todo.completed ? 'bg-green-200' : ''
                } relative`}
                onClick={() => openModal(todo)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleComplete(todo.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="mr-2"
                    />
                    <h2 className="text-xl font-bold text-purple-600">
                      {todo.title.substring(0, 25)}
                      {todo.title.length > 25 && '...'}
                    </h2>
                  </div>
                </div>
                <p className="text-gray-600 mb-2">
                  {todo.body.substring(0, 150)}
                  {todo.body.length > 150 && '...'}
                </p>
                <p className="mt-2">
                  <span className="font-semibold">Category:</span> {todo.category}
                </p>
                <p className="mb-4">
                  <span className="font-semibold">Due Date:</span> {todo.dueDate}
                </p>
                <div className="absolute bottom-2 right-2">
                  {todo.completed && (
                    <span className="text-green-600 font-bold mr-2">Complete</span>
                  )}
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded-lg"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteTodo(todo.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Modal */}
          <Modal
            isOpen={showModal}
            onClose={closeModal}
            onSubmit={handleSave}
            initialTodo={selectedTodo}
          />
        </div>
      );
    }

    /**
     * Modal component for adding or editing a todo.
     * @param {Object} props - Component props.
     * @param {boolean} props.isOpen - Whether the modal is open.
     * @param {Function} props.onClose - Function to close the modal.
     * @param {Function} props.onSubmit - Function to handle saving the todo.
     * @param {Object} props.initialTodo - The initial todo data (null for adding a new todo).
     */
    function Modal({ isOpen, onClose, onSubmit, initialTodo }) {
      const [todo, setTodo] = useState(
        initialTodo || {
          title: '',
          body: '',
          priority: 'medium',
          category: 'general',
          dueDate: '',
        }
      );

      /**
       * Handles input changes and updates the todo state.
       * @param {Event} event - The input change event.
       */
      const handleInputChange = (event) => {
        const { name, value } = event.target;
        setTodo({ ...todo, [name]: value });
      };

      /**
       * Handles the form submission and calls the onSubmit function.
       */
      const handleSubmit = () => {
        onSubmit(todo);
        setTodo({
          title: '',
          body: '',
          priority: 'medium',
          category: 'general',
          dueDate: '',
        });
      };

      /**
       * Handles closing the modal and resets the todo state if adding a new todo.
       */
      const handleClose = () => {
        onClose();
        if (!initialTodo) {
          setTodo({
            title: '',
            body: '',
            priority: 'medium',
            category: 'general',
            dueDate: '',
          });
        }
      };

      return (
        <>
          {isOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">
                  {initialTodo ? 'Edit Task' : 'Add Task'}
                </h2>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    className="border border-gray-400 p-2 w-full rounded-lg"
                    name="title"
                    value={todo.title}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Body
                  </label>
                  <textarea
                    className="border border-gray-400 p-2 w-full rounded-lg"
                    name="body"
                    value={todo.body}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Priority
                  </label>
                  <select
                    className="border border-gray-400 p-2 w-full rounded-lg"
                    name="priority"
                    value={todo.priority}
                    onChange={handleInputChange}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Category
                  </label>
                  <select
                    className="border border-gray-400 p-2 w-full rounded-lg"
                    name="category"
                    value={todo.category}
                    onChange={handleInputChange}
                  >
                    <option value="general">General</option>
                    <option value="work">Work</option>
                    <option value="personal">Personal</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Due Date
                  </label>
                  <input
                    type="date"
                    className="border border-gray-400 p-2 w-full rounded-lg"
                    name="dueDate"
                    value={todo.dueDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg mr-2"
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
                    onClick={handleSubmit}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      );
    }

    export default App;
