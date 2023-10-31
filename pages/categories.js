import Layout from "@/components/layout";
import axios from "axios";
import { useEffect, useState } from "react";
import { withSwal,swal} from 'react-sweetalert2';




function Categories({ swal }) {
    const [editedcategory,setEditedcategory] = useState(null);
    const [name, setName] = useState('');
    const [categories, setCategories] = useState([]);
    const [parentcategory, setParentcategory] = useState('');
    const [properties,setProperties] = useState([]);

    useEffect(() => {
        fetchcategories();
    }, []);

    async function fetchcategories() {
        try {
            const response = await axios.get('/api/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    }

    function editCategory(category) {
        setEditedcategory(category);
        setName(category.name);
        setParentcategory(category?.parent?._id);
        setProperties(category.properties.map(({name,values})=> ({
            name,
            values:values.join(',')
        })));
        fetchcategories();
    }
    function addproperty(){
        setProperties(prev => {
            return [...prev,{name:'',values:''}]
        })
    }

        function handlePropertyName(index, property, newName) {
            setProperties((prevProperties) => {
              const updatedProperties = [...prevProperties]; // Create a copy of the previous state
              updatedProperties[index].name = newName; // Update the name property of the specific element
              return updatedProperties; // Return the updated array
            });
          }
          
          function handlePropertyValues(index, property, newValues) {
            setProperties((prevProperties) => {
              const updatedProperties = [...prevProperties]; // Create a copy of the previous state
              updatedProperties[index].values = newValues; // Update the name property of the specific element
              return updatedProperties; // Return the updated array
            });
          }
    

    async function savecategory(e) {
        e.preventDefault();
    
        const data = { name, 
            properties: properties.map(p => ({name:p.name,values:p.values.split(','),
        })) ,
            parentcategory: parentcategory === '' ? null : parentcategory };

        if (editedcategory) {
            data._id = editedcategory._id;
            try {
                await axios.put('/api/categories', data);
                
            } catch (error) {
                console.error('Error updating category:', error);
            }
        } else {
            try {
                await axios.post('/api/categories', data);
               
                
            } catch (error) {
                console.error('Error creating category:', error);
            }
        }
        setName('');
        setParentcategory('');
        setProperties([]);
        fetchcategories();
    }

    function handleClick(category) {
        swal.fire({
            title: 'Are You Sure',
            text: `Do You Wanna Delete ${category.name}`,
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Confirm',
            confirmButtonColor: '#d55',
        }).then(async (result) => {
            if (result.isConfirmed) {
                const { _id } = category;
                try {
                    await axios.delete('/api/categories?_id=' + _id);
                    fetchcategories();
                } catch (error) {
                    console.error('Error deleting category:', error);
                }
            }
        }).catch((error) => {
            console.error('Error showing confirmation dialog:', error);
        });
    }

    function removeproperty(index){
        setProperties(prev => {
            const newProperties = [...prev];
            return newProperties.filter((p,pindex)=>{
                return pindex !==index;
            });
        });
    }


    return(
        <Layout>
            <h1> categories </h1>
            <label>
              {editedcategory ? `Edit category ${editedcategory.name}` : 'Category name'}
            </label>

            <form  className=" " onSubmit={savecategory }> 
            <div className="flex gap-1">          
            <input className=""  type="text"
            onChange={(ev) => setName(ev.target.value)}
            placeholder="Category name"
            value={name}
            />

            <select className=""
            onChange={(ev) => setParentcategory(ev.target.value)}
              value={parentcategory}
             >
              <option value="">No Parent Category</option> {/* Set value to an empty string */}
                {categories.length > 0 &&
               categories.map((category) => (
                 <option key={category._id} value={category._id}>
                 {category.name}
                </option>
                  ))}
            </select>
                </div> 
                <div>
                    <label className="block" >Properties</label>
                    <button type = 'button'  onClick={addproperty}
                    className="btn-default text-sm mb-2">
                        Add Properties
                        </button>
                        {properties.length > 0 && properties.map((property,index) => (
                        <div className="flex gap-1 mb-">
                           <input className="mb-0" 
                                  type="text"
                                  value={property.name}  
                                  onChange={ev => handlePropertyName(index,property,ev.target.value)}
                                placeholder="property name (example:color)" />
                           <input className="mb-0"
                                  type="text" 
                                  value={property.values}
                                  onChange={ev => handlePropertyValues(index,property,ev.target.value)}
                                  placeholder="values,comma separated" />
                          <button 
                          className="btn-default"
                          onClick={() => removeproperty(index)}
                          type='button'>
                            Remove</button>
                        </div>
                     ))}
                </div>
                <button className="btn-primary py-1 mt-3">
                    save
                     </button>
                     
            </form>

            
            <table className="basic mt-4">
                <thead>
                    <tr>
                        <td>
                            Category Name 
                        </td>
                        <td>
                            Parent-category
                        </td>
                        <td>

                        </td>
                    </tr>
                </thead>
                <tbody>
                   {categories.length >0 && categories.map
                      (category => (
                        <tr>
                          <td>{category?.name}</td>
                          <td>{category?.parent?.name} </td>
                          <td>
                          <button
                       onClick={() => editCategory(category)}
                       className= "btn-primary mr-2" >
                         Edit
                         </button>
                            <button className="btn-primary" onClick={()=>handleClick(category)}>Delete</button>
                          </td>
                        </tr>
                  
                   ))}
                </tbody>
            </table>

        </Layout>
    )
} 


export default withSwal(({ swal }, ref) => (
 <Categories swal={swal}/>
));