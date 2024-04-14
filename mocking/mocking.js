import { faker } from "@faker-js/faker"

// Función para generar datos de productos falsos
function generateMockProducts(count) {
    const products = [];
    for (let i = 0; i < count; i++) {
        const product = {
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            description: faker.lorem.sentence(),
            imageUrl: faker.image.imageUrl(),
        };
        products.push(product);
    }
    return products;
}

export default generateMockProducts;

  
  