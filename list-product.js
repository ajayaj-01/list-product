// script.js

let currentPage = 1;
const productsPerPage = 10;
let allProducts = [];
let displayedProducts = [];
let allCategories = [];
let sortDirection = "asc"; // 'asc' or 'desc'

// Utility function to format the rating stars
function createRatingStars(rate) {
  const fullStars = Math.floor(rate);
  const halfStar = rate % 1 !== 0;
  let stars = "";

  for (let i = 0; i < fullStars; i++) {
    stars += "★"; // Full star
  }
  if (halfStar) {
    stars += "☆"; // Half star
  }
  return stars;
}

// Load products and categories from API
async function loadProducts() {
  try {
    const response = await fetch("https://fakestoreapi.com/products");
    allProducts = await response.json();

    // Extract categories
    allCategories = [
      ...new Set(allProducts.map((product) => product.category)),
    ];
    populateCategories(allCategories);

    // Initial product display
    displayedProducts = allProducts.slice(0, productsPerPage);
    renderProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Populate categories in the sidebar
function populateCategories(categories) {
  const categoriesContainer = document.getElementById("categories");
  categoriesContainer.innerHTML = ""; // Clear existing categories

  categories.forEach((category) => {
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = category;
    checkbox.name = "category";
    checkbox.value = category;

    const label = document.createElement("label");
    label.htmlFor = category;
    label.textContent = category;

    categoriesContainer.appendChild(checkbox);
    categoriesContainer.appendChild(label);
    categoriesContainer.appendChild(document.createElement("br"));
  });

  // Add event listener to filter products by category
  categoriesContainer.addEventListener("change", filterProductsByCategory);
}

// Render products to the page
function renderProducts() {
  const productsContainer = document.querySelector(".products");
  productsContainer.innerHTML = "";
  // const productCard = document.createElement('div');
  // productCard.classList.add('product-card ');
  // productCard.dataset.productId = product.id;

  // const img = document.createElement('img');
  // img.src = product.image;
  // img.alt = product.title;

  // const title = document.createElement('h3');
  // title.textContent = product.title;

  // const price = document.createElement('p');
  // price.textContent = `$${product.price.toFixed(2)}`;

  // const heartIcon = document.createElement('span');
  // heartIcon.classList.add('heart-icon');
  // heartIcon.innerHTML = '&#9825;'; // Black heart

  // productCard.appendChild(img);
  // productCard.appendChild(title);
  // productCard.appendChild(price);
  // productCard.appendChild(heartIcon);
  const productCard = displayedProducts.map((product) => {
    console.log("product-------", product);

    return `<div class="col-md-3 col-xs-12 col-lg-3">
        <div class="card" onclick="showProductDetail(${product.id})">
        <div class="card-body">
        <div class="ratio mb-4 ">
         <img class="card-img ratio-4x3 " src=${product.image} />
        </div>
       
        <h3 class="card-title">${product.title}</h3>
        <span>${product.price.toFixed(2)}</span>
        </div>
        </div>
        
        </div>`;
  });
  productsContainer.innerHTML = productCard;

  // Click event to show product details
//   productCard.addEventListener("click", () => showProductDetail(product.id));

  // Update results count
  const resultsCount = document.getElementById("results-count");
  resultsCount.textContent = `${displayedProducts.length} results`;

document.getElementById('loader-page').style.display='none';

  // Show or hide load more button
  const loadMoreButton = document.getElementById("load-more");
  loadMoreButton.style.display =
    displayedProducts.length < allProducts.length ? "block" : "none";
}

// Filter products by selected categories
function filterProductsByCategory() {
  const selectedCategories = Array.from(
    document.querySelectorAll("#categories input:checked")
  ).map((input) => input.value);

  if (selectedCategories.length === 0) {
    // If no categories are selected, show all products
    displayedProducts = allProducts.slice(0, productsPerPage);
  } else {
    // Filter products based on selected categories
    displayedProducts = allProducts.filter((product) =>
      selectedCategories.includes(product.category)
    );
  }

  // Reset pagination
  currentPage = 1;
  displayedProducts = displayedProducts.slice(0, productsPerPage);
  renderProducts();
}

// Handle sort by price
function sortProductsByPrice(order) {
  displayedProducts.sort((a, b) => {
    return order === "asc" ? a.price - b.price : b.price - a.price;
  });

  // Render sorted products
  renderProducts();
}

// Show product detail
async function showProductDetail(productId) {
  try {
    const response = await fetch(
      `https://fakestoreapi.com/products/${productId}`
    );
    const product = await response.json();

    // Hide listing page and show detail page
    document.querySelector(".listing-page").style.display = "none";
    document.querySelector(".banner").style.display = "none";
    document.getElementById("product-detail").style.display = "flex";

    const productDetailContainer = document.getElementById("product-detail");
    productDetailContainer.innerHTML = `
            <div class="product-detail-content">

                <div class="image">
                    <div class="image-options">
                        <img src="${product.image}" alt="${product.title}">
                        <img src="./icons/max-width_header.png" class="line">
                        <img src="${product.image}" alt="${product.title}">
                        <img src="${product.image}" alt="${product.title}">
                        <img src="${product.image}" alt="${product.title}">
                        <img src="${product.image}" alt="${product.title}">
                    </div>
                    <div class="image-display">
                        <img src="${product.image}" alt="${product.title}">
                    </div>
                </div>
                <div class="info">
                    <h2>${product.title}</h2>
                    <p class="short-description">${product.description.slice(
                      0,
                      100
                    )}<span class="read-more">Read more</span></p>
                    <p class="full-description" style="display:none;">${
                      product.description
                    }</p>
                    <p class="price">$${product.price}</p>
                    <div class="stars">${createRatingStars(
                      product.rating.rate
                    )}(${product.rating.rate})</div>
                    <hr>
                    <h4>Quantity</h4>
                    <div class="quantity">
                        <button id="minus">-</button>
                        <input type="text" id="quantity" value="1">
                        <button id="plus">+</button>
                    </div>
                    <button id="add-to-cart" class="add-to-cart">Add to Cart</button>
                    <div class="icons">
                        <span class="save-icon">&#9825; Save</span>
                        <span ><i class="fa fa-share-alt" style="color: gray;"></i> Share</span>
                    </div>
                </div>
                 <div class="additional-info">
                <h2 >${product.title}</h2>
                <h4>Description</h4>
                <p>${product.description}</p>
                <img src="./icons/max-width_header.png" class="line">
            </div>
            </div>
           
        `;

    // Event listeners for quantity buttons
    document.getElementById("plus").addEventListener("click", () => {
      const quantityInput = document.getElementById("quantity");
      quantityInput.value = parseInt(quantityInput.value) + 1;
    });

    document.getElementById("minus").addEventListener("click", () => {
      const quantityInput = document.getElementById("quantity");
      if (parseInt(quantityInput.value) > 1) {
        quantityInput.value = parseInt(quantityInput.value) - 1;
      }
    });

    // Event listener for read more link
    document.querySelector(".read-more").addEventListener("click", () => {
      document.querySelector(".short-description").style.display = "none";
      document.querySelector(".full-description").style.display = "block";
    });

    // Event listener for back button
    document.getElementById("back-button").style.display = "block";
    document.getElementById("back-button").addEventListener("click", () => {
      document.querySelector(".listing-page").style.display = "flex";
      document.querySelector(".banner").style.display = "flex";
      document.getElementById("product-detail").style.display = "none";
      document.getElementById("back-button").style.display = "none";
    });
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
}

// Handle load more button click
document.getElementById("load-more").addEventListener("click", () => {
  currentPage++;
  const nextProducts = allProducts.slice(
    currentPage * productsPerPage - productsPerPage,
    currentPage * productsPerPage
  );
  displayedProducts = [...displayedProducts, ...nextProducts];
  renderProducts();
});

// Handle sort by change
document.getElementById("sort-by").addEventListener("change", (event) => {
  const sortOrder = event.target.value;
  sortDirection = sortOrder; // Update sort direction
  sortProductsByPrice(sortDirection);
});

function togglePopup() {
  document.querySelector(".popup").classList.toggle("hide");
}

document.querySelector(".fa-bars").addEventListener("click", togglePopup);
document.querySelector(".close").addEventListener("click", togglePopup);

// Initialize the application
loadProducts();
