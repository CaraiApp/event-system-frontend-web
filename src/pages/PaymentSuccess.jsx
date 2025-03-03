import React from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircleOutline } from "@mui/icons-material";
import { Button, Card, Typography } from "@mui/material";


const PaymentSuccess = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
        <CheckCircleOutline style={styles.icon} />
        <Typography level={2} style={{...styles.title, fontWeight: 'bold', fontSize:16, marginBottom:5}}>Payment Successful!</Typography>
        <Typography type="secondary" style={styles.text}>
          Thank you for your payment. Your transaction has been completed.
        </Typography>
        {/* <Button type="primary" size="large" onClick={() => navigate("/")}>
          Go Back
        </Button> */}
      </Card>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f4f4f4",
  },
  card: {
    textAlign: "center",
    padding: "30px",
    maxWidth: "400px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
  },
  icon: {
    fontSize: "60px",
    color: "#52c41a",
    marginBottom: "20px",
  },
  title: {
    color: "#333",
  },
  text: {
    fontSize: "16px",
    marginBottom: "20px",
    display: "block",
  },
};

export default PaymentSuccess;
