import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { API_URL } from "./config";
import { SERVER_ROOT } from "./config";
import { useContext, useEffect, useState } from "react";

import { AppContext } from "./appcontextprovider";

export default function Home() {

  const { cart, setCart } = useContext(AppContext);

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchProducts = async () => {
    setIsLoading(true);

    const response = await fetch(API_URL + '/products');
    const data = await response.json();
    if (!data.error) {
      setProducts(data.products);
    }

    setIsLoading(false);
  }

  useEffect(() => {
    fetchProducts();
  }, [])

  const handleAddToCart = (product) => {

    if (cart.some(item => item.productid == product.productid)) {
      let items = cart.map(item => {
        if (item.productid == product.productid) {
          return { ...item, quantity: item.quantity + 1, price: Number(item.price) + Number(product.price) };
        }
        return item;
      })

      setCart(items);

    } else {
      setCart(items => [...items, product]);
    }

    console.log(cart);

  }

  const handleProductSearch = async () => {

    setIsLoading(true);
    const response = await fetch(API_URL + '/products/findproducts?search=' + encodeURIComponent(searchText));
    const data = await response.json();
    setIsLoading(false);
    if (data.error) {
      alert(errorMessage);
      return;
    }
    setProducts(data.products);
  }

  return (
    <>
      <Navbar />
      {/* <!-- Header--> */}
      <header className="bg-dark py-5">
        <div className="container px-4 px-lg-5 my-5">
          <div className="text-center text-white">
            <h1 className="display-4 fw-bolder">Shop in style</h1>
            <p className="lead fw-normal text-white-50 mb-0">With our online shopping service</p>
          </div>
        </div>
      </header>
      {/* <!-- Section--> */}
      <section className="py-5">
        <div className="container px-4 px-lg-5 mt-5">
          {/* search section */}
          <div className="row my-3">
            <div className="col-12">
              <div className="input-group">
                <input type="text" className="form-control" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder="search for product name or category"></input>
                <button className="btn btn-outline-info" type="button" onClick={handleProductSearch}>Search</button>
              </div>
            </div>
          </div>
          <div className="row">
            {isLoading && <h2 className="text-center">Loading Products Data ....</h2>}
          </div>
          <div className="row gx-4 gx-lg-5 row-cols-2 row-cols-md-3 row-cols-xl-4 justify-content-center">
            {products.map((product, index) => {
              return (
                <div key={'card-' + index} className="col mb-5">
                  <div className="card h-100">
                    {/* <!-- Product image--> */}
                    <img className="card-img-top" src={SERVER_ROOT + '/products_images/' + product.image} alt="..." />
                    {/* <!-- Product details--> */}
                    <div className="card-body p-4">
                      <div className="text-center">
                        {/* <!-- Product name--> */}
                        <h5 className="fw-bolder">{product.name}</h5>
                        <p className="text-muted">{product.description}</p>
                        {/* <!-- Product price--> */}
                        ${product.price}
                      </div>
                    </div>
                    {/* <!-- Product actions--> */}
                    <div className="card-footer p-4 pt-0 border-top-0 bg-transparent">
                      <div className="text-center" onClick={() => { handleAddToCart({ productid: product.id, name: product.name, price: product.price, quantity: 1, image: product.image }) }}><a className="btn btn-outline-dark mt-auto" role="button">Add to cart</a></div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>
      {/* <!-- Footer--> */}
      <Footer />
    </>
  )
}
