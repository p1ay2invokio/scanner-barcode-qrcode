'use client'

import { useState } from 'react';
import Html5QrcodePlugin from './scanner'
import axios from 'axios';

const App = (props) => {

  let [modal, setModal] = useState(false)
  let [found, setFound] = useState(false)

  let [product, setProduct] = useState([])
  let [qtyup, setQtyUp] = useState(null)

  const onNewScanResult = (decodedText, decodedResult) => {
    // handle decoded results here
    console.log(decodedText)
    console.log("Found")
    setFound(true)
    axios.get(`http://localhost:3001/api/product/${decodedText}`).then((res) => {
      console.log(res.data)
      setProduct(res.data)
      setModal(true)
      setQtyUp(res.data[0].qty)
    })
  };

  const updateProduct = (barcode, qty) => {
    axios.patch('http://localhost:3001/api/update_quantity', {
      barcode: barcode,
      qty: qty
    }).then((res) => {
      console.log(res.data)
    })
  }

  return (
    <div>
      <div>
        <Html5QrcodePlugin
          qrCodeSuccessCallback={onNewScanResult}
        />
      </div>

      {modal ? <div className='w-full h-full bg-black/80 fixed left-0 top-0 flex justify-center items-center'>
        <div className='w-[300px] text-black h-[300px] bg-white flex justify-center items-center flex-col gap-[10px]'>
          <div className='flex flex-col justify-center items-center'>
            <p>{product[0].barcode}</p>
            <p>{product[0].name}</p>
          </div>
          <input value={qtyup} onChange={(e) => {
            setQtyUp(e.target.value)
          }} className='border-[1px] border-black'></input>
          <button onClick={() => {
            setModal(false)
            updateProduct(product[0].barcode, Number(qtyup))
          }} className='w-[90%] h-[50px] bg-blue-400 text-white'>อัพเดท</button>
        </div>
      </div> : null}
    </div>
  );
};

export default App