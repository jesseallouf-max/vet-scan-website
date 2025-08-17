/** @type {import('tailwindcss').Config} */
module.exports={content:["./pages/**/*.{js,ts,jsx,tsx}","./components/**/*.{js,ts,jsx,tsx}"],
theme:{extend:{
  fontFamily:{sans:['"Inter"','ui-sans-serif','system-ui','sans-serif']},
  colors:{
    brand:{primary:'#146C60', secondary:'#F6A355', ink:'#0b1220'},
    surface:'#ffffff', backdrop:'#F8FAFC'
  },
  boxShadow:{ soft:'0 10px 30px rgba(0,0,0,.08)' },
  borderRadius:{ '2xl':'1rem','3xl':'1.5rem' }
}},
plugins:[]}
