import React, { useEffect, useState } from 'react'
import { API_URL } from '../../config';
import { useLocation } from 'react-router-dom';

const EditProduct = () => {

    const location = useLocation();
    const product = location.state;

    if (!product) {
        return (
            <Navigate to={'/dashboard/products'} />
        )
    }

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(0);

    const fetchCategories = async () => {
        try {
            const response = await fetch(API_URL + '/categories', {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('shoppingToken'),
                }
            })

            const result = await response.json();

            if (result.error) {
                throw new Error(result.errorMessage);
            }

            setCategories(result.categories);
            setSelectedCategory(product.categoryid);

        } catch (err) {
            alert('Failed to get Categories Data ' + err.message);
            console.log('Failed to get Categories Data ', err);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, [])

    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        // set the product id in the formdata as well 
        formData.append('productid', product.id);
        // also append image if the new image is not uploaded then set the old one
        formData.append('oldimage', product.image);
        setLoading(true);
        try {
            const response = await fetch(API_URL + '/products/update-product', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('shoppingToken')
                },
                body: formData
            });

            const result = await response.json();
            if (result.error) {
                throw new Error(result.errorMessage);
            }

            alert('Product updated Succesfully');

        } catch (err) {
            alert('Failed to Update Product ' + err.message);
            console.log('Failed to Update Product ', err);
        }
        setLoading(false);
    }

    return (
        <>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleUpdateProduct} >
                                {/* Product Name */}
                                <div className="form-group">
                                    <label htmlFor="productName">Product Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="productName"
                                        name="name"
                                        required
                                        defaultValue={product.name}
                                    />
                                </div>
                                {/* Category (Select Dropdown) */}
                                <div className="form-group">
                                    <label htmlFor="category">Category</label>
                                    <select className="form-control" id="category" name='category' value={selectedCategory} onChange={(e) => {
                                        setSelectedCategory(e.target.value);
                                    }} required>
                                        {categories.map((category, index) => {
                                            return (
                                                <option key={'cat-option-' + index} value={category.id}>{category.name}</option>
                                            )
                                        })}
                                    </select>
                                </div>
                                {/* Description */}
                                <div className="form-group">
                                    <label htmlFor="description">Description</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        name="description"
                                        rows={4}
                                        required
                                        defaultValue={product.description}
                                    />
                                </div>
                                {/* Price */}
                                <div className="form-group">
                                    <label htmlFor="price">Price</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="price"
                                        name="price"
                                        step="0.1"
                                        min={0}
                                        required
                                        defaultValue={product.price}
                                    />
                                </div>
                                {/* Image Upload */}
                                <div className="form-group my-3">
                                    <label htmlFor="image">Product Image</label>
                                    <input
                                        type="file"
                                        className="form-control-file"
                                        id="image"
                                        name="image"
                                        accept="image/*"
                                    />
                                </div>
                                {/* Submit Button */}
                                {loading ? <button type="submit" className="btn btn-primary" disabled>
                                    Updating....
                                </button> : <button type="submit" className="btn btn-primary">
                                    Update
                                </button>}

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditProduct
