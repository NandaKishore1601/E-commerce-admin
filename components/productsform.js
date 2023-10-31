import axios from "axios";
import { Router, useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FadeLoader } from "react-spinners";

export default function Productform({
    title:existingTitle,
    description:existingDescription,
    price:existingPice,
    _id,
    images:existingimages,
    category:existingCategory,
    properties:existingProperties,
    }) {
  const [title, setTitle] = useState(existingTitle || '');
  const [description, setDescription] = useState(existingDescription|| '');
  const [price, setPrice] = useState(existingPice || '');
  const [gotoProducts, setGotoProducts] = useState(false);
  const [images,setImages]=useState(existingimages || []);
  const [isuploading,setIsuploading] = useState(false);
  const [categories,setCategories] = useState([]);
  const [selectedCategory,setSelectedCategory] = useState(existingCategory || '');
  const [productproperties,setProductproperties] = useState(existingProperties|| {});

  const router = useRouter( );


  useEffect(() => {
    axios.get('/api/categories').then((result) => {
      setCategories(result.data);
    });

  }, []);



    async function Saveproduct(ev) {
    ev.preventDefault();
    const data = { title,description, price ,images,selectedCategory,productproperties};
    if(_id){
        //update
        try{
          await axios.put('/api/products',{...data,_id});
        } catch (error) {
          console.error('Axios error:', error);
        }
    }else{
        //create
        try {
          await axios.post('/api/products', data);
         
        } catch (error) {
          console.error('Axios error:', error);
        }
      }
    setGotoProducts(true);
    }
    if (gotoProducts) {
        router.push('/products');
    }

    async function uploadimages(ev){
        const files = ev.target?.files;
        if(files?.length > 0){
            setIsuploading(true);
            const data = new FormData();
            for(const file of files){
            data.append('file',file);  
            }
          const res =  await axios.post('/api/upload',data);
          setImages(oldImages => {
            return [...oldImages,...res.data.links];
          });
          setIsuploading(false);
        }
    }
    function setProductProp(propName ,propValues){
      setProductproperties(prev => {
        const newProductProps = {...prev};
        newProductProps[propName] = propValues;
        return newProductProps;
      })



    }


    const propertiestofill = [];
    if(categories.length>0 && selectedCategory){
     let CatInfo = categories.find(({_id}) => _id === selectedCategory)
     propertiestofill.push(...CatInfo.properties);
     while(CatInfo?.parent?._id){
      const parentCat = categories.find(({_id}) => _id === CatInfo?.parent?._id)
      propertiestofill.push(...parentCat.properties)
      CatInfo = parentCat;
     }
    }

  return (
      <form onSubmit={Saveproduct} >
        <label>Product Name</label>
        <input
          type="text"
          placeholder="Product Name"
          value={title}
          onChange={(ev) => setTitle(ev.target.value)}
        />
       <label>Category</label>
      <select
        value={selectedCategory}
        onChange={(ev) => setSelectedCategory(ev.target.value)}
      >
        <option value=''>Uncategorzied</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option >
          ))}
      </select>
      {categories.length >0  && propertiestofill.map(p=>
        (
          <div className="flex gap-1">
            <div> 
              {p.name}
            </div>
            <select value={productproperties[p.name]} 
            onChange={(ev)=> setProductProp(p.name,ev.target.value)}>
              {p.values.map(v => (
              <option value={v}>{v}</option>
            ))}
            </select>
          </div>
        ))}
        <label>
            Photos 
        </label>
        <div className="mb=2 flex flex-wrap gap-2 ">
             {!!images?.length && images.map(link => (
                <div key={link} className=' h-24 '>
                    <img className='rounded-lg' src={link} alt='' />
                </div>
                )
                )}
                {isuploading && (
                    <div  className="h-24  flex items-center ">
                        <FadeLoader className=' item-justify items-center' color="#9fa5ab" radius='1' />
                         </div>
                )}
            <label className="  w-24 h-24 cursor-pointer border bg-gray-200 flex flex-col items-center text-center justify-center text-gray-500 rounded-lg " >
            <svg  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
             </svg>
                upload  
                <input type="file" onChange={uploadimages} className="hidden" />
             </label>
        </div>
        <label>Description</label>
        <textarea
          type="text"
          placeholder="Description"
          value={description}
          onChange={(ev) => setDescription(ev.target.value)}
        />
        <label>Price</label>
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(ev) => setPrice(ev.target.value)}
        />
        <button className="btn-primary" type="submit">
          Save
        </button>
      </form>
  );

  }

