import React, { Component, useMemo } from "react";
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
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  FormFeedback,
} from "reactstrap";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "../../components/Common/TableContainer";

//i18n
import { withTranslation } from "react-i18next";
import { get } from "helpers/api_helper";
import { prepaidCheckBalance, prepaidPricelist } from "helpers/iak_helper";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { colRef } from "helpers/firebase_helper";

function PrepaidDataTable(pricelist) {
  const columns = useMemo(
    () => [
      {
        Header: "Kode",
        accessor: "product_code",
        Cell: cellProps => {
          return (
            <>
              <img
                className="mx-1"
                src={cellProps.row.original.icon_url}
                width={40}
                alt="logo"
              />
              {cellProps.row.original.product_code}
              <Badge
                className={
                  "font-size-12 mx-1 badge-soft-" +
                  (cellProps.row.original.status === "active"
                    ? "success"
                    : "danger")
                }
              >
                {cellProps.row.original.status}
              </Badge>
            </>
          );
        },
      },
      {
        Header: "Tipe",
        accessor: "product_type",
      },
      {
        Header: "Deskripsi",
        accessor: "product_description",
      },
      {
        Header: "Nominal",
        accessor: "product_nominal",
      },
      {
        Header: "Harga Asli",
        accessor: "product_price",
        Cell: cellProps => {
          const hargaIak = Intl.NumberFormat().format(
            cellProps.row.original.product_price
          );
          return (
            <>
              <Row className="mx-1">{"Rp " + hargaIak}</Row>
            </>
          );
        },
      },
      {
        Header: "Harga jual",
        accessor: "sell_price",
        Cell: cellProps => {
          const hargaJual = Intl.NumberFormat().format(
            cellProps.row.original.sell_price
          );
          const margin = Intl.NumberFormat().format(
            cellProps.row.original.margin
          );
          return (
            <>
              <Row className="mx-1">
                {"Rp " + hargaJual + " (+" + margin + ")"}
              </Row>
            </>
          );
        },
      },
      // {
      //   Header: "Detail",
      //   accessor: "product_details",
      // },
      // {
      //   Header: "Status",
      //   accessor: "status",
      // },
      {
        Header: "Pilihan",
        accessor: "view",
        disableFilters: true,
        Cell: cellProps => {
          return (
            <Button
              type="button"
              color="primary"
              className="btn-sm btn-rounded"
              onClick={() => pricelist.toggleModal(cellProps.row.original.product_code, cellProps.row.original.product_price, cellProps.row.original.margin, cellProps.row.original.sell_price)}
            >
              Edit
            </Button>
          );
        },
      },
    ],
    []
  );

  let data = [];
  if (pricelist) {
    data = pricelist.pricelist;
  }
  return (
    <TableContainer
      columns={columns}
      data={data}
      isGlobalFilter={true}
      isAddOptions={false}
      customPageSize={10}
      className="custom-header-css"
      handleFilterType={pricelist.handleFilterType}
      handleFilterStatus={pricelist.handleFilterStatus}
    />
  );
}

PrepaidDataTable.propTypes = {
  preGlobalFilteredRows: PropTypes.any,
};

