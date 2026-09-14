import axios from 'axios';
import React, { useState, useEffect } from 'react';
import OrderLineDashboard from './OrderLineDashboard';
import DashBoard from './App/Container/DashBoard/DashBoard';
import OrderCreationScreen from "./App/Container/OrderPlacing/OrderCreationScreen"
import {io} from 'socket.io-client';
import { AlertCircle, MessageSquare, } from 'lucide-react';
const SERVER_URL = 'localhost:8080';
import './AlertPannel.css';

function ItemRow({ item }) {
  return (
    <div className="py-3">
      <div className="flex items-start justify-between">
        <span className="text-sm font-semibold text-gray-900">
          {item.quantity}x {item.name}
        </span>
        <span className="text-sm font-semibold text-gray-900">{item.price / 100}</span>
      </div>
      {item.options?.map((m, i) => (
        <div key={i} className="pl-4 mt-1 text-gray-500 flex items-start justify-between">
          <span className="text-sm font-semibold">
            {m.quantity}x {m.name}
          </span>
          <span className="text-sm font-semibold">{m.price / 100}</span>
        </div>
      ))}
      {item.notes && (
        <div className="mt-1.5 flex items-center gap-1.5 pl-4">
          <MessageSquare className="h-3.5 w-3.5 text-blue-500" />
          <span className="text-xs font-medium text-blue-600">{item.notes}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [count, setCount] = useState(0);
  const [status, setStatus] = useState('connecting...');
  const [isOpen, setIsOpen] = useState(false);
  const [order, setOrder] = useState(null);
  const [orderId, setOrderId] = useState(null);
  // const [order, setOrder] = useState({
  //   customer: {
  //     id: "94281520157",
  //     name: "***************** ",
  //     phone: "07533 006 408",
  //     email: "customer@email.hidden",
  //     address: "**********************************************",
  //     notes: "",
  //     postcode: "******",
  //     note: "",
  //   },
  //   store_details: {
  //     name: "Amigos Burgers, Shakes & Quesadillas",
  //     post_code: "",
  //     address: "41-43 High Street",
  //     phone_number: "+441144701375",
  //     town: "",
  //     latitude: 53.38322067260742,
  //     longitude: -1.466768741607666,
  //     city: "Sheffield",
  //   },
  //   delivery: {
  //     delivery_fee: 0,
  //     delivery_notes: "",
  //     line1: "**********************************************",
  //     line2: "******",
  //     city: "******",
  //     postcode: "******",
  //     contact_number: "07533 006 408",
  //     contact_access_code: "152071980",
  //     deliver_by: "Order f7uxqfqxlksn1leavu876q",
  //     customer_name: "",
  //     latitude: 51.506263732910156,
  //     longitude: 51.506263732910156,
  //   },
  //   _id: "6a95de0f4c146880c06cac18",
  //   id: "6a95de0f4c146880c06cac18",
  //   token_id: "D6663",
  //   store_id: "e8ed9906-7a92-4d40-9306-fedd6ddbe95c",
  //   external_store_id: "j21",
  //   display_id: "D9372",
  //   source: "justeat",
  //   rid: "100001",
  //   menu_id: "",
  //   industry_id: "2",
  //   external_source_id: "f7uxqfqxlksn1leavu876q",
  //   status: "accepted",
  //   status_thirdparty: "accepted_thirdparty",
  //   service_type: "delivery",
  //   service_type_ref: "delivery-partner",
  //   notes: "",
  //   currency: "GBP",
  //   expected_time: "2026-09-02 20:21:33",
  //   order_date: "2026-08-31 21:03:20",
  //   items: [
  //     {
  //       id: "240810",
  //       name: "Quarter Chicken On Its Own",
  //       price: 699,
  //       unit_price: 699,
  //       quantity: 1,
  //       notes: "Do it extra crispy",
  //       options: [
  //         {
  //           option_list_name: "",
  //           name: "Leg",
  //           id: "361145",
  //           price: 0,
  //           unit_price: 0,
  //           quantity: 1,
  //           _id: "6a95de0f4c146880c06cac1a",
  //         },
  //         {
  //           option_list_name: "",
  //           name: "Lemon & herb",
  //           id: "474958",
  //           price: 0,
  //           unit_price: 0,
  //           quantity: 1,
  //           _id: "6a95de0f4c146880c06cac1b",
  //         },
  //         {
  //           option_list_name: "",
  //           name: "Lemon & herb",
  //           id: "474958",
  //           price: 0,
  //           unit_price: 0,
  //           quantity: 1,
  //           _id: "6a95de0f4c146880c06cac1c",
  //         },
  //       ],
  //       _id: "6a95de0f4c146880c06cac19",
  //     },
  //     {
  //       id: "312121",
  //       name: "Original Chick Burger Meal",
  //       price: 1299,
  //       unit_price: 1299,
  //       quantity: 1,
  //       notes: "",
  //       options: [
  //         {
  //           option_list_name: "",
  //           name: "Lemon & Herb",
  //           id: "458211",
  //           price: 0,
  //           unit_price: 0,
  //           quantity: 1,
  //           _id: "6a95de0f4c146880c06cac1e",
  //         },
  //         {
  //           option_list_name: "",
  //           name: "Lemon & Herb",
  //           id: "458211",
  //           price: 0,
  //           unit_price: 0,
  //           quantity: 1,
  //           _id: "6a95de0f4c146880c06cac1f",
  //         },
  //         {
  //           option_list_name: "",
  //           name: "Boring Fries",
  //           id: "477081",
  //           price: 0,
  //           unit_price: 0,
  //           quantity: 1,
  //           _id: "6a95de0f4c146880c06cac20",
  //         },
  //         {
  //           option_list_name: "",
  //           name: "Shake It! : Chocolate Shake",
  //           id: "361722",
  //           price: 399,
  //           unit_price: 399,
  //           quantity: 1,
  //           _id: "6a95de0f4c146880c06cac21",
  //         },
  //       ],
  //       _id: "6a95de0f4c146880c06cac1d",
  //     },
  //   ],
  //   promotions: [
  //     {
  //       name: "PERCENTAGE_DISCOUNT",
  //       type: "PERCENTAGE_DISCOUNT",
  //       id: "AmigosBurgersShakesQ_24Jul2026_R5W2qdNH0mSRjrSAY2tQ",
  //       amount: 479,
  //       items: [],
  //       _id: "6a95de0f4c146880c06cac22",
  //     },
  //   ],
  //   charges: [
  //     {
  //       name: "DELIVERY_FEE",
  //       reason: "DELIVERY_FEE",
  //       amount: 139,
  //       _id: "6a95de0f4c146880c06cac23",
  //     },
  //     {
  //       name: "SERVICE_FEE",
  //       reason: "SERVICE_FEE",
  //       amount: 263,
  //       _id: "6a95de0f4c146880c06cac24",
  //     },
  //   ],
  //   payments: [
  //     {
  //       info: {
  //         email: "",
  //       },
  //       name: "card",
  //       id: "card",
  //       amount: 2320,
  //       _id: "6a95de0f4c146880c06cac25",
  //     },
  //   ],
  //   cart_total: 2397,
  //   item_total: 1998,
  //   subitem_total: 399,
  //   total_price: 2320,
  //   tax_amount: 0,
  //   discount_total: 479,
  //   charge_total: 402,
  //   tips: 0,
  //   additional_store: "",
  //   order_source: "piper",
  //   payment_status: "paid",
  //   kitchen_notes: "",
  //   due_amount: 0,
  //   loyalty_operations: [],
  //   __v: 0,
  // });
  useEffect(() => {
    const socket = io(SERVER_URL, {
        transports: ['websocket'],
    });
    const myUserId = 'user_abc_1234';
    socket.on('connect', () => {
        setStatus('connected!');
        console.log('socket id:', socket.id);
        socket.emit('register-user', myUserId);
    });
    socket.on('notification-received', (data) => {
        console.log('new notification:', data);
        if(data && data.title === 'new_order') {
          //new Audio('/notification.mp3').play();
          setIsOpen(true);
          setOrderId(data.message);
          console.log(data.message)
          setTimeout(()=>console.log(orderId), 3000);
            //fetchOrder(data.orderId);
        }
    });
    socket.on('disconnect', () => {
        setStatus('disconnected!');
    });
    return () => {
        socket.disconnect();
    };
  }, []);

  const fetchOrder = async () => {
    try {
      console.log(orderId);
      const response = await axios.get(`http://localhost:8080/api/v1/order/${orderId}`);
      console.log('Fetched order:', response.data);
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    }
  };

  const AcceptOrder = async (orderId) => {
    try {
      const response = await axios.post(`http://localhost:8080/api/v1/order/${orderId}/accept`);
      console.log('Order accepted:', response.data);
      setOrderId(null);
      setIsOpen(false);
    } catch (error) {
      console.error('Error accepting order:', error);
    }
  };

  return (
    <div >
      {/* <AlertCircle className="h-5 w-5 text-gray-700" /> */}
      {/* <DashBoard /> */}
      {/* <button onClick={() => setIsOpen(true)}>Open Alert</button> */}

      <div className={`overlay ${isOpen ? 'show' : ''}`} onClick={() => setIsOpen(false)} />

      <div className={`alert-panel ${isOpen ? 'open justify-center text-center content-center' : ''}`}>
        {order && isOpen && <> <div className="mt-2 divide-y divide-gray-100">
          {order?.items.map((item, i) => (
            <ItemRow key={i} item={item} />
          ))}
        </div>
        <div className="mt-2 flex items-center justify-between border-t border-gray-100 pt-3">
          <span className="text-sm font-bold uppercase tracking-wide text-gray-900">Total</span>
          <span className="text-sm font-bold text-gray-900">{order.total_price / 100}</span>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-bold uppercase tracking-wide text-gray-900">Payment</span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
            {order.payment_status}
          </span>
        </div>
        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm text-gray-500">Paid</span>
          <span className="text-sm font-medium text-gray-700">{order.total_price / 100}</span>
        </div>
        </>
        }
        {
          !order && isOpen ?
           <button className='bg-emerald-600 text-white px-4 py-2 rounded' onClick={() => fetchOrder()}> New Order </button> : 
          <button className='bg-emerald-600 text-white px-4 py-2 rounded' onClick={() => AcceptOrder(orderId)}> Accept Order </button>
        }
        {/* <button onClick={() => setIsOpen(false)}>Close</button> */}
      </div>
        <OrderCreationScreen/>
      <OrderLineDashboard/>
    </div>
  );
}
