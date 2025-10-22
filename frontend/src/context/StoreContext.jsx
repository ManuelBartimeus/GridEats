import { createContext, useEffect, useState } from "react";
import { food_list } from "../assets/assets";

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {

    const [cartItems,setCartItems] = useState({});
    const [vendorItems, setVendorItems] = useState(() => {
        const saved = localStorage.getItem('vendorItems');
        return saved ? JSON.parse(saved) : [];
    });
    const [orders, setOrders] = useState(() => {
        const saved = localStorage.getItem('orders');
        return saved ? JSON.parse(saved) : [];
    });
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const addToCart = (itemId) => {
        if (!cartItems[itemId]) {
            setCartItems((prev)=>({...prev,[itemId]:1}))
        }
        else {
            setCartItems((prev)=>({...prev,[itemId]:prev[itemId]+1}))
        }
        // Open the cart when an item is added
        setIsCartOpen(true);
    }

    const removeFromCart = (itemId) => {
        setCartItems((prev) => {
            const currentQuantity = prev[itemId] || 0;
            if (currentQuantity <= 1) {
                // Remove the item completely when quantity reaches 0
                const newCartItems = { ...prev };
                delete newCartItems[itemId];
                return newCartItems;
            } else {
                // Decrement the quantity
                return { ...prev, [itemId]: currentQuantity - 1 };
            }
        });
    }

    useEffect(()=>{
        console.log(cartItems);
    },[cartItems])

    // Persist vendor items and orders
    useEffect(() => {
        localStorage.setItem('vendorItems', JSON.stringify(vendorItems));
    }, [vendorItems]);

    useEffect(() => {
        localStorage.setItem('orders', JSON.stringify(orders));
    }, [orders]);

    // Vendor items CRUD
    const addVendorItem = (item) => {
        const newItem = {
            id: Date.now().toString(),
            status: 'Available',
            ...item
        };
        setVendorItems(prev => [newItem, ...prev]);
    };

    const updateVendorItem = (id, updates) => {
        setVendorItems(prev => prev.map(it => it.id === id ? { ...it, ...updates } : it));
    };

    const deleteVendorItem = (id) => {
        setVendorItems(prev => prev.filter(it => it.id !== id));
    };

    const toggleVendorItemStatus = (id) => {
        setVendorItems(prev => prev.map(it => it.id === id ? { ...it, status: it.status === 'Available' ? 'Unavailable' : 'Available' } : it));
    };

    // Orders helpers (FCFS numbering)
    const addOrder = (order) => {
        const ticket = orders.length + 1;
        setOrders(prev => [...prev, { ...order, id: Date.now().toString(), ticket, status: 'Pending' }]);
    };

    const updateOrderStatus = (id, status) => {
        setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    };

    const markOrderReady = (id) => {
        updateOrderStatus(id, 'Ready');
        alert('Order is ready for pickup!');
    };


    const contextValue = {
        food_list,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        isCartOpen,
        setIsCartOpen,
        isSearchOpen,
        setIsSearchOpen,
        searchQuery,
        setSearchQuery,
        vendorItems,
        addVendorItem,
        updateVendorItem,
        deleteVendorItem,
        toggleVendorItemStatus,
        orders,
        addOrder,
        updateOrderStatus,
        markOrderReady
    }

    return (
        <StoreContext.Provider value={contextValue}>
            {props.children}
        </StoreContext.Provider>
    )

}

export default StoreContextProvider;