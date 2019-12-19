const burgerMenu = document.querySelector('.burger-menu');
const mobileMenu = document.querySelector('.mobile-menu');
const price = "€";
let items = 0;
burgerMenu.addEventListener("click", () => {
    if (mobileMenu.style.display === 'none' || mobileMenu.style.display === '') {
        mobileMenu.style.display = 'block';
    } else {
        mobileMenu.style.display = 'none';
    }
});

if (document.title === "Hifi-club") {
    const shopImgArray = ["/assets/images/slide.jpg", "/assets/images/slide-2.jpg"];
    const shopTitleArray = ["Primaluna Sounds", "Technics Turntables"];
    const shopLinkArray = ["/shop/?category=amplifiers", "/shop/?category=turntables"];
    const shopPicture = document.querySelector('.shop-add__img');
    const shopLink = document.querySelector('.shop-add__link');
    const shopTitle = document.querySelector('.shop-add__title');
    const slideRight = document.querySelector('#slide-right');
    const slideLeft = document.querySelector('#slide-left');
    slideLeft.addEventListener('click', shopAdd); slideRight.addEventListener('click', shopAdd);
    let shopIndex = 0;

    let shopTimer = setInterval(shopAdd, 5000);
    function shopAdd(e) {
        shopIndex++;
        if (shopIndex > shopImgArray.length - 1) {
            shopIndex = 0;
        } else if (shopIndex < 0) {
            shopIndex = shopImgArray.length - 1;
        }
        if (e !== undefined) {
            clearInterval(shopTimer);
            shopTimer = setInterval(shopAdd, 5000);
        }

        shopLink.setAttribute("href", shopLinkArray[shopIndex]);
        shopTitle.textContent = shopTitleArray[shopIndex];
        shopPicture.setAttribute('src', shopImgArray[shopIndex]);
    }
}

if (document.title === "Shop") {
    const productList = document.querySelector('.product__list');
    const pageAmount = document.querySelectorAll('.pager__amount');
    const breadcrumb = document.querySelector('.breadcrumb-list');
    const productTitle = document.querySelector('.products-wrapper__overskrift');
    const sidebarElements = document.querySelectorAll('.sidebar-list__link');
    let params = new URLSearchParams(document.location.search);
    let category = params.get('category');
    let manufacturer = params.get('manufacturer');
    let search = params.get('search');

    fetch("https://hifi-corner.herokuapp.com/api/v1/products", {
        "method": "GET"
    })
        .then(response => response.json())
        .then(data => {
            if (search) {
                breadcrumb.innerHTML += `
                <li class="breadcrumb-list__item "><a class="breadcrumb-list__link breadcrumb-list__link_back" href="/category/">Home</a></li>
                <span class="breadcrumb-list__seperator">/</span>
                <li class="breadcrumb-list__item"><a class="breadcrumb-list__link" href="/shop/?search=${search}">search</a></li>`;
                productTitle.textContent = search;
            } else {
                breadcrumb.innerHTML += `
                <li class="breadcrumb-list__item "><a class="breadcrumb-list__link breadcrumb-list__link_back" href="/category/">Home</a></li>
                <span class="breadcrumb-list__seperator">/</span>
                <li class="breadcrumb-list__item"><a class="breadcrumb-list__link" href="/shop/?category=${category}">${category}</a></li>`;
                productTitle.textContent = category;
            }

            data.forEach(produkt => {
                if (category) {
                    if (produkt.category.toLowerCase() === category.toLocaleLowerCase() || category === "all") {
                        items++;
                        productList.innerHTML += `
                        <a class="product-item" href="/product/?id=${produkt.sku}">
                            <div class="product-item__container">
                                <img src="${produkt.images[0]}" alt="${produkt.model} til salg" class="product-item__img">
                            </div>
                            <h2 class="product-item__title">${produkt.model}</h2>
                            <p class="product-item__price">${produkt.price}${price}</p>
                            <button class="product-item__buy">ADD TO CART</button>
                        </a>
                        `;

                        breadcrumb.innerHTML = `
                        <li class="breadcrumb-list__item "><a class="breadcrumb-list__link breadcrumb-list__link_back" href="/category/">Home</a></li>
                        <span class="breadcrumb-list__seperator">/</span>
                        <li class="breadcrumb-list__item"><a class="breadcrumb-list__link" href="/shop/?category=${produkt.category}">${produkt.category}</a></li>
                        `;
                    }
                }

                if (manufacturer) {
                    if (produkt.make.toLowerCase() === manufacturer.toLocaleLowerCase()) {
                        items++;
                        productList.innerHTML += `
                        <a class="product-item" href="/product/?id=${produkt.sku}">
                            <div class="product-item__container">
                                <img src="${produkt.images[0]}" alt="${produkt.model} til salg" class="product-item__img">
                            </div>
                            <h2 class="product-item__title">${produkt.model}</h2>
                            <p class="product-item__price">${produkt.price}${price}</p>
                            <button class="product-item__buy">ADD TO CART</button>
                        </a>
                        `;

                        breadcrumb.innerHTML = `
                        <li class="breadcrumb-list__item "><a class="breadcrumb-list__link breadcrumb-list__link_back" href="/category/">Home</a></li>
                        <span class="breadcrumb-list__seperator">/</span>
                        <li class="breadcrumb-list__item"><a class="breadcrumb-list__link" href="/shop/?category=${produkt.category}">${produkt.category}</a></li>
                        `;
                    }
                }
            });

            pageAmount.forEach(element => {
                element.textContent = items + ' Item(s)';
            });

            sidebarElements.forEach(tag => {
                if (tag.getAttribute('data-type') && category) {
                    if (tag.getAttribute('data-type').toLowerCase() === category.toLowerCase()) {
                        tag.classList.add('sidebar-list__link_active');
                    } else {
                        tag.classList.remove('sidebar-list__link_activer');
                    }
                }

                if (tag.getAttribute('class') === 'sidebar-list__link sidebar-list__link_active') {
                    if (tag.textContent.toLowerCase() === 'amplifiers') {
                        document.querySelector('.sidebar-list_under').classList.toggle('hide');
                    }
                }

            });
        }).catch(err => console.error(err));
}

