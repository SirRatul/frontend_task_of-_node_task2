import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const CARD_OPTIONS = {
  iconStyle: "solid",
  style: {
    base: {
      iconColor: "#c4f0ff",
      color: "#fff",
      fontWeight: 500,
      fontFamily: "Roboto, Open Sans, Segoe UI, sans-serif",
      fontSize: "16px",
      fontSmoothing: "antialiased",
      ":-webkit-autofill": { color: "#fce883" },
      "::placeholder": { color: "#87bbfd" },
    },
    invalid: {
      iconColor: "#ffc7ee",
      color: "#ffc7ee",
    },
  },
};

export default function PaymentForm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    console.log("state", state);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: elements.getElement(CardElement),
    });

    if (!error) {
      try {
        const { id } = paymentMethod;
        const response = await axios.post("http://localhost:5000/payment", {
          amount: 100,
          id,
        });

        console.log(response.data);
        const stripe_id = response.data.payment.id;

        const tableResponse = await axios.post(
          "http://localhost:5000/addOrder",
          {
            from_airport: state.from_airport,
            from_country: state.from_country,
            to_airport: state.to_airport,
            to_country: state.to_country,
            total: state.total,
            stripe_id,
            status: "paid",
          }
        );
        console.log(tableResponse.data);
        navigate("/thanks");
      } catch (error) {
        console.log("Error", error);
        const tableResponse = await axios.post(
          "http://localhost:5000/addOrder",
          {
            from_airport: state.from_airport,
            from_country: state.from_country,
            to_airport: state.to_airport,
            to_country: state.to_country,
            total: state.total,
            status: "failed",
          }
        );
        console.log(tableResponse.data);
        navigate("/thanks");
      }
    } else {
      console.log(error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <fieldset className="FormGroup">
        <div className="FormRow">
          <CardElement options={CARD_OPTIONS} />
        </div>
      </fieldset>
      <button>Pay</button>
    </form>
  );
}
