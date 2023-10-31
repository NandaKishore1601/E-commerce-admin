import { mongooseConnect } from "@/lib/mongose";
import { Category } from "@/models/category";
import { isAdminRequest } from "./auth/[...nextauth]";

export default async function handle(req, res) {
    const method = req.method;
    await isAdminRequest(res,req);

    try {
        await mongooseConnect();

        if (method === 'GET') {
            const categories = await Category.find().populate('parent');
            res.json(categories);
        } else if (method === 'POST') {
            const { name, properties ,parentcategory } = req.body;
            const categoryDoc = await Category.create({
                name,
                properties:properties,
                parent: parentcategory,
                
            });
            res.status(201).json(categoryDoc); // Respond with the created category
        } else if (method === 'PUT') {
            const { name, properties,parentcategory, _id } = req.body;
            const categoryDoc = await Category.updateOne({ _id }, {
                name,
                properties:properties,
                parent: parentcategory,
            });
            res.json(categoryDoc);
        } else if (method === 'DELETE') {
            const { _id } = req.query;
            await Category.deleteOne({ _id });
            res.status(204).end();  // Return a 204 No Content status upon successful deletion
        } else {
            res.status(405).end(); // Method Not Allowed
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}
