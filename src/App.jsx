import React, { useState, useEffect } from 'react';
import Modal from './Modal';

    /**
     * Main App component that manages the todo list and modal for adding/editing tasks.
     */
    function App() {
      // State to manage the list of todos
      const [todos, setTodos] = useState(() => {
        try {
          const savedTodos = localStorage.getItem('todos');
          if (savedTodos) {
            return JSON.parse(savedTodos);
          }
        } catch (error) {
          console.error('Error loading todos from localStorage:', error);
          alert('Failed to load todos from local storage. Please try again.');
        }
        return [];
      });

      // State for undo/redo functionality
      const [history, setHistory] = useState([[]]);  // Initialize with empty todos array
      const [currentPosition, setCurrentPosition] = useState(0);
      
      // Initialize history with initial todos
      useEffect(() => {
        setHistory([todos]);
      }, []); // Run only once on mount

      // State to control the visibility of the modal
      const [showModal, setShowModal] = useState(false);
      // State to store the currently selected todo for editing
      const [selectedTodo, setSelectedTodo] = useState(null);

      // Save todos to localStorage whenever they change
      useEffect(() => {
        try {
          localStorage.setItem('todos', JSON.stringify(todos));
        } catch (error) {
          console.error('Error saving todos to localStorage:', error);
        }
      }, [todos]);

      /**
       * Updates todos and manages history
       * @param {Array} newTodos - The new todos array
       */
      const updateTodosWithHistory = (newTodos) => {
        setTodos(newTodos);
        // Remove any future history after current position
        const newHistory = history.slice(0, currentPosition + 1);
        setHistory([...newHistory, newTodos]);
        setCurrentPosition(currentPosition + 1);
      };

      /**
       * Undo the last action
       */
      const undo = () => {
        if (currentPosition > 0) {
          setCurrentPosition(currentPosition - 1);
          setTodos(history[currentPosition - 1]);
        }
      };

      /**
       * Redo the last undone action
       */
      const redo = () => {
        if (currentPosition < history.length - 1) {
          setCurrentPosition(currentPosition + 1);
          setTodos(history[currentPosition + 1]);
        }
      };

      /**
       * Toggles the completion status of a todo.
       * @param {number} id - The ID of the todo to toggle.
       */
      const toggleComplete = (id) => {
        const newTodos = todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
        updateTodosWithHistory(newTodos);
      };

      /**
       * Deletes a todo from the list.
       * @param {number} id - The ID of the todo to delete.
       */
      const deleteTodo = (id) => {
        const newTodos = todos.filter((todo) => todo.id !== id);
        updateTodosWithHistory(newTodos);
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
        let newTodos;
        if (selectedTodo) {
          // Update existing task
          newTodos = todos.map((todo) => 
            todo.id === updatedTodo.id ? updatedTodo : todo
          );
        } else {
          // Add new task
          newTodos = [...todos, { id: Date.now(), ...updatedTodo, completed: false }];
        }
        updateTodosWithHistory(newTodos);
        closeModal();
      };

      // Group and sort todos by priority and due date
      const groupedAndSortedTodos = {
        high: todos
          .filter(todo => todo.priority === 'high')
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)),
        medium: todos
          .filter(todo => todo.priority === 'medium')
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)),
        low: todos
          .filter(todo => todo.priority === 'low')
          .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      };

      return (
        <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-purple-500">Todo App</h1>
              <div className="flex gap-2">
                <button
                  className={`bg-gray-500 text-white font-bold py-2 px-4 rounded-lg ${
                    currentPosition === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'
                  }`}
                  onClick={undo}
                  disabled={currentPosition === 0}
                >
                  Undo
                </button>
                <button
                  className={`bg-gray-500 text-white font-bold py-2 px-4 rounded-lg ${
                    currentPosition === history.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'
                  }`}
                  onClick={redo}
                  disabled={currentPosition === history.length - 1}
                >
                  Redo
                </button>
              </div>
            </div>
            <button
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-lg"
              onClick={() => openModal()}
            >
              Add Task
            </button>
          </div>
          
          {/* Priority columns layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* High Priority Column */}
            <div>
              <div className="space-y-4">
                {groupedAndSortedTodos.high.map((todo) => (
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
                      <span
                        className={`px-2 py-1 text-xs font-bold rounded-full ${
                          todo.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : todo.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                      </span>
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
            </div>

            {/* Medium Priority Column */}
            <div>
              <div className="space-y-4">
                {groupedAndSortedTodos.medium.map((todo) => (
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
                      <span
                        className={`px-2 py-1 text-xs font-bold rounded-full ${
                          todo.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : todo.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                      </span>
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
            </div>

            {/* Low Priority Column */}
            <div>
              <div className="space-y-4">
                {groupedAndSortedTodos.low.map((todo) => (
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
                      <span
                        className={`px-2 py-1 text-xs font-bold rounded-full ${
                          todo.priority === 'high'
                            ? 'bg-red-100 text-red-800'
                            : todo.priority === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                      </span>
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
            </div>
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

    export default App;
