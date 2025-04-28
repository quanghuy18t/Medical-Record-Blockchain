import React from 'react'
import { FaShoppingBag } from '../../ReactICON/index'

export default function MedicDetails({ medicineDetail }) {
  return (
    <div className="col-lg-12">
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-xl-3 col-lg-6 col-md-6 col-xxl-5">
              <div className="tab-content" id="myTabContent">
                <div
                  className="tab-pane fade show active"
                  id="home-tab-pane"
                  role="tabpanel"
                  aria-labelledby="home-tab"
                  tabIndex={0}
                >
                  <img
                    className="img-fluid rounded"
                    src={medicineDetail?.image}
                    alt="Image"
                  />
                </div>
              </div>
            </div>
            <div className="col-xl-9 col-lg-6 col-md-6 col-xxl-7 col-sm-12">
              <div className="product-detail-content">
                <div className="new-arrival-content mt-md-0 mt-3 pr">
                  <h4>{medicineDetail.name}</h4>
                  <div className="d-table mb-2">
                    <p className="price float-start d-block">
                      Price: {medicineDetail.price}
                    </p>
                  </div>
                  <p className="text-black">
                    Availability:
                    <span className="item">
                      In stock {medicineDetail?.quantity}
                      <i className="fa ">
                        <FaShoppingBag />
                      </i>
                    </span>
                  </p>
                  <p className="text-black">
                    Brand:{" "}
                    <span className="item">{medicineDetail?.brand}</span>
                  </p>
                  <p className="text-black">
                    MedicineID :{" "}
                    <span className="item">
                      {medicineDetail?.medicineID}
                    </span>
                  </p>
                  <p className="text-black">
                    Expiry Date :{" "}
                    <span className="item">{medicineDetail?.expiryDate}</span>
                  </p>
                  <p className="text-black">
                    Manufacture Date :{" "}
                    <span className="item">
                      {medicineDetails?.manufacturDate}
                    </span>
                  </p>
                  <p className="text-content">{medicineDetails?.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
