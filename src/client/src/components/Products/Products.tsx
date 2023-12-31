import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import axios from 'axios';

interface Product {
    id: string;
    name: string;
    image_uri: string;
}

const Products = () => {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const docuApiKey = process.env.REACT_APP_DOCU_API_KEY;

            try {
                const response = await axios.get('http://localhost:8000/api/template', {
                    headers: {
                        Authorization: docuApiKey,
                    },
                });
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [])

    return (
        <div>
            <div className="app-header center-container">
                <div className="container">
                    <div className="small fw-bold">Explore Our Products</div>
                    <h1 className='fw-bold'>Elevate Your Document Creation</h1>
                    <p>Crafting professional documents can be a daunting task. We understand. That's why we've developed a suite of specialized tools to streamline the process.</p>
                    <p>Ready to get started? It's free to try.</p>

                </div>
            </div>

            <div className='container pb-5'>
                <div className="row">
                    {
                        products.map(product =>
                            <ProductCard id={product.id} name={product.name} img={product.image_uri} available={true} />
                        )
                    }
                </div>
            </div>
        </div>
    );
}

export default Products;