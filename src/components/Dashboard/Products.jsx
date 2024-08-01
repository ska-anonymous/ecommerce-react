import React, { useEffect, useState } from 'react'
import { API_URL, SERVER_ROOT } from '../../config';
import { useNavigate } from 'react-router-dom';

const Products = () => {

    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {

            const response = await fetch(API_URL + '/products/all', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('shoppingToken')}`
                }
            });
            const result = await response.json();
            if (result.error) {
                throw new Error(result.errorMessage);
            }

            setProducts(result.products);

        } catch (err) {
            alert('Failed to fetch products' + err.message);
            console.log('Failed to fetch products', err);
        }
    }

    const handleEditProduct = (product) => {
        navigate('/dashboard/edit-product', { state: product });
    }

    const handleDeleteProduct = async (productId) => {
        const willDelete = confirm('Do you really want to delete this product?');
        if (!willDelete)
            return;

        try {
            const response = await fetch(API_URL + '/products/delete/' + productId, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('shoppingToken')}`
                }
            });
            const result = await response.json();
            if (result.error) {
                throw new Error(result.errorMessage);
            }

            setProducts(products.filter(product => {
                return product.id != productId;
            }))

        } catch (err) {
            alert('Failed to delete product ' + err.message);
            console.log('Failed to delete product ', err);
        }
    }

    useEffect(() => {
        fetchProducts();
    }, [])

    return (
        <>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>SNO</th>
                        <th>Image</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => {
                        return (
                            <tr key={'product-row-' + index}>
                                <td>{index + 1}</td>
                                <td>
                                    <img width={50} height={50} src={SERVER_ROOT + '/products_images/' + product.image} />
                                </td>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td>{product.price}</td>
                                <td>
                                    <button onClick={() => { handleEditProduct(product) }} title='Edit Product' className='btn btn-sm btn-success'>
                                        <i className='bi bi-pencil-square'></i>
                                    </button>
                                    <button onClick={() => { handleDeleteProduct(product.id) }} title='Delete Product' className='btn btn-sm btn-danger my-2'>
                                        <i className='bi bi-trash'></i>
                                    </button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </>
    )
}

export default Products
