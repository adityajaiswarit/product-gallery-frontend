import { useState, useEffect } from 'react'
import axios from 'axios'
import ProductCard from './ProductCard'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/products'
const emptyForm = { title: '', price: '', description: '', category: '', image: '', rating: '' }

export default function App() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [cartCount, setCartCount] = useState(0)

  const loadProducts = async () => {
    try {
      const res = await axios.get(API_URL)
      setProducts(res.data)
      setError(null)
    } catch {
      setError('Unable to load products. Is the backend and database running?')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadProducts() }, [])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const payload = {
      ...form,
      price: Number(form.price),
      rating: form.rating === '' ? null : Number(form.rating)
    }
    try {
      if (editingId !== null) {
        const res = await axios.put(`${API_URL}/${editingId}`, payload)
        setProducts(products.map((p) => (p.id === editingId ? res.data : p)))
        setEditingId(null)
      } else {
        const res = await axios.post(API_URL, payload)
        setProducts([...products, res.data])
      }
      setForm(emptyForm)
      setError(null)
    } catch {
      alert('Could not save the product. Please check the server and try again.')
    }
  }

  const handleEdit = (product) => {
    setEditingId(product.id)
    setForm({
      title: product.title ?? '',
      price: product.price ?? '',
      description: product.description ?? '',
      category: product.category ?? '',
      image: product.image ?? '',
      rating: product.rating ?? ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return
    try {
      await axios.delete(`${API_URL}/${id}`)
      setProducts(products.filter((p) => p.id !== id))
    } catch {
      alert('Could not delete the product. Please try again.')
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <div><p className="eyebrow">STORE MANAGEMENT</p><h1>Product Card Gallery</h1></div>
        <div className="cart-badge">Cart: {cartCount}</div>
      </header>

      <section className="form-panel">
        <h2>{editingId !== null ? 'Edit product' : 'Add a product'}</h2>
        <form className="product-form" onSubmit={handleSubmit}>
          <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
          <input name="price" type="number" min="0" step="0.01" placeholder="Price" value={form.price} onChange={handleChange} required />
          <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
          <input name="image" type="url" placeholder="Image URL" value={form.image} onChange={handleChange} />
          <input name="rating" type="number" step="0.1" min="0" max="5" placeholder="Rating (0–5)" value={form.rating} onChange={handleChange} />
          <div className="form-actions">
            <button type="submit">{editingId !== null ? 'Save changes' : 'Add product'}</button>
            {editingId !== null && <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(emptyForm) }}>Cancel</button>}
          </div>
        </form>
      </section>

      {loading && <p className="status">Loading products…</p>}
      {error && <p className="status error">{error}</p>}
      {!loading && !error && (
        <main>
          <div className="section-heading"><h2>Products</h2><span>{products.length} items</span></div>
          {products.length === 0 ? <p className="status">No products yet. Add your first product above.</p> : (
            <div className="product-grid">
              {products.map((product) => (
                <div className="product-wrap" key={product.id}>
                  <ProductCard
                    name={product.title} price={product.price} description={product.description}
                    rating={product.rating} image={product.image}
                    onAddToCart={() => setCartCount((c) => c + 1)}
                  />
                  <div className="crud-buttons">
                    <button type="button" className="secondary" onClick={() => handleEdit(product)}>Edit</button>
                    <button type="button" className="danger" onClick={() => handleDelete(product.id)}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}
      <footer>React · Spring Boot · MySQL</footer>
    </div>
  )
}
