export default function ProductCard({ name, price, description, rating, image, onAddToCart }) {
  return (
    <article className="product-card">
      {image ? <img src={image} alt={name} onError={(e) => { e.currentTarget.style.display = 'none' }} /> : <div className="image-placeholder">No image</div>}
      <div className="card-body">
        <h2>{name}</h2>
        <p className="price">₹{Number(price || 0).toFixed(2)}</p>
        <p>{description || 'No description provided.'}</p>
        <p className="rating">Rating: {rating ?? 'N/A'} / 5</p>
        <button type="button" onClick={onAddToCart}>Add to cart</button>
      </div>
    </article>
  )
}
