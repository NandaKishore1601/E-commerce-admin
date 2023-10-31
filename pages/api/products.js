import {Product} from "@/models/products";
import { Category } from "@/models/category";
import { mongooseConnect } from "@/lib/mongose";
import { isAdminRequest } from "./auth/[...nextauth]";


export default async function handle(req,res) {
    const { method } = req;
    await mongooseConnect();
    
    
    if (method === 'GET') {
        if (req.query?.id) {
          try {
            const product = await Product.findOne({ _id: req.query.id });
            if (product) {
              res.json(product);
            } else {
              res.status(404).json({ error: 'Product not found' });
            }
          } catch (error) {
            res.status(500).json({ error: 'Server error' });
          }
        } else {
          try {
            const products = await Product.find();
            res.json(products);
          } catch (error) {
            res.status(500).json({ error: 'Server error' });
          }
        }
    }

    if (method === 'POST') {
        const { title, description, price,images,selectedCategory,productproperties} = req.body;
        try {

          const category = await Category.findById(selectedCategory);
          

          if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
            const productDoc = await Product.create({
                title,
                description, 
                price,
                images,
                category:selectedCategory,
                properties: productproperties,
            });
            res.status(201).json(productDoc); // Respond with the created product
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    } else {
        res.status(405).end(); // Method not allowed
       }
       if (method === 'PUT') {
        const { title, description, price, _id ,images,selectedCategory,productproperties} =req.body;
        
        try {
          const category = await Category.findById(selectedCategory);
          
        if (!category) {
          return res.status(404).json({ error: 'Category not found' });
      }
          const updatedProduct = await Product.findOneAndUpdate(
            { _id },
            {title, 
              description, 
              price,
              images,
              category:selectedCategory,
              properties: productproperties},
             
            { new: true } 
          );
          if (!updatedProduct) {
            res.status(404).json({ error: 'Product not found' });
          } else {
            // Product updated successfully
            res.status(200).json(updatedProduct);
          }
        } catch (error) {
          res.status(500).json({ error: 'Server error' });
        }
      }

      if (method === 'DELETE') {
        const productId = req.query?.id;
        if (productId) {
          try {
            const deletedProduct = await Product.findByIdAndDelete(productId);
      
            if (!deletedProduct) {
              res.status(404).json({ error: 'Product not found' });
            } else {
              res.status(204).end(); // Return a 204 No Content status upon successful deletion
            }
          } catch (error) {
            console.error('Server error:', error);
            res.status(500).json({ error: 'Server error' });
          }
        } else {
          // Handle the case where the productId is missing from the request
          res.status(400).json({ error: 'Invalid request' });
        }
      }
      
      
     
 }