if (document.title === "Product") {
    const productElement = document.querySelector('.single-product');
    const imgContainer = document.querySelector('.single-product-container__img-container');
    const breadcrumbList = document.querySelector('.breadcrumb-list');
    const descriptionElement = document.querySelector('.desc-table');
    let params = new URLSearchParams(document.location.search);
    let id = params.get('id');

    fetch(`https://hifi-corner.herokuapp.com/api/v1/products/${id}`, {
        "method": "GET"
    })
        .then(response => response.json())
        .then(produkt => {
            productElement.innerHTML += `
            <h1 class="single-product__title">${produkt.model}</h1>
            <div class="extra-info">
                <a href="/shop/?manufacturer=${produkt.make}" class="single-product__manufacturer single-product__manufacturer_hover">See
                    other ${produkt.make} products</a>
                <div class="price">
                    <h3 class="price__regular-price">${produkt.price}${price}</h3>
                </div>
            </div>

            <p class="single-product__info">${produkt.description}</p>

            <div class="help-container">
                <a href="/shop/" class="button-help-container__links button-help-container__links_hover">Ask
                    a question</a>
                <a href="/shop/" class="button-help-container__links button-help-container__links_hover">Part
                    Exchange</a>
                <a href="/shop/" class="button-help-container__links button-help-container__links_hover">Pay
                    by Finance</a>
                <a href="/shop/" class="button-help-container__links button-help-container__links_hover">Seen
                    a better price?</a>
            </div>

            <form class="single-product-sell">
                <div class="single-product-options">
                    <h4 class="single-product-options__title">Finish <span class="red">*</span></h4>
                </div>

                <div class="single-product-cart">
                    <div class="single-product-cart-container">
                        <div class="single-product-container__qty-container">
                            <label class="single-product-container__label">Qty: </label>
                            <input type="text" value="1" class="single-product-container__qty">
                        </div>

                        <div class="single-product-cart-container__carts-container">
                            <input type="submit" value="ADD TO CART" class="add-cart"></input>
                            <p class="single-product-cart-container__or">-OR-</p>
                            <img src="assets/images/paypal.jpg" alt="Pay via. Paypal" class="add-paypal">
                        </div>
                    </div>
                </div>
            </form>
            <h2 class="single-product__addinfo">ADDITIONAL INFORMATION</h2>
            <table class="single-product__addtable">
                <tr class="addtable__tr addtable__tr_first">
                    <th class="addtable__th">manufacturer</th>
                    <td class="addtable__td">${produkt.make}</td>
                </tr>
                <tr class="addtable__tr">
                    <th class="addtable__th">manufacturer link</th>
                    <td class="addtable__td"><a class="addtable__td-link addtable__td-link_hover"
                            href="/shop/?manufacturer=${produkt.make}">${produkt.make}</a></td>
                </tr>
                <tr class="addtable__tr">
                    <th class="addtable__th">FREE WARRANTY</th>
                    <td class="addtable__td">3 years</td>
                </tr>
                <tr class="addtable__tr">
                    <th class="addtable__th">Delivery Charge</th>
                    <td class="addtable__td">Free</td>
                </tr>
                <tr class="addtable__tr">
                    <th class="addtable__th">Delivery Time</th>
                    <td class="addtable__td">1 - 5 Working Days</td>
                </tr>
                <tr class="addtable__tr">
                    <th class="addtable__th">Card surcharges</th>
                    <td class="addtable__td">No</td>
                </tr>
            </table>
        `;

            breadcrumbList.innerHTML += `
            <li class="breadcrumb-list__item">
                <a class="breadcrumb-list__link breadcrumb-list__link_back" href="/category/">Home</a>
                <span class="breadcrumb-list__seperator">/</span>
            </li>

            <li class="breadcrumb-list__item">
                <a class="breadcrumb-list__link breadcrumb-list__link_back" href="/shop/?category=${produkt.category}">${produkt.category}</a>
                <span class="breadcrumb-list__seperator">/</span>
            </li>

            <li class="breadcrumb-list__item">
                <a class="breadcrumb-list__link" href="/product/?id=${produkt.sku}">${produkt.model}</a>
            </li>
        `;

            imgContainer.innerHTML += `
            <img src=${produkt.images[0]} alt="Product image" class="single-product-container__img">
            <div class="more-img">
                <h2 class="more-img__heading">MORE VIEWS</h2>
                <div class="more-img__container">
                </div>
            </div>
        `;

            const moreImg = document.querySelector('.more-img__container');
            produkt.images.forEach(img => {
                moreImg.innerHTML += `<img src=${img} alt="product img" class="more-img__img">`;
            });


            /*             const colorList = document.querySelector('.single-product-options');
                        produkt.colors.forEach(element => {
                            colorList.innerHTML += `
                            <div class="single-product-option">
                                <input type="radio" class="single-product-options__input" name="radioColor">
                                <h5 class="single-product-options__colors">${element}</h5>
                            </div>
                        `;
                        }); */

            /*             element.specDesc.forEach((specDesc, index) => {
                            descriptionElement.innerHTML += `
                            <tr class="desc-table__tr">
                                <th class="desc-table__th">${specDesc}</th>
                                <td class="desc-table__td">${element.spec[index]}</td>
                            </tr>
                        `;
                        }); */
            const bigPicture = document.querySelector(".single-product-container__img");
            document.querySelectorAll('.more-img__img').forEach(picture => {
                picture.addEventListener('click', () => {
                    bigPicture.setAttribute('src', picture.src);
                });
            })
        }).catch(err => console.error(err));
}

