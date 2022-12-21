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

import { apiError, loginUser, socialLogin } from "../../store/actions";
import { colRef, db } from "helpers/firebase_helper";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";

import { onSnapshot } from "firebase/firestore";

class MainSetting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tokenprice: 0,
      setting: {},
      bg_ppob: {},
      bg_plana: {},
      bg_belanja: {},
      errorAnggota: false,
      successAnggota: false,
      errorBelanja: false,
      successBelanja: false,
      errorPpob: false,
      successPpob: false,
    };
  }

  unsubscribe = onSnapshot(colRef("settings").doc("latest"), async doc => {
    console.log("subscribe to setting");
    this.setState({
      tokenprice: doc.data().tokenprice,
      setting: doc.data(),
      bg_ppob: doc.data().bg_ppob,
      bg_plana: doc.data().bg_plana,
      bg_belanja: doc.data().bg_belanja,
    });
  });

  async componentDidMount() {
    this.unsubscribe;
  }

  async componentDidUpdate() {}

  componentWillUnmount() {
    console.log("setting unsubscribed");
    this.unsubscribe();
  }

  async initSettingData() {
    await colRef("settings")
      .doc("latest")
      .get()
      .then(response => {
        this.setState({
          tokenprice: response.data().tokenprice,
          setting: response.data(),
          bg_ppob: response.data().bg_ppob,
          bg_plana: doc.data().bg_plana,
        });
      });
  }

  render() {
    //meta title
    document.title = "Pengaturan | Kobermart Admin";
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumbs
              title={this.props.t("Pengaturan")}
              breadcrumbItem={this.props.t("Pengaturan")}
            />
            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4">Anggota</CardTitle>
                    <Alert color="success" isOpen={this.state.successAnggota}>
                      Setting Anggota berhasil disimpan
                    </Alert>
                    {this.state.errorAnggota ? (
                      <UncontrolledAlert color="danger">
                        Setting Anggota gagal disimpan
                      </UncontrolledAlert>
                    ) : null}
                    <Formik
                      enableReinitialize={true}
                      initialValues={{
                        hakusaha:
                          (this.state && this.state.setting.tokenprice) || 0,
                        transfer:
                          (this.state && this.state.setting.transfer_fee) || 0,
                        limitkd1:
                          (this.state && this.state.setting.kd1limit) || 0,
                        ref:
                          (this.state && this.state.setting.refpercentage) || 0,
                        kd1: (this.state && this.state.bg_plana.kd1) || 0,
                        kd2: (this.state && this.state.bg_plana.kd2) || 0,
                        kd3: (this.state && this.state.bg_plana.kd3) || 0,
                        kd4: (this.state && this.state.bg_plana.kd4) || 0,
                        kd5: (this.state && this.state.bg_plana.kd5) || 0,
                        opfeeplana:
                          (this.state && this.state.setting.opfee_plana) || 0,
                      }}
                      onSubmit={async values => {
                        await colRef("settings")
                          .doc("latest")
                          .set(
                            {
                              tokenprice: values.hakusaha,
                              kd1limit: values.limitkd1,
                              opfee_plana: values.opfeeplana,
                              transfer_fee: values.transfer,
                              refpercentage: values.ref,
                              bg_plana: {
                                kd1: values.kd1,
                                kd2: values.kd2,
                                kd3: values.kd3,
                                kd4: values.kd4,
                                kd5: values.kd5,
                              },
                            },
                            { merge: true }
                          )
                          .then(result => {
                            this.setState({ successAnggota: true });
                            setTimeout(
                              () => this.setState({ successAnggota: false }),
                              3000
                            );
                          })
                          .catch(err => {
                            this.setState({ errorAnggota: true });
                          });
                      }}
                    >
                      {() => (
                        <Form className="form-horizontal">
                          <Row>
                            <Col md={6}>
                              <div className="mb-3">
                                <Label for="username" className="form-label">
                                  Hak Usaha (Rp)
                                </Label>
                                <Field
                                  name="hakusaha"
                                  type="number"
                                  className="form-control"
                                />
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="mb-3">
                                <Label for="limitkd1" className="form-label">
                                  Limit KD1
                                </Label>
                                <Field
                                  name="limitkd1"
                                  type="number"
                                  className="form-control"
                                  id="limitkd1"
                                  placeholder="Jumlah batas KD1"
                                />
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col md={6}>
                              <div className="mb-3">
                                <Label htmlFor="opfeeplana">
                                  Operational Fee %
                                </Label>
                                <Field
                                  name="opfeeplana"
                                  type="number"
                                  className="form-control"
                                  id="opfeeplana"
                                />
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="mb-3">
                                <Label htmlFor="transfer">
                                  Saldo Transfer Fee
                                </Label>
                                <Field
                                  name="transfer"
                                  type="number"
                                  className="form-control"
                                  id="transfer"
                                />
                              </div>
                            </Col>
                          </Row>
                          <Label>Pembagian BG</Label>
                          <Row>
                            <Col md={2}>
                              <div className="form-floating mb-3">
                                <Field
                                  type="number"
                                  name="ref"
                                  className="form-control"
                                  id="ref"
                                  placeholder="Persentase"
                                />
                                <label htmlFor="ref">ref</label>
                              </div>
                            </Col>
                            <Col md={2}>
                              <div className="form-floating mb-3">
                                <Field
                                  name="kd1"
                                  type="number"
                                  className="form-control"
                                  id="bg1"
                                  placeholder="Persentase"
                                />
                                <label htmlFor="bg1">bg1</label>
                              </div>
                            </Col>
                            <Col md={2}>
                              <div className="form-floating mb-3">
                                <Field
                                  name="kd2"
                                  type="number"
                                  className="form-control"
                                  id="bg2"
                                  placeholder="Persentase"
                                />
                                <label htmlFor="bg2">bg2</label>
                              </div>
                            </Col>
                            <Col md={2}>
                              <div className="form-floating mb-3">
                                <Field
                                  name="kd3"
                                  type="number"
                                  className="form-control"
                                  id="bg3"
                                  placeholder="Persentase"
                                />
                                <label htmlFor="bg3">bg3</label>
                              </div>
                            </Col>
                            <Col md={2}>
                              <div className="form-floating mb-3">
                                <Field
                                  name="kd4"
                                  type="number"
                                  className="form-control"
                                  id="bg4"
                                  placeholder="Persentase"
                                />
                                <label htmlFor="bg4">bg4</label>
                              </div>
                            </Col>
                            <Col md={2}>
                              <div className="form-floating mb-3">
                                <Field
                                  name="kd5"
                                  type="number"
                                  className="form-control"
                                  id="bg5"
                                  placeholder="Persentase"
                                />
                                <label htmlFor="bg5">bg5</label>
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
                      )}
                    </Formik>
                  </CardBody>
                </Card>
              </Col>

              <Col xl={6}>
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4">PPOB</CardTitle>
                    <Alert color="success" isOpen={this.state.successPpob}>
                      Setting PPOB berhasil disimpan
                    </Alert>
                    {this.state.errorPpob ? (
                      <UncontrolledAlert color="danger">
                        Setting PPOB gagal disimpan
                      </UncontrolledAlert>
                    ) : null}
                    <Formik
                      enableReinitialize={true}
                      initialValues={{
                        margin_ppob:
                          (this.state && this.state.setting.margin_ppob) || 0,
                        opfee_ppob:
                          (this.state && this.state.setting.opfee_ppob) || 0,
                        ppob_user: (this.state && this.state.bg_ppob.ref) || 0,
                        ppob_kd1: (this.state && this.state.bg_ppob.kd1) || 0,
                        ppob_kd2: (this.state && this.state.bg_ppob.kd2) || 0,
                        ppob_kd3: (this.state && this.state.bg_ppob.kd3) || 0,
                        ppob_kd4: (this.state && this.state.bg_ppob.kd4) || 0,
                        ppob_kd5: (this.state && this.state.bg_ppob.kd5) || 0,
                      }}
                      onSubmit={async values => {
                        await colRef("settings")
                          .doc("latest")
                          .set(
                            {
                              margin_ppob: values.margin_ppob,
                              opfee_ppob: values.opfee_ppob,
                              bg_ppob: {
                                ref: values.ppob_user,
                                kd1: values.ppob_kd1,
                                kd2: values.ppob_kd2,
                                kd3: values.ppob_kd3,
                                kd4: values.ppob_kd4,
                                kd5: values.ppob_kd5,
                              },
                            },
                            { merge: true }
                          )
                          .then(result => {
                            this.setState({ successPpob: true });
                            setTimeout(
                              () => this.setState({ successPpob: false }),
                              3000
                            );
                          })
                          .catch(err => {
                            this.setState({ errorPpob: true });
                          });
                      }}
                    >
                      {() => (
                        <Form>
                          <Row>
                            <Col md={6}>
                              <div className="mb-3">
                                <Label htmlFor="formrow-margin-ppob-Input">
                                  Margin (Rp)
                                </Label>
                                <Field
                                  name="margin_ppob"
                                  type="number"
                                  className="form-control"
                                  id="formrow-margin-ppob-Input"
                                />
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="mb-3">
                                <Label htmlFor="fee-ppob">
                                  Operational Fee %
                                </Label>
                                <Field
                                  name="opfee_ppob"
                                  type="number"
                                  className="form-control"
                                  id="fee-ppob"
                                />
                              </div>
                            </Col>
                          </Row>
                          <Label>Pembagian BG</Label>
                          <Row>
                            <Col md={2}>
                              <div className="form-floating mb-3">
                                <Field
                                  name="ppob_user"
                                  type="number"
                                  className="form-control"
                                  id="user"
                                  placeholder="Persentase"
                                />
                                <label htmlFor="user">user</label>
                              </div>
                            </Col>
                            <Col md={2}>
                              <div className="form-floating mb-3">
                                <Field
                                  name="ppob_kd1"
                                  type="number"
                                  className="form-control"
                                  id="bg1"
                                  placeholder="Persentase"
                                />
                                <label htmlFor="bg1">bg1</label>
                              </div>
                            </Col>
                            <Col md={2}>
                              <div className="form-floating mb-3">
                                <Field
                                  name="ppob_kd2"
                                  type="number"
                                  className="form-control"
                                  id="bg2"
                                  placeholder="Persentase"
                                />
                                <label htmlFor="bg2">bg2</label>
                              </div>
                            </Col>
                            <Col md={2}>
                              <div className="form-floating mb-3">
                                <Field
                                  name="ppob_kd3"
                                  type="number"
                                  className="form-control"
                                  id="bg3"
                                  placeholder="Persentase"
                                />
                                <label htmlFor="bg3">bg3</label>
                              </div>
                            </Col>
                            <Col md={2}>
                              <div className="form-floating mb-3">
                                <Field
                                  name="ppob_kd4"
                                  type="number"
                                  className="form-control"
                                  id="bg4"
                                  placeholder="Persentase"
                                />
                                <label htmlFor="bg4">bg4</label>
                              </div>
                            </Col>
                            <Col md={2}>
                              <div className="form-floating mb-3">
                                <Field
                                  name="ppob_kd5"
                                  type="number"
                                  className="form-control"
                                  id="bg5"
                                  placeholder="Persentase"
                                />
                                <label htmlFor="bg5">bg5</label>
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
                      )}
                    </Formik>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <Row>
              <Col xl={6}>
                <Card>
                  <CardBody>
                    <CardTitle className="mb-4">Belanja</CardTitle>
                    <Alert color="success" isOpen={this.state.successBelanja}>
                      Setting Belanja berhasil disimpan
                    </Alert>
                    {this.state.errorBelanja ? (
                      <UncontrolledAlert color="danger">
                        Setting Belanja gagal disimpan
                      </UncontrolledAlert>
                    ) : null}
                    <Formik
                      enableReinitialize={true}
                      initialValues={{
                        treshold:
                          (this.state && this.state.setting.product_treshold) ||
                          0,
                        opfee_belanja:
                          (this.state && this.state.setting.opfee_belanja) || 0,
                          ppob_user: (this.state && this.state.bg_belanja.ref) || 0,
                        ppob_kd1: (this.state && this.state.bg_belanja.kd1) || 0,
                        ppob_kd2: (this.state && this.state.bg_belanja.kd2) || 0,
                        ppob_kd3: (this.state && this.state.bg_belanja.kd3) || 0,
                        ppob_kd4: (this.state && this.state.bg_belanja.kd4) || 0,
                        ppob_kd5: (this.state && this.state.bg_belanja.kd5) || 0,
                      }}
                      onSubmit={async values => {
                        await colRef("settings")
                          .doc("latest")
                          .set(
                            {
                              opfee_belanja: values.opfee_belanja,
                              product_treshold: values.treshold,
                              bg_belanja: {
                                ref: values.ppob_user,
                                kd1: values.ppob_kd1,
                                kd2: values.ppob_kd2,
                                kd3: values.ppob_kd3,
                                kd4: values.ppob_kd4,
                                kd5: values.ppob_kd5,
                              },
                            },
                            { merge: true }
                          )
                          .then(result => {
                            this.setState({ successBelanja: true });
                            setTimeout(
                              () => this.setState({ successBelanja: false }),
                              3000
                            );
                          })
                          .catch(err => {
                            this.setState({ errorBelanja: true });
                          });
                      }}
                    >
                      {() => (
                        <Form>
                          <Row>
                            <Col md={6}>
                              <div className="mb-3">
                                <Label>Limit BG %</Label>
                                <Field
                                  name="treshold"
                                  type="number"
                                  className="form-control"
                                />
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="mb-3">
                                <Label htmlFor="formrow-operational-fee-belanja-Input">
                                  Operational Fee %
                                </Label>
                                <Field
                                  name="opfee_belanja"
                                  type="number"
                                  className="form-control"
                                  id="formrow-operational-fee-belanja-Input"
                                />
                              </div>
                            </Col>
                          </Row>
                          <Label>Pembagian BG</Label>
                          <Row>
                            <Col md={2}>
                              <div className="form-floating mb-3">
                                <Field
                                  name="ppob_user"
                                  type="number"
                                  className="form-control"
                                  id="user"
                                  placeholder="Persentase"
                                />
                                <label htmlFor="user">user</label>
                              </div>
                            </Col>
                            <Col md={2}>
                              <div className="form-floating mb-3">
                                <Field
                                  name="ppob_kd1"
                                  type="number"
                                  className="form-control"
                                  id="bg1"
                                  placeholder="Persentase"
                                />
                                <label htmlFor="bg1">bg1</label>
                              </div>
                            </Col>
                            <Col md={2}>
                              <div className="form-floating mb-3">
                                <Field
                                  name="ppob_kd2"
                                  type="number"
                                  className="form-control"
                                  id="bg2"
                                  placeholder="Persentase"
                                />
                                <label htmlFor="bg2">bg2</label>
                              </div>
                            </Col>
                            <Col md={2}>
                              <div className="form-floating mb-3">
                                <Field
                                  name="ppob_kd3"
                                  type="number"
                                  className="form-control"
                                  id="bg3"
                                  placeholder="Persentase"
                                />
                                <label htmlFor="bg3">bg3</label>
                              </div>
                            </Col>
                            <Col md={2}>
                              <div className="form-floating mb-3">
                                <Field
                                  name="ppob_kd4"
                                  type="number"
                                  className="form-control"
                                  id="bg4"
                                  placeholder="Persentase"
                                />
                                <label htmlFor="bg4">bg4</label>
                              </div>
                            </Col>
                            <Col md={2}>
                              <div className="form-floating mb-3">
                                <Field
                                  name="ppob_kd5"
                                  type="number"
                                  className="form-control"
                                  id="bg5"
                                  placeholder="Persentase"
                                />
                                <label htmlFor="bg5">bg5</label>
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
                      )}
                    </Formik>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

MainSetting.propTypes = {
  t: PropTypes.any,
  error: PropTypes.any,
  success: PropTypes.any,
};

export default withTranslation()(MainSetting);
