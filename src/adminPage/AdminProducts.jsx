import axios from "axios";
import { useEffect, useRef, useState } from "react";
import * as bootstrap from 'bootstrap';

const api_base = import.meta.env.VITE_BASE_URL;
const api_url = import.meta.env.VITE_API_PATH;

import ReactLoading from "react-loading";
import ProductModal from '../components/ProductModal'
import Pagination from '../components/Pagination'
import { useDispatch } from "react-redux";
import { pushMessage } from "../redux/toastSlice";

export default function AdminProducts() {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const [adminProducts, setAdminProducts] = useState([]);

  const productModalRef = useRef(null);
  
  const [modalType,setModalType] = useState('');

  const [pageInfo, setPageInfo] = useState({});

  const [selectedProduct,setSelectedProduct] = useState({
    id: "",
    imageUrl: "",
    title: "",
    category: "",
    num:"",
    unit: "",
    originPrice: "",
    price: "",
    description: "",
    content: "",
    isEnabled: false,
    imagesUrl: [''],
  });


  const openModal = (product,type) => {
    setSelectedProduct({
      id: product.id || "",
      imageUrl: product.imageUrl || "",
      title: product.title || "",
      category: product.category || "",
      num: product.num || "",
      unit: product.unit || "",
      originPrice: product.origin_price || "",
      price: product.price || "",
      description: product.description || "",
      content: product.content || "",
      isEnabled: product.isEnabled || false,
      imagesUrl: product.imagesUrl || [''],
    });
    productModalRef.current.show();
    setModalType(type);
  }

  const closeModal = () => {
    productModalRef.current.hide();
  };

  useEffect(()=>{
    productModalRef.current = new bootstrap.Modal("#productModal", {
      keyboard: false,
    });  
  },[])

  const handleModalInputChange = (e)=>{
    const { id, value, type, checked } = e.target;
    setSelectedProduct((prevData)=>({
      ...prevData,
      [id]: type === 'checkbox' ? checked : value
    }))
  }

  const handleImageChange = (index,value) =>{
  
    setSelectedProduct((prevData)=>{

      const newImages = [...prevData.imagesUrl];
      newImages[index]=value;
      if (
        value !== "" &&
        index === newImages.length - 1 &&
        newImages.length < 5
      ) {
        newImages.push("");
      }

      if (newImages.length > 1 && newImages[newImages.length - 1] === "") {
        newImages.pop();
      }

      return { ...prevData, imagesUrl: newImages };
      
    })
  }

  const handleAddImage = ()=>{
    setSelectedProduct((prevData)=>({
      ...prevData,
      imagesUrl:[...prevData.imagesUrl,'']
    }));
  }

  const handleRemoveImage = ()=>{
    setSelectedProduct((prevData)=>{
      const newImages = [...prevData.imagesUrl];
      newImages.pop();
      return {...prevData,imagesUrl: newImages}
    });
  }

  const deleteProduct = async (id)=>{
    try {
      const res = await axios.delete(`${api_base}/api/${api_url}/admin/product/${id}`);
      dispatch(pushMessage({
        text:'刪除產品成功',
        status:'success'
      }))
      getAdminProducts();
    } catch (error) {
      alert(error.response.data.message);
      dispatch(pushMessage({
        text:'刪除產品失敗',
        status:'failed'
      }))
    }
    closeModal();
  }

  const updateProduct = async (id)=>{

    const productData = {
      data:{
        ...selectedProduct,
        origin_price: Number(selectedProduct.originPrice),
        price: Number(selectedProduct.price),
        is_enabled: selectedProduct.isEnabled ? 1 : 0,
        imagesUrl: selectedProduct.imagesUrl,
      },
    };

    try {
      if(modalType === 'edit'){
        const res = await axios.put(`${api_base}/api/${api_url}/admin/product/${id}`,productData);
        dispatch(pushMessage({
          text:'更新產品成功',
          status:'success'
        }))
      }else{
        const res = await axios.post(`${api_base}/api/${api_url}/admin/product`,productData);
        dispatch(pushMessage({
          text:'新增產品成功',
          status:'success'
        }))
      }
      getAdminProducts();
    } catch (error) {
      if(modalType === 'edit'){
        dispatch(pushMessage({
          text:'更新產品失敗',
          status:'failed'
        }))
      }else{
        dispatch(pushMessage({
          text:'新增產品失敗',
          status:'failed'
        }))
      }
    }
    closeModal();
  }

  const handleFileChange = async(e) =>{
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append('file-to-upload',file);

    try {
        const res = await axios.post(`${api_base}/api/${api_url}/admin/upload`,
        formData);
        const uploadImageUrl = res.data.imageUrl;
        
        setSelectedProduct({
        ...selectedProduct,
        imageUrl: uploadImageUrl
        });

        dispatch(pushMessage({
          text:'上傳圖片成功',
          status:'success'
        }))

    } catch (error) {
        dispatch(pushMessage({
          text:'上傳圖片失敗',
          status:'failed'
        }))
    }
  }


  const getAdminProducts = async (page=1) => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${api_base}/api/${api_url}/admin/products?page=${page}`);
        setAdminProducts(Object.values(res.data.products));
        setPageInfo(res.data.pagination);
    } catch (error) {
        dispatch(pushMessage({
          text:'取得資料失敗',
          status:'failed'
        }))
    } finally {
        setIsLoading(false);
    }
  };

  const handlePageChange = (e,page)=>{
    e.preventDefault();
    getAdminProducts(page);
  }

  useEffect(() => {
    getAdminProducts();
  }, []);

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
        <div className='container'>
            <h2 className='text-start'>產品清單</h2>
            <div className='text-end'>
              <button className='btn btn-warning' type='button' onClick={()=>openModal({},"add")}>
                新增產品
              </button>
            </div>
            <table className='table'>
              <thead>
                <tr>
                  <th>產品名稱</th>
                  <th>分類</th>
                  <th>原價</th>
                  <th>售價</th>
                  <th>數量</th>
                  <th>單位</th>
                  <th>是否啟用</th>
                  <th>編輯</th>
                </tr>
              </thead>
              <tbody>
                {adminProducts.map((product)=>{
                  return (
                    <tr key={product.id}>
                      <td>{product.title}</td>
                      <td>{product.category}</td>
                      <td>{product.origin_price}/元</td>
                      <td>{product.price}/元</td>
                      <td>{product.num}</td>
                      <td>{product.unit}</td>
                      <td>{product.is_enabled?'已啟用':'未啟用'}</td>
                      <td>
                        <div className='btn-group'>
                          <button type='button' className='btn btn-warning btn-sm' onClick={()=>openModal(product,'edit')}>編輯</button>
                          <button type='button' className='btn btn-danger btn-sm' onClick={()=>openModal(product,'delete')}>刪除</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            <Pagination pageInfo={pageInfo} handlePageChange={handlePageChange} />
        </div>
      )}
      <ProductModal 
        closeModal={closeModal} 
        handleModalInputChange={handleModalInputChange} 
        handleImageChange={handleImageChange}
        handleAddImage={handleAddImage}
        handleRemoveImage={handleRemoveImage}
        deleteProduct={deleteProduct}
        updateProduct={updateProduct}
        handleFileChange={handleFileChange}
        selectedProduct={selectedProduct}
        modalType={modalType}
        productModalRef={productModalRef}
        />
    </>
  );
}
