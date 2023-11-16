import React, { useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";
import useRequest from "../../hooks/use-request";
import Router from 'next/router';
const OrderShow = ({ order, currentUser }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const { doRequest, errors } = useRequest({
    url: "/api/payments",
    method: "post",
    body: {
      orderId: order.id,
    },
    onSuccess: () => Router.push('/orders')
  });
  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(order.expiresAt) - new Date();
      setTimeLeft(Math.round(msLeft / 1000));
    };
    const timerId = setInterval(findTimeLeft, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [order]);
  if (timeLeft < 0) {
    return <div>Order Expired</div>;
  }
  return (
    <div>
      Time left to pay: {timeLeft} second
      <StripeCheckout
        token={({ id }) => {
          return doRequest({ token: id });
        }}
        stripeKey="pk_test_51Nsc85KRqntwdr3p0N051Wg1C5Yez5LjgZu7w9hKGcPTyuYtjPaJbbb8wBtgzD4ycglTGpYen2B1Oi1iQWdxCnJP005Kb3HJyr"
        amount={order.ticket.price * 100}
        email={currentUser.email}
      />
      {errors}
    </div>
  );
};

OrderShow.getInitialProps = async (context, client) => {
  const { orderId } = context.query;
  const { data } = await client.get(`/api/orders/${orderId}`);
  return { order: data };
};

export default OrderShow;
