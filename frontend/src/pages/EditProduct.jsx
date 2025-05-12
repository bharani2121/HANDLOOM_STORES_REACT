import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: ''
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/clothes/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/clothes/${id}`, product);
      alert('Product updated successfully');
      navigate('/');
    } catch (err) {
      console.error('Update error:', err);
      alert('Update failed');
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-lg rounded">
      <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Product Name"
          required
        />
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Price"
          required
        />
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Description"
          rows="3"
          required
        />
        <input
          type="text"
          name="image"
          value={product.image}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Image URL"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
