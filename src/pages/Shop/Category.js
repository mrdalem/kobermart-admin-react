
import React, { Component, useMemo} from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Container,
  Badge,
  Row,
  Button,
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalBody,
  Col,
  Label
} from "reactstrap";
import Moment from "moment";
import TableContainer from "./CategoryTableContainer";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
//i18n
import { withTranslation } from "react-i18next";
import { Formik, Form, Field } from "formik";
import { colRef, Timestamp} from "helpers/firebase_helper";
import { setOptions } from "leaflet";
import { merge } from "lodash";

function CategoryTable(arg) {
  const {category, toggleModal} = arg;

  const toggleStatus = (id, status) => {
    colRef("p_productcategory").doc(id).set({
      active: status,
    }, {merge: true});
    
    console.log(id, status)
  };

  const columns = useMemo(
    () => [
      {
        Header: "Nama Kategori",
        accessor: "title",
      },
      {
        Header: "Status",
        accessor: "active",
        Cell: cellProps => {
          let status = "nonaktif";
          if(cellProps.row.original.active){
            status = "aktif"
          }
          return status;
        },
      },
      {
        Header: "Produk",
        accessor: "",
        Cell: cellProps => {
          
          return 0;
        },
      },
      {
        Header: "Diperbaharui",
        accessor: "updatedAt.seconds",
        Cell: cellProps => {
          let time = "";
          const today = Moment().format("DD-MM-YYYY");
          const createdAt = Moment(
            Timestamp.fromMillis(
              cellProps.row.original.createdAt.seconds * 1000
            ).toDate()
          ).format("DD-MM-YYYY");
          if (today == createdAt) {
            time = "Hari ini";
          } else {
            time = createdAt;
          }
          return time;
        },
      },
      {
        Header: "Aksi",
        accessor: "",
        disableFilters: true,
        Cell: cellProps => {
          return (
            <div className="d-flex gap-3">
              {cellProps.row.original.active? (
                <Link
                  to="#"
                  className="text-success"
                  onClick={()=>toggleStatus(cellProps.row.original.catid, !cellProps.row.original.active)}
                >
                  <i className="mdi mdi-check font-size-18" id="activate" />
                  {
                    <UncontrolledTooltip placement="top" target="activate">
                      Aktifkan
                    </UncontrolledTooltip>
                  }
                </Link>
              ) : (
                <Link
                  to="#"
                  className="text-secondary"
                  onClick={()=>toggleStatus(cellProps.row.original.catid, !cellProps.row.original.active)}
                >
                  <i className="mdi mdi-close font-size-18" id="deactivate" />
                  {
                    <UncontrolledTooltip placement="top" target="deactivate">
                      Nonaktifkan
                    </UncontrolledTooltip>
                  }
                </Link>
              )}
              <Link to="#" className="text-primary">
                <i
                  className="mdi mdi-pencil font-size-18"
                  id="toggletooltip"
                />
                <UncontrolledTooltip placement="top" target="toggletooltip">
                  Ubah
                </UncontrolledTooltip>
              </Link>
              <Link
                to="#"
                className="text-danger"
              >
                <i className="mdi mdi-delete font-size-18" id="deletetooltip" />
                <UncontrolledTooltip placement="top" target="deletetooltip">
                  Hapus
                </UncontrolledTooltip>
              </Link>
            </div>
          );
        },
      },
    ],
    []
  );

  let data = [];
  return (
    <TableContainer
      columns={columns}
      data={category}
      isGlobalFilter={true}
      isAddOptions={false}
      customPageSize={10}
      className="custom-header-css"
      toggleModal={toggleModal}
    />
  );
}

class ShopCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productCategory: [],
      isModalOpen: false,
    };

    this.unsubProductCategory = this.unsubProductCategory.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal() {
    this.setState({ 
      isModalOpen: !this.state.isModalOpen,
    });
  }

  unsubProductCategory = colRef("p_productcategories")
    .orderBy("createdAt", "asc")
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        let temp = this.state.productCategory;
        if (change.type === "added") {
          console.log("New: ", change.doc.data());
          temp.push({ catid: change.doc.id, ...change.doc.data() });
        }
        if (change.type === "modified") {
          console.log("Modified: ", change.doc.data());
          let index = temp.findIndex(doc => doc.catid == change.doc.id);
          temp[index] = { catid: change.doc.id, ...change.doc.data() };
          console.log(temp.findIndex(doc => doc.catid == change.doc.id));
        }
        if (change.type === "removed") {
          console.log("Removed: ", change.doc.data());
          let index = temp.findIndex(doc => doc.catid == change.doc.id);
          temp.splice(index, 1);
        }
        this.setState({ productCategory: [] }, () => {
          this.setState({
            productCategory: temp,
          });
        });
      });
    });

  async componentDidMount() {
    this.unsubProductCategory;
  }

  async componentDidUpdate() {}

  componentWillUnmount() {
    this.unsubProductCategory();
  }

  render() {
    //meta title
    document.title = "Kategori Produk| Kobermart Admin";
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumbs
              title={this.props.t("Belanja")}
              breadcrumbItem={this.props.t("Kategori Produk")}
            />
            <CategoryTable 
              category={this.state.productCategory}
              toggleModal={this.toggleModal}
            
            />
            <Modal className="modal-dialog-centered" isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
              <ModalHeader tag="h4">{"Tambah Kategori"}</ModalHeader>
              <ModalBody>
                <Formik
                preventDefault={true}
                initialValues={{}}
                onSubmit={async values => {
                  console.log(values.title);
                }}
                >
                  <Form>
                    <Row>
                      <Col>
                      <div className="mb-3">
                          <Label htmlFor="category-name">
                            Judul Kategori
                          </Label>
                          <Field
                            name="title"
                            type="text"
                            className="form-control"
                            id="category-name"
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
                      <Button
                        color="secondary"
                        type="submit"
                        className="btn btn-secondary w-md mt-3 ms-3"
                        onClick={this.toggleModal}
                      >
                        Batal
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

ShopCategory.propTypes = {
  t: PropTypes.any,
  error: PropTypes.any,
  success: PropTypes.any,
};

export default withTranslation()(ShopCategory);
