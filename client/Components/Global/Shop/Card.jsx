import React from 'react'

export default function Card({
  item,
  index,
  setOpenComponent,
  setMedicineDetail
}) {
  return (
    <div
      onClick={() => (setMedicineDetail(item), setOpenComponent("Medicine"))}
      key={index}
      className="col-xl-2 col-xxl-3 col-md-4 col-sm-6"
    >
      <div className="card">
        <div className="card-body product-grid-card">
          <div className="new-arrival-product">
            <div className="new-arrivals-img-contnent">
              <img className="img-fluid rounded" src={item.image} alt="" />
            </div>
            <div className="new-arrival-content text-center mt-3">
              <h4>{item.name}</h4>
              <span className="price">
                {item.price}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
