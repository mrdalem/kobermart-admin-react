import React, { Component, useMemo } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Container, Badge, Row, UncontrolledTooltip } from "reactstrap";

import TableContainer from "./TransactionTableContainer";
import Moment from "moment";

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb";
//i18n
import { withTranslation } from "react-i18next";
import { colRef, db, Timestamp } from "helpers/firebase_helper";
import {post} from 'helpers/api_helper';

function TransactionTable(arg) {
  const { data } = arg;

  const Capitalize = str => str.charAt(0).toUpperCase() + str.slice(1);

  const activateTrx = (type, id) => {
    switch (type) {
      case "withdraw": post("api/balance/withdraw/activate", {id}).then(res => console.log(res));
        break;
      case "topup": post("api/balance/topup/activate", {id}).then(res => console.log(res));
      default: 
        break;
    }
    
  }

  const deactivateTrx = (type, id) => {
    switch (type) {
      case "withdraw": post("api/balance/withdraw/deactivate", {id}).then(res => console.log(res));   
        break; 
      case "topup": post("api/balance/topup/deactivate", {id}).then(res => console.log(res));
        break; 
      default: 
        break;
    }
    
  }

  const deleteTrx = (type, id, userid) => {
    switch (type) {
      case "withdraw": post("api/balance/withdraw/delete", {id, userid}).then(res => console.log(res));
        break;
      case "topup": post("api/balance/topup/delete", {id, userid}).then(res => console.log(res));
        break;
      default:
        break;
    }
    
  }

  const transactionColumns = useMemo(
    () => [
      {
        Header: "Waktu",
        accessor: "createdAt.seconds",
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
        Header: "Jenis",
        accessor: "type",
        maxWidth: 10,
        Cell: cellProps => {
          return (
            <>
              <Row className="mx-1">{Capitalize(cellProps.row.original.type)}</Row>
            </>
          );
        },
      },
      {
        Header: "Nama",
        accessor: "id",
        Cell: cellProps => {
          return (
            <>
              <Row className="mx-1">{Capitalize(cellProps.row.original.data.customerData.name)}</Row>
            </>
          );
        },
      },
      {
        Header: "Nominal",
        accessor: "nominal",
        Cell: cellProps => {
          const nominal = Intl.NumberFormat().format(
            cellProps.row.original.nominal
          );
          return (
            <>
              <Row className="mx-1">{"Rp " + nominal}</Row>
            </>
          );
        },
      },
      {
        Header: "Metode",
        accessor: "data.transactionData.method",
        Cell: cellProps => {
          let method = "";
          switch (cellProps.row.original.type) {
            case "token": method = "saldo"
              break;
              case "referral": method = "saldo"
              break;
              case "plan-a": method = "saldo"
              break;
          
            default: method = cellProps.row.original.data.transactionData.method;
              break;
          }
          return (
            <>
              {Capitalize(method)}
            </>
          );
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: cellProps => {
          let color = "warning";

          switch (cellProps.row.original.status) {
            case "ACTIVE":
              color = "success";
              break;
            case "FAILDED":
              color = "danger";
              break;
            default:
              break;
          }

          return (
            <>
              <Badge className={"font-size-12 mx-1 badge-soft-" + color}>
                {Capitalize(cellProps.row.original.status.toLowerCase())}
              </Badge>
            </>
          );
        },
      },
      {
        Header: "Pilihan",
        accessor: "",
        Cell: cellProps => {
          return (
            <div className="d-flex gap-3">
              
              {cellProps.row.original.status == "PENDING"? 
              <Link 
              to="#" 
              className="text-success"
              onClick={()=> activateTrx(cellProps.row.original.type, cellProps.row.original.trxid)}
              >
                <i className="mdi mdi-check font-size-18" id="activate" />
                {
                  <UncontrolledTooltip placement="top" target="activate">
                    Aktifkan
                  </UncontrolledTooltip>
                }
              </Link>:<Link to="#" className="text-secondary" onClick={()=> deactivateTrx(cellProps.row.original.type, cellProps.row.original.trxid)}>
                <i className="mdi mdi-close font-size-18" id="deactivate" />
                {
                  <UncontrolledTooltip placement="top" target="deactivate">
                    Nonaktifkan
                  </UncontrolledTooltip>
                }
              </Link>}
              <Link to="#" className="text-primary">
                <i
                  className="mdi mdi-information font-size-18"
                  id="toggletooltip"
                />
                <UncontrolledTooltip placement="top" target="toggletooltip">
                  Informasi
                </UncontrolledTooltip>
              </Link>
              
              <Link
                to="#"
                className="text-danger"
                onClick={()=> deleteTrx(cellProps.row.original.type, cellProps.row.original.trxid, cellProps.row.original.id)}
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

  

  return (
    <TableContainer
      columns={transactionColumns}
      data={data}
      isGlobalFilter={true}
      isAddOptions={false}
      customPageSize={10}
      className="custom-header-css"
    />
  );
}

class TransactionTopup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
    };

    this.unsubTrx = this.unsubTrx.bind(this);
  }

  async componentDidMount() {
    this.unsubTrx;
  }

  unsubTrx = colRef("globaltrx")
    .orderBy("createdAt", "asc")
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        let temp = this.state.transactions;
        if (change.type === "added") {
          console.log("New: ", change.doc.data());
          temp.push({ trxid: change.doc.id, ...change.doc.data() });
        }
        if (change.type === "modified") {
          console.log("Modified: ", change.doc.data());
          let index = temp.findIndex(doc => doc.trxid == change.doc.id);
          temp[index] = { trxid: change.doc.id, ...change.doc.data() };
          console.log(temp.findIndex(doc => doc.trxid == change.doc.id));
        }
        if (change.type === "removed") {
          console.log("Removed: ", change.doc.data());
          let index = temp.findIndex(doc => doc.trxid == change.doc.id);
          temp.splice(index, 1);
        }
        this.setState({ transactions: [] }, () => {
          this.setState({
            transactions: temp,
          });
        });
      });
    });

  componentWillUnmount() {
    this.unsubTrx();
  }

  componentDidUpdate() {}

  render() {
    //meta title
    document.title = "Transaksi | Kobermart Admin";
    return (
      <React.Fragment>
        <div className="page-content">
          <Container fluid>
            {/* Render Breadcrumb */}
            <Breadcrumbs
              title={this.props.t("Transaksi")}
              breadcrumbItem={this.props.t("Transaksi")}
            />
            <TransactionTable data={this.state.transactions} />
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

TransactionTopup.propTypes = {
  t: PropTypes.any,
};

export default withTranslation()(TransactionTopup);
