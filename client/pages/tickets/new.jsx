import React, { useState } from "react";
import useRequest from "../../hooks/use-request.js";
import Router from "next/router";
const NewTicket = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: (ticket) => {
      console.log(ticket);
      return Router.push("/");
    },
  });
  const onSubmit = (event) => {
    event.preventDefault();
    doRequest();
  };
  const onBlur = () => {
    const value = parseInt(price);
    if (isNaN(value)) {
      return;
    }
    setPrice(value.toFixed(2));
  };
  return (
    <div>
      <h1>Create a Ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="text"
            className="form-control"
            onBlur={onBlur}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="mt-2">{errors}</div>
        <button className="btn btn-primary mt-2">Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
