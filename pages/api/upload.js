import multiparty from 'multiparty';
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import fs from 'fs';
import mime from 'mime-types';
const bucketname = 'nanda-ecommerce'

export default async function handle(req,res){
  const form = new  multiparty.Form();
  const {fields,files} = await new Promise((resolve,reject)=>{
    form.parse(req,(error,fields,files)=>{
      if(error) reject(error);
       resolve({fields,files});
  });
  });
  
  const client = new S3Client({
    region:'eu-north-1',
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRECT_ACCESS_KEY,
    },
  });
  const links = [];
  for(const file of files.file){
    const ext = file.originalFilename.split('.').pop();
    console.log(ext);
    const newfilename = Date.now()+'.'+ext;
    await client.send(new PutObjectCommand({
    Bucket : bucketname,
    Key: newfilename,
    Body: fs.readFileSync(file.path),
    ACL:'public-read',
    ContentType: mime.lookup(file.path),

  }));
  const link = `https://${bucketname}.s3.amazonaws.com/${newfilename}`;
  links.push(link); 
}
  return res.json({links});
}
export const config = {
    api: {bodyParser : false}
}
