import React, { useState } from 'react';
import axios from 'axios';
import './Addproduct.css';

const AddProduct = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [category, setCategory] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newProduct = { name, price, description, image, category };

    try {
      const response = await axios.post('http://localhost:5000/api/clothes', newProduct);
      console.log('✅ Product added:', response.data);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);

      setName('');
      setPrice('');
      setDescription('');
      setImage('');
      setCategory('');
    } catch (error) {
      console.error('❌ Error adding product:', error.response?.data || error.message);
      alert('Failed to add product.');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded">
      <h2 className="text-2xl font-bold mb-4">Add New Product</h2>

      {success && (
        <div className="success-message">
          <div className="tick-animation">&#10004;</div>
          <span>Product added successfully!</span>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          rows="3"
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="text"
          placeholder="Category (e.g., Men, Women, Kids)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Product
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
