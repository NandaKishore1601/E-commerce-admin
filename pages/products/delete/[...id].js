import Layout from "@/components/layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default function Deleteproduct(){

    const router = useRouter();
    const [productdata,setproductdata]=useState('')

    const {id}= router.query;
    useEffect(()=>{
        if(!id){
            return;
        }
        axios.get('/api/products?id='+id).then(response => {
           setproductdata(response.data);
        })
    },[id]
    );
    function goback(){
        router.push('/products');
    }
   async function Delete(){
    try {
        await axios.delete('/api/products/?id='+id);
      } catch (error) {
        console.error('Axios error:', error);
      }
      goback();
    }
    return (
        <Layout>
            <div className="text-center ">
            <h1>Do you really wanna delete "{productdata.title}" ?</h1>
            <button className='bg-green-500 py-1 px-6 rounded-md text-white mr-2 ' onClick={Delete}>yes</button>
            <button className='bg-red-500 py-1 px-6 rounded-md text-white ' onClick={goback}>no</button>
            </div>
        </Layout>
    )
}