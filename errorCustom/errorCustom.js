// Diccionario de mensajes de error
const errorMessages = {
    PRODUCT_NOT_FOUND: "El producto no se encontró.",
    INVALID_PRODUCT_ID: "ID de producto inválido.",
    CART_NOT_FOUND: "El carrito no se encontró.",
    PRODUCT_ALREADY_IN_CART: "El producto ya está en el carrito.",
    PERMISSION_DENIED: "Se requiere permiso de administrador.",
    PERMISSION_DENIED2: "Se requiere logueo de usuario",
    PERMISSION_DENIED3: "Se requiere permiso de administrador o premium."
};

// Función para personalizar mensajes de error
function customizeError(code) {
    return errorMessages[code] || "Error desconocido.";
}

export default customizeError;
