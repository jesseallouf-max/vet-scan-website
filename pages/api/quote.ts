import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import fetch from 'cross-fetch'
import nodemailer from 'nodemailer'
const schema=z.object({clinicName:z.string().min(1),contactName:z.string().min(1),role:z.string().min(1),email:z.string().email(),phone:z.string().optional().nullable(),service:z.string().min(1),notes:z.string().optional().nullable(),vetOnly:z.any()})
export default async function handler(req:NextApiRequest,res:NextApiResponse){
  if(req.method!=='POST') return res.status(405).json({error:'Method not allowed'})
  try{
    const data=schema.parse(req.body)
    const {SMTP_HOST,SMTP_USER,SMTP_PASS,SMTP_PORT,CONTACT_TO,HUBSPOT_TOKEN}=process.env
    const toEmail=CONTACT_TO||'vetscannyc@gmail.com'
    if(SMTP_HOST&&SMTP_USER&&SMTP_PASS){
      const transporter=nodemailer.createTransport({host:SMTP_HOST,port:Number(SMTP_PORT||587),secure:false,auth:{user:SMTP_USER,pass:SMTP_PASS}})
      await transporter.sendMail({from:'"Vet Scan NYC" <no-reply@vetscannyc.com>',to:toEmail,subject:`New Quote Request — ${data.clinicName}`,text:JSON.stringify(data,null,2)})
    } else {
      console.log('Email (no SMTP configured):', data)
    }
    if(HUBSPOT_TOKEN){
      const hs={'Content-Type':'application/json','Authorization':`Bearer ${HUBSPOT_TOKEN}`}
      await fetch('https://api.hubapi.com/crm/v3/objects/contacts?hapikey=',{method:'POST',headers:hs,body:JSON.stringify({properties:{email:data.email,firstname:data.contactName,phone:data.phone||'',company:data.clinicName,jobtitle:data.role}})})
      await fetch('https://api.hubapi.com/crm/v3/objects/notes',{method:'POST',headers:hs,body:JSON.stringify({properties:{hs_note_body:`Service: ${data.service}\nClinic: ${data.clinicName}\nContact: ${data.contactName} (${data.role})\nPhone: ${data.phone||''}\nNotes: ${data.notes||''}`}})})
    }
    return res.status(200).json({ok:true})
  }catch(err:any){console.error(err);return res.status(400).json({error:err.message||'Invalid request'})}
}
