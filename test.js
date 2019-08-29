//разделяю цену по разрядам

const formatNumber = (number = 0, n = 0, x = 3) => {
    const re = `\\d(?=(\\d{${x}})+${n > 0 ? '\\.' : '$'})`;

    return Number(number)
        .toFixed(Math.max(0, ~~n))
        .replace(new RegExp(re, 'g'), '$& ')
        .replace(/\.00$/, '');
};


//все объявления 
const allProducts = document.createElement("div");
allProducts.className = ("allProductsClass");
document.body.appendChild(allProducts);


//получаю продукты и продавцов


let urls = [
    "http://avito.dump.academy/products",
    "http://avito.dump.academy/sellers"
];

let array = urls.map((item) => {
    return fetch(item).then(function(response) {
        return response.json();
    });
});

Promise.all(array)
    .then(results => {
        const [products, sellers] = results;

        console.log({ products });
        console.log({ sellers });




        //получаю продукты
        for (let i = 0; i < products.data.length; i++) {
            const product = products.data[i];
            const productElement = createProduct(product);


            const sellerId = product.relationships.seller;
            const sellerDATA = sellers.data[sellerId];

            productElement.append(createSeller(sellerDATA));

            //вывожу имена продавцов и рейтинг

            function createSeller(sellerDATA) {
                const sellerNameDiv = document.createElement("div");
                sellerNameDiv.className = ("sellerNameDivClass");

                const sellerNameAndRating = document.createElement("p");
                sellerNameAndRating.innerHTML = `${sellerDATA.name} ${sellerDATA.rating}`;


                sellerNameDiv.appendChild(sellerNameAndRating);

                return sellerNameDiv;
            };
            allProducts.append(productElement);

        }

    });



//функция по созданию объявления
function createProduct(product) {



    //одно объявление
    const newProduct = document.createElement("div");
    newProduct.className = ("newProductClass");
    allProducts.appendChild(newProduct);



    //главное фото

    const productPictureDiv = document.createElement("div");
    productPictureDiv.className = ("productPictureDivClass");

    const pictureInDiv = document.createElement("img");
    pictureInDiv.src = `http:${product.pictures[0]}`;
    pictureInDiv.height = 200;
    pictureInDiv.width = 200;
    productPictureDiv.appendChild(pictureInDiv);
    newProduct.appendChild(productPictureDiv);

    //количество дополнительных фото

    const productPicturesLength = document.createElement("div");
    productPicturesLength.className = ("productPicturesLengthClass");
    const extraPhotoes = document.createElement("p");
    extraPhotoes.className = ("extraPhotoesClass");
    extraPhotoes.innerHTML = product.pictures.length - 1;
    productPicturesLength.appendChild(extraPhotoes);


    //фото с количеством доп.фото

    const mainPhoto = document.createElement("div");
    mainPhoto.className = ("wrapper");
    mainPhoto.appendChild(productPictureDiv);
    mainPhoto.appendChild(productPicturesLength);
    newProduct.appendChild(mainPhoto);


    //заголовок объявления

    const productTitleDiv = document.createElement("div");
    productTitleDiv.className = ("productTitleDivClass");

    const productTitle = document.createElement("h3");
    productTitle.innerHTML = product.title;
    productTitleDiv.append(productTitle);
    newProduct.appendChild(productTitleDiv);


    //цена

    const productPriceDiv = document.createElement("div");
    productPriceDiv.className = ("productPriceDivClass");

    const productPrice = document.createElement("p");

    const priceWithSpaces = formatNumber(product.price);

    productPrice.innerHTML = product.price ? priceWithSpaces + " ₽" : "Цена не указана";
    productPriceDiv.appendChild(productPrice);
    newProduct.appendChild(productPriceDiv);

    return newProduct;
};