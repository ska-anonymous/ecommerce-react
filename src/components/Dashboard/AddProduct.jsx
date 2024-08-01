import React, { useEffect, useState } from 'react'
import { API_URL } from '../../config';

const AddProduct = () => {

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

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

        } catch (err) {
            alert('Failed to get Categories Data ' + err.message);
            console.log('Failed to get Categories Data ', err);
        }
    }

    useEffect(() => {
        fetchCategories();
    }, [])

    const handleAddProduct = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        setLoading(true);
        try {
            const response = await fetch(API_URL + '/products/add-product', {
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

            e.target.reset();
            alert('Product added Succesfully');

        } catch (err) {
            alert('Failed to add New Product ' + err.message);
            console.log('Failed to add New Product ', err);
        }
        setLoading(false);
    }

    return (
        <>
            <div className="row">
                <div className="col-12">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleAddProduct} >
                                {/* Product Name */}
                                <div className="form-group">
                                    <label htmlFor="productName">Product Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="productName"
                                        name="name"
                                        required
                                    />
                                </div>
                                {/* Category (Select Dropdown) */}
                                <div className="form-group">
                                    <label htmlFor="category">Category</label>
                                    <select className="form-control" id="category" name="category" required>
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
                                        defaultValue={""}
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
                                        defaultValue={0}
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
                                        required
                                    />
                                </div>
                                {/* Submit Button */}
                                {loading ? <button type="submit" className="btn btn-primary" disabled>
                                    Submiting....
                                </button> : <button type="submit" className="btn btn-primary">
                                    Submit
                                </button>}

                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AddProduct
