import React from "react";

const ProductsStatistics = () => {
    return (
        <div className="col-xl-6 col-lg-12">
            <div className="card mb-4 shadow-sm">
                <article className="card-body">
                    <h5 className="card-title">Products statistics</h5>
                    <iframe
                        title="productsStatistics"
                        style={{
                            background: "#FFFFFF",
                            border: "none",
                            borderRadius: "2px",
                            boxShadow: "0 2px 10px 0 rgba(70, 76, 79, .2)",
                            width: "100%",
                            height: "350px"
                        }}
                        src="https://charts.mongodb.com/charts-ecommercedb-drnml/embed/charts?id=63b1dbf1-94f5-4890-86e2-a1fc56387c3c&maxDataAge=300&theme=light&autoRefresh=true"></iframe>
                </article>
            </div>
        </div >
    );
};

export default ProductsStatistics;
