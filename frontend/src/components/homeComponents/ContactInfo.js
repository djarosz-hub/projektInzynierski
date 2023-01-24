import React from "react";

const ContactInfo = () => {
    return (
        <div className="contactInfo container">
            <div className="row">
                <div className="col-12 col-md-4 contact-Box">
                    <div className="box-info">
                        <div className="info-image">
                            <i className="fas fa-phone-alt"></i>
                        </div>
                        <h5>Call Us</h5>
                        <p>+48 123 456 789</p>
                    </div>
                </div>
                <div className="col-12 col-md-4 contact-Box">
                    <div className="box-info">
                        <div className="info-image">
                            <i className="fas fa-map-marker-alt"></i>
                        </div>
                        <h5>Headquarter</h5>
                        <p>CRACOW Sukiennicza 10 st.</p>
                    </div>
                </div>
                <div className="col-12 col-md-4 contact-Box">
                    <div className="box-info">
                        <div className="info-image">
                            <i className="fas fa-fax"></i>
                        </div>
                        <h5>E-mail</h5>
                        <p>shop@shop.com</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactInfo;
