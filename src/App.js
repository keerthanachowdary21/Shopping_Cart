// App.js
import { useState, useEffect } from 'react';
import "./App.css"

const PRODUCTS = [
  { id: 1, name: "Laptop", price: 500 },
  { id: 2, name: "Smartphone", price: 300 },
  { id: 3, name: "Headphones", price: 100 },
  { id: 4, name: "Smartwatch", price: 150 },
];

const FREE_GIFT = { id: 99, name: "Wireless Mouse", price: 0 };
const THRESHOLD = 1000;

function App() {
  const [cart, setCart] = useState([]);
  const [products] = useState(PRODUCTS);
  const [showGiftMessage, setShowGiftMessage] = useState(false);

  // Calculate subtotal
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Check if free gift should be added or removed
  useEffect(() => {
    const hasFreeGift = cart.some(item => item.id === FREE_GIFT.id);
    const shouldAddGift = subtotal >= THRESHOLD && !hasFreeGift;
    const shouldRemoveGift = subtotal < THRESHOLD && hasFreeGift;

    if (shouldAddGift) {
      setCart([...cart, { ...FREE_GIFT, quantity: 1 }]);
      setShowGiftMessage(true);
      setTimeout(() => setShowGiftMessage(false), 10000);
    } else if (shouldRemoveGift) {
      setCart(cart.filter(item => item.id !== FREE_GIFT.id));
    }
  }, [cart, subtotal]);

  // Add product to cart
  const addToCart = (product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity }];
      }
    });
  };

  // Update cart item quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Calculate progress towards free gift
  const progress = Math.min((subtotal / THRESHOLD) * 100, 100);

  return (
    <div className="container">
      <h1 className='heading'>Shopping Cart</h1>
      
      <section className="products-section">
        <h2>Products</h2>
        <div className="product-list">
          {products.map(product => (
            <ProductItem
              key={product.id}
              product={product}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </section>

      <section className='cart-summary'>
        <h2>Cart Summary</h2>
        <div className='subtotal-div'>
          <p className='subtotal'>Subtotal:</p>
          <p className='subtotal'>₹{subtotal}</p>
        </div>
        <hr/>
        <div className="progress-container">
          <div className="progress-bar" style={{ width: `${progress}%` }}></div>
        </div>
        <p className="progress-text">
          {subtotal >= THRESHOLD ? (
            "You got a free Wireless Mouse!"
          ) : (
            `Add ₹${THRESHOLD - subtotal} more to get a FREE Wireless Mouse!`
          )}
        </p>

        {showGiftMessage && (
          <div className="gift-message">
            Congratulations! You've earned a free Wireless Mouse!
          </div>
        )}
      </section>

      <section className="cart-section">
        {cart.length === 0 ? (
          <>
            <p className='para'>Your cart is empty.</p>
            <p className='para'>Add some products to see them here!</p>
          </>
        ) : (
          <>
            <div className="cart-items">
              {cart.map(item => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  isFreeGift={item.id === FREE_GIFT.id}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function ProductItem({ product, onAddToCart }) {
  const handleAddToCart = () => {
    onAddToCart(product, 1); // Always add quantity 1
  };

  return (
    <div className="product-item">
      <h3>{product.name}</h3>
      <p>₹{product.price}</p>
      <button className="add-to-cart" onClick={handleAddToCart}>
        Add to Cart
      </button>
    </div>
  );
}

function CartItem({ item, onUpdateQuantity, isFreeGift }) {
  return (
    <div className="cart-item">
      <div className="item-info">
        <h3>{item.name}</h3>
        <br/>
        {isFreeGift ? (
          <p className='gift-btn'>FREE GIFT</p>
        ) : (
          <>
            <p className="item-total">
              ₹{item.price} x {item.quantity} = ₹{item.price * item.quantity}
            </p>
          </>
        )}
      </div>
      {!isFreeGift && (
        <div className="quantity-controls">
          <button 
            className='btn-color-red' 
            onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button 
            className='btn-color-green' 
            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

export default App;