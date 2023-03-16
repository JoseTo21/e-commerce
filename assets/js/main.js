async function getProducts() {
    const data = await fetch("https://ecommercebackend.fundamentos-29.repl.co/");

    const res = await data.json()

    localStorage.setItem("products", JSON.stringify(res))

    return res
}

function transitionNavbar() {
    const navbar = document.querySelector(".header__principal");

    window.addEventListener("scroll", function () {
        if (window.scrollY > 250) {
            navbar.classList.add("navbar__active");
        } else {
            navbar.classList.remove("navbar__active");
        }
    });
}

function printProducts(db) {
    
    const productsHTML = document.querySelector(".products")

    let html = ""

    for (const product of db.products) {
        html +=         `
        <div class="product">
            <div class="product__img">
                <img src="${product.image}" alt="imagen">
            </div>
    
            <div class="product__info">

            <div class="info__pq">
            <h3>$${product.price}.00</h3>  
            <span>Stock: ${product.quantity}</span>
            </div>

            <h5 class="info__name">${product.name}</h5>

            <div class="icart">
                ${product.quantity ? `<i class='bx bx-cart-add' id= '${product.id}'></i>`
                : "<span class='sold__out'> SOLD OUT!</span>"}
            </div>

            </div>
        </div>
        `

        productsHTML.innerHTML = html

    }

}

function handleShowCart() {
    const bxcartHTML = document.querySelector(".bx-cart")
    const cartHTML = document.querySelector(".cart")
    
    bxcartHTML.addEventListener("click", function() {
        cartHTML.classList.toggle("cart__show")
    })
}

function addToCartFromProducts(db) {
    const productsHTML = document.querySelector(".products")
    
    productsHTML.addEventListener("click", function (e) {
        if (e.target.classList.contains("bx-cart-add")) {
            const id = Number(e.target.id)

            const productFind = db.products.find(
                (product) => product.id === id);

            
            if (db.cart[productFind.id]) {
                if (productFind.quantity === db.cart[productFind.id].amount) 
                    return alert ("¡No hay más stock en bodega!");
                db.cart[productFind.id].amount++;

            } else {db.cart[productFind.id] = { ...productFind, amount :1};

            }

            localStorage.setItem("cart", JSON.stringify(db.cart));
            printProductsInCart(db)
            printTotal(db)
            hanldePrintAmountProducts(db)
        }


    })
}

function printProductsInCart(db) {
    
    const cartProductsHTML = document.querySelector(".cart__products")

    let html = ''

    for (const product in db.cart) {
        const { quantity, price, name, image, id, amount } = db.cart[product];

        html+= `
            <div class="cart__product">
                <div class="cart__product-img">
                    <img src="${image}" alt="imagen">
                </div>

                <div class="cart__product-body">
                    <h4>${name} | <span>$${price}.00</span></h4>
                    <p>Te llevas: ${amount} | Solo quedan: ${quantity}</p>
                </div>

                <div class="cart__product-opc" id='${id}'>
                    <i class='bx bxs-plus-circle'></i>
                    <i class='bx bxs-minus-circle' ></i>
                    <i class='bx bxs-trash' ></i>
                </div>
            </div>
        `;
    }

    cartProductsHTML.innerHTML = html
}

function handleProductsInCart (db) {
    
    const cartProducts = document.querySelector(".cart__products");

    cartProducts.addEventListener('click', function(e) {
        if(e.target.classList.contains('bxs-plus-circle')) {
            const id = Number(e.target.parentElement.id);
            const productFind = db.products.find(
                (product) => product.id === id);

            if (productFind.quantity === db.cart[productFind.id].amount) 
                return alert ("¡No hay más stock en bodega!");

            db.cart[id].amount++;
        }
        if(e.target.classList.contains('bxs-minus-circle')) {
            const id = Number(e.target.parentElement.id);
            if (db.cart[id].amount === 1) {
                const response = confirm("Estás seguro que quieres eliminar el producto del carrito?");

                if(!response) return;
                delete  db.cart[id];
            }
            else {
                db.cart[id].amount--;
            }
        }
        if(e.target.classList.contains('bxs-trash')) {
            const id = Number(e.target.parentElement.id);
            const response = confirm("Estás seguro que quieres eliminar el producto del carrito?");

            if(!response) return;
            delete  db.cart[id];
        }

        localStorage.setItem('cart', JSON.stringify(db.cart))
        printProductsInCart(db)
        printTotal(db)
        hanldePrintAmountProducts(db)
    });
}

function printTotal(db) {
    
    const infototalHTLM = document.querySelector(".info__total")
    const infoamountHTLM = document.querySelector(".info__amount")

    let totalPrice = 0;
    let amountProducts = 0;

    for (const product in db.cart) {
        const { amount, price } = db.cart[product];
        totalPrice += price * amount;
        amountProducts += amount;
    }

    infototalHTLM.textContent = "$" + totalPrice + ".00";
    infoamountHTLM.textContent = "Estás comprando: " + amountProducts + " unidade(s).";
}

function handleTotalCart(db) {
    const btnbuyHTML = document.querySelector(".btn__buy")

    btnbuyHTML.addEventListener("click", function() {
        if(!Object.values(db.cart).length)
        return alert("Selecciona los elementos a comprar primero!");

        const response = confirm("Quieres confirmar la compra?");
        if (!response) return;

        const currentProducts = []

        for (const product of db.products) {
            const productCart = db.cart[product.id];
            if (product.id === productCart?.id) {
                currentProducts.push({
                    ...product,
                    quantity: product.quantity - productCart.amount,
                });
            }
            else {
                currentProducts.push(product);
            }
        }

        db.products = currentProducts;
        db.cart = {};

        localStorage.setItem("products",JSON.stringify(db.products));
        localStorage.setItem("cart",JSON.stringify(db.cart));

        printTotal(db);
        printProductsInCart(db);
        printProducts(db);
        hanldePrintAmountProducts(db)
    });
}

function hanldePrintAmountProducts(db) {
    const amountProductsHTML = document.querySelector(".amountProducts")

    let amount = 0
    
    for (const product in db.cart) {
        amount += db.cart[product].amount
    }

    amountProductsHTML.textContent = amount
}

function handleShowMenu() {
    const menuHTML = document.querySelector(".menu");
    const linksHTML = document.querySelectorAll(".menu li a");
    const bxmenutHTML = document.querySelector(".bx-menu-alt-right");

    bxmenutHTML.addEventListener("click", function() {
        menuHTML.classList.toggle("menu__show");
    });

    linksHTML.forEach(link => {
        link.addEventListener("click", function() {
            menuHTML.classList.toggle("menu__show");
        })
    })
}

function handleDarkMode() {
    const btnDarkMode = document.querySelector(".bx-moon");

    btnDarkMode.addEventListener("click", function() {
        document.body.classList.toggle('dark')
    })
}

async function main() {
    const db ={
        products: JSON.parse(localStorage.getItem("products")) || await getProducts(),
        cart: JSON.parse(localStorage.getItem('cart')) || {}
    }
    

    printProducts(db);
    handleShowCart();
    addToCartFromProducts(db);
    printProductsInCart(db);
    handleProductsInCart (db);
    printTotal(db);
    handleTotalCart(db);
    hanldePrintAmountProducts(db);
    handleShowMenu()
    transitionNavbar()
    handleDarkMode()

}

main()

