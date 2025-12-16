window.addEventListener('load', async () => { //Main de la app y variables

    const url = 'https://fakestoreapi.com/products';

    const all = document.getElementById('all');
    const menorPrecio = document.getElementById('menor-precio');
    const mayorPrecio = document.getElementById('mayor-precio');
    const rating = document.getElementById('rating');
    const prodContainer = document.getElementById('products-container');

    const productService = new ProductService(url);
    const productUI = new ProductUI(prodContainer);

    await productService.getProducts();

    all.addEventListener('click', () => {
        productUI.limpiarProductos();
        productService.resetProducts();
        productUI.pintarProductos(productService.products);
    });

    menorPrecio.addEventListener('click', () => {
        productUI.limpiarProductos();
        productService.ordenarMenorPrecio();
        productUI.pintarProductos(productService.products);
    });

    mayorPrecio.addEventListener('click', () => {
        productUI.limpiarProductos();
        productService.ordenarMayorPrecio();
        productUI.pintarProductos(productService.products);
    });

    rating.addEventListener('click', () => {
        productUI.limpiarProductos();
        productService.ordenarPorRating();
        productUI.pintarProductos(productService.products);
    });
});


class ProductService { //Maneja los datos de la API
    constructor(url) {
        this.url = url;
        this.products = [];
        this.originalProducts = [];
    }

    async getProducts() {
        try {
            const response = await fetch(this.url);
            const data = await response.json();
            this.products = [...data];
            this.originalProducts = [...data]; // copia json original
        } catch (error) {
            console.warn(error);
        }
    }

    resetProducts() {
        this.products = [...this.originalProducts];
    }

    ordenarMenorPrecio() {
        this.products.sort((a, b) => a.price - b.price);
    }

    ordenarMayorPrecio() {
        this.products.sort((a, b) => b.price - a.price);
    }

    ordenarPorRating() {
        this.products.sort((a, b) => b.rating.rate - a.rating.rate);
    }
}


class ProductUI { //Muestra los datos de la API en el HTML
    constructor(container) {
        this.container = container;
    }

    pintarProductos(products) {
        products.forEach(el => {
            const cardProd = document.createElement('div');
            cardProd.classList.add('bg-white','w-72','h-96','shadow-md','rounded','m-3');

            cardProd.innerHTML = `
                <div class="h-3/4 w-full">
                    <img class="w-full h-full object-cover rounded-t" src="${el.image}" alt="${el.title}">
                </div>
                <div class="w-full h-1/4 p-3">
                    <span class="text-lg font-semibold uppercase tracking-wide">${el.category}</span>
                    <p class="text-gray-600 text-sm leading-5 mt-1">${el.title}</p>
                </div>
            `;

            this.container.appendChild(cardProd);
        });
    }

    limpiarProductos() {
        while (this.container.firstChild) {
            this.container.firstChild.remove();
        }
    }
}
