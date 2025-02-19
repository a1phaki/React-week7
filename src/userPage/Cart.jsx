import axios from "axios";
import { useEffect, useState } from "react";
import ReactLoading from "react-loading";
import { useForm } from 'react-hook-form';
import validate from "validate.js";

const api_base = import.meta.env.VITE_BASE_URL;
const api_url = import.meta.env.VITE_API_PATH;

export default function Cart() {
  const [isLoading, setIsLoading] = useState(false);
  const [carts, setCarts] = useState([]);

  const {register ,handleSubmit ,formState: { errors },reset} = useForm();

  const getCart = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${api_base}/api/${api_url}/cart`);
      setCarts(res.data.data.carts);
    } catch (error) {
      alert(error.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const validateForm = (data) => {
    const validationErrors = validate(data);
    return validationErrors || {};
  };




  const onSubmit = async(data) =>{
    const validationErrors = validateForm(data);
    if(Object.keys(validationErrors).length === 0){
      try {
        const res = await axios.post(`${api_base}/api/${api_url}/order`,
          {
            data:{
              user:data,
              message:data.message
            }
          }
        );
        reset();
        getCart();
      } catch (error) {
        alert(error.response.data.message);
      }
    }
  }

  return (
    <>
      {isLoading ? (
        <div className="loading-overlay">
          <ReactLoading
            type="spokes"
            color="#ffc107"
            height={100}
            width={100}
          />
        </div>
      ) : (
        <div className="container">
          <table className="table">
            <thead>
              <tr>
                <th scope="col" width="33%">
                  品名
                </th>
                <th scope="col" width="33%">
                  數量/單位
                </th>
                <th scope="col" width="33%">
                  單價
                </th>
              </tr>
            </thead>
            <tbody>
              {carts.map((item) => (
                <tr key={item.id}>
                  <td>{item.product.title}</td>
                  <td>
                    {item.qty}/{item.product.unit}
                  </td>
                  <td>{item.product.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <form onSubmit={handleSubmit(onSubmit)}>
              <div className="py-3 row">
                <label htmlFor="name" className="col-sm-3 col-form-label">收件人姓名</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control" id="name"  placeholder='請輸入姓名' 
                  {...register("name",{
                    required:'姓名為必填'
                  })}
                  />
                  <div className='mt-2 text-danger'>
                    {errors.name?errors.name.message:''}
                  </div>
                </div>
              </div>
              <div className="py-3 row">
                <label htmlFor="email" className="col-sm-3 col-form-label">Email</label>
                <div className="col-sm-9">
                  <input type="email" className="form-control" id="email" placeholder='請輸入Email'
                  {...register("email",{
                    required:'Email為必填',
                    pattern:{
                      value:/^[a-zA-Z0-9._]{5,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                      message:'請輸入有效email格式'
                    },
                  })}
                  />
                  <div className='mt-2 text-danger'>
                    {errors.email?errors.email.message:''}
                  </div>
                </div>
              </div>
              <div className="py-3 row">
                <label htmlFor="tel" className="col-sm-3 col-form-label">收件人電話</label>
                <div className="col-sm-9">
                  <input type="tel" className="form-control" id="tel" placeholder='請輸入電話' 
                  {...register("tel",{
                    required:'電話為必填',
                    pattern:{
                      value:/^\d{8,}$/,
                      message:'請輸入有效電話格式'
                    }
                  })}
                  />
                   <div className='mt-2 text-danger'>
                    {errors.tel?errors.tel.message:''}
                  </div>
                </div>
              </div>
              <div className="py-3 row">
                <label htmlFor="address" className="col-sm-3 col-form-label">收件人地址</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control" id="address" placeholder='請輸入地址'
                  {...register("address",{
                    required:'地址為必填',
                  })}
                  />
                  <div className='mt-2 text-danger'>
                    {errors.address?errors.address.message:''}
                  </div>
                </div>
              </div>
              <div className="row py-3">
                <label htmlFor="message" className="col-sm-3 col-form-label">留言</label>
                <div className="col-sm-9">
                  <textarea  rows='3' className="form-control" id="message" placeholder='請輸入留言'
                  {...register("message")}
                  />
                </div>
              </div>
              <div className="py-3 text-center">
                <button type='submit' className='btn btn-warning btn-lg'>
                  送出訂單
                </button>
              </div>
            </form>
        </div>
      )}
    </>
  );
}
