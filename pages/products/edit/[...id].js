import Layout from "@/components/layout";
import Productform from "@/components/productsform";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Edit(){
    const [Productinfo,setProductinfo]= useState(null);

    const router = useRouter();
    const {id} = router.query;

    useEffect(() => {
        if(!id){
            return;
        }
        axios.get('/api/products/?id='+id).then((response) => {
          setProductinfo(response.data);
        });
      },[id]);
    return(
        <Layout>
            <h1>Edit ProductDetails</h1>
          {Productinfo && (<Productform {...Productinfo}/>)}
        </Layout>
    )
}