//Min søge funktion
fetch('https://hifi-corner.herokuapp.com/api/v1/products')
    .then(response => response.json())
    .then(data => {
        const searchField = document.querySelector('.shop-search__input');
        const searchIcon = document.querySelector('.shop-search__icon');
        const productList = document.querySelector('.product__list');
        const pageAmount = document.querySelectorAll('.pager__amount');
        const productTitle = document.querySelector('.products-wrapper__overskrift');
        let params = new URLSearchParams(document.location.search);
        let search = params.get('search');
        searchField.addEventListener('keydown', searchValidator);
        searchIcon.addEventListener('click', searchValidator);

        if (search) {
            productTitle.textContent = search;
        }

        data.forEach((element) => {
            if (search) {
                if (element.model.toLowerCase().includes(search.toLowerCase()) ||
                    element.category.toLowerCase().includes(search.toLowerCase())) {
                    items++;

                    productList.innerHTML += `
                    <a class="product-item" href="/product/?id=${element.sku}">
                    <div class="product-item__container">
                    <img src="${element.images[0]}" alt="${element.model} til salg" class="product-item__img">
                    </div>
                    <h2 class="product-item__title">${element.model}</h2>
                    <p class="product-item__price">${element.price}€</p>
                    <button class="product-item__buy">ADD TO CART</button>
                    </a>
                    `;
                }
            }

            pageAmount.forEach(amount => {
                amount.textContent = items + ' Item(s)';
            });
        });

        function searchValidator(e) {
            if (e.keyCode === 13 && e.target.value !== '' ||
                e.target.tagName === 'I' && searchField.value !== '') {
                window.location.href = '/Shop/?search=' + searchField.value;
            } else if (e.keyCode === 13 && e.target.value === '' ||
                e.target.tagName === 'I' && searchField.value === '') {
                window.location.href = '/Shop/?category=all';
            }
        }
    }).catch(err => console.error(err));   
