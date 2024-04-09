// permisos para admin y users
export const checkAdmin = (req, res, next) => {
    console.log('Middleware checkAdmin ejecutándose');
    // Verifica si el usuario está autenticado correctamente y si es admin
    if (req.user && req.user.role === 'admin') {
        console.log('Usuario autenticado y es admin');
        return next(); // Permite el acceso
    } else {
        console.log('Usuario no autorizado');
        res.status(403).send('Solo Administrador Autorizado'); // No autorizado
    }
};


export const checkUser = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
        return next();
    } else {
        res.status(403).send('Acceso Denegado');
    }
};


