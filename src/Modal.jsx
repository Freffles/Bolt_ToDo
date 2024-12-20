import React, { useState, useEffect, useRef } from 'react';

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
  const modalRef = useRef(null);
  const firstFocusableElementRef = useRef(null);

  useEffect(() => {
    if (initialTodo) {
      setTodo(initialTodo);
    } else {
      setTodo({
        title: '',
        body: '',
        priority: 'medium',
        category: 'general',
        dueDate: '',
      });
    }
  }, [initialTodo]);

  useEffect(() => {
    if (isOpen && firstFocusableElementRef.current) {
      firstFocusableElementRef.current.focus();
    }
    return () => {
      if (modalRef.current) {
        modalRef.current.focus();
      }
    };
  }, [isOpen]);

  /**
   * Handles input changes and updates the todo state.
   * @param {Event} event - The input change event.
   */
  const handleInputChange = (event) => {
    const { name, value, type } = event.target;
    setTodo({ ...todo, [name]: type === 'checkbox' ? event.target.checked : value });
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
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center" ref={modalRef}>
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md" >
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
                ref={firstFocusableElementRef}
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

export default Modal;
