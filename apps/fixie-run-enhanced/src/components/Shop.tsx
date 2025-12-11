import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Package, Truck, CreditCard, Gift } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ShopProps {
  user: any;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  inStock: boolean;
  featured: boolean;
  discount?: number;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export default function Shop({ user }: ShopProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    loadProducts();
    loadCart();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      // Mock products data - in real app, this would come from database
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Premium Bike Jersey',
          description: 'High-performance cycling jersey with moisture-wicking fabric',
          price: 89.99,
          image: '👕',
          category: 'clothing',
          inStock: true,
          featured: true,
          discount: 15
        },
        {
          id: '2',
          name: 'Carbon Fiber Water Bottle',
          description: 'Ultra-lightweight carbon fiber bottle with 500ml capacity',
          price: 45.99,
          image: '🥤',
          category: 'accessories',
          inStock: true,
          featured: false
        },
        {
          id: '3',
          name: 'Wireless Bike Computer',
          description: 'GPS-enabled bike computer with heart rate monitoring',
          price: 199.99,
          image: '📱',
          category: 'electronics',
          inStock: true,
          featured: true
        },
        {
          id: '4',
          name: 'LED Safety Lights Set',
          description: 'Rechargeable LED lights for maximum visibility',
          price: 29.99,
          image: '🔦',
          category: 'safety',
          inStock: true,
          featured: false,
          discount: 10
        },
        {
          id: '5',
          name: 'Recovery Foam Roller',
          description: 'Professional-grade foam roller for muscle recovery',
          price: 39.99,
          image: '🔄',
          category: 'recovery',
          inStock: true,
          featured: false
        },
        {
          id: '6',
          name: 'Cycling Gloves Pro',
          description: 'Gel-padded gloves for long rides and maximum comfort',
          price: 34.99,
          image: '🧤',
          category: 'clothing',
          inStock: false,
          featured: false
        }
      ];

      setProducts(mockProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCart = async () => {
    // In real app, load cart from database or localStorage
    const savedCart = localStorage.getItem('fixie-cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCart = (newCart: CartItem[]) => {
    localStorage.setItem('fixie-cart', JSON.stringify(newCart));
    setCart(newCart);
  };

  const addToCart = (product: Product) => {
    const existingItem = cart.find(item => item.product.id === product.id);

    if (existingItem) {
      const newCart = cart.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      saveCart(newCart);
    } else {
      saveCart([...cart, { product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    const newCart = cart.filter(item => item.product.id !== productId);
    saveCart(newCart);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const newCart = cart.map(item =>
      item.product.id === productId
        ? { ...item, quantity }
        : item
    );
    saveCart(newCart);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const checkout = async () => {
    if (!user?.id) {
      alert('Please connect your wallet to checkout');
      return;
    }

    // In real app, this would integrate with payment processor and blockchain
    alert('Checkout functionality coming soon! This would integrate with your wallet for PTF token payments.');
  };

  const categories = [
    { id: 'all', name: 'All Products', icon: '🛒' },
    { id: 'clothing', name: 'Clothing', icon: '👕' },
    { id: 'accessories', name: 'Accessories', icon: '🎒' },
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'safety', name: 'Safety', icon: '🔦' },
    { id: 'recovery', name: 'Recovery', icon: '💆‍♂️' }
  ];

  const filteredProducts = activeCategory === 'all'
    ? products
    : products.filter(product => product.category === activeCategory);

  const featuredProducts = products.filter(product => product.featured);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">🛒 Fixie Shop</h2>
          <p className="text-gray-600">Premium cycling gear and accessories</p>
        </div>

        {/* Cart Button */}
        <button
          onClick={() => setShowCart(!showCart)}
          className="relative bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center space-x-2"
        >
          <ShoppingCart className="w-5 h-5" />
          <span>Cart</span>
          {getCartItemsCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {getCartItemsCount()}
            </span>
          )}
        </button>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          className="fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 border-l"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900">Shopping Cart</h3>
              <button
                onClick={() => setShowCart(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Your cart is empty</p>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-6">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl">{item.product.image}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{item.product.name}</h4>
                        <p className="text-sm text-gray-500">${item.product.price.toFixed(2)}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium hover:bg-gray-300"
                        >
                          -
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium hover:bg-gray-300"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold">Total:</span>
                    <span className="text-2xl font-bold text-gray-900">
                      ${getCartTotal().toFixed(2)}
                    </span>
                  </div>

                  <button
                    onClick={checkout}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center space-x-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Checkout with PTF</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-2 mb-4">
            <Star className="w-6 h-6" />
            <h3 className="text-xl font-bold">Featured Products</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                <div className="text-3xl mb-2">{product.image}</div>
                <h4 className="font-semibold mb-1">{product.name}</h4>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold">
                    ${product.discount
                      ? (product.price * (1 - product.discount / 100)).toFixed(2)
                      : product.price.toFixed(2)}
                  </span>
                  {product.discount && (
                    <span className="text-sm bg-red-500 px-2 py-1 rounded">
                      -{product.discount}%
                    </span>
                  )}
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="w-full mt-3 bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-gray-100"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span>{category.icon}</span>
              <span>{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-6">
              <div className="text-6xl mb-4 text-center">{product.image}</div>

              <div className="mb-3">
                <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.description}</p>
              </div>

              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-2xl font-bold text-gray-900">
                    ${product.discount
                      ? (product.price * (1 - product.discount / 100)).toFixed(2)
                      : product.price.toFixed(2)}
                  </span>
                  {product.discount && (
                    <div className="flex items-center space-x-1">
                      <span className="text-sm text-gray-500 line-through">
                        ${product.price.toFixed(2)}
                      </span>
                      <span className="text-sm bg-red-500 text-white px-2 py-0.5 rounded">
                        -{product.discount}%
                      </span>
                    </div>
                  )}
                </div>

                <div className={`px-2 py-1 rounded text-xs font-medium ${
                  product.inStock
                    ? 'bg-green-100 text-green-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </div>
              </div>

              <button
                onClick={() => addToCart(product)}
                disabled={!product.inStock}
                className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                  product.inStock
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>{product.inStock ? 'Add to Cart' : 'Out of Stock'}</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-600">Try selecting a different category</p>
        </div>
      )}

      {/* Footer Info */}
      <div className="bg-gray-50 rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <Truck className="w-8 h-8 text-blue-600 mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">Free Shipping</h4>
            <p className="text-sm text-gray-600">On orders over $100</p>
          </div>

          <div className="flex flex-col items-center">
            <CreditCard className="w-8 h-8 text-green-600 mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">Pay with PTF</h4>
            <p className="text-sm text-gray-600">Use your earned tokens</p>
          </div>

          <div className="flex flex-col items-center">
            <Gift className="w-8 h-8 text-purple-600 mb-2" />
            <h4 className="font-semibold text-gray-900 mb-1">Token Rewards</h4>
            <p className="text-sm text-gray-600">Earn tokens on purchases</p>
          </div>
        </div>
      </div>
    </div>
  );
}
