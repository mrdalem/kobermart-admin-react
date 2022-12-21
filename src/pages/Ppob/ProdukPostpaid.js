import React, { Component, useState } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  UncontrolledAlert,
  Card,
  Col,
  Container,
  Row,
  CardBody,
  CardTitle,
  Label,
  Button,
  Input,
  InputGroup,
} from "reactstrap";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";

//i18n
import { withTranslation } from "react-i18next";

import { colRef, db } from "helpers/firebase_helper";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { onSnapshot } from "firebase/firestore";

class ProdukPostpaidPpob extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentDidMount() {}

  async componentDidUpdate() {}

  componentWillUnmount() {}

  render() {
    //meta title
    document.title = "Produk Postpaid PPOB | Kobermart Admin";
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumbs
              title={this.props.t("PPOB")}
              breadcrumbItem={this.props.t("Produk Postpaid")}
            />
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

ProdukPostpaidPpob.propTypes = {
  t: PropTypes.any,
  error: PropTypes.any,
  success: PropTypes.any,
};

export default withTranslation()(ProdukPostpaidPpob);
