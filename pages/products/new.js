import Layout from "@/components/layout";
import Productform from "@/components/productsform";
import axios from "axios";
import { redirect } from "next/dist/server/api-utils";
import { Router, useRouter } from "next/router";
import { useState } from "react";

export default function NewProducts() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [gotoProducts, setGotoProducts] = useState(false);
  const router = useRouter();

  async function createProduct(ev) {
    ev.preventDefault();

    const data = { title, description, price };

    try {
      const response = await axios.post('/api/products', data);

      if (response.status === 201) {
        // Successful creation, navigate to the "products" page
        setGotoProducts(true);
      } else {
        // Handle other status codes or errors as needed
      }
    } catch (error) {
      // Handle Axios request errors
      console.error('Axios error:', error);
    }
  }

  // Use router.push inside the function, not outside
  if (gotoProducts) {
    router.push('/products');
  }

  return (
    <Layout>
    <h1>New Product</h1>
      <Productform />
    </Layout>
  );
}
