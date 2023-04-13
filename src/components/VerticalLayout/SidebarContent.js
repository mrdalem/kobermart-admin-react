import PropTypes from "prop-types";
import React, { Component } from "react";

//Simple bar
import SimpleBar from "simplebar-react";

// MetisMenu
import MetisMenu from "metismenujs";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";

//i18n
import { withTranslation } from "react-i18next";

class SidebarContent extends Component {
  constructor(props) {
    super(props);
    this.refDiv = React.createRef();
  }

  componentDidMount() {
    // console.log("didmount");
    this.initMenu();
  }

  // eslint-disable-next-line no-unused-vars
  componentDidUpdate(prevProps, prevState, ss) {
    if (this.props.type !== prevProps.type) {
      // console.log("didupdate");
      this.initMenu();
    }
  }

  initMenu() {
    // console.log("init menu start");
    new MetisMenu("#side-menu");
    let matchingMenuItem = null;
    const ul = document.getElementById("side-menu");
    const items = ul.getElementsByTagName("a");

    for (let i = 0; i < items.length; ++i) {
      // console.log(i);
      if (this.props.location.pathname === items[i].pathname) {
        matchingMenuItem = items[i];
        // console.log("matching menu");
        break;
      }
    }
    if (matchingMenuItem) {
      this.activateParentDropdown(matchingMenuItem);
    }
  }

  // componentDidUpdate() {}

  scrollElement = item => {
    setTimeout(() => {
      if (this.refDiv.current !== null) {
        if (item) {
          const currentPosition = item.offsetTop;
          if (currentPosition > window.innerHeight) {
            if (this.refDiv.current)
              this.refDiv.current.getScrollElement().scrollTop =
                currentPosition - 300;
          }
        }
      }
    }, 300);
  };

  activateParentDropdown = item => {
    item.classList.add("active");
    const parent = item.parentElement;

    const parent2El = parent.childNodes[1];
    if (parent2El && parent2El.id !== "side-menu") {
      parent2El.classList.add("mm-show");
    }

    if (parent) {
      parent.classList.add("mm-active");
      const parent2 = parent.parentElement;

      if (parent2) {
        parent2.classList.add("mm-show"); // ul tag

        const parent3 = parent2.parentElement; // li tag

        if (parent3) {
          parent3.classList.add("mm-active"); // li
          parent3.childNodes[0].classList.add("mm-active"); //a
          const parent4 = parent3.parentElement; // ul
          if (parent4) {
            parent4.classList.add("mm-show"); // ul
            const parent5 = parent4.parentElement;
            if (parent5) {
              parent5.classList.add("mm-show"); // li
              parent5.childNodes[0].classList.add("mm-active"); // a tag
            }
          }
        }
      }
      this.scrollElement(item);
      return false;
    }
    this.scrollElement(item);
    return false;
  };

  render() {
    return (
      <React.Fragment>
        <SimpleBar className="h-100" ref={this.refDiv}>
          <div id="sidebar-menu">
            <ul className="metismenu list-unstyled" id="side-menu">
              <li className="menu-title">{this.props.t("Menu")}</li>

              <li>
                <Link to="/dashboard" className="">
                  <i className="bx bx-home-circle" />

                  <span>{this.props.t("Dashboards")}</span>
                </Link>
              </li>

              <li>
                <Link to="/report" className="has-arrow">
                  <i className="bx bxs-report" />
                  <span>{this.props.t("Laporan")}</span>
                </Link>
                <ul className="sub-menu" aria-expanded="false">
                  <li>
                    <Link to="/report-harian">{this.props.t("Harian")}</Link>
                  </li>
                  <li>
                    <Link to="/report-bulanan">{this.props.t("Bulanan")}</Link>
                  </li>
                  <li>
                    <Link to="/report-tahunan">{this.props.t("Tahunan")}</Link>
                  </li>
                </ul>
              </li>

              
              <li>
                <Link to="/member" className="">
                  <i className="bx bx-user" />
                  <span>{this.props.t("Keanggotaan")}</span>
                </Link>
                
              </li>

              <li>
                <Link to="/transactions" className="">
                  <i className="bx bx-transfer" />
                  <span>{this.props.t("Transaksi")}</span>
                </Link>
                
              </li>

              <li>
                <Link to="/ppob" className="has-arrow">
                  <i className="bx bx-globe" />
                  <span>{this.props.t("PPOB")}</span>
                </Link>
                <ul className="sub-menu" aria-expanded="false">
                  <li>
                    <Link to="/riwayat-transaksi-ppob">
                      {this.props.t("Riwayat Transaksi")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/prepaid-data">
                      {this.props.t("Paket Data")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/prepaid-pulsa">
                      {this.props.t("Pulsa")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/prepaid-pln">
                      {this.props.t("Token Listrik")}
                    </Link>
                  </li>
                  
                  <li>
                    <Link to="/postpaid-pln">
                      {this.props.t("Tagihan Listrik")}
                    </Link>
                  </li>
                  <li>
                    <Link to="/produk-prepaid-ppob">
                      {this.props.t("Semua Produk")}
                    </Link>
                  </li>
                  {/* <li>
                    <Link to="/produk-postpaid-ppob">
                      {this.props.t("Produk Postpaid")}
                    </Link>
                  </li> */}
                </ul>
              </li>

              <li>
                <Link to="/shop-order" className="">
                  <i className="bx bxs-store" />
                  <span>{this.props.t("Order")}</span>
                </Link>
              </li>
              <li>
                <Link to="/stok" className="">
                  <i className="bx bx-package" />
                  <span>{this.props.t("Stok")}</span>
                </Link>
              </li>
              <li>
                <Link to="/kolektor" className="">
                  <i className="bx bxl-telegram" />
                  <span>{this.props.t("Kolektor")}</span>
                </Link>
              </li>

              <li>
                <Link to="/settings" className="has-arrow">
                  <i className="bx bx-cog" />
                  <span>{this.props.t("Pengaturan")}</span>
                </Link>
                <ul className="sub-menu" aria-expanded="true">
                  <li>
                    <Link to="/setting">{this.props.t("Umum")}</Link>
                  </li>
                  <li>
                    <Link to="/shop-product">{this.props.t("Produk")}</Link>
                  </li>
                  <li>
                    <Link to="/shop-supplier">{this.props.t("Supplier")}</Link>
                  </li>
                  <li>
                    <Link to="/shop-category">{this.props.t("Kategori")}</Link>
                  </li>
                  <li>
                    <Link to="/shop-warehouse">{this.props.t("Gudang")}</Link>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </SimpleBar>
      </React.Fragment>
    );
  }
}

SidebarContent.propTypes = {
  location: PropTypes.object,
  t: PropTypes.any,
  type: PropTypes.string,
};

export default withRouter(withTranslation()(SidebarContent));
