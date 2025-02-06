import React from "react";
import "./PaymentMethods.css";

const PaymentMethods = () => {
  return (      
<>
  <div className="payment-methods">  
    <h2 className="payment-heading">Payment Methods</h2>
    <div className="card-details">
      <div className="card-info">        
        <img className="card-pattern" src="src\assets\card-design.png"/>
        <p><b>Mastercard Debit Card</b></p>
        <p>XXXX XXXX X132</p>
        <span>
          <p><b>Expires on Dec 2026</b></p>
          <p>Falcon Finances</p>
        </span>
      </div>
      <div className="details">
        <p><b>Type:</b> <span>MasterCard debit card</span></p>
        <p><b>Name:</b> <span>Michael Giacchino</span></p>
        <p><b>Expires:</b> <span>DEC 2026</span></p>
        <p><b>Issuer:</b> <span>Falcon Finances</span></p>
        <p><b>ID:</b> <span>card_3d1avx3zcafd62</span></p>
      </div>
    </div>
  </div>
</>

  );
};

export default PaymentMethods;
