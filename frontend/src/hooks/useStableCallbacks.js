import { useCallback, useMemo } from 'react'

export function useStableCallbacks(store) {
  const { addToCart, toggleWishlist, removeFromCart, updateQuantity, clearCart, login, logout, register } = store

  const handleAddToCart = useCallback((product, quantity = 1) => addToCart(product, quantity), [addToCart])
  const handleToggleWishlist = useCallback((product) => toggleWishlist(product), [toggleWishlist])
  const handleRemoveFromCart = useCallback((id) => removeFromCart(id), [removeFromCart])
  const handleUpdateQuantity = useCallback((id, quantity) => updateQuantity(id, quantity), [updateQuantity])
  const handleClearCart = useCallback(() => clearCart(), [clearCart])
  const handleLogin = useCallback((userData) => login(userData), [login])
  const handleLogout = useCallback(() => logout(), [logout])
  const handleRegister = useCallback((userData) => register(userData), [register])

  return useMemo(
    () => ({
      handleAddToCart,
      handleToggleWishlist,
      handleRemoveFromCart,
      handleUpdateQuantity,
      handleClearCart,
      handleLogin,
      handleLogout,
      handleRegister,
    }),
    [handleAddToCart, handleToggleWishlist, handleRemoveFromCart, handleUpdateQuantity, handleClearCart, handleLogin, handleLogout, handleRegister],
  )
}
