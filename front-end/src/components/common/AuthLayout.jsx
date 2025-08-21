import React from "react";
import { Row, Col } from "antd";
import { Link } from "react-router-dom";
import logoPath from "../../assets/logo/logo.png";

const styles = {
  formHalf: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    padding: "2rem 2rem",
  },
  formWrapper: {
    width: "100%",
    maxWidth: "600px",
  },
  illustrationHalf: {
    backgroundColor: "white",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "2rem",
    minHeight: "100vh",
    borderLeft: "1px solid #e0e0e0",
  },
  header: {
    display: "flex",
    alignItems: "center",
    headerMargin: "4rem",
  },
  logo: {
    height: "40px",
    marginRight: "16px",
  },
  appTitle: {
    fontSize: "24px",
    fontWeight: 600,
    margin: 0,
  },
  pageTitle: {
    fontSize: "28px",
    fontWeight: 700,
    marginTop: 0,
    marginBottom: "8px",
  },
  subTitle: {
    color: "#6c757d",
    marginBottom: "24px",
  },
};

const AuthLayout = ({
  children,
  illustration,
  title,
  subTitle,
  headerMargin = "8rem",
}) => {
  const dynamicHeaderStyle = {
    ...styles.header,
    marginBottom: headerMargin,
  };

  return (
    <Row style={{ minHeight: "100vh", width: "100%" }}>
      <Col xs={24} lg={12} style={styles.formHalf}>
        <div style={styles.formWrapper}>
          <div style={dynamicHeaderStyle}>
            <img src={logoPath} alt="Budget Tracker Logo" style={styles.logo} />
            <h1 style={styles.appTitle}>Budget Tracker</h1>
          </div>
          <h2 style={styles.pageTitle}>{title}</h2>
          <p style={styles.subTitle}>{subTitle}</p>
          {children}
        </div>
      </Col>

      <Col xs={0} lg={12} style={styles.illustrationHalf}>
        <img
          src={illustration}
          alt="Illustration"
          style={{ maxWidth: "100%", maxHeight: "500px" }}
        />
      </Col>
    </Row>
  );
};

export const AuthLink = ({ text, to, linkText }) => (
  <div style={{ textAlign: "center", marginTop: "16px" }}>
    {text} <Link to={to}>{linkText}</Link>
  </div>
);

export default AuthLayout;
