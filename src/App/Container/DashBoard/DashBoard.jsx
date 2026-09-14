import axios from "axios";
import moment from "moment";
import React, { useState, useEffect } from "react";
import justeat from "./../../../assets/justeat.png";
import ubereats from "./../../../assets/ubereats.png";
import deliveroo from "./../../../assets/deliveroo.png";
import {
  Search,
  LayoutGrid,
  List,
  Settings,
  X,
  MapPin,
  Printer,
  Phone,
  Lock,
  Bike,
  MessageSquare,
  CheckCircle2,
  ChevronDown,
  UtensilsCrossed,
  Store,
  Bell,
} from "lucide-react";

// ----------------------------------------------------------------------------
// Mock data — one full "detail" object per queue order so any card can be
// selected and the middle/right panels update to match it.
// ----------------------------------------------------------------------------

const STATUS_STYLES = {
  "in delivery": { bar: "bg-amber-500", text: "text-white", pill: "bg-amber-500" },
  accepted: { bar: "bg-blue-600", text: "text-white", pill: "bg-blue-600" },
  new: { bar: "bg-emerald-500", text: "text-white", pill: "bg-emerald-500" },
  active: { bar: "bg-blue-500", text: "text-white", pill: "bg-blue-500" },
  completed: { bar: "bg-green-600", text: "text-white", pill: "bg-green-600" },
  rejected: { bar: "bg-red-600", text: "text-white", pill: "bg-red-600" },
};

// ----------------------------------------------------------------------------
// Small building blocks
// ----------------------------------------------------------------------------

const ORDERS = [
  {
    customer: {
      id: "94281520157",
      name: "***************** ",
      phone: "07533 006 408",
      email: "customer@email.hidden",
      address: "**********************************************",
      notes: "",
      postcode: "******",
      note: "",
    },
    store_details: {
      name: "Amigos Burgers, Shakes & Quesadillas",
      post_code: "",
      address: "41-43 High Street",
      phone_number: "+441144701375",
      town: "",
      latitude: 53.38322067260742,
      longitude: -1.466768741607666,
      city: "Sheffield",
    },
    delivery: {
      delivery_fee: 0,
      delivery_notes: "",
      line1: "**********************************************",
      line2: "******",
      city: "******",
      postcode: "******",
      contact_number: "07533 006 408",
      contact_access_code: "152071980",
      deliver_by: "Order f7uxqfqxlksn1leavu876q",
      customer_name: "",
      latitude: 51.506263732910156,
      longitude: 51.506263732910156,
    },
    _id: "6a95de0f4c146880c06cac18",
    id: "6a95de0f4c146880c06cac18",
    token_id: "D6663",
    store_id: "e8ed9906-7a92-4d40-9306-fedd6ddbe95c",
    external_store_id: "j21",
    display_id: "D9372",
    source: "justeat",
    rid: "100001",
    menu_id: "",
    industry_id: "2",
    external_source_id: "f7uxqfqxlksn1leavu876q",
    status: "accepted",
    status_thirdparty: "accepted_thirdparty",
    service_type: "delivery",
    service_type_ref: "delivery-partner",
    notes: "",
    currency: "GBP",
    expected_time: "2026-09-02 20:21:33",
    order_date: "2026-08-31 21:03:20",
    items: [
      {
        id: "240810",
        name: "Quarter Chicken On Its Own",
        price: 699,
        unit_price: 699,
        quantity: 1,
        notes: "Do it extra crispy",
        options: [
          {
            option_list_name: "",
            name: "Leg",
            id: "361145",
            price: 0,
            unit_price: 0,
            quantity: 1,
            _id: "6a95de0f4c146880c06cac1a",
          },
          {
            option_list_name: "",
            name: "Lemon & herb",
            id: "474958",
            price: 0,
            unit_price: 0,
            quantity: 1,
            _id: "6a95de0f4c146880c06cac1b",
          },
          {
            option_list_name: "",
            name: "Lemon & herb",
            id: "474958",
            price: 0,
            unit_price: 0,
            quantity: 1,
            _id: "6a95de0f4c146880c06cac1c",
          },
        ],
        _id: "6a95de0f4c146880c06cac19",
      },
      {
        id: "312121",
        name: "Original Chick Burger Meal",
        price: 1299,
        unit_price: 1299,
        quantity: 1,
        notes: "",
        options: [
          {
            option_list_name: "",
            name: "Lemon & Herb",
            id: "458211",
            price: 0,
            unit_price: 0,
            quantity: 1,
            _id: "6a95de0f4c146880c06cac1e",
          },
          {
            option_list_name: "",
            name: "Lemon & Herb",
            id: "458211",
            price: 0,
            unit_price: 0,
            quantity: 1,
            _id: "6a95de0f4c146880c06cac1f",
          },
          {
            option_list_name: "",
            name: "Boring Fries",
            id: "477081",
            price: 0,
            unit_price: 0,
            quantity: 1,
            _id: "6a95de0f4c146880c06cac20",
          },
          {
            option_list_name: "",
            name: "Shake It! : Chocolate Shake",
            id: "361722",
            price: 399,
            unit_price: 399,
            quantity: 1,
            _id: "6a95de0f4c146880c06cac21",
          },
        ],
        _id: "6a95de0f4c146880c06cac1d",
      },
    ],
    promotions: [
      {
        name: "PERCENTAGE_DISCOUNT",
        type: "PERCENTAGE_DISCOUNT",
        id: "AmigosBurgersShakesQ_24Jul2026_R5W2qdNH0mSRjrSAY2tQ",
        amount: 479,
        items: [],
        _id: "6a95de0f4c146880c06cac22",
      },
    ],
    charges: [
      {
        name: "DELIVERY_FEE",
        reason: "DELIVERY_FEE",
        amount: 139,
        _id: "6a95de0f4c146880c06cac23",
      },
      {
        name: "SERVICE_FEE",
        reason: "SERVICE_FEE",
        amount: 263,
        _id: "6a95de0f4c146880c06cac24",
      },
    ],
    payments: [
      {
        info: {
          email: "",
        },
        name: "card",
        id: "card",
        amount: 2320,
        _id: "6a95de0f4c146880c06cac25",
      },
    ],
    cart_total: 2397,
    item_total: 1998,
    subitem_total: 399,
    total_price: 2320,
    tax_amount: 0,
    discount_total: 479,
    charge_total: 402,
    tips: 0,
    additional_store: "",
    order_source: "piper",
    payment_status: "paid",
    kitchen_notes: "",
    due_amount: 0,
    loyalty_operations: [],
    __v: 0,
  },
];