class ProdukPrepaid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pricelist: [],
      filter: "",
      status: "active",
      isModalOpen: false,
      modalHeader: "",
      selectedProductPrice: 0,
      selectedProductMargin: 0,
      selectedProductSellPrice: "",
      canSubmit: true,
    };

    this.handleFilterType = this.handleFilterType.bind(this);
    this.handleFilterStatus = this.handleFilterStatus.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.modalOnClose = this.modalOnClose.bind(this);
    this.onChangeSellPrice = this.onChangeSellPrice.bind(this);
    this.onChangeMargin = this.onChangeMargin.bind(this);
    this.getTableData = this.getTableData.bind(this);
  }

  handleFilterType(type) {
    this.setState({ filter: type });
  }

  handleFilterStatus(status) {
    this.setState({ status: status });
  }

  toggleModal(product, price, margin, sellPrice) {
    this.setState({ 
      isModalOpen: !this.state.isModalOpen,
      modalHeader: product,
      selectedProductPrice: price,
      selectedProductMargin: margin,
      selectedProductSellPrice: sellPrice,
    });
  }

  modalOnClose() {
    this.setState({ 
      modalHeader: "",
      selectedProductPrice: 0,
      selectedProductMargin: 0,
      selectedProductSellPrice: 0,
    });
  }

  onChangeSellPrice(event){
    console.log(event.target.value)
    this.setState({
      selectedProductSellPrice: event.target.value,
      selectedProductMargin: event.target.value - this.state.selectedProductPrice
    })
    event.preventDefault()
  }

  onChangeMargin(event){
    console.log(event.target.value)
    this.setState({
      selectedProductMargin: parseInt(event.target.value.toString()),
      selectedProductSellPrice: parseInt(event.target.value.toString()) + this.state.selectedProductPrice
    })
    event.preventDefault()
  }

  getTableData = async () => {
    let fromIak = [];
    let fromFs = [];
    const pricelistData = [];

    await prepaidPricelist().then(async result => {
      fromIak = result.data.pricelist;
      await colRef("prepaid_pricelist")
        .get()
        .then(docs => {
          docs.forEach(element => {
            fromFs.push({
              product_code: element.id,
              ...element.data(),
            });
          });
        });
    });

    fromIak.forEach(e => {
      if (fromFs.find(el => el.product_code == e.product_code)) {
        pricelistData.push({
          ...e,
          sell_price: fromFs.find(el => el.product_code == e.product_code)
            .sell_price,
          margin: fromFs.find(el => el.product_code == e.product_code).margin,
        });
      } else {
        pricelistData.push({
          ...e,
        });
      }
    });

    // console.log(pricelistData[0])
    this.setState({
      pricelist: pricelistData.sort((a, b) =>
        a.product_type > b.product_type ? 1 : -1
      ),
    });
  }

  async componentDidMount() {
    this.getTableData()
  }

  render() {
    //meta title
    document.title = "Produk Prepaid PPOB | Kobermart Admin";
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumbs
              title={this.props.t("PPOB")}
              breadcrumbItem={this.props.t("Produk Prepaid")}
            />
            <PrepaidDataTable
              toggleModal={this.toggleModal}
              handleFilterType={this.handleFilterType}
              handleFilterStatus={this.handleFilterStatus}
              pricelist={this.state.pricelist.filter(
                el =>
                  (this.state.filter
                    ? el.product_type == this.state.filter
                    : true) &&
                  (this.state.status ? el.status == this.state.status : true)
              )}
            />
            <Modal className="modal-dialog-centered" isOpen={this.state.isModalOpen} toggle={this.toggleModal} onClosed={this.modalOnClose}>
              <ModalHeader tag="h4">{"Edit harga "+this.state.modalHeader}</ModalHeader>
              <ModalBody>
                <Formik
                preventDefault={true}
                enableReinitialize={true}
                initialValues={{
                  productPrice:
                    (this.state && this.state.selectedProductPrice) || "",
                  sellPrice:
                    (this.state && this.state.selectedProductSellPrice) || "",
                  margin:
                    (this.state && this.state.selectedProductMargin) || "",
                  
                }}
                onSubmit={async values => {
                  if(this.state.selectedProductMargin > 0){
                    this.setState({canSubmit: true});
                    await colRef("prepaid_pricelist")
                      .doc(this.state.modalHeader)
                      .set(
                        {
                          sell_price: parseInt(values.sellPrice.toString()),
                          margin: parseInt(values.margin.toString()),
                          
                        },
                      )
                      .then(result => {
                        this.toggleModal()
                        this.getTableData()
                      })
                      .catch(err => {
                        this.setState({ errorPpob: true });
                      });
                  } else {
                    this.setState({canSubmit: false})
                  }
                }}
                >
                  <Form>
                    <Row>
                      <Col>
                      <div className="mb-3">
                          <Label htmlFor="product-sell-price">
                            Harga Asli
                          </Label>
                          <Field
                            disabled={true}
                            name="productPrice"
                            type="number"
                            className="form-control"
                            id="product-sell-price"
                          />
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="product-sell-price">
                            Harga Jual
                          </Label>
                          <Field
                            name="sellPrice"
                            type="number"
                            className="form-control"
                            id="product-sell-price"
                            onChange={this.onChangeSellPrice}
                          />
                        </div>
                        <div className="mb-3">
                          <Label htmlFor="product-margin">
                            Margin
                          </Label>
                          <Field
                            name="margin"
                            type="number"
                            className="form-control"
                            id="product-margin"
                            onChange={this.onChangeMargin}
                          />
                        </div>
                      </Col>
                      
                    </Row>
                    

                    <div>
                      <Button
                        color="primary"
                        type="submit"
                        className="btn btn-primary w-md mt-3"
                      >
                        Simpan
                      </Button>
                    </div>
                  </Form>
                </Formik>
              </ModalBody>
            </Modal>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

ProdukPrepaid.propTypes = {
  t: PropTypes.any,
  error: PropTypes.any,
  success: PropTypes.any,
};

// export default ProdukPrepaid;
export default withTranslation()(ProdukPrepaid);
