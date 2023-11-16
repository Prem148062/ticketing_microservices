import React from "react";

const Orderindex = ({ orders }) => {
  return <ul>
    {
        orders.map((o) => {
           return <li key={o.id}>{o.ticket.title} - {o.status}</li> 
        })
    }
  </ul>
};

Orderindex.getInitialProps = async (context, client) => {
  const { data } = await client.get("/api/orders");
  return { orders: data };
};

export default Orderindex;