function VehicleIcon({ vehicle, className }) {
  if (vehicle === "utensils") return <UtensilsCrossed className={className} />;
  return <Bike className={className} />;
}

function SourceMark({ source }) {
  if (source === "ubereats") {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm text-[9px] font-bold text-white">
        <img src={ubereats} className="h-6 w-6" />
      </span>
    );
  }
  if (source === "justeat") {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm text-[9px] font-bold text-white">
        <img src={justeat} className="h-6 w-6" />
      </span>
    );
  }
  if (source === "deliveroo") {
    return (
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-sm text-[9px] font-bold text-white">
        <img src={deliveroo} className="h-6 w-6" />
      </span>
    );
  }
  if (source === "phone") return <Phone className="h-4 w-4 text-gray-500" />;
  if (source === "dineIn") return <UtensilsCrossed className="h-4 w-4 text-gray-500" />;
  return <Store className="h-4 w-4 text-gray-500" />;
}

// ----------------------------------------------------------------------------
// Top bar
// ----------------------------------------------------------------------------

function TopBar() {
  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="flex items-center justify-between px-5 py-3">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-500">
              <div className="h-3 w-3 rounded-sm bg-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">
              ORDER<span className="text-emerald-500">Line</span>
            </span>
          </div>

          <nav className="flex items-center gap-6">
            <div className="flex items-center gap-2 border-b-2 border-gray-900 pb-3 -mb-3">
              <span className="text-sm font-semibold text-gray-900">Orders</span>
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-white">
                1
              </span>
            </div>
            <span className="text-sm font-medium text-gray-500">Inventory</span>
            <span className="text-sm font-medium text-gray-500">Hours</span>
          </nav>
        </div>

        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-semibold text-emerald-700">Taking orders</span>
          </div>
          <span className="text-sm font-medium text-gray-700">Pizza Bella Rennes (zy26w-5)</span>
          <Settings className="h-5 w-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Sub header (tabs + search + view toggle)
// ----------------------------------------------------------------------------

function SubHeader() {
    const placeOrder = async (source) => {
        console.log(`Placing order for source: ${source}`);
        let response = await axios.get(`https://order.cloud-valtapi.com/application/events/logs?page=1&limit=1&source=${source}&event_type=order.release`);
        let body = {}
        if(response.status === 200) {
            let event = response.data.body[0];
            if(event) body = event.request_body; 
            if(source === "deliveroo") body = body.body.order;
            console.log(`Response from order release:`, body);
        }
        if(body) {
            if(source === "justeat"){
                body.posLocationId = "j21";
                body.id = body.id+Math.floor(Math.random() * 12);
                body.third_party_order_reference = body.third_party_order_reference+Math.floor(Math.random() * 10);
                let data = await axios.post(`http://localhost:8080/api/v1/just-eat/create/order/webhook`, body);
            } else if(source === "deliveroo") {
                body.location_id = "d21";
                body.id = body.id+Math.floor(Math.random() * 12);
                body.display_id = body.display_id+Math.floor(Math.random() * 10);
                let data = await axios.post(`http://localhost:8080/api/v1/deliveroo/convert/piperorder`, body);
            } else if(source === "ubereats") { 
                body.store.id = "u21";
                body.id = body.id+Math.floor(Math.random() * 12);
                body.display_id = body.display_id+Math.floor(Math.random() * 10);
                let data = await axios.post(`http://localhost:8080/api/v1/uber-eats/convert/piperorder`, body);
            }
        }   
    //   axios.post(`http://localhost:8080/api/v1/order/place/${source}`, {
    //     rid: "100001",
    //   });
    };
    return (
    <div className="flex items-center justify-between border-b border-gray-200 bg-white px-5 py-2.5">
      <div className="flex items-center gap-6">
        <button className="cursor-pointer border-b-2 border-emerald-500 pb-2 -mb-2.5 text-sm font-semibold text-emerald-600">
          In progress · 1
        </button>
        <button className="text-sm font-medium text-gray-400">Upcoming · 0</button>
        <button className="text-sm font-medium text-gray-400">Finished</button>
        <button onClick={()=>placeOrder("justeat")} className="cursor-pointer border-b-2 border-emerald-500 pb-2 -mb-2.5 text-sm font-semibold text-emerald-600">
          Just Eat
        </button>
        <button onClick={()=>placeOrder("deliveroo")} className="cursor-pointer border-b-2 border-emerald-500 pb-2 -mb-2.5 text-sm font-semibold text-emerald-600">
          Deliveroo
        </button>
        <button onClick={()=>placeOrder("ubereats")} className="cursor-pointer border-b-2 border-emerald-500 pb-2 -mb-2.5 text-sm font-semibold text-emerald-600">
          Uber Eats
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-1.5">
          <Search className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-400">Search</span>
        </div>
        <div className="flex overflow-hidden rounded-md border border-gray-200">
          <button className="flex h-8 w-8 items-center justify-center bg-white">
            <LayoutGrid className="h-4 w-4 text-gray-400" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center bg-emerald-500">
            <List className="h-4 w-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Left column — order queue
// ----------------------------------------------------------------------------

function OrderCard({ order, isActive, onSelect }) {
  const style = STATUS_STYLES[order.status];

  return (
    <button
      onClick={() => onSelect(order.id)}
      className={`w-full overflow-hidden rounded-lg border text-left transition ${
        isActive ? "border-blue-600 ring-1 ring-blue-600" : "border-gray-200 hover:border-gray-300"
      } bg-white`}
    >
      <div className={`flex items-center justify-between px-3 py-2 ${style.bar}`}>
        <span className={`text-sm font-bold ${style.text}`}>
          {order.total_price / 100} {order.currency}
        </span>
        <span className={`text-xs font-bold tracking-wide ${style.text}`}>{order.status}</span>
      </div>
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <SourceMark source={order.source} />
          <span className="text-sm font-medium text-gray-700">{order.display_id}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <span>{moment(order.expected_time).format("HH:mm")}</span>
          <VehicleIcon vehicle={order.service_type ? "bike" : "utensils"} className="h-4 w-4" />
        </div>
      </div>
    </button>
  );
}

function QueueColumn({ orders, activeId, onSelect }) {
  return (
    <div >//className="w-64 shrink-0 overflow-y-auto border-r border-gray-200 bg-gray-50 p-3"
      <div className="grid grid-cols-4 gap-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} isActive={order.id === activeId} onSelect={onSelect} />
        ))}
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Middle column — order detail
// ----------------------------------------------------------------------------

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


// ----------------------------------------------------------------------------
// Main app
// ----------------------------------------------------------------------------

export default function OrderLineDashboard() {
  const [activeId, setActiveId] = useState("o3");
  const [orders, setOrders] = useState(ORDERS);
  const activeOrder = orders.find((o) => o.id === activeId) ?? orders[0];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/v1/order/?rid=100001");
      if (response.status !== 200) {
        throw new Error(`Failed to fetch orders: ${response.data.message}`);
      }
      const data = await response.data;
      setOrders(data.data);
      console.log("Fetched orders:", data.data);
    } catch (error) {
      //fs.writeFileSync('error.txt', `Error fetching orders: ${error}\n`, { flag: 'a' });
      setOrders();
      console.error("Error fetching orders:", error);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col bg-gray-50 font-sans text-gray-900">
      <TopBar />
      <SubHeader />
      <div className="overflow-hidden flex-1 overflow-y-auto p-3">
        <QueueColumn orders={orders} activeId={activeId} onSelect={setActiveId} />
      </div>
    </div>
  );
}