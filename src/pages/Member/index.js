import React, { Component, useMemo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import {
  Container,
  Badge,
  UncontrolledTooltip,
  Row,
  Col,
  Label,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  FormFeedback,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

import Breadcrumbs from "../../components/Common/Breadcrumb";
import TableContainer from "./MemberTableContainer";
import { withTranslation } from "react-i18next";
import { colRef, db } from "helpers/firebase_helper";
import { post } from "helpers/api_helper";
import { Formik, Form, Field, useFormik } from "formik";
import * as Yup from "yup";
import { onSnapshot, Timestamp } from "firebase/firestore";
import { initial, isEmpty } from "lodash";
import { preventDefault } from "@fullcalendar/core";

function TokenTable(arg) {
  const {
    data,
    toggleModalTambahToken,
    toggleModalRegisterToken,
    deleteToken,
    toggleTableType,
    tableType,
  } = arg;

  const tokenColumns = useMemo(
    () => [
      {
        Header: "No Token",
        accessor: "tokenCode",
        Cell: cellProps => {
          return (
            <>
              {cellProps.row.original.tokenCode}
              <Badge
                className={
                  "font-size-12 mx-1 badge-soft-" +
                  (cellProps.row.original.tokenUsed ? "warning" : "success")
                }
              >
                {cellProps.row.original.tokenUsed ? "used" : "free"}
              </Badge>
            </>
          );
        },
      },
      {
        Header: "Dibuat pada",
        accessor: "tokenCreatedAt.seconds",
        Cell: cellProps => {
          let time = "";
          const today = Timestamp.fromMillis(Date.now())
            .toDate()
            .toLocaleString();

          const createdAt = Timestamp.fromMillis(
            cellProps.row.original.tokenCreatedAt.seconds * 1000
          )
            .toDate()
            .toLocaleString();

          if (createdAt.slice(0, 10) == today.slice(0, 10)) {
            time = "Hari ini";
          } else {
            time = createdAt;
          }

          return time.slice(0, 10);
        },
      },
      {
        Header: "Dibuat oleh",
        accessor: "creatorName",
      },
      {
        Header: "Upline",
        accessor: "uplineName",
      },
      {
        Header: "Pilihan",
        accessor: "",
        disableFilters: true,
        Cell: cellProps => {
          return (
            <div className="d-flex gap-3">
              <Link to="#" className="text-primary">
                <i
                  className="mdi mdi-information font-size-18"
                  id="toggletooltip"
                />
                <UncontrolledTooltip placement="top" target="toggletooltip">
                  Informasi
                </UncontrolledTooltip>
              </Link>
              {cellProps.row.original.tokenUsed ? null : (
                <Link
                  to="#"
                  className="text-success"
                  onClick={() =>
                    toggleModalRegisterToken(cellProps.row.original.tokenCode)
                  }
                >
                  <i
                    className="mdi mdi-account-plus font-size-18"
                    id="edittooltip"
                  />
                  {
                    <UncontrolledTooltip placement="top" target="edittooltip">
                      Registrasi
                    </UncontrolledTooltip>
                  }
                </Link>
              )}

              {cellProps.row.original.tokenUsed ? null : (
                <Link
                  to="#"
                  className="text-danger"
                  onClick={() => deleteToken(cellProps.row.original.tokenCode)}
                >
                  <i
                    className="mdi mdi-delete font-size-18"
                    id="deletetooltip"
                  />
                  <UncontrolledTooltip placement="top" target="deletetooltip">
                    Hapus
                  </UncontrolledTooltip>
                </Link>
              )}
              {!cellProps.row.original.tokenUsed ? null : (
                <UncontrolledDropdown>
                  <DropdownToggle tag="a" href="#" className="card-drop">
                    <i className="mdi mdi-dots-horizontal font-size-18"></i>
                  </DropdownToggle>

                  <DropdownMenu className="dropdown-menu-end">
                    <DropdownItem href="#">
                      <i
                        className="mdi mdi-pencil font-size-16 text-warning me-1"
                        id="edittooltip"
                      ></i>
                      Edit
                      <UncontrolledTooltip placement="top" target="edittooltip">
                        Edit
                      </UncontrolledTooltip>
                    </DropdownItem>

                    <DropdownItem href="#">
                      <i
                        className="mdi mdi-cash-plus font-size-16 text-success me-1"
                        id="topuptooltip"
                      ></i>
                      Topup
                      <UncontrolledTooltip
                        placement="top"
                        target="topuptooltip"
                      >
                        Topup
                      </UncontrolledTooltip>
                    </DropdownItem>
                    <DropdownItem href="#">
                      <i
                        className="mdi mdi-cash-refund font-size-16 text-primary me-1"
                        id="withdrawtooltip"
                      ></i>
                      Withdraw
                      <UncontrolledTooltip
                        placement="top"
                        target="withdrawtooltip"
                      >
                        Withdraw
                      </UncontrolledTooltip>
                    </DropdownItem>
                    <DropdownItem href="#">
                      <i
                        className="mdi mdi-swap-horizontal font-size-16 text-secondary me-1"
                        id="transfertooltip"
                      ></i>
                      Transfer
                      <UncontrolledTooltip
                        placement="top"
                        target="transfertooltip"
                      >
                        Transfer
                      </UncontrolledTooltip>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
            </div>
          );
        },
      },
    ],
    []
  );

  const memberColumns = useMemo(
    () => [
      {
        Header: "No Token",
        accessor: "tokenCode",
        Cell: cellProps => {
          return (
            <>
              {cellProps.row.original.tokenCode}
              <Badge
                className={
                  "font-size-12 mx-1 badge-soft-" +
                  (cellProps.row.original.tokenUsed ? "warning" : "success")
                }
              >
                {cellProps.row.original.tokenUsed ? "used" : "free"}
              </Badge>
            </>
          );
        },
      },

      {
        Header: "Nama",
        accessor: "name",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Upline",
        accessor: "uplineName",
      },
      {
        Header: "Saldo",
        accessor: "balance",
      },
      {
        Header: "Cashback",
        accessor: "cashback",
      },
      {
        Header: "Pilihan",
        accessor: "",
        disableFilters: true,
        Cell: cellProps => {
          return (
            <div className="d-flex gap-3">
              {cellProps.row.original.tokenUsed ? null : (
                <Link
                  to="#"
                  className="text-success"
                  onClick={() =>
                    toggleModalRegisterToken(cellProps.row.original.tokenCode)
                  }
                >
                  <i
                    className="mdi mdi-account-plus font-size-18"
                    id="edittooltip"
                  />
                  {
                    <UncontrolledTooltip placement="top" target="edittooltip">
                      Registrasi
                    </UncontrolledTooltip>
                  }
                </Link>
              )}
              <Link to="#" className="text-primary">
                <i
                  className="mdi mdi-information font-size-18"
                  id="toggletooltip"
                />
                <UncontrolledTooltip placement="top" target="toggletooltip">
                  Informasi
                </UncontrolledTooltip>
              </Link>
              {cellProps.row.original.tokenUsed ? null : (
                <Link
                  to="#"
                  className="text-danger"
                  onClick={() => deleteToken(cellProps.row.original.tokenCode)}
                >
                  <i
                    className="mdi mdi-delete font-size-18"
                    id="deletetooltip"
                  />
                  <UncontrolledTooltip placement="top" target="deletetooltip">
                    Hapus
                  </UncontrolledTooltip>
                </Link>
              )}
              <UncontrolledDropdown>
                <DropdownToggle tag="a" href="#" className="card-drop">
                  <i className="mdi mdi-dots-horizontal font-size-18"></i>
                </DropdownToggle>

                <DropdownMenu className="dropdown-menu-end">
                  <DropdownItem href="#">
                    <i
                      className="mdi mdi-pencil font-size-16 text-warning me-1"
                      id="edittooltip"
                    ></i>
                    Edit
                    <UncontrolledTooltip placement="top" target="edittooltip">
                      Edit
                    </UncontrolledTooltip>
                  </DropdownItem>

                  <DropdownItem href="#">
                    <i
                      className="mdi mdi-cash-plus font-size-16 text-success me-1"
                      id="topuptooltip"
                    ></i>
                    Topup
                    <UncontrolledTooltip placement="top" target="topuptooltip">
                      Topup
                    </UncontrolledTooltip>
                  </DropdownItem>
                  <DropdownItem href="#">
                    <i
                      className="mdi mdi-cash-refund font-size-16 text-primary me-1"
                      id="withdrawtooltip"
                    ></i>
                    Withdraw
                    <UncontrolledTooltip
                      placement="top"
                      target="withdrawtooltip"
                    >
                      Withdraw
                    </UncontrolledTooltip>
                  </DropdownItem>
                  <DropdownItem href="#">
                    <i
                      className="mdi mdi-swap-horizontal font-size-16 text-secondary me-1"
                      id="transfertooltip"
                    ></i>
                    Transfer
                    <UncontrolledTooltip
                      placement="top"
                      target="transfertooltip"
                    >
                      Transfer
                    </UncontrolledTooltip>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </div>
          );
        },
      },
    ],
    []
  );

  return (
    <TableContainer
      columns={tableType == "member" ? memberColumns : tokenColumns}
      data={data}
      isGlobalFilter={true}
      isAddOptions={false}
      customPageSize={10}
      className="custom-header-css"
      toggleModalTambahToken={toggleModalTambahToken}
      toggleTableType={toggleTableType}
      tableType={tableType}
    />
  );
}

class Token extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableType: "all",
      tokens: [],
      newToken: false,
      registerToken: false,
      selectedToken: "",
      provinceList: [],
      regencyList: [],
      districtList: [],
      villageList: [],
      selectedProvince: "",
      selectedRegency: "",
      selectedDistrict: "",
      selectedVillage: "",
      name: "",
      whatsapp: "",
      gender: "L",
      email: "",
      password: "",
      passwordConf: "",
      jalan: "",
      bank: "",
      bankAcc: "",
      monthlist: [
        {
          name: "Januari",
          id: "01",
        },
        {
          name: "Februari",
          id: "02",
        },
        {
          name: "Maret",
          id: "03",
        },
        {
          name: "April",
          id: "04",
        },
        {
          name: "Mei",
          id: "05",
        },
        {
          name: "Juni",
          id: "06",
        },
        {
          name: "Juli",
          id: "07",
        },
        {
          name: "Agustus",
          id: "08",
        },
        {
          name: "September",
          id: "09",
        },
        {
          name: "Oktober",
          id: "10",
        },
        {
          name: "November",
          id: "11",
        },
        {
          name: "Desember",
          id: "12",
        },
      ],
      datelist: [],
      selectedDay: "01",
      selectedMonth: "01",
      selectedYear: 1900,
      registerError: {
        status: false,
        message: "",
      },
    };

    this.toggleModalTambahToken = this.toggleModalTambahToken.bind(this);
    this.toggleModalRegisterToken = this.toggleModalRegisterToken.bind(this);
    this.getIdfromList = this.getIdfromList.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.fillForm = this.fillForm.bind(this);
    this.updateTable = this.updateTable.bind(this);
    this.deleteToken = this.deleteToken.bind(this);
    this.toggleTableType = this.toggleTableType.bind(this);
  }

  toggleTableType(type) {
    let hidden = [];
    if (type == "member") {
      hidden = ["creatorName"];
    }
    this.setState({
      tableType: type,
      hiddenCols: hidden,
    });
  }

  resetForm() {
    this.setState({
      registerToken: false,
      selectedToken: "",
      regencyList: [],
      districtList: [],
      villageList: [],
      selectedProvince: this.state.provinceList[0].name,
      selectedRegency: "",
      selectedDistrict: "",
      selectedVillage: "",
      name: "",
      whatsapp: "",
      gender: "L",
      email: "",
      password: "",
      passwordConf: "",
      bank: "",
      bankAcc: "",
      jalan: "",
      selectedDay: "01",
      selectedMonth: "01",
      selectedYear: 1900,
      registerError: {
        status: false,
      },
    });
  }

  fillForm() {
    this.setState({
      name: "Testing",
      whatsapp: "085313924122",
      gender: "L",
      email: "test@gmail.com",
      password: "123456",
      passwordConf: "123456",
      bank: "",
      bankAcc: "",
      jalan: "Jalan Raya Pesalakan",
      selectedDay: "01",
      selectedMonth: "01",
      selectedYear: 1900,
    });
  }

  componentDidMount() {
    this.updateTable();

    fetch(`https://www.emsifa.com/api-wilayah-indonesia/api/provinces.json`)
      .then(response => response.json())
      .then(provinces => {
        this.setState({
          provinceList: provinces,
          selectedProvince: provinces[0].name,
        });
      });

    var temp = [];
    for (let index = 1; index < 32; index++) {
      temp.push(index.toString().padStart(2, "0"));
    }

    this.setState({
      datelist: temp,
    });
  }

  getIdfromList(list, name) {
    var data = { id: "" };
    if (list.length > 0) {
      data = list.find(e => e.name == name);
    }
    return data.id;
  }

  async toggleModalTambahToken() {
    console.log("new token");
    await post("api/member/token/admin-token").then(res => {
      console.log(res);
      this.updateTable();
    });
  }

  toggleModalRegisterToken(code) {
    const value = !this.state.registerToken;
    this.setState({
      registerToken: value,
      selectedToken: code,
    });

    if (!value) {
      this.resetForm();
    } else {
      this.fillForm();
    }
  }

  deleteToken(code) {
    console.log("Menghapus " + code);
    post(`api/member/token/delete-token/${code}`).then(res => {
      console.log(res);
      this.updateTable();
    });
  }

  async updateTable() {
    const membersInfo = await colRef("membersInfo").get();

    await colRef("members")
      .orderBy("tokenCreatedAt", "asc")
      .get()
      .then(result => {
        const temp = [];
        const temp2 = [];
        result.docs.forEach(e => {
          const data = e.data();
          (data.id = e.id), temp.push(data);
        });

        temp.forEach(e => {
          const data = e;
          const upline = temp.find(el => data.upline == el.id);
          const creator = temp.find(el => data.tokenCreator == el.id);
          if (data.tokenUsed) {
            const infos = membersInfo.docs.find(el => el.id == data.id);
            data.balance = infos.data().balance;
            data.cashback = infos.data().cashback;
          }
          if (upline && creator) {
            data.uplineName = upline.name;
            data.creatorName = creator.name;
          } else {
            data.uplineName = "KBBJ0";
            data.creatorName = "admin";
          }
        });
        this.setState({ tokens: temp });
      });
  }

  render() {
    document.title = "Token | Kobermart Admin";
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumbs
              title={this.props.t("Keanggotaan")}
              breadcrumbItem={this.props.t("Anggota")}
            />
            <TokenTable
              data={
                this.state.tableType == "all"
                  ? this.state.tokens
                  : this.state.tableType == "token"
                  ? this.state.tokens.filter(el => el.tokenUsed == false)
                  : this.state.tokens.filter(el => el.tokenUsed == true)
              }
              toggleModalTambahToken={this.toggleModalTambahToken}
              toggleModalRegisterToken={this.toggleModalRegisterToken}
              deleteToken={this.deleteToken}
              toggleTableType={this.toggleTableType}
              tableType={this.state.tableType}
              hiddenCols={this.state.hiddenCols}
            />
            <Modal
              isOpen={this.state.registerToken}
              toggle={this.toggleModalRegisterToken}
              centered={true}
              size="lg"
            >
              <ModalHeader tag="h4">{`Isi Data Token ${this.state.selectedToken}`}</ModalHeader>
              <ModalBody>
                <Formik
                  preventDefault={true}
                  enableReinitialize={true}
                  initialValues={{
                    name: this.state.name,
                    whatsapp: this.state.whatsapp,
                    gender: this.state.gender,
                    email: this.state.email,
                    password: this.state.password,
                    passwordConf: this.state.passwordConf,
                    bank: this.state.bank,
                    bankAcc: this.state.bankAcc,
                    jalan: this.state.jalan,
                    prov: this.state.selectedProvince,
                    kab: this.state.selectedRegency,
                    kec: this.state.selectedDistrict,
                    desa: this.state.selectedVillage,
                    day: this.state.selectedDay,
                    month: this.state.selectedMonth,
                    year: this.state.selectedYear,
                  }}
                  // validate={value => {
                  //   console.log("validate");
                  // }}
                  validationSchema={() =>
                    Yup.object().shape({
                      name: Yup.string()
                        .min(2, "Too Short!")
                        .max(50, "Too Long!")
                        .required("Required"),
                      email: Yup.string()
                        .email("Invalid email")
                        .required("Required"),
                      gender: Yup.string().required("Required!"),
                      day: Yup.string().required("Required!"),
                      month: Yup.string().required("Required!"),
                      year: Yup.number()
                        .min(1900)
                        .max(2022)
                        .required("Required!"),
                      password: Yup.string().required("Required!"),
                      passwordConf: Yup.string().oneOf(
                        [Yup.ref("password"), null],
                        "Harus sama dengan password"
                      ),
                      whatsapp: Yup.string()
                        .min(9, "Too Short!")
                        .max(15, "Too Long!")
                        .required("Required"),
                      prov: Yup.string().required("Required"),
                      kab: Yup.string().required("Required"),
                      kec: Yup.string().required("Required"),
                      desa: Yup.string().required("Required"),
                      jalan: Yup.string().required("Required"),
                    })
                  }
                  onSubmit={async values => {
                    console.log(values);
                    post("api/member/member/admin-register", {
                      id: this.state.selectedToken,
                      ...values,
                    }).then(res => {
                      console.log(res);
                      if (res.success) {
                        this.resetForm();
                        this.updateTable();
                      } else {
                        this.setState({
                          registerError: {
                            status: true,
                            message: res.message,
                          },
                        });
                      }
                    });
                  }}
                >
                  {({ errors, touched }) => (
                    <Form>
                      <Alert
                        color="danger"
                        isOpen={this.state.registerError.status}
                      >
                        {this.state.registerError.message}
                      </Alert>
                      <Row>
                        <Col xl={6}>
                          <div className="mb-3">
                            <Label htmlFor="register-name">
                              Nama<span className="text-danger">*</span>
                            </Label>
                            <Field
                              name="name"
                              type="text"
                              className={`form-control ${
                                errors.name && touched.name
                                  ? "border-danger"
                                  : null
                              }`}
                              id="register-name"
                              onChange={event => {
                                this.setState({ name: event.target.value });
                              }}
                            />
                            {errors.name && touched.name ? (
                              <div className="text-danger">{errors.name}</div>
                            ) : null}
                          </div>
                          <Row>
                            <Col>
                              <div className="mb-3">
                                <Label className="control-label">
                                  Tgl Lahir
                                  <span className="text-danger">*</span>
                                </Label>
                                <Field
                                  as="select"
                                  name="day"
                                  className="form-control select2"
                                  onChange={event => {
                                    console.log(event.target.value);
                                  }}
                                >
                                  {this.state.datelist.map(value => (
                                    <option key={value} value={value}>
                                      {value}
                                    </option>
                                  ))}
                                </Field>
                              </div>
                            </Col>
                            <Col>
                              <div className="mb-3">
                                <Label className="control-label">
                                  Bulan
                                  <span className="text-danger">*</span>
                                </Label>
                                <Field
                                  as="select"
                                  name="month"
                                  className="form-control select2"
                                >
                                  {this.state.monthlist.map(value => (
                                    <option key={value.id} value={value.id}>
                                      {value.name}
                                    </option>
                                  ))}
                                </Field>
                              </div>
                            </Col>
                            <Col>
                              <div className="mb-3">
                                <Label className="control-label">
                                  Tahun
                                  <span className="text-danger">*</span>
                                </Label>
                                <Field
                                  name="year"
                                  type="number"
                                  className="form-control select2"
                                  onChange={event =>
                                    this.setState({
                                      selectedYear: event.target.value,
                                    })
                                  }
                                />
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col>
                              <div className="mb-3">
                                <Label className="control-label">
                                  Jenis Kelamin
                                  <span className="text-danger">*</span>
                                </Label>
                                <Field
                                  as="select"
                                  name="gender"
                                  className={`form-control select2 ${
                                    errors.gender && touched.gender
                                      ? "border-danger"
                                      : null
                                  }`}
                                  onChange={event =>
                                    this.setState({
                                      gender: event.target.value,
                                    })
                                  }
                                >
                                  <option></option>
                                  <option value="L">Laki-laki</option>
                                  <option value="P">Perempuan</option>
                                </Field>
                                {errors.gender && touched.gender ? (
                                  <div className="text-danger">
                                    {errors.gender}
                                  </div>
                                ) : null}
                              </div>
                            </Col>
                          </Row>
                          <div className="mb-3">
                            <Label htmlFor="no-whatsapp">
                              No Whatsapp<span className="text-danger">*</span>
                            </Label>
                            <Field
                              name="whatsapp"
                              type="text"
                              className={`form-control ${
                                errors.whatsapp && touched.whatsapp
                                  ? "border-danger"
                                  : null
                              }`}
                              id="no-whatsapp"
                              onChange={event =>
                                this.setState({
                                  whatsapp: event.target.value,
                                })
                              }
                            />
                            {errors.whatsapp && touched.whatsapp ? (
                              <div className="text-danger">
                                {errors.whatsapp}
                              </div>
                            ) : null}
                          </div>
                          <div className="mb-3">
                            <Label htmlFor="email-address">
                              Email<span className="text-danger">*</span>
                            </Label>
                            <Field
                              name="email"
                              type="text"
                              className={`form-control ${
                                errors.email && touched.email
                                  ? "border-danger"
                                  : null
                              }`}
                              id="email-address"
                              onChange={event =>
                                this.setState({
                                  email: event.target.value,
                                })
                              }
                            />
                            {errors.email && touched.email ? (
                              <div className="text-danger">{errors.email}</div>
                            ) : null}
                          </div>
                          <div className="mb-3">
                            <Label htmlFor="password-field">
                              Password<span className="text-danger">*</span>
                            </Label>
                            <Field
                              name="password"
                              type="text"
                              className={`form-control ${
                                errors.password && touched.password
                                  ? "border-danger"
                                  : null
                              }`}
                              id="password-field"
                              onChange={event =>
                                this.setState({
                                  password: event.target.value,
                                })
                              }
                            />
                            {errors.password && touched.password ? (
                              <div className="text-danger">
                                {errors.password}
                              </div>
                            ) : null}
                          </div>
                          <div className="mb-3">
                            <Label htmlFor="password-confirm-field">
                              Konfirmasi Password
                              <span className="text-danger">*</span>
                            </Label>
                            <Field
                              name="passwordConf"
                              type="text"
                              className={`form-control ${
                                errors.passwordConf && touched.passwordConf
                                  ? "border-danger"
                                  : null
                              }`}
                              id="password-confirm-field"
                              onChange={event =>
                                this.setState({
                                  passwordConf: event.target.value,
                                })
                              }
                            />
                            {errors.passwordConf && touched.passwordConf ? (
                              <div className="text-danger">
                                {errors.passwordConf}
                              </div>
                            ) : null}
                          </div>
                        </Col>
                        <Col xl={6}>
                          <div className="mb-3">
                            <Label htmlFor="bank-name">Nama Bank</Label>
                            <Field
                              name="bank"
                              type="text"
                              className="form-control"
                              id="bank-name"
                              onChange={event => {
                                this.setState({ bank: event.target.value });
                              }}
                            />
                          </div>
                          <div className="mb-3">
                            <Label htmlFor="bank-account">No Rekening</Label>
                            <Field
                              name="bankAcc"
                              type="text"
                              className="form-control"
                              id="bank-account"
                              onChange={event => {
                                this.setState({ bankAcc: event.target.value });
                              }}
                            />
                          </div>
                          <div className="mb-3">
                            <Label htmlFor="prov">
                              Provinsi<span className="text-danger">*</span>
                            </Label>
                            <Field
                              as="select"
                              name="prov"
                              type="text"
                              className={`form-control select2 ${
                                errors.prov && touched.prov
                                  ? "border-danger"
                                  : null
                              }`}
                              onChange={async event => {
                                this.setState({
                                  selectedProvince: event.target.value,
                                });
                                console.log(
                                  this.getIdfromList(
                                    this.state.provinceList,
                                    this.state.selectedProvince
                                  )
                                );
                                await fetch(
                                  `https://www.emsifa.com/api-wilayah-indonesia/api/regencies/${this.getIdfromList(
                                    this.state.provinceList,
                                    event.target.value
                                  )}.json`
                                )
                                  .then(response => response.json())
                                  .then(regencies =>
                                    this.setState({
                                      regencyList: regencies,
                                      districtList: [],
                                      villageList: [],
                                    })
                                  );
                              }}
                            >
                              {this.state.provinceList.map(value => (
                                <option key={value.id} value={value.name}>
                                  {value.name}
                                </option>
                              ))}
                            </Field>
                            {errors.prov && touched.prov ? (
                              <div className="text-danger">{errors.prov}</div>
                            ) : null}
                          </div>
                          {isEmpty(this.state.regencyList) ? null : (
                            <div className="mb-3">
                              <Label htmlFor="kab">
                                Kabupaten<span className="text-danger">*</span>
                              </Label>
                              <Field
                                as="select"
                                name="kab"
                                type="text"
                                className={`form-control select2 ${
                                  errors.kab && touched.kab
                                    ? "border-danger"
                                    : null
                                }`}
                                onChange={async event => {
                                  this.setState({
                                    selectedRegency: event.target.value,
                                  });
                                  await fetch(
                                    `https://www.emsifa.com/api-wilayah-indonesia/api/districts/${this.getIdfromList(
                                      this.state.regencyList,
                                      event.target.value
                                    )}.json`
                                  )
                                    .then(response => response.json())
                                    .then(district =>
                                      this.setState({
                                        districtList: district,
                                        villageList: [],
                                      })
                                    );
                                }}
                              >
                                {this.state.regencyList.map(value => (
                                  <option key={value.id} value={value.name}>
                                    {value.name}
                                  </option>
                                ))}
                              </Field>
                              {errors.kab && touched.kab ? (
                                <div className="text-danger">{errors.kab}</div>
                              ) : null}
                            </div>
                          )}
                          {isEmpty(this.state.districtList) ? null : (
                            <div className="mb-3">
                              <Label htmlFor="kec">
                                Kecamatan<span className="text-danger">*</span>
                              </Label>
                              <Field
                                as="select"
                                name="kec"
                                type="text"
                                className={`form-control select2 ${
                                  errors.kec && touched.kec
                                    ? "border-danger"
                                    : null
                                }`}
                                onChange={async event => {
                                  this.setState({
                                    selectedDistrict: event.target.value,
                                  });
                                  await fetch(
                                    `https://www.emsifa.com/api-wilayah-indonesia/api/villages/${this.getIdfromList(
                                      this.state.districtList,
                                      event.target.value
                                    )}.json`
                                  )
                                    .then(response => response.json())
                                    .then(villages =>
                                      this.setState({
                                        villageList: villages,
                                        selectedVillage: villages[0].name,
                                      })
                                    );
                                }}
                              >
                                {this.state.districtList.map(value => (
                                  <option key={value.id} value={value.name}>
                                    {value.name}
                                  </option>
                                ))}
                              </Field>
                              {errors.kec && touched.kec ? (
                                <div className="text-danger">{errors.kec}</div>
                              ) : null}
                            </div>
                          )}
                          {isEmpty(this.state.villageList) ? null : (
                            <div className="mb-3">
                              <Label htmlFor="desa">
                                Desa<span className="text-danger">*</span>
                              </Label>
                              <Field
                                as="select"
                                name="desa"
                                type="text"
                                className={`form-control select2 ${
                                  errors.desa && touched.desa
                                    ? "border-danger"
                                    : null
                                }`}
                                id="desa"
                                onChange={async event => {
                                  this.setState({
                                    selectedVillage: event.target.value,
                                  });
                                }}
                              >
                                {this.state.villageList.map(value => (
                                  <option key={value.id} value={value.name}>
                                    {value.name}
                                  </option>
                                ))}
                              </Field>
                              {errors.desa && touched.desa ? (
                                <div className="text-danger">{errors.desa}</div>
                              ) : null}
                            </div>
                          )}
                          {isEmpty(this.state.selectedVillage) ? null : (
                            <div className="mb-3">
                              <Label htmlFor="jalan">
                                Jalan/Banjar
                                <span className="text-danger">*</span>
                              </Label>
                              <Field
                                name="jalan"
                                type="text"
                                className={`form-control ${
                                  errors.jalan && touched.jalan
                                    ? "border-danger"
                                    : null
                                }`}
                                id="jalan"
                                onChange={async event => {
                                  this.setState({
                                    jalan: event.target.value,
                                  });
                                }}
                              />
                              {errors.jalan && touched.jalan ? (
                                <div className="text-danger">
                                  {errors.jalan}
                                </div>
                              ) : null}
                            </div>
                          )}
                        </Col>
                      </Row>
                      <div>
                        <span className="text-danger">* harus diisi</span>
                      </div>
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
              </ModalBody>
            </Modal>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

Token.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(Token);
